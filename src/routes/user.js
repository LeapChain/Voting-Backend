const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user");
const { createUserVote, cancelUserVote } = require("../controllers/vote");
const { applyForGovernor } = require("../controllers/governance");

const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const auth = require("../middleware/auth");
const { validateSignature } = require("../middleware/validateSignature");
const userExists = require("../middleware/userExists");

const { userCreateSchema } = require("../schema/userSchema");
const { userVoteSchema } = require("../schema/voteSchema");

router.post("/create", userCreateSchema, validateRequestSchema, createUser);

router.post("/apply", auth, applyForGovernor);

router.post(
  "/:id/vote",
  userVoteSchema,
  validateRequestSchema,
  userExists,
  validateSignature,
  createUserVote
);

router.post(
  "/:id/unvote",
  userVoteSchema,
  validateRequestSchema,
  userExists,
  validateSignature,
  cancelUserVote
);

module.exports = router;
