import createError from "http-errors";
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from "../services/contacts.js";

export const getAllContacts = async (req, res) => {
  const contacts = await getAllContactsService();
  res.status(200).json({
    status: 200,
    message: "Contacts fetched successfully",
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId);

  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, "Missing required fields");
  }

  const newContact = await createContactService(req.body);
  const { __v, ...contactWithoutVersion } = newContact.toObject(); // прибрати __v

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contactWithoutVersion,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const data = req.body;

  const updatedContact = await updateContactService(contactId, data);

  if (!updatedContact) {
    throw createError(404, "Contact not found");
  }

  const { __v, ...contactWithoutVersion } = updatedContact.toObject(); // прибрати __v

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: contactWithoutVersion,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const deleted = await deleteContactService(contactId);

  if (!deleted) {
    throw createError(404, "Contact not found");
  }

  res.status(204).send();
};
