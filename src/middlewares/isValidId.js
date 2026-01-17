import { isValidObjectId } from "mongoose";
import createError from "http-errors";

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(createError(400, `${contactId} is not valid id`));
  }
  next();
};
