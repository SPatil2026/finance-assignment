import { Router } from "express";
import { Role } from "@prisma/client";
import authRouter from "./auth/auth.routes";
import userRouter from "./users/user.routes";
import recordRouter from "./records/record.routes";
import dashboardRouter from "./dashboard/dashboard.routes";
import { verifyToken } from "../utils/token-manager";
import { roleCheck } from "../middleware/roleCheck";

const appRouter = Router();

// Public routes — no token needed
const publicRoutes = ["/api/auth/login", "/api/auth/register"];

// Global auth guard — skips public routes
appRouter.use((req, res, next) => {
    if (publicRoutes.includes(req.path)) {
        return next();
    }
    return verifyToken(req, res, next);
});

appRouter.use("/api/auth", authRouter);

// ADMIN only
appRouter.use("/api/users", roleCheck(Role.ADMIN), userRouter);

// ANALYST and ADMIN (mutations further restricted inside router)
appRouter.use("/api/records", roleCheck(Role.ANALYST), recordRouter);

// All authenticated users (VIEWER / ANALYST / ADMIN)
appRouter.use("/api/dashboard", dashboardRouter);

export default appRouter;