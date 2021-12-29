const getAll = require("./getAll");
const updateContacts = require("./updateContacts");

const remove = async (id) => {
  const contacts = await getAll();
  const newContacts = contacts.filter(
    (contact) => contact.id.toString() !== id
  );

  if (contacts.length === newContacts.length) {
    return null;
  }

  await updateContacts(newContacts);

  return newContacts;
};

module.exports = remove;
