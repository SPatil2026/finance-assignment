import { Request, Response } from "express";
import { Role, UserStatus } from "@prisma/client";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} from "../services/user.service";

// GET /api/users?role=ADMIN&status=ACTIVE
export const listUsers = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as Role | undefined;
    const status = req.query.status as UserStatus | undefined;
    const users = await getAllUsers({ role, status });
    res.status(200).json({ users });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id
export const getUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json({ user });
  } catch (err: any) {
    const status = err.message === "User not found" ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

// PATCH /api/users/:id/role
export const changeRole = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { role } = req.body;
    const requesterId = res.locals.jwtData.user_id as string;

    if (req.params.id === requesterId) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await updateUserRole(req.params.id, role);
    res.status(200).json({ message: "Role updated successfully", user });
  } catch (err: any) {
    const status = err.message === "User not found" ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

// PATCH /api/users/:id/status
export const changeStatus = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { status } = req.body;
    const requesterId = res.locals.jwtData.user_id as string;

    if (req.params.id === requesterId) {
      return res.status(400).json({ message: "You cannot change your own status" });
    }

    const user = await updateUserStatus(req.params.id, status);
    res.status(200).json({ message: "Status updated successfully", user });
  } catch (err: any) {
    const status = err.message === "User not found" ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};
