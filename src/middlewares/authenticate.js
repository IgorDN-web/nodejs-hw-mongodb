import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createHttpError(401, "Not authorized");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);

    req.user = payload; // предполагается, что payload содержит данные пользователя (_id и т.п.)

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(createHttpError(401, "Access token expired"));
    } else {
      next(createHttpError(401, "Not authorized"));
    }
  }
};
