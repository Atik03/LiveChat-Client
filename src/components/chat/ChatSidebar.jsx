"use client";

import { MessageCircle } from "lucide-react";

export default function ChatSidebar({ selectedChat, onSelectChat }) {
  return (
    <aside
      className={`
        w-full
        shrink-0
        border-r
        border-base-300
        bg-base-100
        md:w-[320px]
        lg:w-[350px]
        xl:w-[380px]
        ${selectedChat ? "hidden md:block" : "block"}
      `}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-base-300 px-5">
        <div>
          <h1 className="text-lg font-bold">Chats</h1>
          <p className="text-xs text-base-content/50">Your conversations</p>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex h-[calc(100%-4rem)] flex-col">
        {/* Empty State */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <MessageCircle size={26} className="text-primary" />
          </div>

          <h2 className="font-semibold">No conversations yet</h2>

          <p className="mt-1 max-w-xs text-sm text-base-content/50">
            Search for people and start a new conversation.
          </p>
        </div>
      </div>
    </aside>
  );
}
