import { Router } from "express";
import { summary, categories, trends, recent } from "../../controller/dashboard.controller";
import { validate } from "../../middleware/validate";
import {
  dashboardQuerySchema,
  trendsQuerySchema,
  recentQuerySchema,
} from "../../validator/dashboard.schema";

const dashboardRouter = Router();

// GET /api/dashboard/summary
dashboardRouter.get("/summary", validate(dashboardQuerySchema), summary);

// GET /api/dashboard/categories
dashboardRouter.get("/categories", validate(dashboardQuerySchema), categories);

// GET /api/dashboard/trends
dashboardRouter.get("/trends", validate(trendsQuerySchema), trends);

// GET /api/dashboard/recent
dashboardRouter.get("/recent", validate(recentQuerySchema), recent);

export default dashboardRouter;
