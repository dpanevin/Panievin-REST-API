const uuid = require("uuid").v4;
const getAll = require("./getAll");
const updateContacts = require("./updateContacts");

const add = async ({ name, email, phone }) => {
  const newContact = {
    id: uuid(),
    name,
    email,
    phone,
  };
  const contacts = await getAll();
  contacts.push(newContact);

  await updateContacts(contacts);
  return newContact;
};

module.exports = add;
