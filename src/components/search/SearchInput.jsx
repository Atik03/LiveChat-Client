"use client";

import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange, onClear, onFocus }) {
  return (
    <label className="input input-bordered flex w-full items-center gap-2 rounded-xl bg-base-200">
      <Search size={18} className="shrink-0 text-base-content/50" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        placeholder="Search messages, people..."
        className="grow bg-transparent outline-none"
        aria-label="Search messages and people"
      />
    </label>
  );
}
