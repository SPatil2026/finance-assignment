import { Router } from "express";
import { listUsers, getUser, changeRole, changeStatus } from "../../controller/user.controller";
import { validate } from "../../middleware/validate";
import { getUserSchema, updateRoleSchema, updateStatusSchema } from "../../validator/user.schema";

const userRouter = Router();

// GET /api/users?role=ADMIN&status=ACTIVE
userRouter.get("/", listUsers);

// GET /api/users/:id
userRouter.get("/:id", validate(getUserSchema), getUser);

// PATCH /api/users/:id/role
userRouter.patch("/:id/role", validate(updateRoleSchema), changeRole);

// PATCH /api/users/:id/status
userRouter.patch("/:id/status", validate(updateStatusSchema), changeStatus);

export default userRouter;
