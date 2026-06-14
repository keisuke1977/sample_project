'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { getEmployeeUserId } from '@/lib/supabase/auth-helpers'

const postSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  content: z.string().min(1, '内容は必須です'),
})

export async function createPost(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('ユーザー登録が必要です')

    const validated = postSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
    })

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: employeeId, title: validated.title, content: validated.content })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/employee/posts')
    return { success: true, data }
  } catch (error) {
    console.error('createPost error:', error)
    return {
      success: false,
      error: error instanceof z.ZodError
        ? error.issues[0].message
        : error instanceof Error ? error.message : '投稿の作成に失敗しました',
    }
  }
}

export async function updatePost(postId: string, formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('ユーザー登録が必要です')

    const validated = postSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
    })

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('posts')
      .update({ title: validated.title, content: validated.content })
      .eq('id', postId)
      .eq('user_id', employeeId)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/employee/posts')
    return { success: true, data }
  } catch (error) {
    console.error('updatePost error:', error)
    return {
      success: false,
      error: error instanceof z.ZodError
        ? error.issues[0].message
        : error instanceof Error ? error.message : '投稿の更新に失敗しました',
    }
  }
}

export async function deletePost(postId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('ユーザー登録が必要です')

    const supabase = createServiceRoleClient()
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', employeeId)

    if (error) throw error

    revalidatePath('/employee/posts')
    return { success: true }
  } catch (error) {
    console.error('deletePost error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '投稿の削除に失敗しました',
    }
  }
}

export async function getPosts() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const employeeId = await getEmployeeUserId()
    if (!employeeId) return { success: true, data: [] }

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', employeeId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data ?? [] }
  } catch (error) {
    console.error('getPosts error:', error)
    return { success: false, data: [], error: error instanceof Error ? error.message : '取得に失敗しました' }
  }
}

export async function getPost(postId: string) {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('ユーザー登録が必要です')

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .eq('user_id', employeeId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('getPost error:', error)
    return { success: false, data: null, error: error instanceof Error ? error.message : '取得に失敗しました' }
  }
}
