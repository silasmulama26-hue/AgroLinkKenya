"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getSupabase } from "@/lib/supabase";

const translations = {
  en: {
    welcomeBack: "Welcome Back",
    signInToAccount: "Sign in to your AgriLink account",
    email: "Email Address",
    password: "Password",
    signIn: "Sign In",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign Up",
    forgotPassword: "Forgot Password?",
    signInError: "Sign in failed. Please check your credentials.",
    loading: "Signing in..."
  },
  sw: {
    welcomeBack: "Karibu Tena",
    signInToAccount: "Ingia kwenye akaunti yako ya AgriLink",
    email: "Anwani ya Barua Pepe",
    password: "Nenosiri",
    signIn: "Ingia",
    dontHaveAccount: "Huna akaunti?",
    signUp: "Jisajili",
    forgotPassword: "Umesahau Nenosiri?",
    signInError: "Kuingia kumeshindikana. Tafadhali angalia hati zako.",
    loading: "Inaingia..."
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const t = translations[preferredLang];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(t.signInError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setPreferredLang(prev => prev === "en" ? "sw" : "en")}
            className="px-3 py-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 uppercase"
          >
            {preferredLang}
          </button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">AgriLink</h1>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{t.welcomeBack}</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">{t.signInToAccount}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-neutral-400 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  {t.loading}
                </>
              ) : (
                t.signIn
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-neutral-600 dark:text-neutral-400">
              {t.dontHaveAccount}{" "}
              <button
                onClick={() => router.push('/auth/register')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {t.signUp}
              </button>
            </p>
            <button
              onClick={() => router.push('/auth/forgot-password')}
              className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              {t.forgotPassword}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}