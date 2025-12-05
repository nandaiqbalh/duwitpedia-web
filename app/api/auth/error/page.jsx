'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const errorMessages = {
  OAuthSignin: 'Failed to sign in with OAuth provider. Please try again.',
  OAuthCallback: 'Failed to callback from OAuth provider. Please try again.',
  OAuthCreateAccount: 'Could not create your account. Please try again.',
  EmailCreateAccount: 'Could not create account with email.',
  Callback: 'An error occurred during the callback process.',
  OAuthAccountNotLinked: 'Email is already linked to another account. Please sign in with the original method.',
  EmailSignInError: 'Email sign in failed.',
  SessionCallback: 'Your session has expired. Please sign in again.',
  SignoutCallback: 'An error occurred while signing out.',
  AccessDenied: 'You do not have permission to sign in. Please contact support.',
  Verification: 'The verification link is invalid or has expired.',
  Default: 'An authentication error occurred. Please try again.',
}

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {errorMessages[error] || errorMessages.Default}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button
              onClick={() => router.push('/login')}
              className="w-full"
              variant="default"
            >
              Back to Login
            </Button>
            <Button
              onClick={() => router.push('/')}
              className="w-full"
              variant="outline"
            >
              Go to Home
            </Button>
          </div>

          {error && (
            <p className="text-xs text-gray-500 text-center pt-2">
              Error code: {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
