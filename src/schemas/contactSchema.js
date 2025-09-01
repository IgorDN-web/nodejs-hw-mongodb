import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email(),
  phone: Joi.string(),
  contactType: Joi.string().valid("personal", "work", "other").required(),
  isFavorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  contactType: Joi.string().valid("personal", "work", "other"),
  isFavorite: Joi.boolean(),
}).min(1);
