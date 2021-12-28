const express = require("express");

const router = express.Router();

const contacts = require("../../model");

router.get("/", async (req, res) => {
  const contactsList = await contacts.getAll();

  res.json(contactsList);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const currentContact = await contacts.getContactById(id);

  res.json(currentContact);
});

module.exports = router;
