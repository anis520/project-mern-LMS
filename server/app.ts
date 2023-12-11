require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import coookieParser from "cookie-parser";

// body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(coookieParser());

// cors setup
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

/// global
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("hello lms s");
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
