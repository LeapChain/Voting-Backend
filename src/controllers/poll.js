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
    const votes = await Vote.find({ poll: id }).lean();
    return res.json({ poll, votes });
  } catch (err) {
    return res.json(err);
  }
};

const createPoll = async (req, res) => {
  try {
    const sortedChoices = req.body.choices.sort((a, b) =>
      a.title > b.title ? 1 : -1
    );

    user = req.user;

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
      req.body.signature,
      req.body.accountNumber
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
  } catch (err) {
    return res.json(err);
  }
};

const updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteWeightage, choices } = req.body;

    const sortedChoices = req.body.choices.sort((a, b) =>
      a._id > b._id ? 1 : -1
    );

    user = req.user;

    const message = {
      voteWeightage: voteWeightage,
      nonce: user.nonce,
      choices: sortedChoices,
    };

    const stringifiedMessage = JSON.stringify(message);

    const isValidSignature = Account.verifySignature(
      stringifiedMessage,
      req.body.signature,
      req.body.accountNumber
    );

    if (isValidSignature) {
      const newPoll = await Poll.findOneAndUpdate(
        { _id: id },
        { voteWeightage: voteWeightage },
        {
          new: true,
          runValidators: true,
        }
      );

      for (const choice of choices) {
        choice_subdoc = newPoll.choices.id(choice["_id"]);
        if (choice_subdoc) {
          choice_subdoc.totalVotes = choice["totalVotes"];
        }
      }
      newPoll.save();
      return res.json(newPoll);
    } else {
      return res.json({
        error: "Invalid Signature..",
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
  updatePoll,
};
