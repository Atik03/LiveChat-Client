"use client";

import {
  Bell,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  Lock,
  Monitor,
  Moon,
  Palette,
  Phone,
  Shield,
  Sun,
  Volume2,
} from "lucide-react";

const settingsSections = [
  {
    title: "Appearance",
    items: [
      {
        label: "Theme",
        description: "Choose your preferred appearance",
        icon: Palette,
        value: "Light / Dark",
      },
    ],
  },
  {
    title: "Notifications",
    items: [
      {
        label: "Message Notifications",
        description: "Get notified when you receive new messages",
        icon: Bell,
      },
      {
        label: "Call Notifications",
        description: "Get notified about incoming calls",
        icon: Phone,
      },
      {
        label: "Notification Sound",
        description: "Play a sound for new notifications",
        icon: Volume2,
      },
    ],
  },
  {
    title: "Privacy",
    items: [
      {
        label: "Online Status",
        description: "Control who can see when you're online",
        icon: Monitor,
      },
      {
        label: "Last Seen",
        description: "Control who can see your last active time",
        icon: Clock3,
      },
      {
        label: "Read Receipts",
        description: "Show when you've read a message",
        icon: Shield,
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        label: "Change Password",
        description: "Update your account password",
        icon: Lock,
      },
      {
        label: "Active Sessions",
        description: "Manage devices where you're signed in",
        icon: Monitor,
      },
    ],
  },
  {
    title: "Calls",
    items: [
      {
        label: "Who Can Call Me",
        description: "Choose who can make calls to you",
        icon: Phone,
      },
    ],
  },
  {
    title: "Blocked Users",
    items: [
      {
        label: "Manage Blocked Users",
        description: "View and manage users you've blocked",
        icon: Shield,
      },
    ],
  },
  {
    title: "About",
    items: [
      {
        label: "Version",
        description: "LiveChat application version",
        icon: FileText,
        value: "1.0.0",
      },
      {
        label: "Terms & Privacy",
        description: "Review our terms and privacy policy",
        icon: FileText,
      },
      {
        label: "Help & Support",
        description: "Get help with LiveChat",
        icon: CircleHelp,
      },
    ],
  },
];

export default function SettingsView() {
  return (
    <div className="mx-auto w-full  px-3 py-4 sm:px-1 md:px-1 md:py-1">
      {/* Settings Sections */}
      <div className="space-y-2">
        {settingsSections.map((section) => (
          <section
            key={section.title}
            className="overflow-hidden rounded-2xl border border-base-300 bg-base-100"
          >
            {/* Section Header */}
            <div className="border-b border-base-300 px-4 py-3 sm:px-5">
              <h2 className="text-sm font-semibold">{section.title}</h2>
            </div>

            {/* Items */}
            <div>
              {section.items.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === section.items.length - 1;

                return (
                  <button
                    key={item.label}
                    type="button"
                    disabled
                    className={`flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5 ${
                      !isLast ? "border-b border-base-300" : ""
                    } cursor-default opacity-80`}
                  >
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={19} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.label}</p>

                      <p className="mt-0.5 text-xs leading-5 text-base-content/50">
                        {item.description}
                      </p>
                    </div>

                    {/* Right Side */}
                    {item.value ? (
                      <span className="hidden shrink-0 text-xs text-base-content/50 sm:block">
                        {item.value}
                      </span>
                    ) : (
                      <ChevronRight
                        size={18}
                        className="shrink-0 text-base-content/30"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
