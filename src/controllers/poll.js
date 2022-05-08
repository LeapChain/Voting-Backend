const Poll = require("../models/Poll");

const getAllPoll = async (req, res) => {
  try {
    const polls = await Poll.find().lean();
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

const createPoll = async (req, res) => {
  try {
    const poll = await Poll.create(req.body);
    return res.json(poll);
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
};
