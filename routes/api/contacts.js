const express = require("express");
const { NotFound, BadRequest } = require("http-errors");
const router = express.Router();

const { joiSchema } = require("../../models/contact");
const { Contact } = require("../../models");

router.get("/", async (_, res, next) => {
  try {
    const contactsList = await Contact.find();

    res.json(contactsList);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const currentContact = await Contact.findById(id);

    if (!currentContact) {
      throw new NotFound();
    }

    res.json(currentContact);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const body = req.body;

  try {
    const { error } = joiSchema.validate({ body });

    if (error) {
      throw new BadRequest(error.message);
    }

    const newContact = await Contact.create(body);

    res.status(201).json(newContact);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }

    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const newContacts = await Contact.delete(id);

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

    const { error } = joiSchema.validate(body);

    if (error) {
      console.log(error.message);
      throw new BadRequest(error.message);
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedContact) {
      throw new NotFound();
    }

    res.json(updatedContact);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }

    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  const favorite = req.body.favorite;

  try {
    if (!favorite) {
      throw new BadRequest("Missing field favorite");
    }

    const { error } = joiSchema.validate({ favorite });

    if (error) {
      console.log(error.message);
      throw new BadRequest(error.message);
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      {
        new: true,
      }
    );

    if (!updatedContact) {
      throw new NotFound();
    }

    res.json(updatedContact);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }

    next(error);
  }
});

module.exports = router;
