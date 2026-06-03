'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { getEmployeeUserId } from '@/lib/supabase/auth-helpers'

const createConsultationSchema = z.object({
  category: z.enum(['menstrual', 'pms', 'menopause', 'pregnancy', 'mental', 'other']),
})

const sendMessageSchema = z.object({
  consultation_id: z.string().uuid(),
  body: z.string().min(1, 'メッセージを入力してください').max(2000),
})

export async function createConsultation(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('従業員登録が必要です')

    const validated = createConsultationSchema.parse({
      category: formData.get('category'),
    })

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('consultations')
      .insert({
        user_id: employeeId,
        category: validated.category,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/employee/consultation')
    return { success: true, data }
  } catch (error) {
    console.error('Create consultation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '相談の作成に失敗しました',
    }
  }
}

export async function sendConsultationMessage(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('従業員登録が必要です')

    const validated = sendMessageSchema.parse({
      consultation_id: formData.get('consultation_id'),
      body: formData.get('body'),
    })

    const supabase = createServiceRoleClient()

    const { data: consultation } = await supabase
      .from('consultations')
      .select('id, user_id, status')
      .eq('id', validated.consultation_id)
      .single()

    if (!consultation || consultation.user_id !== employeeId) {
      throw new Error('相談が見つかりません')
    }

    const { data, error } = await supabase
      .from('consultation_messages')
      .insert({
        consultation_id: validated.consultation_id,
        sender_type: 'user',
        body: validated.body,
      })
      .select()
      .single()

    if (error) throw error

    if (consultation.status === 'pending') {
      await supabase
        .from('consultations')
        .update({ status: 'active' })
        .eq('id', validated.consultation_id)
    }

    revalidatePath(`/employee/consultation/${validated.consultation_id}`)
    return { success: true, data }
  } catch (error) {
    console.error('Send message error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'メッセージの送信に失敗しました',
    }
  }
}

export async function getConsultationMessages(consultationId: string) {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId) return { success: false, data: [] }

    const supabase = createServiceRoleClient()

    const { data: consultation } = await supabase
      .from('consultations')
      .select('id')
      .eq('id', consultationId)
      .eq('user_id', employeeId)
      .maybeSingle()

    if (!consultation) return { success: false, data: [] }

    const { data, error } = await supabase
      .from('consultation_messages')
      .select('*')
      .eq('consultation_id', consultationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return { success: true, data: data ?? [] }
  } catch (error) {
    console.error('Get messages error:', error)
    return { success: false, data: [] }
  }
}

export async function getConsultations() {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId) return { success: false, data: [] }

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', employeeId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data ?? [] }
  } catch (error) {
    console.error('Get consultations error:', error)
    return { success: false, data: [] }
  }
}
