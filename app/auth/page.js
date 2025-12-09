"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { login, signup, loading } = useContext(AuthContext);
  const router = useRouter();
  
  const [mode, setMode] = useState("login"); // login | signup
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [role, setRole] = useState("ROLE_USER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setIsSubmitting(true);
    
    try {
      const res = await login(email, password, role);
      if (res && res.success) {
        router.push(res.user?.role === "ROLE_ADMIN" ? "/admin/dashboard" : "/user/home");
      } else {
        setError(res?.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await signup(name, email, password, role);
      if (res && res.success) {
        router.push(role === "ROLE_ADMIN" ? "/admin/dashboard" : "/user/home");
      } else {
        setError(res?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during signup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show loading state if auth is still being checked
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Checking authentication...</div>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 glass-panel grid w-full max-w-5xl gap-10 border border-white/10 bg-slate-900/70 p-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="overflow-hidden">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300 animate-pulse">
              <span className="w-2 h-2 bg-indigo-400 rounded-full inline-block mr-2"></span>
              Sentora OS Portal
            </p>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Enterprise Access to
            <span className="block text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-orange-400 bg-clip-text animate-gradient">
              Next-Gen Computing
            </span>
          </h1>
          <p className="text-slate-300 leading-relaxed">
            Access your Sentora OS dashboard, manage system deployments, and monitor enterprise infrastructure. 
            Secure authentication for mission-critical operations.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "🔐", label: "Quantum-safe authentication" },
              { icon: "🛡️", label: "Zero-trust security" },
              { icon: "⚡", label: "Real-time monitoring" },
              { icon: "🚀", label: "Autonomous operations" }
            ].map((item, index) => (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/10"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                    {item.label.charAt(0)}
                  </div>
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="frosted-card p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-orange-500/10"></div>
          
          <div className="relative">
            <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
              {["login", "signup"].map((type) => (
                <button
                  key={type}
                  onClick={() => setMode(type)}
                  className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-[0.35em] transition-all duration-300 ${
                    mode === type 
                      ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {type === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="mt-6 space-y-4">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300"
              >
                <option value="ROLE_USER" className="text-gray-900">
                  System User
                </option>
                <option value="ROLE_ADMIN" className="text-gray-900">
                  System Administrator
                </option>
              </select>

              {mode === "signup" && (
                <input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300"
                  required
                />
              )}

              <input
                placeholder="Corporate Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300"
                required
              />
              <input
                placeholder="Secure Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300"
                required
              />

              {mode === "login" ? (
                <div className="space-y-4">
                  <button 
                    type="button"
                    className="text-sm text-indigo-300 underline decoration-dotted decoration-indigo-400 hover:text-indigo-200 transition-colors duration-300"
                  >
                    Reset Password?
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-primary w-full rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 shadow-indigo-500/30 hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? 'Authenticating...' : 'Access System'}
                  </button>
                  <div className="text-center text-sm text-slate-300">
                    New to Sentora OS?{" "}
                    <button 
                      type="button"
                      onClick={() => setMode("signup")} 
                      className="text-indigo-300 underline hover:text-indigo-200 transition-colors duration-300"
                    >
                      Request Access
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-primary w-full rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-emerald-500/30 hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                  <div className="text-center text-sm text-slate-300">
                    Already have access?{" "}
                    <button 
                      type="button"
                      onClick={() => setMode("login")} 
                      className="text-indigo-300 underline hover:text-indigo-200 transition-colors duration-300"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}
