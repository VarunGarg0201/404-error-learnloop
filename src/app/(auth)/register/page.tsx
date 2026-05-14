"use client";

import { useState } from "react";
import { signUpWithEmail } from "@/features/auth/actions";
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

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signUpWithEmail(formData);
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
        <h1 className="text-xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join the learning ecosystem
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
              or create with email
            </span>
          </div>
        </div>

        {/* Error */}
        <AuthError message={error} />

        {/* Email form */}
        <form action={handleSubmit} className="space-y-3">
          <InputField
            name="name"
            label="Full name"
            placeholder="Your name"
            required
          />
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
            placeholder="Min 6 characters"
            required
            minLength={6}
          />
          <SubmitButton loading={loading}>Create account</SubmitButton>
        </form>
      </SurfaceCard>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
