"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../providers/AuthProvider";

export default function AdminLogin() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await login(username, password, 'ROLE_ADMIN');
    if (res.success) router.push('/admin/dashboard');
    else alert(res.message || 'Login failed');
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="glass-panel w-full max-w-md space-y-5 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Admin Console</p>
          <h2 className="text-2xl font-semibold text-white">Secure login</h2>
          <p className="text-sm text-slate-300">Manage inventory, orders, and predictions.</p>
        </div>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <div className="flex items-center justify-between">
          <a className="text-sm text-indigo-200">Forgot Password?</a>
          <button
            onClick={handleLogin}
            className="rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-indigo-500/30"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
