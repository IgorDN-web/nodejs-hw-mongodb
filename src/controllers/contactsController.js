import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from "../services/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user._id; // берем userId из аутентификации
    const contactsData = await getAllContactsService({ userId, ...req.query });
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contactsData,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contact = await getContactByIdService(userId, req.params.contactId);
    res.status(200).json({
      status: 200,
      message: "Successfully found contact!",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const newContact = await createContactService(userId, req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully created contact!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updatedContact = await updateContactService(userId, req.params.contactId, req.body);
    res.status(200).json({
      status: 200,
      message: "Successfully updated contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await deleteContactService(userId, req.params.contactId);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};
