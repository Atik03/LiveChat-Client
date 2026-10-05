"use client";

import ChatLayout from "@/components/layout/ChatLayout";
import SettingsView from "@/components/settings/SettingsView";

export default function SettingsPage() {
  return (
    <ChatLayout>
      <div className="h-full overflow-y-auto">
        <SettingsView />
      </div>
    </ChatLayout>
  );
}
