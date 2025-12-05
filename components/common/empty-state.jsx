'use client'

import { Button } from '@/components/ui/button'

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionOnClick,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {Icon && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <Icon className="w-8 h-8 text-gray-600" />
        </div>
      )}
      
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-sm text-gray-600 text-center mb-6 max-w-sm">
          {description}
        </p>
      )}

      {children && (
        <div className="mb-6">
          {children}
        </div>
      )}

      {actionLabel && actionOnClick && (
        <Button onClick={actionOnClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
