require("dotenv").config();
require("./db/connect");
const express = require("express");
const app = express();
const morgan = require("morgan");

const pollRouter = require("./routes/poll");

app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/v1/poll", pollRouter);

module.exports = app;
