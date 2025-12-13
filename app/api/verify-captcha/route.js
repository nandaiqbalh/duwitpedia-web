import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("reCAPTCHA secret key is not configured");
      return NextResponse.json(
        { success: false, error: "reCAPTCHA is not configured" },
        { status: 500 }
      );
    }

    // Verify the token with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    
    const response = await fetch(verifyUrl, {
      method: "POST",
    });

    const data = await response.json();

    // reCAPTCHA v3 returns a score between 0.0 and 1.0
    // 0.0 is very likely a bot, 1.0 is very likely a human
    // Recommended threshold is 0.5
    if (data.success && data.score >= 0.5) {
      return NextResponse.json({
        success: true,
        score: data.score,
      });
    }

    return NextResponse.json({
      success: false,
      error: "reCAPTCHA verification failed",
      score: data.score,
    }, { status: 400 });

  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification error" },
      { status: 500 }
    );
  }
}
