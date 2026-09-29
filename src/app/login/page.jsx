"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      if (!data) {
        toast.error("Unable to sign in. Please try again.");
        return;
      }

      toast.success("Welcome back!");

      router.replace("/chat");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Branding Section */}
        <section className="relative hidden overflow-hidden bg-primary lg:flex">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/90 to-secondary" />

          {/* Decorative Elements */}
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <MessageCircle
                  size={24}
                  strokeWidth={2.3}
                  className="text-white"
                />
              </div>

              <span className="text-2xl font-bold tracking-tight text-white">
                LiveChat
              </span>
            </div>

            {/* Main Content */}
            <div className="max-w-xl">
              <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
                Real-Time Communication
              </span>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Connect.
                <br />
                Communicate.
                <br />
                Stay connected.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/70 xl:text-lg">
                LiveChat brings your conversations, communities, calls, and
                connections together in one modern communication platform.
              </p>
            </div>

            {/* Footer */}
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} LiveChat. All rights reserved.
            </p>
          </div>
        </section>

        {/* Login Section */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-content shadow-lg">
                <MessageCircle size={24} strokeWidth={2.3} />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                LiveChat
              </span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-base-content/55 sm:text-base">
                Sign in to continue to your conversations.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <label className="input input-bordered flex w-full items-center gap-3 rounded-xl bg-base-100 focus-within:border-primary">
                  <Mail size={19} className="text-base-content/40" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="grow bg-transparent outline-none"
                  />
                </label>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary transition hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <label className="input input-bordered flex w-full items-center gap-3 rounded-xl bg-base-100 focus-within:border-primary">
                  <LockKeyhole size={19} className="text-base-content/40" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="grow bg-transparent outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="text-base-content/40 transition hover:text-base-content"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </label>
              </div>

              {/* Remember / Session */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  disabled={loading}
                />

                <label
                  htmlFor="remember"
                  className="cursor-pointer text-sm text-base-content/60"
                >
                  Keep me signed in
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary h-12 w-full rounded-xl text-sm font-semibold shadow-lg"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-base-300" />
              <span className="text-xs text-base-content/40">OR</span>
              <div className="h-px flex-1 bg-base-300" />
            </div>

            <p className="text-center text-sm text-base-content/60">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Create account
              </Link>
            </p>

            {/* Mobile Footer */}
            <p className="mt-10 text-center text-xs text-base-content/40 lg:hidden">
              © {new Date().getFullYear()} VYRO
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
