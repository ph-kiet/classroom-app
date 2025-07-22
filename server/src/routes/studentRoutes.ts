import express from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
} from "../controllers/studentController";
import { verifyToken } from "../middlewares/authMiddleware";
import authoriseRoles from "../middlewares/roleMiddleware";

const studentRoutes = express.Router();

studentRoutes.get(
  "/",
  verifyToken,
  authoriseRoles("instructor"),
  getAllStudents
);
studentRoutes.post(
  "/",
  verifyToken,
  authoriseRoles("instructor"),
  createStudent
);
studentRoutes.put(
  "/:studentPhoneNumber",
  verifyToken,
  authoriseRoles("instructor"),
  updateStudent
);
studentRoutes.delete(
  "/:studentPhoneNumber",
  verifyToken,
  authoriseRoles("instructor"),
  deleteStudent
);

export default studentRoutes;
