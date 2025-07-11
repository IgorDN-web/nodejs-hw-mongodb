import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

const addOneContact = async () => {
  const contacts = await readContacts();

  const newContact = createFakeContact();

  const updatedContacts = [...contacts, newContact];

  await writeContacts(updatedContacts);

  console.log("One contact added:", newContact);
};

addOneContact();
