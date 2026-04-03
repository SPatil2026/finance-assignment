import { Prisma, RecordType } from "@prisma/client";
import prisma from "../lib/prisma";

interface CreateRecordInput {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  createdById: string;
}

interface UpdateRecordInput {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: string;
  notes?: string;
}

interface ListRecordsFilters {
  type?: RecordType;
  category?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const createRecord = async (input: CreateRecordInput) => {
  return prisma.financialRecord.create({
    data: {
      amount: new Prisma.Decimal(input.amount),
      type: input.type,
      category: input.category,
      date: new Date(input.date),
      notes: input.notes,
      createdById: input.createdById,
    },
  });
};

export const listRecords = async (filters: ListRecordsFilters) => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Prisma.FinancialRecordWhereInput = {
    isDeleted: false,
    ...(filters.type && { type: filters.type }),
    ...(filters.category && {
      category: { contains: filters.category, mode: "insensitive" },
    }),
    ...((filters.from || filters.to) && {
      date: {
        ...(filters.from && { gte: new Date(filters.from) }),
        ...(filters.to && { lte: new Date(filters.to) }),
      },
    }),
  };

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return {
    records,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRecordById = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });
  if (!record) throw new Error("Record not found");
  return record;
};

export const updateRecord = async (id: string, input: UpdateRecordInput) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });
  if (!record) throw new Error("Record not found");

  return prisma.financialRecord.update({
    where: { id },
    data: {
      ...(input.amount !== undefined && {
        amount: new Prisma.Decimal(input.amount),
      }),
      ...(input.type && { type: input.type }),
      ...(input.category && { category: input.category }),
      ...(input.date && { date: new Date(input.date) }),
      ...(input.notes !== undefined && { notes: input.notes }),
    },
  });
};

export const softDeleteRecord = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });
  if (!record) throw new Error("Record not found");

  return prisma.financialRecord.update({
    where: { id },
    data: { isDeleted: true },
  });
};
