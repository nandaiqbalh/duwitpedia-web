"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { motion } from 'framer-motion';
import { LoginCard } from "@/components/login/login-card";
import { LoginLoading } from "@/components/login/login-loading";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const errorMessages = {
  OAuthSignin: "Failed to sign in. Please try again.",
  OAuthCallback: "Failed to callback from OAuth provider. Please try again.",
  OAuthCreateAccount: "Could not create account. Please try again.",
  EmailCreateAccount: "Could not create account with email.",
  Callback: "Something went wrong during authentication.",
  OAuthAccountNotLinked: "Email is already linked to another account.",
  EmailSignInError: "Email sign in failed. Please check your credentials.",
  SessionCallback: "Your session expired. Please sign in again.",
  SignoutCallback: "Failed to sign out.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  Verification: "The verification link has expired or is invalid.",
  Default: "An authentication error occurred. Please try again.",
  CredentialsSignin: "Invalid email or password. Please try again.",
};

function ErrorAlerts() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const loggedOut = searchParams.get("logged_out");
  const sessionExpired = searchParams.get("session_expired");

  return (
    <>
      {(loggedOut || sessionExpired || error) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          {loggedOut && (
            <Alert className="bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Logged Out</AlertTitle>
              <AlertDescription className="text-green-700">
                You have been successfully logged out.
              </AlertDescription>
            </Alert>
          )}

          {sessionExpired && (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-900">Session Expired</AlertTitle>
              <AlertDescription className="text-orange-700">
                Your session has expired. Please log in again.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-900">Authentication Error</AlertTitle>
              <AlertDescription className="text-red-700">
                {errorMessages[error] || errorMessages.Default}
              </AlertDescription>
            </Alert>
          )}
        </motion.div>
      )}
    </>
  );
}

export default function DemoLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Redirect based on role
      if (session.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <LoginLoading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Error Messages with Animation */}
        <Suspense fallback={null}>
          <ErrorAlerts />
        </Suspense>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoginCard mode="email" />
        </motion.div>
      </div>
    </div>
  );
}
