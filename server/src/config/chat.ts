import { Server, Socket } from "socket.io";
import { getUserNameByPhoneNumber } from "../controllers/chatController";

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

interface SendMessagePayload {
  recipientId: string;
  message: string;
}

export function setupChat(io: Server): void {
  const connectedUsers = new Map<string, string>();

  io.on("connection", (socket: Socket) => {
    const userId: string | undefined = socket.handshake.auth.userId;
    if (!userId) {
      socket.disconnect();
      return;
    }

    connectedUsers.set(userId, socket.id);
    // console.log(`User ${userId} connected with socket ID ${socket.id}`);

    socket.on(
      "sendMessage",
      async ({ recipientId, message }: SendMessagePayload) => {
        const recipientSocketId = connectedUsers.get(recipientId);
        const timestamp = new Date().toISOString();
        const messageData: Message = { senderId: userId, message, timestamp };

        if (recipientSocketId) {
          const senderName = await getUserNameByPhoneNumber(userId);
          // Notify recipient of new chat (for first message)
          io.to(recipientSocketId).emit("newChat", {
            senderId: userId,
            senderName: senderName,
          });
          // Send message to recipient and sender
          io.to(recipientSocketId).emit("receiveMessage", messageData);
          socket.emit("receiveMessage", messageData);
        } else {
          socket.emit("error", { message: "Recipient not found" });
        }
      }
    );

    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
      //   console.log(`User ${userId} disconnected`);
    });
  });
}
