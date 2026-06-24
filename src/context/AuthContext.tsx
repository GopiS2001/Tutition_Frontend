import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { loginRequest, logoutRequest, type AuthUser } from "../api/auth.api";
import { ApiError } from "../lib/apiClient";

const STORAGE_KEY = "tuition_auth";

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setAuth(loadStoredAuth());
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    const nextAuth: StoredAuth = {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      user: result.user,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  }, []);

  const logout = useCallback(async () => {
    if (auth?.accessToken) {
      try {
        await logoutRequest(auth.accessToken);
      } catch (error) {
        if (!(error instanceof ApiError)) throw error;
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        accessToken: auth?.accessToken ?? null,
        isAuthenticated: !!auth?.accessToken,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
