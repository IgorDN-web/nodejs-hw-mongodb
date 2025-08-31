// FILE: src/services/contacts.js
import streamifier from "streamifier";
import cloudinary from "../utils/cloudinary.js";
import { Contact } from "../models/contactModel.js";
import createHttpError from "http-errors";

// Загружает фото в Cloudinary и возвращает URL
async function uploadToCloudinary(buffer) {
  if (!buffer) return null;
  const folder = process.env.CLOUDINARY_FOLDER || "contacts";
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Получить все контакты с фильтрацией, пагинацией, сортировкой
export const getAllContactsService = async (
  { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", type, favorite },
  userId
) => {
  const filter = { userId };
  if (type) filter.contactType = type;
  if (favorite !== undefined) filter.favorite = favorite === "true";

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(perPage),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage) || 1;
  return {
    items: contacts,
    page: Number(page),
    limit: Number(perPage),
    total: totalItems,
    totalPages,
    hasPreviousPage: Number(page) > 1,
    hasNextPage: Number(page) < totalPages,
  };
};

// Получить контакт по ID
export const getContactByIdService = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) throw createHttpError(404, "Contact not found");
  return contact;
};

// Создать контакт
export const createContactService = async (body, userId, photoBuffer) => {
  const photo = await uploadToCloudinary(photoBuffer);
  const created = await Contact.create({
    ...body,
    userId,
    ...(photo ? { photo } : {}),
  });
  return created;
};

// Обновить контакт
export const updateContactService = async (contactId, body, userId, photoBuffer) => {
  const update = { ...body };
  if (photoBuffer) {
    update.photo = await uploadToCloudinary(photoBuffer);
  }
  const updated = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    update,
    { new: true }
  );
  if (!updated) throw createHttpError(404, "Contact not found");
  return updated;
};

// Удалить контакт
export const deleteContactService = async (contactId, userId) => {
  const deleted = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!deleted) throw createHttpError(404, "Contact not found");
  return deleted;
};
