"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, Wallet } from "lucide-react";

export function LoginCard({ mode = "google" }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleGoogleSignIn = async () => {
    if (!executeRecaptcha) {
      console.warn("reCAPTCHA not available");
      signIn("google", { callbackUrl });
      return;
    }

    try {
      // Generate reCAPTCHA token
      const token = await executeRecaptcha("google_login");
      
      // Verify token with backend
      const verifyResponse = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        // Proceed with Google sign in
        signIn("google", { callbackUrl });
      } else {
        setEmailError("reCAPTCHA verification failed. Please try again.");
      }
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      // Still allow sign in even if reCAPTCHA fails
      signIn("google", { callbackUrl });
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setEmailError("");

    // Validation
    if (!email || !password) {
      setEmailError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setEmailError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Generate reCAPTCHA token
      if (executeRecaptcha) {
        const token = await executeRecaptcha("email_login");
        
        // Verify token with backend
        const verifyResponse = await fetch("/api/verify-captcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
          setEmailError("reCAPTCHA verification failed. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setEmailError("Invalid email or password");
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setEmailError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-gray-200">
      <CardHeader className="space-y-1 text-center">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
        </Link>
        <CardTitle className="text-3xl font-semibold text-gray-900">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-600">
          {mode === "email" 
            ? "Sign in with demo credentials" 
            : "Sign in to continue to Duwitpedia"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "google" ? (
          // Google Login Only
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 text-base"
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            <p className="text-center text-sm text-gray-500">
              Quick and secure authentication
            </p>

            {/* Demo CTA */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-700 mb-3">
                Wanna try demo user?
              </p>
              <Link href="/login/demo">
                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                >
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Email Login Only (Demo)
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Email:</strong> demo@duwitpedia.com</p>
                <p><strong>Password:</strong> gloryglory-man-united</p>
              </div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="demo@duwitpedia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {emailError && (
                <p className="text-sm text-red-600">{emailError}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Back to Google Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <Link href="/login">
              <Button
                variant="outline"
                className="w-full"
              >
                Back to Google Login
              </Button>
            </Link>
          </div>
        )}

        <p className="text-center text-xs text-gray-500 mt-4">
          By signing in, you agree to our{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </CardContent>
    </Card>
  );
}
