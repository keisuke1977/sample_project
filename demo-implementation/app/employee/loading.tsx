export default function EmployeeLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-pulse space-y-6">
      <div className="h-8 rounded-lg w-2/3" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="space-y-4">
        <div className="h-32 rounded-2xl" style={{ backgroundColor: 'var(--color-border)' }} />
        <div className="h-32 rounded-2xl" style={{ backgroundColor: 'var(--color-border)' }} />
        <div className="h-32 rounded-2xl" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>
    </div>
  )
}
