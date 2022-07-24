const Vote = require("../models/Vote");
const Poll = require("../models/Poll");

const generateNonce = require("../utils/generateNonce");

const createPollVote = async (req, res) => {
  try {
    const { accountNumber, signature } = req.body;
    const { nonce, choices } = req.body.message;
    const pollID = req.params.id;

    const isActivePoll = await Poll.exists({ status: 0, _id: pollID });

    if (isActivePoll) {
      await Vote.deleteMany({
        accountNumber: accountNumber,
        poll: pollID,
      });

      const vote = await Vote.create({
        accountNumber,
        signature,
        nonce,
        poll: pollID,
        choices,
        type: "POLL",
      });

      user = req.user;
      user.nonce = generateNonce();
      await user.save();

      return res.json(vote);
    } else {
      return res.status(400).json({
        error: "Sorry, the poll is not active anymore to cast the votes..",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createPollVote,
};
