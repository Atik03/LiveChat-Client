"use client";

import { Check, Edit3, X } from "lucide-react";

export default function ProfileField({
  icon,
  label,
  value,
  placeholder,
  editable,
  editing,
  inputValue,
  onEdit,
  onChange,
  onSave,
  onCancel,
  textarea = false,
  saving = false,
  checking = false,
  validationMessage = "",
  validationState = null,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon && (
            <span className="shrink-0 text-base-content/50">{icon}</span>
          )}

          <p className="text-xs font-medium uppercase tracking-wide text-base-content/50">
            {label}
          </p>
        </div>

        {!editing && editable && (
          <button
            type="button"
            onClick={onEdit}
            className="btn btn-ghost btn-xs gap-1.5 rounded-lg"
          >
            <Edit3 size={14} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-2">
          {textarea ? (
            <textarea
              value={inputValue}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              rows={3}
              maxLength={500}
              className="textarea textarea-bordered w-full resize-none"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              disabled={saving}
              className="input input-bordered w-full"
              autoFocus
            />
          )}

          {/* Username validation */}
          {label === "Username" && validationMessage && (
            <p
              className={`mt-1.5 text-xs ${
                validationState === true ? "text-success" : "text-error"
              }`}
            >
              {checking ? "Checking username..." : validationMessage}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="btn btn-ghost btn-sm"
            >
              <X size={15} />
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={
                saving ||
                checking ||
                (label === "Username" && validationState === false)
              }
              className="btn btn-primary btn-sm"
            >
              {saving ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Check size={15} />
              )}
              Save
            </button>
          </div>
        </div>
      ) : (
        <p
          className={`mt-1 text-sm ${
            value ? "text-base-content" : "text-base-content/40"
          }`}
        >
          {value || placeholder || "Not added"}
        </p>
      )}
    </div>
  );
}
