const fs = require("fs/promises");
const contactsPath = require("./contactsPath");

const getAll = async () => {
  const contacts = await fs.readFile(contactsPath);
  const result = await JSON.parse(contacts);

  return result;
};

module.exports = getAll;
