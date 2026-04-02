import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import appRouter from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.JWT_SECRET || "jwt"))

app.use(appRouter)

export default app;
