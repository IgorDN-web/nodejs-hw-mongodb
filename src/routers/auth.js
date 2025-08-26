import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginContactSchema,
  registerContactSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginContactController,
  logoutUserController,
  refreshUsersSessionController,
  registerContactController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerContactSchema),
  ctrlWrapper(registerContactController),
);
router.post(
  '/login',
  validateBody(loginContactSchema),
  ctrlWrapper(loginContactController),
);
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshUsersSessionController));
router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
export default router;
