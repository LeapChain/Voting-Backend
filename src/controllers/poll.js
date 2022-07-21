const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
const generateNonce = require("../utils/generateNonce");
const { verifySignature } = require("@leapchain/dleap");

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
    return res.status(400).json(err);
  }
};

const getPoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id).lean();
    const votes = await Vote.find({ poll: id }).lean();
    poll.votes = votes;

    return res.json(poll);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const createPoll = async (req, res) => {
  try {
    const sortedChoices = req.body.choices.sort((a, b) =>
      a.title > b.title ? 1 : -1
    );

    user = req.user;

    const message = {
      choices: sortedChoices,
      description: req.body.description,
      nonce: user.nonce,
      title: req.body.title,
      url: req.body.url,
    };

    const stringifiedMessage = JSON.stringify(message);

    const isValidSignature = verifySignature(
      req.body.signature,
      stringifiedMessage,
      req.body.accountNumber
    );

    if (isValidSignature) {
      const poll = await Poll.create(req.body);
      user.nonce = generateNonce();
      await user.save();
      return res.json(poll);
    } else {
      return res.status(400).json({
        error: "Invalid Signature..",
      });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteWeightage, choices, status } = req.body;

    const sortedChoices = req.body.choices.sort((a, b) =>
      a._id > b._id ? 1 : -1
    );

    user = req.user;

    const message = {
      choices: sortedChoices,
      nonce: user.nonce,
      status: status,
      voteWeightage: voteWeightage,
    };

    const stringifiedMessage = JSON.stringify(message);

    const isValidSignature = verifySignature(
      req.body.signature,
      stringifiedMessage,
      req.body.accountNumber
    );

    if (isValidSignature) {
      const newPoll = await Poll.findOneAndUpdate(
        { _id: id },
        { voteWeightage: voteWeightage, status: status },
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
    return res.status(400).json(err);
  }
};

const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id);
    return res.json(poll);
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  getAllPoll,
  getPoll,
  createPoll,
  deletePoll,
  updatePoll,
};
