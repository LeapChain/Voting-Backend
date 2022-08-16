const express = require("express");
const router = express.Router();
const { authUser } = require("../controllers/auth");
const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const { userExists } = require("../middleware/user");
const { validateSignature } = require("../middleware/validateSignature");
const { authUserSchema } = require("../schema/userSchema");

router.post(
  "/",
  authUserSchema,
  validateRequestSchema,
  userExists,
  validateSignature,
  authUser
);

module.exports = router;
