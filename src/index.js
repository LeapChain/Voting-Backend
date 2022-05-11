require("dotenv").config();
require("./db/connect");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const pollRouter = require("./routes/poll");
const userRouter = require("./routes/user");
const authUserRouter = require("./routes/auth");
const voteRouter = require("./routes/vote");

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/v1/poll", pollRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authUserRouter);
app.use("/api/v1/vote", voteRouter);

module.exports = app;
