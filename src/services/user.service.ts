import prisma from "../lib/prisma";
import { Role, UserStatus } from "@prisma/client";

export const getAllUsers = async (filters: {
  role?: Role;
  status?: UserStatus;
}) => {
  return prisma.user.findMany({
    where: {
      ...(filters.role && { role: filters.role }),
      ...(filters.status && { status: filters.status }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserRole = async (id: string, role: Role) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  return prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

export const updateUserStatus = async (id: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  return prisma.user.update({
    where: { id },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};
