"use client";
import { useContext } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      Logout
    </button>
  );
}
