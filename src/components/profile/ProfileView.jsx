"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Mail, Phone, Trash2, Users, UsersRound } from "lucide-react";
import toast from "react-hot-toast";

import ProfileField from "./ProfileField";
import ProfileSection from "./ProfileSection";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function ProfileView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingField, setEditingField] = useState(null);
  const [value, setValue] = useState("");

  const [saving, setSaving] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [status, setStatus] = useState("online");

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  /* ==================================================
     LOAD PROFILE
  ================================================== */

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load profile.");
      }

      if (data?.data) {
        setUser(data.data);
        setStatus(data.data.isOnline ? "online" : "offline");
      }
    } catch (error) {
      console.error("Failed to load profile:", error);

      toast.error(error.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  /* ==================================================
     EDITING
  ================================================== */

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setValue(currentValue || "");

    if (field === "username") {
      setUsernameMessage("");
      setUsernameAvailable(null);
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setValue("");
    setUsernameMessage("");
    setUsernameAvailable(null);
  };

  /* ==================================================
     SAVE FIELD
  ================================================== */

  const handleSave = async (field) => {
    if (saving) return;

    try {
      setSaving(true);

      let endpoint = "/api/profile";
      let body = {};

      /* Full Name */

      if (field === "name") {
        const cleanName = value.trim();

        if (!cleanName) {
          toast.error("Full name cannot be empty.");
          return;
        }

        if (cleanName.length > 100) {
          toast.error("Full name cannot exceed 100 characters.");
          return;
        }

        body = {
          name: cleanName,
        };
      }

      /* Username */

      if (field === "username") {
        const cleanUsername = value.trim().toLowerCase();

        if (!cleanUsername) {
          toast.error("Username is required.");
          return;
        }

        if (!/^[a-z0-9][a-z0-9_]{2,29}$/.test(cleanUsername)) {
          toast.error(
            "Username must be 3-30 characters and contain only letters, numbers, and underscores.",
          );
          return;
        }

        if (usernameAvailable === false) {
          toast.error("Please choose an available username.");
          return;
        }

        endpoint = "/api/profile/username";

        body = {
          username: cleanUsername,
        };
      }

      /* Phone */

      if (field === "phoneNumber") {
        endpoint = "/api/profile/phone";

        body = {
          phoneNumber: value.trim(),
        };
      }

      /* Bio */

      if (field === "bio") {
        endpoint = "/api/profile/bio";

        body = {
          bio: value.trim(),
        };
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update profile.");
      }

      if (data?.data) {
        setUser(data.data);

        setStatus(data.data.isOnline ? "online" : "offline");
      }

      toast.success(data?.message || "Profile updated successfully.");

      cancelEditing();
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);

      toast.error(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     CHECK USERNAME
  ================================================== */

  const handleUsernameChange = async (nextValue) => {
    const cleanUsername = nextValue.trim().toLowerCase();

    setValue(cleanUsername);
    setUsernameAvailable(null);
    setUsernameMessage("");

    if (!cleanUsername) {
      return;
    }

    if (!/^[a-z0-9][a-z0-9_]{2,29}$/.test(cleanUsername)) {
      setUsernameMessage(
        "Username must be 3-30 characters and contain only letters, numbers, and underscores.",
      );

      setUsernameAvailable(false);
      return;
    }

    if (cleanUsername === String(user?.username || "").toLowerCase()) {
      setUsernameMessage("This is your current username.");

      setUsernameAvailable(true);
      return;
    }

    try {
      setCheckingUsername(true);

      const response = await fetch(
        `${API_URL}/api/profile/username?username=${encodeURIComponent(
          cleanUsername,
        )}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to check username.");
      }

      setUsernameAvailable(Boolean(data.available));

      setUsernameMessage(data.message || "");
    } catch (error) {
      console.error("Username availability error:", error);

      setUsernameAvailable(null);
      setUsernameMessage("Unable to check username right now.");
    } finally {
      setCheckingUsername(false);
    }
  };

  /* ==================================================
     STATUS
  ================================================== */

  const handleStatusChange = async (nextStatus) => {
    if (status === nextStatus || saving) {
      return;
    }

    const previousStatus = status;

    try {
      setStatus(nextStatus);
      setSaving(true);

      const response = await fetch(`${API_URL}/api/profile/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isOnline: nextStatus === "online",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update status.");
      }

      if (data?.data) {
        setUser(data.data);

        setStatus(data.data.isOnline ? "online" : "offline");
      }

      toast.success(data?.message || "Status updated successfully.");
    } catch (error) {
      console.error("Status update error:", error);

      setStatus(previousStatus);

      toast.error(error.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     PROFILE IMAGE
  ================================================== */

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG, and WebP images are allowed.");

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image cannot exceed 5MB.");

      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/profile/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to upload profile image.");
      }

      if (data?.data) {
        setUser(data.data);

        setStatus(data.data.isOnline ? "online" : "offline");
      }

      toast.success(data?.message || "Profile image uploaded successfully.");
    } catch (error) {
      console.error("Profile image upload error:", error);

      toast.error(error.message || "Failed to upload profile image.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  /* ==================================================
     DELETE PROFILE IMAGE
  ================================================== */

  const handleDeleteImage = async () => {
    if (!user?.image || uploadingImage) {
      return;
    }

    try {
      setUploadingImage(true);

      const response = await fetch(`${API_URL}/api/profile/image`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to remove profile image.");
      }

      if (data?.data) {
        setUser(data.data);

        setStatus(data.data.isOnline ? "online" : "offline");
      }

      toast.success(data?.message || "Profile image removed successfully.");
    } catch (error) {
      console.error("Profile image delete error:", error);

      toast.error(error.message || "Failed to remove profile image.");
    } finally {
      setUploadingImage(false);
    }
  };

  /* ==================================================
     LOADING
  ================================================== */

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  /* ==================================================
     PROFILE UNAVAILABLE
  ================================================== */

  if (!user) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Profile unavailable</h2>

          <p className="mt-1 text-sm text-base-content/60">
            Please sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  /* ==================================================
     DISPLAY DATA
  ================================================== */

  const fullName = user.name || "User";

  const username = user.username ? `@${user.username}` : "Username not set";

  const email = user.email || "Email not available";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const accountCreated = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className=" w-full px-3 py-4 sm:px-1 md:px-1 md:py-1">
      {/* ==================================================
          PROFILE HEADER
      ================================================== */}

      <div className="space-y-2">
        <ProfileSection title="Profile">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            {/* PROFILE PHOTO */}

            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white shadow-md sm:h-28 sm:w-28">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}

                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <span className="loading loading-spinner loading-sm text-white" />
                  </div>
                )}
              </div>

              {/* CHANGE PHOTO */}

              <button
                type="button"
                onClick={handleImageButtonClick}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-base-100 bg-primary text-primary-content shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Change profile photo"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* USER INFO */}

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold">{fullName}</h2>

              <p className="mt-1 text-sm text-base-content/60">{username}</p>

              {/* STATUS */}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    className="radio radio-success radio-sm"
                    checked={status === "online"}
                    disabled={saving}
                    onChange={() => handleStatusChange("online")}
                  />

                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Online
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    className="radio radio-sm"
                    checked={status === "offline"}
                    disabled={saving}
                    onChange={() => handleStatusChange("offline")}
                  />

                  <span>Offline</span>
                </label>
              </div>

              {/* REMOVE PHOTO */}

              {user.image && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  disabled={uploadingImage}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-error transition hover:opacity-80 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </ProfileSection>

        {/* ==================================================
            PERSONAL INFORMATION
        ================================================== */}

        <ProfileSection title="Personal Information">
          <div className="space-y-6">
            <ProfileField
              label="Full Name"
              value={fullName}
              editable
              editing={editingField === "name"}
              inputValue={value}
              onEdit={() => startEditing("name", user.name)}
              onChange={setValue}
              onSave={() => handleSave("name")}
              onCancel={cancelEditing}
              saving={saving}
            />

            <ProfileField
              label="Username"
              value={username}
              placeholder="Username not set"
              editable
              editing={editingField === "username"}
              inputValue={value}
              onEdit={() => startEditing("username", user.username)}
              onChange={handleUsernameChange}
              onSave={() => handleSave("username")}
              onCancel={cancelEditing}
              saving={saving}
              checking={checkingUsername}
              validationMessage={usernameMessage}
              validationState={usernameAvailable}
            />
          </div>
        </ProfileSection>

        {/* ==================================================
            CONTACT INFORMATION
        ================================================== */}

        <ProfileSection title="Contact Information">
          <div className="space-y-6">
            <ProfileField
              icon={<Mail size={18} />}
              label="Email"
              value={email}
            />

            <ProfileField
              icon={<Phone size={18} />}
              label="Phone Number"
              value={user.phoneNumber || ""}
              placeholder="+ Add Phone Number"
              editable
              editing={editingField === "phoneNumber"}
              inputValue={value}
              onEdit={() => startEditing("phoneNumber", user.phoneNumber)}
              onChange={setValue}
              onSave={() => handleSave("phoneNumber")}
              onCancel={cancelEditing}
              saving={saving}
            />
          </div>
        </ProfileSection>

        {/* ==================================================
            ABOUT
        ================================================== */}

        <ProfileSection title="About">
          <div className="space-y-6">
            <ProfileField
              label="Bio / About Me"
              value={user.bio || ""}
              placeholder="Add a short bio"
              editable
              editing={editingField === "bio"}
              inputValue={value}
              onEdit={() => startEditing("bio", user.bio)}
              onChange={setValue}
              onSave={() => handleSave("bio")}
              onCancel={cancelEditing}
              saving={saving}
              textarea
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-base-content/50">
                Account Created
              </p>

              <p className="mt-1 text-sm font-medium">{accountCreated}</p>
            </div>
          </div>
        </ProfileSection>

        {/* ==================================================
            ACTIVITY
        ================================================== */}

        <ProfileSection title="Activity">
          <div className="grid grid-cols-2 gap-3">
            {/* CONTACTS */}

            <div className="rounded-xl border border-base-300 bg-base-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users size={19} />
                </div>

                <div>
                  <p className="text-xs text-base-content/50">Contacts</p>

                  <p className="mt-0.5 text-lg font-bold">0</p>
                </div>
              </div>
            </div>

            {/* GROUPS */}

            <div className="rounded-xl border border-base-300 bg-base-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UsersRound size={19} />
                </div>

                <div>
                  <p className="text-xs text-base-content/50">Groups</p>

                  <p className="mt-0.5 text-lg font-bold">0</p>
                </div>
              </div>
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}
