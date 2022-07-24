const express = require("express");
const router = express.Router();
const isAdminAccount = require("../middleware/isAdminAccount");
const { PollSchema } = require("../schema/pollSchema");
const { pollVoteSchema } = require("../schema/voteSchema");
const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const { validateSignature } = require("../middleware/validateSignature");
const userExists = require("../middleware/userExists");

const {
  getAllPoll,
  getPoll,
  createPoll,
  updatePoll,
} = require("../controllers/poll");
const { createPollVote } = require("../controllers/vote");

router.get("/", getAllPoll);

router.post(
  "/",
  PollSchema,
  validateRequestSchema,
  isAdminAccount,
  validateSignature,
  createPoll
);

router.get("/:id", getPoll);

router.patch("/:id", isAdminAccount, updatePoll);

router.post(
  "/:id/vote",
  pollVoteSchema,
  validateRequestSchema,
  validateSignature,
  userExists,
  createPollVote
);

module.exports = router;
