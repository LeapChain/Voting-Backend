const express = require("express");
const router = express.Router();
const isAdminAccount = require("../middleware/isAdminAccount");
const { PollSchema } = require("../schema/pollSchema");
const {
  validateRequestSchema,
} = require("../middleware/validateRequestSchema");
const { validateSignature } = require("../middleware/validateSignature");

const {
  getAllPoll,
  getPoll,
  createPoll,
  updatePoll,
} = require("../controllers/poll");

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

module.exports = router;
