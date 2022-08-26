const express = require("express");
const router = express.Router();

const {
  createUser,
  changeUsername,
  listGoverners,
} = require("../controllers/user");
const { createUserVote, cancelUserVote } = require("../controllers/vote");
const { applyForGovernor } = require("../controllers/governance");

const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const auth = require("../middleware/auth");
const { validateSignature } = require("../middleware/validateSignature");
const {
  userExists,
  usernameExists,
  canChangeUsername,
  isGovernor,
} = require("../middleware/user");

const {
  userCreateSchema,
  changeUsernameSchema,
} = require("../schema/userSchema");
const { userVoteSchema } = require("../schema/voteSchema");

router.post("/create", userCreateSchema, validateRequestSchema, createUser);

router.post("/apply", auth, applyForGovernor);

router.get("/governors", auth, listGoverners);

router.post(
  "/change-username",
  auth,
  changeUsernameSchema,
  validateRequestSchema,
  usernameExists,
  canChangeUsername,
  changeUsername
);

router.post(
  "/:id/vote",
  userVoteSchema,
  validateRequestSchema,
  userExists,
  validateSignature,
  isGovernor,
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
