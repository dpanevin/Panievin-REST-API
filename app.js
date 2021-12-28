const express = require("express");
const moment = require("moment");
const fs = require("fs/promises");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

app.use(cors());

app.use(async (req, res, next) => {
  const { method, url } = req;
  const date = moment().format("DD-MM-YYYY_hh:mm:ss");
  const str = `${method} ${url} ${date}\n`;

  await fs.appendFile("server.log", str);

  next();
});

app.use("/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = app;
