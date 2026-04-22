"use client";

import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";

export interface UserData {
  uid: string;
  name: string;
  email: string;
  plan: string;
  phone: string;
  gatePaper: string;
  createdAt: unknown;
}

interface AuthActionResult {
  ok: boolean;
  error?: string;
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
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const auth = getAuth();
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getFirestoreErrorCode(error: unknown): string {
  return typeof error === "object" && error && "code" in error
    ? String(error.code)
    : "";
}

function isFirestorePermissionError(error: unknown): boolean {
  return getFirestoreErrorCode(error) === "permission-denied";
}

function createFallbackUser(firebaseUser: FirebaseUser): UserData {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || "Student",
    plan: "free",
    phone: "",
    gatePaper: "",
    createdAt: null,
  };
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
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      return "Authentication failed. Please try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUser = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }

    try {
      const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));

      if (snapshot.exists()) {
        const data = snapshot.data();
        setUser({
          uid: firebaseUser.uid,
          name: String(data.name || firebaseUser.displayName || "Student"),
          email: String(data.email || firebaseUser.email || ""),
          plan: String(data.plan || "free"),
          phone: String(data.phone || ""),
          gatePaper: String(data.gatePaper || ""),
          createdAt: data.createdAt ?? null,
        });
        return;
      }

      setUser(createFallbackUser(firebaseUser));
    } catch (error) {
      if (isFirestorePermissionError(error)) {
        console.warn(
          "User profile document is not readable with current Firestore rules. Falling back to Firebase Auth profile.",
        );
      } else {
        console.error("Refresh user error:", error);
      }
      setUser(createFallbackUser(firebaseUser));
    }
  }, []);

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
          email.trim(),
          password,
        );
        await syncUser(credential.user);
        return { ok: true };
      } catch (error) {
        console.error("Login error:", error);
        return { ok: false, error: getAuthErrorMessage(error) };
      } finally {
        setLoading(false);
      }
    },
    [syncUser],
  );

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
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );

        await updateProfile(credential.user, { displayName: name.trim() });

        try {
          await setDoc(doc(db, "users", credential.user.uid), {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone?.trim() || "",
            plan: "free",
            gatePaper: gatePaper?.trim() || "",
            createdAt: serverTimestamp(),
          });
        } catch (profileError) {
          if (isFirestorePermissionError(profileError)) {
            console.warn(
              "Signup succeeded, but Firestore rules blocked creating the user profile document.",
            );
          } else {
            throw profileError;
          }
        }

        await syncUser(credential.user);
        return { ok: true };
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

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
