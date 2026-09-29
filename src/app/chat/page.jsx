"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <main className="h-screen overflow-hidden bg-base-200">
      {/* Main Navbar */}
      <Navbar />

      {/* Chat Application */}
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left - Conversations */}
        <ChatSidebar
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />

        {/* Right - Conversation */}
        <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} />
      </div>
    </main>
  );
}
