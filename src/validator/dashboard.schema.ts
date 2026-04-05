import { z } from "zod";

const optionalDate = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
  .optional();

export const dashboardQuerySchema = z.object({
  query: z.object({
    from: optionalDate,
    to: optionalDate,
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
  }),
});

export const trendsQuerySchema = z.object({
  query: z.object({
    year: z
      .string()
      .regex(/^\d{4}$/, "Year must be a 4-digit number")
      .optional(),
  }),
});

export const recentQuerySchema = z.object({
  query: z.object({
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a positive integer")
      .optional(),
  }),
});
