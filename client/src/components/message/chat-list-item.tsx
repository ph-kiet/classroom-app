import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useChatStore from "@/stores/chat-store";

interface IProps {
  recipientId: string;
  recipientName: string;
  lastMessage?: string;
}

export default function ChatListItem({
  recipientId,
  recipientName,
  lastMessage,
}: IProps) {
  const { selectChat } = useChatStore();
  return (
    <div
      className="hover:bg-muted relative flex min-w-0 cursor-pointer items-center gap-4 px-6 py-4"
      onClick={() => selectChat(recipientId)}
    >
      <Avatar className="overflow-visible md:size-12">
        <AvatarImage
          src={"https://ui.shadcn.com/avatars/02.png"}
          alt="avatar image"
        />
        <AvatarFallback>TT</AvatarFallback>
      </Avatar>
      <div className="min-w-0 grow">
        <div className="flex items-center justify-between">
          <span className="truncate font-medium">{recipientName}</span>
          <span className="text-muted-foreground flex-none text-xs">
            {/* 10 min */}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* <Check /> */}
          <span className="text-muted-foreground truncate text-start text-sm">
            {lastMessage || "No messages yet"}
          </span>
        </div>
      </div>
    </div>
  );
}
