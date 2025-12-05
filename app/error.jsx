'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error)
  }, [error])

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-base mt-2">
            We encountered an unexpected error while processing your request.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error Message */}
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm font-medium text-red-900 mb-1">Error Details:</p>
            <p className="text-sm text-red-700 font-mono break-words">
              {error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={reset} 
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>

            <Link href="/" className="block">
              <Button 
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Support Message */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 text-center mb-3">
              If the problem persists, please contact our support team:
            </p>
            <a 
              href="mailto:nandaiqbalhanafii@gmail.com?subject=Error Report&body=Error: " 
              className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Mail className="w-4 h-4" />
              nandaiqbalhanafii@gmail.com
            </a>
          </div>

          {/* Additional Help */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-800">
              💡 <strong>Quick Tips:</strong> Try clearing your browser cache, checking your internet connection, or using a different browser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}