// FILE: src/controllers/contactsController.js
// =============================
import {
getAllContactsService,
getContactByIdService,
createContactService,
updateContactService,
deleteContactService,
} from "../services/contacts.js";


export const getAllContacts = async (req, res, next) => {
try {
const userId = req.user._id;
const contactsData = await getAllContactsService(req.query, userId);
res.status(200).json({ status: 200, message: "Successfully found contacts!", data: contactsData });
} catch (error) {
next(error);
}
};


export const getContactById = async (req, res, next) => {
try {
const userId = req.user._id;
const contact = await getContactByIdService(req.params.contactId, userId);
res.status(200).json({ status: 200, message: "Successfully found contact!", data: contact });
} catch (error) {
next(error);
}
};


export const createContact = async (req, res, next) => {
try {
const userId = req.user._id;
const photoBuffer = req.file?.buffer || null;
const created = await createContactService(req.body, userId, photoBuffer);
res.status(201).json({ status: 201, message: "Successfully created a contact!", data: created });
} catch (error) {
next(error);
}
};


export const updateContact = async (req, res, next) => {
try {
const userId = req.user._id;
const photoBuffer = req.file?.buffer || null;
const updated = await updateContactService(req.params.contactId, req.body, userId, photoBuffer);
res.status(200).json({ status: 200, message: "Successfully patched a contact!", data: updated });
} catch (error) {
next(error);
}
};


export const deleteContact = async (req, res, next) => {
try {
const userId = req.user._id;
await deleteContactService(req.params.contactId, userId);
res.status(204).send();
} catch (error) {
next(error);
}
};