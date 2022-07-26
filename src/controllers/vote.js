const Vote = require("../models/Vote");
const Poll = require("../models/Poll");
const User = require("../models/User");

const generateNonce = require("../utils/generateNonce");

const { MAX_GOVERNANCE_VOTE_PER_ACCOUNT } = require("../constants");

const createPollVote = async (req, res) => {
  try {
    const { accountNumber, signature } = req.body;
    const { nonce, choices } = req.body.message;
    const pollID = req.params.id;

    const isActivePoll = await Poll.exists({ status: 0, _id: pollID });

    if (isActivePoll) {
      Vote.deleteMany({
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
      user.save();

      return res.json(vote);
    } else {
      return res.status(400).json({
        errors: [
          {
            msg: "The poll is not active anymore to cast the votes..",
            param: "id",
            location: "param",
          },
        ],
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const createUserVote = async (req, res) => {
  try {
    const { accountNumber, signature } = req.body;
    const { nonce } = req.body.message;
    const userID = req.params.id;

    const userCanBeVoted = await User.exists({
      type: "GOVERNER",
      _id: userID,
    });

    if (userCanBeVoted) {
      const totalVotesByUser = await Vote.count({
        type: "GOVERNANCE",
        accountNumber,
      });
      if (totalVotesByUser > MAX_GOVERNANCE_VOTE_PER_ACCOUNT) {
        return res.status(400).json({
          errors: [
            {
              msg: "You can not vote more than three times. Please unvote to vote again..",
              param: "none",
              location: "none",
            },
          ],
        });
      } else {
        Vote.deleteMany({
          accountNumber: accountNumber,
          votedTo: userID,
        });

        const vote = await Vote.create({
          accountNumber,
          signature,
          nonce,
          votedTo: userID,
          type: "GOVERNANCE",
        });

        user = req.user;
        user.nonce = generateNonce();
        user.save();

        return res.json(vote);
      }
    } else {
      return res.json({
        errors: [
          {
            msg: "The user is not eligible to be voted on..",
            param: "id",
            location: "param",
          },
        ],
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createPollVote,
  createUserVote,
};
