'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export function ErrorState({
  title = 'Something went wrong',
  description,
  actionLabel = 'Try Again',
  actionOnClick,
  secondaryActionLabel,
  secondaryActionOnClick,
  icon: Icon = AlertCircle,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="mb-4 p-3 bg-red-50 rounded-lg">
        <Icon className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-600 text-center mb-6 max-w-sm">
          {description}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {actionOnClick && (
          <Button onClick={actionOnClick}>
            {actionLabel}
          </Button>
        )}
        
        {secondaryActionOnClick && (
          <Button variant="outline" onClick={secondaryActionOnClick}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
