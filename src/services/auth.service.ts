import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { Role } from "@prisma/client";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: Role
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already in use");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role ?? Role.VIEWER,
    },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status === "INACTIVE") {
    throw new Error("Account is inactive. Contact an administrator.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  if (!user) throw new Error("User not found");
  return user;
};
