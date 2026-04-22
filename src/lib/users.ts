export type UserStatus = "active" | "banned";
export type UserAuthProvider = "password" | "google" | "unknown";

export interface UserData {
  uid: string;
  name: string;
  email: string;
  plan: string;
  phone: string;
  gatePaper: string;
  createdAt: string | null;
  updatedAt: string | null;
  lastLoginAt: string | null;
  provider: UserAuthProvider;
  emailVerified: boolean;
  status: UserStatus;
  bannedReason: string;
  bannedAt: string | null;
  photoURL: string;
}

type NormalizeUserProfileInput = {
  uid: string;
  name?: unknown;
  email?: unknown;
  plan?: unknown;
  phone?: unknown;
  gatePaper?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
  provider?: unknown;
  emailVerified?: unknown;
  status?: unknown;
  bannedReason?: unknown;
  bannedAt?: unknown;
  photoURL?: unknown;
};

interface BuildUserProfilePayloadInput {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  gatePaper?: string;
  plan?: string;
  provider?: UserAuthProvider | string;
  emailVerified?: boolean;
  photoURL?: string;
  existing?: Partial<UserData> | null;
}

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toIsoString(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object" && value && "seconds" in value) {
    return new Date(
      Number((value as { seconds: number }).seconds) * 1000,
    ).toISOString();
  }

  return null;
}

export function normalizeUserProvider(value: unknown): UserAuthProvider {
  const provider = toTrimmedString(value).toLowerCase();

  if (provider === "password") {
    return "password";
  }

  if (provider === "google" || provider === "google.com") {
    return "google";
  }

  return "unknown";
}

export function normalizeUserStatus(value: unknown): UserStatus {
  return toTrimmedString(value).toLowerCase() === "banned" ? "banned" : "active";
}

export function normalizeUserProfile({
  uid,
  name,
  email,
  plan,
  phone,
  gatePaper,
  createdAt,
  updatedAt,
  lastLoginAt,
  provider,
  emailVerified,
  status,
  bannedReason,
  bannedAt,
  photoURL,
}: NormalizeUserProfileInput): UserData {
  return {
    uid,
    name: toTrimmedString(name) || "Student",
    email: toTrimmedString(email).toLowerCase(),
    plan: toTrimmedString(plan) || "free",
    phone: toTrimmedString(phone),
    gatePaper: toTrimmedString(gatePaper),
    createdAt: toIsoString(createdAt),
    updatedAt: toIsoString(updatedAt),
    lastLoginAt: toIsoString(lastLoginAt),
    provider: normalizeUserProvider(provider),
    emailVerified: Boolean(emailVerified),
    status: normalizeUserStatus(status),
    bannedReason: toTrimmedString(bannedReason),
    bannedAt: toIsoString(bannedAt),
    photoURL: toTrimmedString(photoURL),
  };
}

export function buildUserProfilePayload({
  uid,
  name,
  email,
  phone,
  gatePaper,
  plan,
  provider,
  emailVerified,
  photoURL,
  existing,
}: BuildUserProfilePayloadInput) {
  const now = new Date().toISOString();

  return {
    uid,
    name: (name || existing?.name || "Student").trim(),
    email: (email || existing?.email || "").trim().toLowerCase(),
    phone: (phone || existing?.phone || "").trim(),
    gatePaper: (gatePaper || existing?.gatePaper || "").trim(),
    plan: (plan || existing?.plan || "free").trim() || "free",
    provider: normalizeUserProvider(provider || existing?.provider),
    emailVerified: Boolean(
      emailVerified ?? existing?.emailVerified ?? false,
    ),
    status: normalizeUserStatus(existing?.status),
    bannedReason: existing?.bannedReason || "",
    bannedAt: existing?.bannedAt || "",
    photoURL: (photoURL || existing?.photoURL || "").trim(),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    lastLoginAt: now,
  };
}

export function isBannedUser(profile: Pick<UserData, "status"> | null | undefined) {
  return profile?.status === "banned";
}

export function getBannedUserMessage(
  profile: Pick<UserData, "bannedReason"> | null | undefined,
) {
  const reason = profile?.bannedReason?.trim();

  if (reason) {
    return `Your account has been banned. Reason: ${reason}`;
  }

  return "Your account has been banned. Please contact the Engineering Loop team if you think this is a mistake.";
}

export function getEmailVerificationDocId(email: string) {
  return encodeURIComponent(email.trim().toLowerCase());
}
