const Vote = require("../models/Vote");

const createVote = async (req, res) => {
  try {
    const vote = await Vote.create(req.body);
    return res.json(vote);
  } catch (err) {
    res.json(err);
  }
};

module.exports = {
  createVote,
};
