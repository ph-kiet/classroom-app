import express from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
} from "../controllers/studentController";
import { verifyToken } from "../middlewares/authMiddleware";

const studentRoutes = express.Router();

studentRoutes.get("/", verifyToken, getAllStudents);
studentRoutes.post("/", verifyToken, createStudent);
studentRoutes.put("/:studentPhoneNumber", verifyToken, updateStudent);
studentRoutes.delete("/:studentPhoneNumber", verifyToken, deleteStudent);

export default studentRoutes;
