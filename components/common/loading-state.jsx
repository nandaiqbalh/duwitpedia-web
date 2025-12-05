'use client'

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  fullHeight = false,
  className = '',
}) {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-3',
    lg: 'h-16 w-16 border-4',
  }

  const containerClass = fullHeight ? 'min-h-screen' : 'py-12'

  return (
    <div className={`flex flex-col items-center justify-center ${containerClass} px-4 ${className}`}>
      <div className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
      
      {message && (
        <p className="mt-4 text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  )
}
