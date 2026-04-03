import { Request, Response } from "express";
import { RecordType } from "@prisma/client";
import {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  softDeleteRecord,
} from "../services/record.service";

// POST /api/records
export const create = async (req: Request, res: Response) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    const createdById = res.locals.jwtData.user_id as string;

    const record = await createRecord({ amount, type, category, date, notes, createdById });
    res.status(201).json({ message: "Record created successfully", record });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/records
export const list = async (req: Request, res: Response) => {
  try {
    const { type, category, from, to, page, limit } = req.query;

    const result = await listRecords({
      type: type as RecordType | undefined,
      category: category as string | undefined,
      from: from as string | undefined,
      to: to as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/records/:id
export const getOne = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const record = await getRecordById(req.params.id);
    res.status(200).json({ record });
  } catch (err: any) {
    const status = err.message === "Record not found" ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

// PUT /api/records/:id
export const update = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const record = await updateRecord(req.params.id, req.body);
    res.status(200).json({ message: "Record updated successfully", record });
  } catch (err: any) {
    const status = err.message === "Record not found" ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

// DELETE /api/records/:id
export const remove = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await softDeleteRecord(req.params.id);
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err: any) {
    const status = err.message === "Record not found" ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};
