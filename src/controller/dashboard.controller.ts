import { Request, Response } from "express";
import { RecordType } from "@prisma/client";
import {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentRecords,
} from "../services/dashboard.service";

// GET /api/dashboard/summary?from=&to=
export const summary = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const data = await getSummary({ from, to });
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/categories?from=&to=&type=INCOME
export const categories = async (req: Request, res: Response) => {
  try {
    const { from, to, type } = req.query as {
      from?: string;
      to?: string;
      type?: RecordType;
    };
    const data = await getCategoryTotals({ from, to, type });
    res.status(200).json({ categories: data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/trends?year=2024
export const trends = async (req: Request, res: Response) => {
  try {
    const yearStr = req.query.year as string | undefined;
    const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
    const data = await getMonthlyTrends(year);
    res.status(200).json({ year, trends: data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/recent?limit=10
export const recent = async (req: Request, res: Response) => {
  try {
    const limitStr = req.query.limit as string | undefined;
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    const data = await getRecentRecords(limit);
    res.status(200).json({ recent: data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
