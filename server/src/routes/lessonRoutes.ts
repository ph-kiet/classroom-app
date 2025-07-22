import express from "express";

import { verifyToken } from "../middlewares/authMiddleware";
import {
  createLesson,
  getAllLessons,
  makeCompleted,
} from "../controllers/lessonController";
import authoriseRoles from "../middlewares/roleMiddleware";

const lessonRoutes = express.Router();

lessonRoutes.get("/", verifyToken, getAllLessons);
lessonRoutes.post("/", verifyToken, authoriseRoles("instructor"), createLesson);
lessonRoutes.put(
  "/makeCompleted/:lessonId",
  verifyToken,
  authoriseRoles("student"),
  makeCompleted
);

export default lessonRoutes;
