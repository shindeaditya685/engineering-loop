"use client";

import {
  GoogleAuthProvider,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import app, { db } from "@/lib/firebase";
import {
  buildUserProfilePayload,
  getBannedUserMessage,
  normalizeUserProfile,
  normalizeUserProvider,
  type UserAuthProvider,
  type UserData,
} from "@/lib/users";

interface AuthActionResult {
  ok: boolean;
  error?: string;
  message?: string;
}

interface SyncUserOptions {
  name?: string;
  phone?: string;
  gatePaper?: string;
  provider?: UserAuthProvider;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    gatePaper?: string,
  ) => Promise<AuthActionResult>;
  continueWithGoogle: () => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getFirestoreErrorCode(error: unknown): string {
  return typeof error === "object" && error && "code" in error
    ? String(error.code)
    : "";
}

function isFirestorePermissionError(error: unknown) {
  return getFirestoreErrorCode(error) === "permission-denied";
}

function getPrimaryProvider(firebaseUser: FirebaseUser): UserAuthProvider {
  const providerId = firebaseUser.providerData[0]?.providerId || "unknown";
  return normalizeUserProvider(providerId);
}

function createFallbackUser(
  firebaseUser: FirebaseUser,
  overrides?: SyncUserOptions,
): UserData {
  const provider = overrides?.provider || getPrimaryProvider(firebaseUser);

  return normalizeUserProfile({
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    name:
      overrides?.name ||
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "Student",
    plan: "free",
    phone: overrides?.phone || "",
    gatePaper: overrides?.gatePaper || "",
    provider,
    emailVerified:
      provider === "google"
        ? true
        : Boolean(overrides?.emailVerified ?? firebaseUser.emailVerified),
    photoURL: firebaseUser.photoURL || "",
    createdAt: null,
    updatedAt: null,
    lastLoginAt: null,
    status: "active",
    bannedReason: "",
    bannedAt: null,
  });
}

function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Please allow popups to continue with Google.";
    case "auth/account-exists-with-different-credential":
      return "This email is already registered with another sign-in method.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      return "Authentication failed. Please try again.";
  }
}

function getEmailVerificationSettings() {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "";

  if (!origin) {
    return undefined;
  }

  return {
    url: `${origin}/login?verify=verified`,
  };
}

function getVerificationEmailErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";

  switch (code) {
    case "auth/unauthorized-continue-uri":
      return "Verification email could not be sent because this domain is not authorized in Firebase Authentication settings.";
    case "auth/invalid-continue-uri":
      return "Verification email could not be sent because the continue URL is invalid.";
    default:
      return "We created your account, but could not send the verification email. Try logging in once to resend it.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBannedUser = useCallback(
    async (profile: Pick<UserData, "bannedReason">) => {
      setUser(null);
      await signOut(auth);
      router.push("/login");
      return {
        ok: false,
        error: getBannedUserMessage(profile),
      } satisfies AuthActionResult;
    },
    [router],
  );

  const syncUser = useCallback(
    async (
      firebaseUser: FirebaseUser | null,
      options?: SyncUserOptions,
    ): Promise<AuthActionResult> => {
      if (!firebaseUser) {
        setUser(null);
        return { ok: true };
      }

      const provider = options?.provider || getPrimaryProvider(firebaseUser);

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snapshot = await getDoc(userRef);
        const existing = snapshot.exists()
          ? normalizeUserProfile({
              uid: firebaseUser.uid,
              ...snapshot.data(),
            })
          : null;

        const nextPayload = buildUserProfilePayload({
          uid: firebaseUser.uid,
          name:
            options?.name ||
            existing?.name ||
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Student",
          email: firebaseUser.email || existing?.email || "",
          phone: options?.phone ?? existing?.phone,
          gatePaper: options?.gatePaper ?? existing?.gatePaper,
          plan: existing?.plan,
          provider,
          emailVerified:
            provider === "google"
              ? true
              : Boolean(
                  options?.emailVerified ??
                    firebaseUser.emailVerified ??
                    existing?.emailVerified,
                ),
          photoURL: firebaseUser.photoURL || existing?.photoURL || "",
          existing,
        });

        await setDoc(userRef, nextPayload, { merge: true });

        const profile = normalizeUserProfile(nextPayload);

        if (profile.status === "banned") {
          return handleBannedUser(profile);
        }

        setUser(profile);
        return { ok: true };
      } catch (error) {
        if (isFirestorePermissionError(error)) {
          console.warn(
            "User profile document is not readable with current Firestore rules. Falling back to Firebase Auth profile.",
          );
        } else {
          console.error("Refresh user error:", error);
        }

        setUser(createFallbackUser(firebaseUser, options));
        return { ok: true };
      }
    },
    [handleBannedUser],
  );

  const refreshUser = useCallback(async () => {
    setLoading(true);

    try {
      await syncUser(auth.currentUser);
    } finally {
      setLoading(false);
    }
  }, [syncUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthActionResult> => {
      setLoading(true);

      try {
        const credential = await signInWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password,
        );

        if (
          getPrimaryProvider(credential.user) === "password" &&
          !credential.user.emailVerified
        ) {
          try {
            await sendEmailVerification(
              credential.user,
              getEmailVerificationSettings(),
            );
          } catch (verificationError) {
            console.warn(
              "Unable to resend verification email during login:",
              verificationError,
            );
          }

          await signOut(auth);
          setUser(null);
          return {
            ok: false,
            error:
              "Verify your email before logging in. We sent a fresh verification link to your inbox.",
          };
        }

        return await syncUser(credential.user);
      } catch (error) {
        console.error("Login error:", error);
        return { ok: false, error: getAuthErrorMessage(error) };
      } finally {
        setLoading(false);
      }
    },
    [syncUser],
  );

  const continueWithGoogle = useCallback(async (): Promise<AuthActionResult> => {
    setLoading(true);

    try {
      const credential = await signInWithPopup(auth, googleProvider);

      if (!credential.user.email) {
        await signOut(auth);
        return {
          ok: false,
          error: "Google sign-in did not return an email address.",
        };
      }

      return await syncUser(credential.user, {
        provider: "google",
        emailVerified: true,
      });
    } catch (error) {
      console.error("Google auth error:", error);
      return { ok: false, error: getAuthErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  }, [syncUser]);

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      phone?: string,
      gatePaper?: string,
    ): Promise<AuthActionResult> => {
      setLoading(true);

      try {
        const normalizedEmail = email.trim().toLowerCase();

        const credential = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password,
        );

        await updateProfile(credential.user, { displayName: name.trim() });

        const result = await syncUser(credential.user, {
          name,
          phone,
          gatePaper,
          provider: "password",
          emailVerified: false,
        });

        if (!result.ok) {
          return result;
        }

        try {
          await sendEmailVerification(
            credential.user,
            getEmailVerificationSettings(),
          );
        } catch (verificationError) {
          console.error("Verification email send error:", verificationError);
          await signOut(auth);
          setUser(null);
          return {
            ok: false,
            error: getVerificationEmailErrorMessage(verificationError),
          };
        }

        await signOut(auth);
        setUser(null);
        return {
          ok: true,
          message:
            "We sent a verification email to your inbox. Verify it, then log in.",
        };
      } catch (error) {
        console.error("Signup error:", error);
        return { ok: false, error: getAuthErrorMessage(error) };
      } finally {
        setLoading(false);
      }
    },
    [syncUser],
  );

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
      } catch (error) {
        console.error("Auth persistence error:", error);
      }

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!isMounted) {
          return;
        }

        setLoading(true);
        await syncUser(firebaseUser);

        if (isMounted) {
          setLoading(false);
        }
      });
    };

    void initializeAuth();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [syncUser]);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (auth.currentUser) {
        void refreshUser();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && auth.currentUser) {
        void refreshUser();
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      continueWithGoogle,
      logout,
      refreshUser,
    }),
    [continueWithGoogle, loading, login, logout, refreshUser, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
