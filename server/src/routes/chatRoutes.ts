import express from "express";

import { verifyToken } from "../middlewares/authMiddleware";
import { getAllUsers } from "../controllers/chatController";
const chatRoutes = express.Router();

chatRoutes.get("/users", verifyToken, getAllUsers);

export default chatRoutes;
