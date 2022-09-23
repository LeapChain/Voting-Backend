const { matchedData } = require("express-validator");
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
const User = require("../models/User");
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
    return res.status(500).json(err);
  }
};

const getPoll = async (req, res) => {
  try {
    const { id } = req.params;
    const pollPromise = Poll.findById(id).lean();
    const votesPromise = Vote.find({ poll: id }).lean();

    const [poll, votes] = await Promise.all([pollPromise, votesPromise]);
    poll.votes = votes;

    return res.json(poll);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const createPoll = async (req, res) => {
  /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'create poll and allow users to vote on the choices.',
        required: true,
        schema: { $ref: "#/definitions/Poll" }
    } */
  try {
    const body = matchedData(req, { locations: ["body"] });
    const { accountNumber, signature } = body;
    const { title, description, url, nonce, choices } = body.message;

    const poll = await Poll.create({
      accountNumber,
      title,
      description,
      url,
      nonce,
      choices,
      signature,
    });

    user = req.user;
    user.nonce = generateNonce();
    user.save();

    return res.json(poll);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getAllPoll,
  getPoll,
  createPoll,
};
