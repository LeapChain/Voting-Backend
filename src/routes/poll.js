const express = require("express");
const router = express.Router();
const isAdminAccount = require("../middleware/isAdminAccount");

const {
  getAllPoll,
  getPoll,
  createPoll,
  deletePoll,
  updatePoll,
} = require("../controllers/poll");

router.get("/", getAllPoll);
router.post("/", isAdminAccount, createPoll);
router.get("/:id", getPoll);
router.patch("/:id", isAdminAccount, updatePoll);

module.exports = router;
