import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '@/components/header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Femcare — 企業向け女性健康管理プラットフォーム',
  description: '「気づき→学び→相談」の3ステップで、女性従業員の健康をサポートする企業向けプラットフォームです。',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
