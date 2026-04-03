import { Router } from "express";
import { create, list, getOne, update, remove } from "../../controller/record.controller";
import { validate } from "../../middleware/validate";
import { roleCheck } from "../../middleware/roleCheck";
import {
  createRecordSchema,
  updateRecordSchema,
  getRecordSchema,
  listRecordsSchema,
} from "../../validator/record.schema";
import { Role } from "@prisma/client";

const recordRouter = Router();

// GET /api/records  — ANALYST and ADMIN
recordRouter.get("/", validate(listRecordsSchema), list);

// GET /api/records/:id  — ANALYST and ADMIN
recordRouter.get("/:id", validate(getRecordSchema), getOne);

// POST /api/records  — ADMIN only
recordRouter.post("/", roleCheck(Role.ADMIN), validate(createRecordSchema), create);

// PUT /api/records/:id  — ADMIN only
recordRouter.put("/:id", roleCheck(Role.ADMIN), validate(updateRecordSchema), update);

// DELETE /api/records/:id  — ADMIN only
recordRouter.delete("/:id", roleCheck(Role.ADMIN), validate(getRecordSchema), remove);

export default recordRouter;
