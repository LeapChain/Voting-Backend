const Vote = require("../models/Vote");
const Poll = require("../models/Poll");

const generateNonce = require("../utils/generateNonce");
const { syncUserVotes, syncPollVotes } = require("../utils/syncVote");

const { MAX_GOVERNANCE_VOTE_PER_ACCOUNT, VoteType } = require("../constants");

const createPollVote = async (req, res) => {
  /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'allow users to vote on the poll...',
        required: true,
        schema: { $ref: "#/definitions/pollVote" }
    } */
  try {
    const { accountNumber, signature } = req.body;
    const { nonce, choices } = req.body.message;
    const pollID = req.params.id;

    const poll = await Poll.findOne({ status: 0, _id: pollID });

    if (poll) {
      const choiceExists = poll.choices.find((choice) => {
        return choices === choice._id.toString();
      });
      if (choiceExists) {
        const vote = await Vote.findOneAndUpdate(
          { accountNumber: accountNumber, poll: pollID },
          {
            accountNumber,
            signature,
            nonce,
            poll: pollID,
            choices,
            type: VoteType.POLL,
          },
          { upsert: true, new: true }
        );

        syncPollVotes();

        user = req.user;
        user.nonce = generateNonce();
        user.save();

        return res.json(vote);
      } else {
        return res.status(400).json({
          message: "Invalid choice",
        });
      }
    } else {
      return res.status(403).json({
        message: "poll not eligible to vote on",
      });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const createUserVote = async (req, res) => {
  /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'allow users to vote for governors...',
        required: true,
        schema: { $ref: "#/definitions/userVote" }
    } */
  try {
    const { accountNumber, signature } = req.body;
    const { nonce } = req.body.message;
    const userID = req.params.id;

    const totalVotesByUser = await Vote.count({
      type: VoteType.GOVERNANCE,
      accountNumber,
    });

    if (totalVotesByUser > MAX_GOVERNANCE_VOTE_PER_ACCOUNT) {
      return res.status(403).json({
        message:
          "You can not vote more than three times. Please unvote to vote again..",
      });
    } else {
      const vote = await Vote.findOneAndUpdate(
        { accountNumber: accountNumber, votedTo: userID },
        {
          $setOnInsert: {
            accountNumber,
            signature,
            nonce,
            votedTo: userID,
            type: VoteType.GOVERNANCE,
          },
        },
        { upsert: true, new: true }
      );

      user = req.user;
      user.nonce = generateNonce();
      user.save();

      syncUserVotes();

      return res.json(vote);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const cancelUserVote = async (req, res) => {
  /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'allow users to cancel their vote for governors...',
        required: true,
        schema: { $ref: "#/definitions/userVote" }
    } */
  try {
    const { accountNumber } = req.body;
    const userID = req.params.id;

    await Vote.deleteOne({ accountNumber: accountNumber, votedTo: userID });
    syncUserVotes();
    return res.json({ message: "Vote cancelled successfully.." });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  createPollVote,
  createUserVote,
  cancelUserVote,
};
