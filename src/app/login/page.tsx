"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";

function getSafeRedirectPath(target: string | null, fallback = "/dashboard") {
  if (!target || !target.startsWith("/") || target.startsWith("//")) {
    return fallback;
  }

  return target;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirectPath(searchParams.get("next"));
  const { login, loading, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectPath);
    }
  }, [loading, redirectPath, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);

    if (result.ok) {
      router.replace(redirectPath);
    } else {
      setError(result.error || "Invalid email or password.");
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900 bg-grid relative">
      <div className="absolute inset-0 bg-noise" />
      <div className="w-full max-w-sm relative z-10">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(0,212,255,0.15)]">
              <LogIn className="w-8 h-8 text-dark-900" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Log in to access your profile, dashboard, and document status.
            </p>
          </div>

          {error && (
            <div className="bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-6">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@email.com"
                className="input-field text-sm"
                autoComplete="email"
                required
              />
            </div>

            <div className="relative">
              <label className="label-text">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                className="input-field text-sm pr-10"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="btn-primary w-full text-sm"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-accent-cyan hover:underline font-medium"
              >
                Sign up free
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Your account stays in sync with Firebase authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPageFallback() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-dark-900 bg-grid px-4">
      <div className="absolute inset-0 bg-noise" />
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan animate-spin" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
