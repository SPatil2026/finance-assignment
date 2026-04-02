import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_NAME } from "../constants/constants";

export const createToken = (
  user_id: string,
  role: string,
  email: string
): string => {
  const payload = { user_id, role, email };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.signedCookies[COOKIE_NAME] || req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "No Token Found" });
  }

  return new Promise<void>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err: any, success: any) => {
      if (err) {
        res.clearCookie(COOKIE_NAME);
        return res.status(401).json({ message: "Token Expired or Invalid" });
      }
      resolve();
      res.locals.jwtData = success;
      return next();
    });
  });
};
