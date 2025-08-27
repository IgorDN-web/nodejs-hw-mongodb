// FILE: src/routes/authRouter.js
// ================================
import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

// ✅ Регистрация нового пользователя
router.post("/register", register);

// ✅ Логин (выдаёт accessToken + refreshToken в куке)
router.post("/login", login);

// ✅ Обновление accessToken по refreshToken
router.post("/refresh", refresh);

// ✅ Выход (удаляет сессию и очищает refreshToken в cookie)
router.post("/logout", logout);

// ✅ HW6: отправка письма для сброса пароля
router.post("/send-reset-email", sendResetEmail);

// ✅ HW6: сброс пароля по токену
router.post("/reset-password", resetPassword);

export default router;
