import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsControllers,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactSchema,
  updateStudentSchema,
} from '../validation/contact.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);
router.get('/', ctrlWrapper(getContactsControllers));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(updateStudentSchema),
  ctrlWrapper(patchContactController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
