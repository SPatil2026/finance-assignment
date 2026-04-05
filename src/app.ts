import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import appRouter from "./routes";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET || "jwt"));

app.use(appRouter);

export default app;
