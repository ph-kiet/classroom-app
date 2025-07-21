import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatHeader from "./chat-header";
import ChatFooter from "./chat-footer";
import useChatStore from "@/stores/chat-store";
import ChatBubble from "./chat-bubble";

export interface IMessage {
  senderId: string;
  message: string;
  timestamp: string;
  isSent: boolean;
}

interface ChatContentProps {
  userId: string;
}

export default function ChatContent({ userId }: ChatContentProps) {
  const { selectedChat, messages, addChat, addMessage, updateLastMessage } =
    useChatStore();
  const [socket, setSocket] = useState<typeof Socket | null>(null);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_IO_URL || "http://localhost:3005";
    const newSocket = io(socketUrl, {
      auth: { userId },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    newSocket.on("connect_error", () => {
      console.error("Socket.IO connection error");
    });

    newSocket.on(
      "receiveMessage",
      ({ senderId, message, timestamp }: IMessage) => {
        const recipientId = senderId === userId ? selectedChat : senderId;
        if (recipientId) {
          addMessage(recipientId, {
            senderId,
            message,
            timestamp,
            isSent: senderId === userId,
          });
          updateLastMessage(recipientId, message);
        }
      }
    );

    newSocket.on(
      "newChat",
      ({ senderId, senderName }: { senderId: string; senderName: string }) => {
        addChat(senderId, senderName);
      }
    );

    newSocket.on("error", ({ message }: { message: string }) => {
      console.error("Socket error:", message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, addChat, addMessage, updateLastMessage, selectedChat]);

  if (!selectedChat) {
    return (
      <div className="bg-background fixed inset-0 z-50 flex h-full flex-col p-4 lg:relative lg:z-10 lg:bg-transparent lg:p-0">
        <div className="flex-1 flex items-center justify-center">
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background fixed inset-0 z-50 flex h-full flex-col p-4 lg:relative lg:z-10 lg:bg-transparent lg:p-0">
      <ChatHeader recipientId={selectedChat} />
      <div className="flex-1 overflow-y-auto lg:px-4">
        <div>
          <div className="flex flex-col items-start space-y-10 py-8">
            {(messages[selectedChat] || []).map((msg, index) => (
              <ChatBubble key={index} msg={msg} />
            ))}
          </div>
        </div>
      </div>
      <ChatFooter socket={socket} userId={userId} recipientId={selectedChat} />
    </div>
  );
}
