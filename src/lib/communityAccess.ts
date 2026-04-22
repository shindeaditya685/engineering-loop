import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  getBannedUserMessage,
  normalizeUserProfile,
  type UserData,
} from "@/lib/users";

interface CommunityAccessInput {
  authorUid?: unknown;
  authorEmail?: unknown;
}

interface CommunityAccessResult {
  ok: boolean;
  error?: string;
  user?: UserData;
}

export async function verifyCommunityAccess({
  authorUid,
  authorEmail,
}: CommunityAccessInput): Promise<CommunityAccessResult> {
  const uid = String(authorUid || "").trim();
  const email = String(authorEmail || "").trim().toLowerCase();

  if (!uid || !email) {
    return {
      ok: false,
      error: "Please log in again so we can verify your account.",
    };
  }

  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return {
      ok: false,
      error: "We could not verify your account. Please log in again.",
    };
  }

  const user = normalizeUserProfile({
    uid,
    ...snapshot.data(),
    email,
  });

  if (user.email !== email) {
    return {
      ok: false,
      error: "We could not verify your account details. Please log in again.",
    };
  }

  if (user.status === "banned") {
    return {
      ok: false,
      error: getBannedUserMessage(user),
    };
  }

  return {
    ok: true,
    user,
  };
}
