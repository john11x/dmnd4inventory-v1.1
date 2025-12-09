"use client";

import { useContext, useEffect, useMemo } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function ProtectedClient({ children, role, allowedRoles }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const normalizedRoles = useMemo(() => {
    if (allowedRoles) return allowedRoles;
    if (role) return [role];
    return undefined;
  }, [allowedRoles, role]);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    if (normalizedRoles && !normalizedRoles.includes(user.role)) {
      if (user.role === "ROLE_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/home");
      }
    }
  }, [user, normalizedRoles, router]);

  if (!user || (normalizedRoles && !normalizedRoles.includes(user.role))) {
    return <div className="p-6 text-slate-300">Checking authentication...</div>;
  }

  return children;
}
