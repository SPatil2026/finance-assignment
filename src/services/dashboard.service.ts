import { Prisma, RecordType } from "@prisma/client";
import prisma from "../lib/prisma";

interface DateRangeFilter {
  from?: string;
  to?: string;
}

const buildDateWhere = (filter: DateRangeFilter): Prisma.FinancialRecordWhereInput => ({
  isDeleted: false,
  ...((filter.from || filter.to) && {
    date: {
      ...(filter.from && { gte: new Date(filter.from) }),
      ...(filter.to && { lte: new Date(filter.to) }),
    },
  }),
});

// Summary
export const getSummary = async (filter: DateRangeFilter) => {
  const where = buildDateWhere(filter);

  const [incomeAgg, expenseAgg, count] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { ...where, type: RecordType.INCOME },
      _sum: { amount: true },
    }),
    prisma.financialRecord.aggregate({
      where: { ...where, type: RecordType.EXPENSE },
      _sum: { amount: true },
    }),
    prisma.financialRecord.count({ where }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpenses = Number(expenseAgg._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalRecords: count,
  };
};

// Category-wise totals
export const getCategoryTotals = async (filter: DateRangeFilter & { type?: RecordType }) => {
  const where: Prisma.FinancialRecordWhereInput = {
    ...buildDateWhere(filter),
    ...(filter.type && { type: filter.type }),
  };

  const groups = await prisma.financialRecord.groupBy({
    by: ["category", "type"],
    where,
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  return groups.map((g) => ({
    category: g.category,
    type: g.type,
    total: Number(g._sum.amount ?? 0),
  }));
};

// Monthly trends
export const getMonthlyTrends = async (year: number) => {
  // Use raw SQL for date_trunc grouping (not natively supported in Prisma groupBy)
  const rows = await prisma.$queryRaw<
    { month: Date; type: string; total: number }[]
  >`
    SELECT
      DATE_TRUNC('month', date) AS month,
      type,
      SUM(amount)::float         AS total
    FROM financial_records
    WHERE is_deleted = false
      AND EXTRACT(YEAR FROM date) = ${year}
    GROUP BY DATE_TRUNC('month', date), type
    ORDER BY month ASC
  `;

  // Reshape into { month: "2024-01", INCOME: x, EXPENSE: y }
  const monthMap: Record<string, { month: string; INCOME: number; EXPENSE: number }> = {};

  for (const row of rows) {
    const key = row.month.toISOString().substring(0, 7); // "YYYY-MM"
    if (!monthMap[key]) {
      monthMap[key] = { month: key, INCOME: 0, EXPENSE: 0 };
    }
    monthMap[key][row.type as "INCOME" | "EXPENSE"] = Number(row.total);
  }

  return Object.values(monthMap);
};

// Recent activity
export const getRecentRecords = async (limit: number) => {
  return prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { date: "desc" },
    take: limit,
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      notes: true,
      createdAt: true,
    },
  });
};
