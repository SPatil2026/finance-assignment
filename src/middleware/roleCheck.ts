import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";

export const roleCheck = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.jwtData?.role;
    // ADMIN passes every role check
    if (userRole === Role.ADMIN || userRole === role) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  };
};

