const express = require("express");
const router = express.Router();

const {
  getAllPoll,
  getPoll,
  createPoll,
  deletePoll,
} = require("../controllers/poll");

router.route("/").get(getAllPoll).post(createPoll);
router.route("/:id").get(getPoll).delete(deletePoll);

module.exports = router;
