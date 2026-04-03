import { z } from "zod";

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    role: z.enum(["VIEWER", "ANALYST", "ADMIN"], {
      message: "Role must be VIEWER, ANALYST, or ADMIN",
    }),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    status: z.enum(["ACTIVE", "INACTIVE"], {
      message: "Status must be ACTIVE or INACTIVE",
    }),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID"),
  }),
});
