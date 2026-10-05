"use client";

export default function ProfileSection({ title, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <div className="border-b border-base-300 px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
