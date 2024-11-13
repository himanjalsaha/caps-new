"use client";

// This higher order component based on the user role 
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "TEACHER" | "STUDENT";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

 useEffect(() => {
   if (loading) return; // Do nothing while loading
   if (!user) {
     router.replace("/login"); // Redirect to login if not authenticated
   } else if (user.role !== requiredRole) {
     router.replace("/unauthorized"); // Redirect if role does not match
   }
 }, [user, loading, router, requiredRole]);

  if (loading || !user || user.role !== requiredRole) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
