"use client";

import { User, UserPlus } from "lucide-react";

export default function SearchResult({ user, onAddContact }) {
  const initials = user?.name
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isContact = user?.isContact === true;
  const isOnline = user?.isOnline === true;

  return (
    <div className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-base-200">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white">
          {user?.image ? (
            <img
              src={user.image}
              alt={user?.name || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            initials || <User size={18} />
          )}
        </div>

        {/* Online indicator Only visible for accepted contacts */}
        {isContact && isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-base-100 bg-success" />
        )}
      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {user?.name || "Unknown User"}
        </p>

        <p className="truncate text-xs text-base-content/50">
          @{user?.username || ""}
        </p>

        {/* Status
            Only visible for accepted contacts */}
        {isContact && (
          <p
            className={`mt-0.5 text-[11px] ${
              isOnline ? "text-success" : "text-base-content/40"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        )}
      </div>

      {/* Action
          Only non-contacts can send contact request */}
      {!isContact && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddContact?.(user);
          }}
          className="btn btn-ghost btn-sm rounded-xl text-primary hover:bg-primary/10"
          aria-label={`Add ${user?.name || "user"} as contact`}
        >
          <UserPlus size={17} />

          <span className="hidden sm:inline">Add</span>
        </button>
      )}
    </div>
  );
}
