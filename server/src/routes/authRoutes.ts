import express from "express";
import {
  createAccessCode,
  validateAccessCode,
  getAuthUser,
  logout,
  setupAccount,
  studentSignIn,
  updateProfile,
  signUp,
} from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";
const authRoutes = express.Router();

authRoutes.post("/createAccessCode", createAccessCode);
authRoutes.post("/validateAccessCode", validateAccessCode);
authRoutes.get("/user", verifyToken, getAuthUser);
authRoutes.post("/logout", verifyToken, logout);
authRoutes.post("/setupAccount", setupAccount);
authRoutes.post("/sign-in", studentSignIn);
authRoutes.put("/profile", verifyToken, updateProfile);
authRoutes.post("/sign-up", signUp);

export default authRoutes;
