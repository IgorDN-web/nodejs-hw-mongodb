// src/middlewares/errorHandler.js
import { HttpError } from 'http-errors';

export const notFoundHandler = (req, res, next) => {
  next(createError(404, "Route not found"));
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    data: err.message,
  });
};
