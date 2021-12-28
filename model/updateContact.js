const getAll = require("./getAll");
const updateContacts = require("./updateContacts");

const remove = async (id, body) => {
  const contacts = await getAll();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id.toString() === id
  );

  if (contactIndex === -1) {
    return null;
  } else {
    const udatedContact = { ...contacts[contactIndex], ...body };

    contacts.splice(contactIndex, 1, udatedContact);

    await updateContacts(contacts);

    return udatedContact;
  }
};

module.exports = remove;
