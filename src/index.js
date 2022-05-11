require("dotenv").config();
require("./db/connect");
const express = require("express");
const app = express();
const morgan = require("morgan");

const pollRouter = require("./routes/poll");
const userRouter = require("./routes/user");
const authUserRouter = require("./routes/auth");

app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/v1/poll", pollRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authUserRouter);

module.exports = app;
