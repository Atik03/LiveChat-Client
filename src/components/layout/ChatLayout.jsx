"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatLayout({ children }) {
  const [selectedChat, setSelectedChat] = useState(null);

  const isChatOpen = Boolean(selectedChat);

  return (
    <main className="h-screen overflow-hidden bg-base-200">
      {/* Navbar */}
      <div className={isChatOpen ? "hidden lg:block" : "block"}>
        <Navbar />
      </div>

      {/* Application Area */}
      <div
        className={
          isChatOpen
            ? "h-screen lg:h-[calc(100vh-4rem)]"
            : "h-[calc(100vh-4rem)]"
        }
      >
        <div className="flex h-full min-h-0 overflow-hidden">
          {/* Sidebar */}
          <ChatSidebar
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
          />

          {/* Main Content */}
          <section className="h-full min-h-0 min-w-0 flex-1 overflow-hidden">
            {children || (
              <ChatWindow
                chat={selectedChat}
                onBack={() => setSelectedChat(null)}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
