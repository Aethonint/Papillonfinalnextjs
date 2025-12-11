"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Load User on Mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
    }
    setLoading(false);
  }, []);

  // 2. Login Function
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("auth_token", authToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  // 3. NEW: Refresh User Function (Fixes your issue)
  // This fetches the latest data from DB and updates the UI immediately
  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem("auth_token");
    if (!currentToken) return;

    try {
      const res = await fetch("http://localhost:8000/api/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${currentToken}`,
          "Accept": "application/json",
        },
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // Update State (Instantly updates UI)
        setUser(updatedUser);
        // Update Storage (Persists on reload)
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  // 4. Logout Function
  const logout = async () => {
    try {
        if (token) {
            await fetch("http://localhost:8000/api/logout", {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
            });
        }
    } catch (error) {
        console.error("Logout failed", error);
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);