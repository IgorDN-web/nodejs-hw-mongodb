import express from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contactsController.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";  // добавляем аутентификацию
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactSchema.js";

const router = express.Router();

router.use(authenticate); // ВСЕ маршруты требуют аутентификацию

router.get("/", ctrlWrapper(getAllContacts));
router.get("/:contactId", isValidId, ctrlWrapper(getContactById));
router.post("/", validateBody(createContactSchema), ctrlWrapper(createContact));
router.patch("/:contactId", isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete("/:contactId", isValidId, ctrlWrapper(deleteContact));

export default router;
