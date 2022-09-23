const express = require("express");
const router = express.Router();
const {
  isAdminAccount,
  userExists,
  isOnGovernance,
} = require("../middleware/user");
const { PollSchema } = require("../schema/pollSchema");
const { pollVoteSchema } = require("../schema/voteSchema");
const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const { validateSignature } = require("../middleware/validateSignature");

const { getAllPoll, getPoll, createPoll } = require("../controllers/poll");
const { createPollVote } = require("../controllers/vote");

router.get("/", getAllPoll);

router.post(
  "/",
  PollSchema,
  validateRequestSchema,
  userExists,
  validateSignature,
  isOnGovernance,
  createPoll
);

router.get("/:id", getPoll);

router.post(
  "/:id/vote",
  pollVoteSchema,
  validateRequestSchema,
  userExists,
  validateSignature,
  isOnGovernance,
  createPollVote
);

module.exports = router;
