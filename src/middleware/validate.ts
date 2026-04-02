import { ZodObject, ZodError, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * Validates request body, query, and params against the provided Zod schema.
 * Schema should have optional `body`, `query`, and `params` keys.
 */
export const validate =
  (schema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.issues[0].message });
      }
      return res
        .status(500)
        .json({ message: "Error making request, contact support" });
    }
  };
