import useChatStore from "@/stores/chat-store";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import ChatListItem from "./chat-list-item";
import { NewChatDialog } from "./new-chat-dialog";

export default function ChatSidebar() {
  const { chats } = useChatStore();
  return (
    <Card className="w-full pb-0 lg:w-96 shadow-none">
      <CardHeader>
        <CardTitle className="font-display text-xl lg:text-2xl">
          Chats
        </CardTitle>
        <CardAction>
          <NewChatDialog />
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0">
        <div className="block min-w-0 divide-y">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.recipientId}
              recipientId={chat.recipientId}
              recipientName={chat.recipientName}
              lastMessage={chat.lastMessage}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
