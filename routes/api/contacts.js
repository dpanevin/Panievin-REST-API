const express = require("express");
const { NotFound, BadRequest } = require("http-errors");
const router = express.Router();
const Joi = require("joi");

const contacts = require("../../model");

const joiSchemaPost = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .pattern(
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
    )
    .required(),
  phone: Joi.string()
    .pattern(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/)
    .required(),
});
const joiSchemaPut = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(
    /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
  ),
  phone: Joi.string().pattern(
    /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/
  ),
});

router.get("/", async (req, res, next) => {
  try {
    const contactsList = await contacts.getAll();

    res.json(contactsList);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const currentContact = await contacts.getContactById(id);

    if (!currentContact) {
      throw new NotFound();
    }

    res.json(currentContact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const body = req.body;

  try {
    const { error } = joiSchemaPost.validate(body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const newContact = await contacts.add(body);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const newContacts = await contacts.remove(id);

    if (!newContacts) {
      throw new NotFound();
    }

    res.json({
      message: "Contact deleted",
      contacts: newContacts,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  try {
    if (Object.keys(req.body).length === 0) {
      throw new BadRequest("Missing fields");
    }

    const { error } = joiSchemaPut.validate(body);

    if (error) {
      console.log(error.message);
      throw new BadRequest(error.message);
    }

    const updatedContact = await contacts.updateContact(id, body);

    if (!updatedContact) {
      throw new NotFound();
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
