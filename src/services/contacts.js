import createError from "http-errors";
import { Contact } from "../models/contactModel.js";

export const getAllContactsService = async () => {
  const contacts = await Contact.find({});
  return contacts;
};

export const getContactByIdService = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createError(404, "Contact not found");
  }
  return contact;
};

export const createContactService = async (data) => {
  const { name, phoneNumber, contactType } = data;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, "Missing required fields");
  }

  const newContact = new Contact(data);
  await newContact.save();

  return newContact;
};

export const updateContactService = async (contactId, data) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, data, {
    new: true,
  });
  if (!updatedContact) {
    throw createError(404, "Contact not found");
  }
  return updatedContact;
};

export const deleteContactService = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  if (!deletedContact) {
    throw createError(404, "Contact not found");
  }
  return deletedContact;
};
