'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function EmployeeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Employee app error:', error)
  }, [error])

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
        エラーが発生しました
      </h2>
      <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        {error.message || '予期しないエラーが発生しました。'}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          再試行
        </button>
        <button
          onClick={() => (window.location.href = '/')}
          className="px-6 py-2 rounded-lg border"
          style={{ borderColor: 'var(--color-border)' }}
        >
          ホームへ戻る
        </button>
      </div>
    </div>
  )
}
