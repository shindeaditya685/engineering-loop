"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const nextPath =
        pathname && pathname !== "/dashboard"
          ? `?next=${encodeURIComponent(pathname)}`
          : "";

      router.replace(`/login${nextPath}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-4">
            {loading ? (
              <Loader2 className="w-6 h-6 text-accent-cyan animate-spin" />
            ) : (
              <Lock className="w-6 h-6 text-accent-cyan" />
            )}
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Checking your account
          </h1>
          <p className="text-sm text-gray-400">
            We&apos;re getting your dashboard ready.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
