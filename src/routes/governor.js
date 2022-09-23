const express = require("express");
const router = express.Router();

const { listGovernors } = require("../controllers/governor");
const { createUserVote, cancelUserVote } = require("../controllers/vote");
const { applyForGovernor } = require("../controllers/governor");

const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const auth = require("../middleware/auth");
const { validateSignature } = require("../middleware/validateSignature");
const { userExists, isCandidateGovernor } = require("../middleware/user");

const { userVoteSchema } = require("../schema/voteSchema");

router.get("/", listGovernors);

router.post("/apply", auth, applyForGovernor);

router.post(
  "/:id/vote",
  userVoteSchema,
  validateRequestSchema,
  userExists,
  validateSignature,
  isCandidateGovernor,
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
