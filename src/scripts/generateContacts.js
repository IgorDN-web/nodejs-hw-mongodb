import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

const generateContacts = async (count = 5) => {
  const contacts = await readContacts();

  const newContacts = Array.from({ length: count }, () => createFakeContact());

  const updatedContacts = [...contacts, ...newContacts];

  await writeContacts(updatedContacts);

  console.log(`${count} contacts generated.`);
};

generateContacts();
