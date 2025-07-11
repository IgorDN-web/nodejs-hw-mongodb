import fs from "fs/promises";
import { PATH_DB } from "../constants/contacts.js";

export const writeContacts = async (contacts) => {
  try {
    await fs.writeFile(PATH_DB, JSON.stringify(contacts, null, 2), "utf-8");
  } catch (error) {
    console.log("Error writing contacts:", error.message);
  }
};
