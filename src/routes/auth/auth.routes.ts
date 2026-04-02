import { Router } from "express";
import { register, login, logout, me } from "../../controller/auth.controller";
import { validate } from "../../middleware/validate";
import { registerSchema, loginSchema } from "../../validator/auth.schema";

const authRouter = Router();

// POST /api/auth/register
authRouter.post("/register", validate(registerSchema), register);

// POST /api/auth/login
authRouter.post("/login", validate(loginSchema), login);

// POST /api/auth/logout
authRouter.post("/logout", logout);

// GET /api/auth/me
authRouter.get("/me", me);

export default authRouter;
