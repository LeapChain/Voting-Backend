const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/user");
const { createUserVote } = require("../controllers/vote");
const { userVoteSchema } = require("../schema/voteSchema");
const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const { userCreateSchema } = require("../schema/userSchema");
const { validateSignature } = require("../middleware/validateSignature");
const userExists = require("../middleware/userExists");

router.post("/create", userCreateSchema, validateRequestSchema, createUser);

router.post(
  "/:id/vote",
  userVoteSchema,
  validateRequestSchema,
  validateSignature,
  userExists,
  createUserVote
);

module.exports = router;
