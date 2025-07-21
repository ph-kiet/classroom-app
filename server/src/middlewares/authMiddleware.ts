import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  phoneNumber: string;
  name: string;
  role: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract JWT from the cookie
  const token = req.cookies.jwt;

  // Check if token exists
  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.phoneNumber = decoded.phoneNumber;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

declare module "express-serve-static-core" {
  interface Request {
    role: string;
    phoneNumber: string;
  }
}
