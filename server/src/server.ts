import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import studentRoutes from "./routes/studentRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { setupChat } from "./config/chat";
import chatRoutes from "./routes/chatRoutes";

// Load environment variables
dotenv.config();

const app: Application = express();
const server = createServer(app);
const port: number = parseInt(process.env.PORT || "3005", 10);

const apiRouter = express.Router();

// Config json middleware
app.use(express.json());

// For parsing Cookie header
app.use(cookieParser());

// Config cors
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

//Api routes
apiRouter.use("/auth", authRoutes);
apiRouter.use("/students", studentRoutes);
apiRouter.use("/lessons", lessonRoutes);
apiRouter.use("/chats", chatRoutes);
app.use("/api", apiRouter);

// Socket.io config
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
setupChat(io);

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
