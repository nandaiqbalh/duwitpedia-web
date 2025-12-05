'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">The page you are looking for does not exist.</p>
          <Button onClick={() => window.location.href = '/'} className="w-full">
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}