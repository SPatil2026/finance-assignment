import { Request, Response } from "express";
import { createToken } from "../utils/token-manager";
import { COOKIE_NAME } from "../constants/constants";
import { registerUser, loginUser, getMe } from "../service/auth.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  signed: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await registerUser(name, email, password, role);
    const token = createToken(user.id, user.role, user.email);

    res
      .cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (err: any) {
    const status = err.message === "Email already in use" ? 409 : 500;
    res.status(status).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    const token = createToken(user.id, user.role, user.email);

    res
      .cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
      .status(200)
      .json({ message: "Login successful", user });
  } catch (err: any) {
    const status =
      err.message === "Invalid email or password" ? 401 :
        err.message.includes("inactive") ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};

export const logout = (_req: Request, res: Response) => {
  res
    .clearCookie(COOKIE_NAME)
    .status(200)
    .json({ message: "Logged out successfully" });
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.jwtData.user_id as string;
    const user = await getMe(userId);
    res.status(200).json({ user });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
