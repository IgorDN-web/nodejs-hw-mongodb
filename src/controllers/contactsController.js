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
    const contact = await getContactByIdService(req.params.contactId, userId);
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
    const newContact = await createContactService(req.body, userId);
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
    const updatedContact = await updateContactService(req.params.contactId, req.body, userId);
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
    await deleteContactService(req.params.contactId, userId);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};
