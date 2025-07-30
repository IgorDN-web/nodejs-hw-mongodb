import createError from "http-errors";
import { Contact } from "../models/contactModel.js";

export const getAllContactsService = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  type,
  isFavourite,
}) => {
  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === "true";

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(perPage),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
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
