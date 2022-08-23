require("dotenv").config();

if (process.env.NODE_ENV !== "test") {
  require("./src/db/connect");
}

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");

const pollRouter = require("./src/routes/poll");
const userRouter = require("./src/routes/user");
const authUserRouter = require("./src/routes/auth");

app.enable("trust proxy");
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/v1/auth", authUserRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/polls", pollRouter);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
