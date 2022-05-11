const express = require("express");
const router = express.Router();

const { createVote } = require("../controllers/vote");

router.route("/").post(createVote);
// router.route("/:id").get(getPoll).delete(deletePoll);

module.exports = router;
