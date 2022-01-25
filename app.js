const express = require("express");
const moment = require("moment");
const fs = require("fs/promises");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

app.use(async (req, res, next) => {
  const { method, url } = req;
  const date = moment().format("DD-MM-YYYY_hh:mm:ss");
  const str = `${method} ${url} ${date}\n`;

  await fs.appendFile("server.log", str);

  next();
});
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;

  res.status(status).json({ message });
});

module.exports = app;

// MongoDB pass: oWo2pkXpEsWDgVs0
