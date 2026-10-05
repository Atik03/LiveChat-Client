"use client";

import { useEffect, useRef, useState } from "react";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";

export default function UserSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchRef = useRef(null);

  // Search real users from the backend
  useEffect(() => {
    const query = searchValue.trim();

    if (!query) {
      setUsers([]);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const serverUrl =
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

        const response = await fetch(
          `${serverUrl}/api/users/search?query=${encodeURIComponent(query)}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to search users.");
        }

        setUsers(result.data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setUsers([]);
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setSearchOpen(Boolean(value.trim()));
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setUsers([]);
    setSearchOpen(false);
    setError("");
  };

  const handleAddContact = (user) => {
    console.log("Add contact:", user);
  };

  const handleSelectUser = (user) => {
    console.log("Open conversation with:", user);
    setSearchOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <SearchInput
        value={searchValue}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
        onFocus={() => {
          if (searchValue.trim()) {
            setSearchOpen(true);
          }
        }}
      />

      {searchOpen && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/40">
              People
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : error ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-error">{error}</p>
            </div>
          ) : users.length > 0 ? (
            <div className="max-h-96 space-y-1 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={String(user._id)}
                  onClick={() => handleSelectUser(user)}
                  className="cursor-pointer"
                >
                  <SearchResult
                    user={user}
                    onAddContact={(selectedUser) => {
                      handleAddContact(selectedUser);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium">No users found</p>
              <p className="mt-1 text-xs text-base-content/50">
                Try searching by name or username.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
