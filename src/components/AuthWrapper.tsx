"use client";

import { useAuth } from "@/lib/auth";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  return <>{children}</>;
}
