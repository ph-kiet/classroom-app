import express from "express";

import { verifyToken } from "../middlewares/authMiddleware";
import {
  createLesson,
  getAllLessons,
  makeCompleted,
} from "../controllers/lessionController";

const lessonRoutes = express.Router();

lessonRoutes.get("/", verifyToken, getAllLessons);
lessonRoutes.post("/", verifyToken, createLesson);
lessonRoutes.put("/makeCompleted/:lessonId", verifyToken, makeCompleted);

export default lessonRoutes;
