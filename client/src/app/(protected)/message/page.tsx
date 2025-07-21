"use client";
import ChatContent from "@/components/message/chat-content";
import ChatSidebar from "@/components/message/chat-sidebar";
import useAuthStore from "@/stores/auth-store";

export default function Page() {
  const { user } = useAuthStore();
  return (
    <div className="flex h-[calc(100vh-5.8rem)] w-full">
      <ChatSidebar />
      <div className="grow">
        <ChatContent userId={user?.phoneNumber || ""} />
      </div>
    </div>
  );
}
