const express = require("express");
const router = express.Router();

const { createUser, changeUsername } = require("../controllers/user");

const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const auth = require("../middleware/auth");
const { usernameExists, canChangeUsername } = require("../middleware/user");

const {
  userCreateSchema,
  changeUsernameSchema,
} = require("../schema/userSchema");

router.post("/create", userCreateSchema, validateRequestSchema, createUser);

router.post(
  "/change-username",
  auth,
  changeUsernameSchema,
  validateRequestSchema,
  usernameExists,
  canChangeUsername,
  changeUsername
);

module.exports = router;
