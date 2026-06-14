'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { getEmployeeUserId, requireEmployeeUserId } from '@/lib/supabase/auth-helpers'
import type { CommunityCategory } from '@/lib/supabase/types'


const postSchema = z.object({
  title:        z.string().min(1, 'タイトルは必須です').max(200),
  content:      z.string().min(1, '内容は必須です'),
  category:     z.enum(['menstruation', 'pregnancy', 'menopause', 'work_life', 'mental_health', 'career', 'other']),
  is_anonymous: z.coerce.boolean().optional().default(false),
})

// ─── 投稿 CRUD ──────────────────────────────────────────

export async function createCommunityPost(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')
    const employeeId = await requireEmployeeUserId()

    const validated = postSchema.parse({
      title:        formData.get('title'),
      content:      formData.get('content'),
      category:     formData.get('category'),
      is_anonymous: formData.get('is_anonymous') === 'true',
    })

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('community_posts')
      .insert({ user_id: employeeId, ...validated })
      .select()
      .single()

    if (error) {
      console.error('createCommunityPost error:', error)
      throw error
    }
    revalidatePath('/employee/community')
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof z.ZodError ? error.issues[0].message : String(error) }
  }
}

export async function updateCommunityPost(postId: string, formData: FormData) {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('ユーザー登録が必要です')

    const validated = postSchema.parse({
      title:        formData.get('title'),
      content:      formData.get('content'),
      category:     formData.get('category'),
      is_anonymous: formData.get('is_anonymous') === 'true',
    })

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('community_posts')
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq('id', postId)
      .eq('user_id', employeeId)
      .select()
      .single()

    if (error) throw error
    revalidatePath('/employee/community')
    revalidatePath(`/employee/community/${postId}`)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof z.ZodError ? error.issues[0].message : String(error) }
  }
}

export async function deleteCommunityPost(postId: string) {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('ユーザー登録が必要です')

    const supabase = createServiceRoleClient()
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', employeeId)

    if (error) throw error
    revalidatePath('/employee/community')
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getCommunityPosts(category?: CommunityCategory) {
  try {
    const employeeId = await getEmployeeUserId()

    const supabase = createServiceRoleClient()
    let query = supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error
    return { success: true, data: data ?? [], currentUserId: employeeId }
  } catch (error) {
    return { success: false, data: [], currentUserId: null, error: String(error) }
  }
}

export async function getCommunityPost(postId: string) {
  try {
    const employeeId = await getEmployeeUserId()
    const supabase = createServiceRoleClient()

    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (postError) throw postError

    const { data: replies } = await supabase
      .from('community_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    const likedByMe = employeeId
      ? !!(await supabase
          .from('community_post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', employeeId)
          .maybeSingle()
          .then(({ data }) => data))
      : false

    return { success: true, post, replies: replies ?? [], likedByMe, currentUserId: employeeId }
  } catch (error) {
    return { success: false, post: null, replies: [], likedByMe: false, currentUserId: null, error: String(error) }
  }
}

// ─── いいね ──────────────────────────────────────────────

export async function toggleLike(postId: string) {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('ユーザー登録が必要です')

    const supabase = createServiceRoleClient()

    const { data: existing } = await supabase
      .from('community_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', employeeId)
      .maybeSingle()

    if (existing) {
      await supabase.from('community_post_likes').delete().eq('id', existing.id)
      revalidatePath(`/employee/community/${postId}`)
      revalidatePath('/employee/community')
      return { success: true, liked: false }
    } else {
      await supabase.from('community_post_likes').insert({ post_id: postId, user_id: employeeId })
      revalidatePath(`/employee/community/${postId}`)
      revalidatePath('/employee/community')
      return { success: true, liked: true }
    }
  } catch (error) {
    return { success: false, liked: false, error: String(error) }
  }
}

// ─── 返信 ────────────────────────────────────────────────

export async function createReply(postId: string, formData: FormData) {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('ユーザー登録が必要です')

    const content = String(formData.get('content') ?? '').trim()
    if (!content) throw new Error('返信内容は必須です')

    const is_anonymous = formData.get('is_anonymous') === 'true'

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('community_replies')
      .insert({ post_id: postId, user_id: employeeId, content, is_anonymous })
      .select()
      .single()

    if (error) throw error
    revalidatePath(`/employee/community/${postId}`)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteReply(replyId: string, postId: string) {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId) throw new Error('ユーザー登録が必要です')

    const supabase = createServiceRoleClient()
    const { error } = await supabase
      .from('community_replies')
      .delete()
      .eq('id', replyId)
      .eq('user_id', employeeId)

    if (error) throw error
    revalidatePath(`/employee/community/${postId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ─── いいね済み投稿IDリスト（一覧ページ用） ──────────────

export async function getLikedPostIds(postIds: string[]): Promise<string[]> {
  try {
    const employeeId = await getEmployeeUserId()
    if (!employeeId || postIds.length === 0) return []

    const supabase = createServiceRoleClient()
    const { data } = await supabase
      .from('community_post_likes')
      .select('post_id')
      .eq('user_id', employeeId)
      .in('post_id', postIds)

    return (data ?? []).map((r) => r.post_id)
  } catch {
    return []
  }
}
