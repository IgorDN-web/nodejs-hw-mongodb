import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import { sendResetEmailSchema, resetPasswordSchema } from "../schemas/resetPasswordSchema.js";
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(register));
router.post("/login", validateBody(loginSchema), ctrlWrapper(login));
router.post("/refresh", ctrlWrapper(refresh));
router.post("/logout", ctrlWrapper(logout));
router.post("/send-reset-email", validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmail));
router.post("/reset-password", validateBody(resetPasswordSchema), ctrlWrapper(resetPassword));

export default router;
