"use client";

import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  MessageCircle,
  Smile,
  Paperclip,
  Mic,
  Send,
} from "lucide-react";

export default function ChatWindow({ chat, onBack }) {
  /* ==========================================
     NO CONVERSATION SELECTED
  ========================================== */

  if (!chat) {
    return (
      <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-base-200">
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto">
          <div className="flex max-w-md flex-col items-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <MessageCircle size={30} className="text-primary" />
            </div>

            <h2 className="text-xl font-bold">Welcome to LiveChat</h2>

            <p className="mt-2 text-sm leading-6 text-base-content/50">
              Select a conversation from the left or search for a user to start
              chatting.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ==========================================
     CHAT VIEW
  ========================================== */

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-base-100">
      {/* Chat Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-base-300 px-4">
        {/* User Information */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Back */}
          <button
            type="button"
            onClick={onBack}
            className="btn btn-ghost btn-square btn-sm md:hidden"
            aria-label="Back to chats"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content">
            {chat.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* User */}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{chat.name}</h2>

            <p className="text-xs text-success">Online</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm rounded-xl"
            aria-label="Audio call"
          >
            <Phone size={19} />
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm rounded-xl"
            aria-label="Video call"
          >
            <Video size={19} />
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm rounded-xl"
            aria-label="Chat options"
          >
            <MoreVertical size={19} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-base-200/40 px-4">
        <div className="flex min-h-full items-center justify-center py-6">
          <div className="text-center">
            <p className="text-sm text-base-content/40">No messages yet.</p>

            <p className="mt-1 text-xs text-base-content/30">
              Send a message to start the conversation.
            </p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="shrink-0 border-t border-base-300 bg-base-100 p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm rounded-xl"
            aria-label="Emoji"
          >
            <Smile size={20} />
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm rounded-xl"
            aria-label="Attach file"
          >
            <Paperclip size={19} />
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered min-w-0 flex-1 rounded-xl bg-base-200"
          />

          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm rounded-xl"
            aria-label="Voice message"
          >
            <Mic size={19} />
          </button>

          <button
            type="button"
            className="btn btn-primary btn-square btn-sm rounded-xl"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
