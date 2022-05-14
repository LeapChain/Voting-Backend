const express = require("express");
const router = express.Router();

const {
  getAllPoll,
  getPoll,
  createPoll,
  deletePoll,
  getVotesOfPoll,
} = require("../controllers/poll");

router.route("/").get(getAllPoll).post(createPoll);
router.route("/:id").get(getPoll).delete(deletePoll);
router.route("/:id/votes").get(getVotesOfPoll);

module.exports = router;
