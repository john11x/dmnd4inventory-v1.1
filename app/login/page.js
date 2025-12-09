"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../providers/AuthProvider";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await login(email, password, 'ROLE_USER');
      if (res && res.success) {
        router.push('/user/home');
      } else {
        setError(res?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 frosted-card w-full max-w-md space-y-6 p-8 backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">Sentora OS</p>
            <h2 className="text-2xl font-bold text-white">System Access</h2>
            <p className="text-sm text-slate-300">Sign in to access your enterprise dashboard</p>
          </div>
        </div>
        
        {error && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/30 p-3 text-sm text-red-200 backdrop-blur-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <input
              placeholder="Corporate Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
              required
              disabled={isLoading}
            />
            <input
              placeholder="Secure Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <a href="#" className="text-sm text-indigo-300 hover:text-indigo-200 transition-colors duration-300">
              Reset Password?
            </a>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.35em] text-white shadow-lg shadow-indigo-500/30 hover:scale-105 hover:shadow-xl disabled:opacity-70 transition-all duration-300 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : 'Access System'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-300">
          Need access?{" "}
          <a href="/auth" className="text-indigo-300 hover:text-indigo-200 transition-colors duration-300">
            Request Account
          </a>
        </div>
      </div>
    </div>
  );
}
