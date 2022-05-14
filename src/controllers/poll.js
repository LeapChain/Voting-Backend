const Poll = require("../models/Poll");
const User = require("../models/User");
const Vote = require("../models/Vote");
const generateNonce = require("../utils/generateNonce");
const { Account } = require("@commandokoala/thenewboston");
const { WHITELISTEAD_POLL_ACCOUNT_NUMBERS } = require("../constants");

const getAllPoll = async (req, res) => {
  try {
    var status = req.query.status;
    if (!status) {
      const polls = await Poll.find().lean();
      return res.json(polls);
    }
    const polls = await Poll.find({ status: status }).lean();
    return res.json(polls);
  } catch (err) {
    return res.json(err);
  }
};

const getPoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id).lean();
    return res.json(poll);
  } catch (err) {
    return res.json(err);
  }
};

const getVotesOfPoll = async (req, res) => {
  try {
    const { id } = req.params;
    const votes = await Vote.find({ poll: id }).lean();
    return res.json(votes);
  } catch (err) {
    return res.json(err);
  }
};

const createPoll = async (req, res) => {
  try {
    const { accountNumber, signature } = req.body;

    if (WHITELISTEAD_POLL_ACCOUNT_NUMBERS.includes(accountNumber)) {
      const sortedChoices = req.body.choices.sort((a, b) =>
        a.title > b.title ? 1 : -1
      );

      const user = await User.findOne({ accountNumber });

      if (!user) {
        return res.json({
          error:
            "User validation failed: User associated with `accountNumber` does not exist..",
        });
      }

      const message = {
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        nonce: user.nonce,
        choices: sortedChoices,
      };

      const stringifiedMessage = JSON.stringify(message);

      const isValidSignature = Account.verifySignature(
        stringifiedMessage,
        signature,
        accountNumber
      );

      if (isValidSignature) {
        const poll = await Poll.create(req.body);
        user.nonce = generateNonce();
        await user.save();
        return res.json(poll);
      } else {
        return res.json({
          error: "Invalid Signature..",
        });
      }
    } else {
      return res.json({
        error: "accountNumber is not in the whiltelist..",
      });
    }
  } catch (err) {
    return res.json(err);
  }
};

const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id);
    return res.json(poll);
  } catch (err) {
    return res.json(err);
  }
};

module.exports = {
  getAllPoll,
  getPoll,
  createPoll,
  deletePoll,
  getVotesOfPoll,
};
