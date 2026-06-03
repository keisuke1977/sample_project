import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-xl rounded-2xl',
          },
        }}
        routing="path"
        path="/sign-up"
      />
    </div>
  )
}
