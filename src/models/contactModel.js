// FILE: src/models/contactModel.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String, // URL загруженного изображения в Cloudinary
    },
    contactType: {
      type: String,
      enum: ["personal", "work", "other"],
      default: "personal",
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);
