"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau password salah.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh(); // Ensure layout reads the new session
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}>
      {/* Decorative Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'var(--gradient-mesh)' }}></div>

      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-[var(--color-primary-200)] opacity-40 z-0 pointer-events-none"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-[var(--color-accent-200)] opacity-40 z-0 pointer-events-none"></div>

      <div className="w-full max-w-md z-10 relative animate-fade-in-up">
        <div className="card relative z-10" style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 100%)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)',
          borderRadius: '28px',
          padding: '48px 40px'
        }}>
          <div className="text-center mb-8">
            <div className="w-28 h-28 flex items-center justify-center mb-5 mx-auto drop-shadow-xl">
              <Image src="/images/assets/logo.webp" alt="Logo" width={96} height={96} className="object-contain" priority />
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--color-primary-900)] tracking-tight">Login Admin SPMB</h1>
            <p className="text-[var(--color-text-secondary)] mt-2 font-medium">SD Plus 3 Al-Muhajirin</p>
          </div>
          {error && (
            <div className="bg-[var(--color-danger-50)] text-[var(--color-danger-600)] p-4 rounded-lg mb-6 text-sm font-medium border border-[var(--color-danger-100)] flex items-start gap-2 animate-scale-in">
              <span className="mt-0.5">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="form-group">
              <label htmlFor="email" className="form-label text-[var(--color-primary-900)]">Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input bg-white/80 focus:bg-white"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="form-label text-[var(--color-primary-900)]">Password</label>
              </div>
              <input
                id="password"
                type="password"
                required
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input bg-white/80 focus:bg-white"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Masuk ke Sistem...
                </span>
              ) : (
                "Login ke Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[var(--color-border-light)] pt-4">
            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              &copy; {new Date().getFullYear()} {SITE_CONFIG.schoolName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
