"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/features/users/types";
import { authService } from "@/features/auth/api/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth init failed", error);
        // Optional: Redirect to login if needed, but maybe not here to allow public pages
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    setUser(user);
    router.push("/dashboard");
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
