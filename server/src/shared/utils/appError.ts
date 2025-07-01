export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    // Ensure proper stack trace capture
    Error.captureStackTrace(this, this.constructor);
  }
}