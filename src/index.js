require("dotenv").config();
require("./db/connect");
const express = require("express");
const app = express();
const morgan = require("morgan");

const pollRouter = require("./routes/poll");
const userRouter = require("./routes/user");

app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/v1/poll", pollRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
