"use client";

import useAuthStore from "@/stores/auth-store";
import { useEffect } from "react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/auth/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            phoneNumber: data.user.phoneNumber,
            name: data.user.name,
            role: data.user.role,
            email: data.user.email,
          }); // Set user to auth store
        } else {
          clearUser(); // Clear state if user is not authenticated
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        clearUser(); // Clear state on error
      }
    };

    fetchUser();
  }, [setUser, clearUser]);

  return <>{children}</>;
}
