"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  Phone,
  Video,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [theme, setTheme] = useState("light");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  /*
  ========================================
  User Data
  ========================================
  */

  const user = session?.user;

  const userName = user?.name || "User";

  const userUsername = user?.username ? `@${user.username}` : "";

  const userEmail = user?.email || "";

  const userImage = user?.image || "";

  const userInitial = userName.trim().charAt(0).toUpperCase();

  /*
  ========================================
  Notifications
  ========================================
  */

  const unreadCount = 0;

  /*
  ========================================
  Theme
  ========================================
  */

  useEffect(() => {
    const savedTheme = localStorage.getItem("livechat-theme");

    const initialTheme =
      savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";

    setTheme(initialTheme);

    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);

    localStorage.setItem("livechat-theme", nextTheme);

    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  /*
  ========================================
  Close Dropdowns On Outside Click
  ========================================
  */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
  ========================================
  Logout
  ========================================
  */

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout failed:", error);
        return;
      }

      setProfileOpen(false);

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  /*
  ========================================
  Profile Image
  ========================================
  */

  const UserAvatar = ({ size = "h-9 w-9", textSize = "text-sm" }) => {
    if (userImage) {
      return (
        <img
          src={userImage}
          alt={userName}
          className={`${size} rounded-full object-cover`}
        />
      );
    }

    return (
      <div
        className={`flex ${size} items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary ${textSize} font-semibold text-white`}
      >
        {userInitial}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-base-300 bg-base-100/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6">
        {/* ========================================
            LEFT SIDE
        ======================================== */}

        <div className="flex min-w-0 items-center">
          {/* ==================================
              DESKTOP LOGO
          ================================== */}

          <Link href="/chat" className="hidden items-center gap-2 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-secondary text-white shadow-sm">
              <span className="text-sm font-bold">L</span>
            </div>

            <span className="text-lg font-bold tracking-tight">LiveChat</span>
          </Link>
        </div>

        {/* ========================================
            DESKTOP SEARCH
        ======================================== */}

        <div className="mx-4 min-w-0 max-w-xl flex-1 md:mx-6 md:flex lg:mx-8">
          <label className="input input-bordered flex w-full items-center gap-2 rounded-xl bg-base-200">
            <Search size={18} className="shrink-0 text-base-content/50" />

            <input
              type="search"
              placeholder="Search messages, people..."
              className="grow bg-transparent outline-none"
              aria-label="Search messages and people"
            />
          </label>
        </div>

        {/* ========================================
            RIGHT SIDE
        ======================================== */}

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {/* ==================================
              DESKTOP THEME
              md and above only
          ================================== */}

          <button
            type="button"
            onClick={handleThemeToggle}
            className="btn btn-ghost btn-square hidden rounded-xl md:flex"
            aria-label="Toggle theme"
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          {/* ==================================
              NOTIFICATIONS
              ALL DEVICES
          ================================== */}

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((previous) => !previous);

                setProfileOpen(false);
              }}
              className="btn btn-ghost btn-square relative rounded-xl"
              aria-label="Notifications"
              aria-expanded={notificationOpen}
            >
              <Bell size={19} />

              {/* Real unread indicator */}

              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold text-error-content">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}

            {notificationOpen && (
              <div className="absolute right-0 top-12 z-50 w-[calc(100vw-24px)] max-w-80 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl">
                <div className="flex items-center justify-between px-2 py-2">
                  <h3 className="text-sm font-semibold sm:text-base">
                    Notifications
                  </h3>

                  {unreadCount > 0 && (
                    <span className="badge badge-primary badge-sm">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                <div className="mt-2 rounded-xl bg-base-200 p-4 text-center text-sm text-base-content/60">
                  No notifications yet
                </div>
              </div>
            )}
          </div>

          {/* ==================================
              PROFILE
              ALL DEVICES
          ================================== */}

          <div ref={profileRef} className="relative ml-0.5 sm:ml-1">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((previous) => !previous);

                setNotificationOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-base-200"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              {/* Avatar */}

              {sessionLoading ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-base-300" />
              ) : (
                <UserAvatar />
              )}

              {/* Desktop User Information */}

              <div className="hidden text-left lg:block">
                {sessionLoading ? (
                  <>
                    <div className="h-3 w-24 animate-pulse rounded bg-base-300" />

                    <div className="mt-1 h-2.5 w-16 animate-pulse rounded bg-base-300" />
                  </>
                ) : (
                  <>
                    <p className="max-w-32 truncate text-sm font-semibold leading-4">
                      {userName}
                    </p>

                    <p className="mt-0.5 max-w-32 truncate text-xs text-base-content/50">
                      {userUsername}
                    </p>
                  </>
                )}
              </div>

              {/* Desktop Chevron */}

              <ChevronDown
                size={16}
                className="hidden text-base-content/50 lg:block"
              />
            </button>

            {/* ==================================
                PROFILE DROPDOWN
            ================================== */}

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-[calc(100vw-24px)] max-w-72 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl">
                {/* Profile Header */}

                <div className="flex items-center gap-3 rounded-xl bg-base-200 p-3">
                  <div className="shrink-0">
                    <UserAvatar size="h-10 w-10" textSize="text-sm" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{userName}</p>

                    {userUsername && (
                      <p className="truncate text-xs text-base-content/50">
                        {userUsername}
                      </p>
                    )}

                    {userEmail && (
                      <p className="mt-0.5 truncate text-xs text-base-content/40">
                        {userEmail}
                      </p>
                    )}

                    <p className="mt-1 flex items-center gap-1 text-xs text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Online
                    </p>
                  </div>
                </div>

                {/* ==================================
                    MOBILE THEME
                    md and below only
                ================================== */}

                <div className="mt-2 md:hidden">
                  <button
                    type="button"
                    onClick={handleThemeToggle}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-base-200"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-200">
                      {theme === "light" ? (
                        <Moon size={17} />
                      ) : (
                        <Sun size={17} />
                      )}
                    </div>

                    <span>
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                  </button>
                </div>

                {/* Divider */}

                <div className="my-2 border-t border-base-300" />

                {/* Profile */}

                <div className="space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-base-200"
                  >
                    <User size={17} />

                    <span>My Profile</span>
                  </Link>
                </div>

                {/* Divider */}

                <div className="my-2 border-t border-base-300" />

                {/* Calls */}

                <div className="space-y-0.5">
                  <Link
                    href="/audio-call"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-base-200"
                  >
                    <Phone size={17} />

                    <span>Audio Call</span>
                  </Link>

                  <Link
                    href="/video-call"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-base-200"
                  >
                    <Video size={17} />

                    <span>Video Call</span>
                  </Link>
                </div>

                {/* Divider */}

                <div className="my-2 border-t border-base-300" />

                {/* Settings */}

                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-base-200"
                >
                  <Settings size={17} />

                  <span>Settings</span>
                </Link>

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-error transition hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loggingOut ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <LogOut size={17} />
                  )}

                  <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
