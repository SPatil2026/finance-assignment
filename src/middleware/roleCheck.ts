import { NextFunction, Request, Response } from "express";

export const roleCheck = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.jwtData.role !== role) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
