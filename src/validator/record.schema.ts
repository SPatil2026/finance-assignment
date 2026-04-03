import { z } from "zod";

export const createRecordSchema = z.object({
  body: z.object({
    amount: z
      .number({ message: "Amount must be a number" })
      .positive("Amount must be greater than 0"),
    type: z.enum(["INCOME", "EXPENSE"], {
      message: "Type must be INCOME or EXPENSE",
    }),
    category: z.string().min(1, "Category is required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    notes: z.string().optional(),
  }),
});

export const updateRecordSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid record ID"),
  }),
  body: z.object({
    amount: z
      .number({ message: "Amount must be a number" })
      .positive("Amount must be greater than 0")
      .optional(),
    type: z
      .enum(["INCOME", "EXPENSE"], { message: "Type must be INCOME or EXPENSE" })
      .optional(),
    category: z.string().min(1, "Category is required").optional(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
      .optional(),
    notes: z.string().optional(),
  }),
});

export const getRecordSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid record ID"),
  }),
});

export const listRecordsSchema = z.object({
  query: z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().optional(),
    from: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid 'from' date" })
      .optional(),
    to: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid 'to' date" })
      .optional(),
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a positive integer")
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a positive integer")
      .optional(),
  }),
});
