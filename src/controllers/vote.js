const Vote = require("../models/Vote");
const User = require("../models/User");

const generateNonce = require("../utils/generateNonce");
const { Account } = require("@commandokoala/thenewboston");

const createVote = async (req, res) => {
  try {
    const { accountNumber, signature } = req.body;

    const user = await User.findOne({ accountNumber });

    if (!user) {
      return res.json({
        error:
          "User validation failed: User associated with `accountNumber` does not exist..",
      });
    }

    const message = {
      choices: req.body.choices,
      poll: req.body.poll,
      nonce: user.nonce,
    };

    const stringifiedMessage = JSON.stringify(message);

    const isValidSignature = Account.verifySignature(
      stringifiedMessage,
      signature,
      accountNumber
    );

    if (isValidSignature) {
      const vote = await Vote.create(req.body);
      user.nonce = generateNonce();
      await user.save();
      return res.json(vote);
    } else {
      return res.json({
        error: "Invalid Signature..",
      });
    }
  } catch (err) {
    res.json(err);
  }
};

module.exports = {
  createVote,
};
