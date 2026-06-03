'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { getEmployeeUserId } from '@/lib/supabase/auth-helpers'

const checkInSchema = z.object({
  sleep_score: z.coerce.number().int().min(1).max(5),
  fatigue_score: z.coerce.number().int().min(1).max(5),
  mood_score: z.coerce.number().int().min(1).max(5),
  menstrual_status: z.enum(['menstrual', 'premenstrual', 'normal']),
  symptoms: z.array(
    z.enum(['headache', 'abdominal_pain', 'bloating', 'hot_flash', 'fatigue', 'other'])
  ).default([]),
  check_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export async function submitCheckIn(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('従業員登録が必要です')

    const symptomsRaw = formData.getAll('symptoms') as string[]
    const validated = checkInSchema.parse({
      sleep_score: formData.get('sleep_score'),
      fatigue_score: formData.get('fatigue_score'),
      mood_score: formData.get('mood_score'),
      menstrual_status: formData.get('menstrual_status'),
      symptoms: symptomsRaw,
      check_date: formData.get('check_date'),
    })

    const supabase = createServiceRoleClient()

    const { data: checkIn, error: checkInError } = await supabase
      .from('check_ins')
      .insert({
        user_id: employeeId,
        sleep_score: validated.sleep_score,
        fatigue_score: validated.fatigue_score,
        mood_score: validated.mood_score,
        menstrual_status: validated.menstrual_status,
        check_date: validated.check_date,
        feedback_message: generateFeedback(validated),
      })
      .select()
      .single()

    if (checkInError) throw checkInError

    if (validated.symptoms.length > 0) {
      const { error: symptomsError } = await supabase.from('check_in_symptoms').insert(
        validated.symptoms.map((symptom) => ({
          check_in_id: checkIn.id,
          symptom,
        }))
      )
      if (symptomsError) throw symptomsError
    }

    revalidatePath('/employee/home')
    revalidatePath('/employee/records')
    return { success: true, data: checkIn }
  } catch (error) {
    console.error('Submit check-in error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'チェックインの保存に失敗しました',
    }
  }
}

function generateFeedback(data: z.infer<typeof checkInSchema>): string {
  if (data.mood_score <= 2) {
    return '今日は気分が落ち込み気味かもしれません。無理せず、自分のペースで過ごしましょう。'
  }
  if (data.fatigue_score <= 2) {
    return '疲れが溜まっているようです。十分な休息と水分補給を心がけてください。'
  }
  if (data.sleep_score <= 2) {
    return '睡眠の質が低い日のようです。就寝前のスクリーンタイムを控えてみましょう。'
  }
  return '今日の体調は安定しているようです。この調子を維持していきましょう。'
}

export async function getTodayCheckIn(checkDate: string) {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId) return { success: false, data: null }

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('check_ins')
      .select('*, check_in_symptoms(symptom)')
      .eq('user_id', employeeId)
      .eq('check_date', checkDate)
      .maybeSingle()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Get today check-in error:', error)
    return { success: false, data: null }
  }
}
