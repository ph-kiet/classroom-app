import { NextFunction, Request, Response } from "express";

const authoriseRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.role)) {
      res.status(403).json({ message: "Access denied!" });
      return;
    }
    next();
  };
};

export default authoriseRoles;
