"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      toast.error("Please enter your full name.");
      return false;
    }

    if (name.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return false;
    }

    if (!email) {
      toast.error("Please enter your email address.");
      return false;
    }

    if (!formData.password) {
      toast.error("Please enter a password.");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    if (!formData.terms) {
      toast.error("Please accept the Terms of Service and Privacy Policy.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (error) {
        toast.error(
          error.message || "Unable to create your account. Please try again.",
        );

        return;
      }

      if (!data) {
        toast.error("Account creation failed. Please try again.");
        return;
      }

      toast.success("Account created successfully!");

      router.replace("/chat");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        "Something went wrong while creating your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Branding */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary lg:flex">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold text-white backdrop-blur-sm">
                L
              </div>

              <span className="text-2xl font-bold tracking-tight text-white">
                LiveChat
              </span>
            </div>

            <div className="max-w-xl">
              <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
                Real-Time Communication
              </span>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Connect, communicate,
                <br />
                and stay in sync.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
                Create your account and start connecting with people through
                real-time conversations, calls, groups, and more.
              </p>
            </div>

            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} LiveChat. All rights reserved.
            </p>
          </div>
        </section>

        {/* Registration */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                V
              </div>

              <span className="text-xl font-bold">LiveChat</span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-base-content/60">
                Join LiveChat and start connecting with people.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Full name
                </label>

                <label className="input input-bordered flex w-full items-center gap-3 rounded-xl bg-base-100">
                  <UserRound
                    size={18}
                    className="shrink-0 text-base-content/40"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Atik Shaharia"
                    autoComplete="name"
                    className="grow bg-transparent outline-none"
                    disabled={loading}
                  />
                </label>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <label className="input input-bordered flex w-full items-center gap-3 rounded-xl bg-base-100">
                  <Mail size={18} className="shrink-0 text-base-content/40" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="grow bg-transparent outline-none"
                    disabled={loading}
                  />
                </label>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <label className="input input-bordered flex w-full items-center gap-3 rounded-xl bg-base-100">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-base-content/40"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className="grow bg-transparent outline-none"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="text-base-content/50 hover:text-base-content"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                <p className="mt-2 text-xs text-base-content/50">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm password
                </label>

                <label className="input input-bordered flex w-full items-center gap-3 rounded-xl bg-base-100">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-base-content/40"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="grow bg-transparent outline-none"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    className="text-base-content/50 hover:text-base-content"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </label>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="checkbox checkbox-primary checkbox-sm mt-0.5"
                  disabled={loading}
                />

                <span className="text-sm leading-5 text-base-content/60">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary h-12 w-full rounded-xl border-0 bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:opacity-95"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-base-content/60">
              Already have an account?
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
