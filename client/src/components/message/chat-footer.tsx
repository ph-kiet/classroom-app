import { useState } from "react";
import { Socket } from "socket.io-client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendIcon } from "lucide-react";

interface ChatFooterProps {
  socket: typeof Socket | null;
  userId: string;
  recipientId: string;
}

export default function ChatFooter({ socket, recipientId }: ChatFooterProps) {
  const [input, setInput] = useState<string>("");

  const sendMessage = () => {
    if (input.trim() && socket) {
      socket.emit("sendMessage", { recipientId, message: input });
      setInput("");
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="lg:px-4">
      <div className="bg-white relative flex items-center rounded-md border">
        <Input
          type="text"
          className="h-14 border-transparent pe-32 text-base! shadow-transparent! ring-transparent! lg:pe-56"
          placeholder="Enter message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={handleKeyUp}
        />
        <div className="absolute end-4 flex items-center">
          <Button variant="outline" onClick={sendMessage}>
            <span className="hidden lg:inline">Send</span>{" "}
            <SendIcon className="inline lg:hidden" />
          </Button>
        </div>
      </div>
    </div>
  );
}
