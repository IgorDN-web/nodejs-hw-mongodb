// FILE: src/services/contacts.js
import streamifier from "streamifier";
import cloudinary from "../utils/cloudinary.js";
import { Contact } from "../models/contactModel.js";


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


export const getAllContactsService = async (
{ page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", type, isFavourite },
userId
) => {
const filter = { userId };
if (type) filter.contactType = type;
if (isFavourite !== undefined) filter.isFavourite = isFavourite === "true";


const skip = (page - 1) * perPage;
const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };


const [contacts, totalItems] = await Promise.all([
Contact.find(filter).sort(sort).skip(skip).limit(perPage),
Contact.countDocuments(filter),
]);


const totalPages = Math.ceil(totalItems / perPage) || 1;
return {
data: contacts,
page: Number(page),
perPage: Number(perPage),
totalItems,
totalPages,
hasPreviousPage: Number(page) > 1,
hasNextPage: Number(page) < totalPages,
};
};


export const getContactByIdService = async (contactId, userId) => {
const contact = await Contact.findOne({ _id: contactId, userId });
if (!contact) throw createError(404, "Contact not found");
return contact;
};


export const createContactService = async (body, userId, photoBuffer) => {
const photo = await uploadToCloudinary(photoBuffer);
const created = await Contact.create({ ...body, userId, ...(photo ? { photo } : {}) });
return created;
};


export const updateContactService = async (contactId, body, userId, photoBuffer) => {
const update = { ...body };
if (photoBuffer) {
update.photo = await uploadToCloudinary(photoBuffer);
}
const updated = await Contact.findOneAndUpdate({ _id: contactId, userId }, update, { new: true });
if (!updated) throw createError(404, "Contact not found");
return updated;
};


export const deleteContactService = async (contactId, userId) => {
const deleted = await Contact.findOneAndDelete({ _id: contactId, userId });
if (!deleted) throw createError(404, "Contact not found");
return deleted;
};