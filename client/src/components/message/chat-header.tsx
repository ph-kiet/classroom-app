import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useChatStore from "@/stores/chat-store";

interface ChatHeaderProps {
  recipientId: string;
}

export default function ChatHeader({ recipientId }: ChatHeaderProps) {
  const { chats } = useChatStore();
  const recipient = chats.find((chat) => chat.recipientId === recipientId);

  return (
    <div className="flex justify-between gap-4 lg:px-4">
      <div className="flex gap-4">
        <Button
          size="sm"
          variant="outline"
          className="flex size-10 p-0 lg:hidden"
        >
          <ArrowLeft />
        </Button>
        <Avatar className="size-10 overflow-visible lg:size-12">
          <AvatarImage src={""} alt="avatar image" />
          <AvatarFallback>TT</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">
            {recipient?.recipientName || "Unknown"}
          </span>
          <span className="text-sm">{recipient?.recipientId}</span>
        </div>
      </div>
    </div>
  );
}
