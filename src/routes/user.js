const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user");
const { createUserVote } = require("../controllers/vote");
const { applyForGovernor } = require("../controllers/governance");

const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const { validateSignature } = require("../middleware/validateSignature");
const userExists = require("../middleware/userExists");

const { userCreateSchema } = require("../schema/userSchema");
const { governorRequestSchema } = require("../schema/governanceSchema");
const { userVoteSchema } = require("../schema/voteSchema");

router.post("/create", userCreateSchema, validateRequestSchema, createUser);

router.post(
  "/apply",
  governorRequestSchema,
  validateRequestSchema,
  userExists,
  validateSignature,
  applyForGovernor
);

router.post(
  "/:id/vote",
  userVoteSchema,
  validateRequestSchema,
  userExists,
  validateSignature,
  createUserVote
);

module.exports = router;
