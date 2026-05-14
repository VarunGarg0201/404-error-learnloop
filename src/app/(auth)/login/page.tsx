"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithEmail } from "@/features/auth/actions";
import {
  OAuthButtons,
  AuthError,
  SubmitButton,
} from "@/features/auth/components";
import { SurfaceCard } from "@/components/shared/cards";
import { InputField, PasswordInput } from "@/components/shared/inputs";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const [error, setError] = useState<string | null>(
    callbackError === "auth_callback_failed"
      ? "Authentication failed. Please try again."
      : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Logo */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 mb-2">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your LearnLoop account
        </p>
      </div>

      <SurfaceCard className="space-y-4">
        {/* OAuth */}
        <OAuthButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        {/* Error */}
        <AuthError message={error} />

        {/* Email form */}
        <form action={handleSubmit} className="space-y-3">
          <InputField
            name="email"
            type="email"
            label="Email"
            placeholder="you@university.edu"
            required
          />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="••••••••"
            required
          />
          <SubmitButton loading={loading}>Sign in</SubmitButton>
        </form>
      </SurfaceCard>

      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
