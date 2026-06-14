import { getPost } from '@/app/actions/posts'
import { notFound } from 'next/navigation'
import EditPostForm from './EditPostForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { success, data: post } = await getPost(id)

  if (!success || !post) {
    notFound()
  }

  return <EditPostForm post={post} />
}
