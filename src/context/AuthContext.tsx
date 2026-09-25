import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "candidate";
  targetBand: number;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdminOrTeacher: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; password: string; role?: "admin" | "teacher" | "candidate"; targetBand?: number }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("ielts_mastery_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("ielts_mastery_token") || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  // Validate session on mount
  useEffect(() => {
    if (token && user?.email) {
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-email": user.email,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated && data.user) {
            setUser(data.user);
            localStorage.setItem("ielts_mastery_user", JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Keep local user if network fails
        });
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to log in." };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("ielts_mastery_user", JSON.stringify(data.user));
      localStorage.setItem("ielts_mastery_token", data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error logging in." };
    }
  };

  const signup = async (payload: {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "teacher" | "candidate";
    targetBand?: number;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to create account." };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("ielts_mastery_user", JSON.stringify(data.user));
      localStorage.setItem("ielts_mastery_token", data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error signing up." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ielts_mastery_user");
    localStorage.removeItem("ielts_mastery_token");
  };

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdminOrTeacher,
        login,
        signup,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
