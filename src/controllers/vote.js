const Vote = require("../models/Vote");
const User = require("../models/User");

const generateNonce = require("../utils/generateNonce");
const { verifySignature, createSignature } = require("@leapchain/dleap");

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
      nonce: user.nonce,
      poll: req.body.poll,
    };

    const stringifiedMessage = JSON.stringify(message);

    console.log(stringifiedMessage);
    const testSignature = createSignature(
      stringifiedMessage,
      "ea37b7d45aa88a659f596f3315ed8168fd5127446f33dc0d400b92103d1ce774"
    );
    console.log(testSignature);

    const isValidSignature = verifySignature(
      signature,
      stringifiedMessage,
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
