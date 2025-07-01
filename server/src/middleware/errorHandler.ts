// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  // Handle Mongoose duplicate key errors
  if (err.code === "11000") {
    statusCode = 400;
    message = "Duplicate key error: Resource already exists";
  }

  console.error(`Error: ${message}, Status: ${statusCode}`);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};