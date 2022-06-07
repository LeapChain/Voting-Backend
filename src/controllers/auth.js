const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { verifySignature } = require("@leapchain/dleap");
const generateNonce = require("../utils/generateNonce");

const authUser = async (req, res) => {
  try {
    const { accountNumber, signature } = req.body;

    if (!(accountNumber && signature)) {
      return res.json({
        errors: {},
        _message: "User validation failed",
        name: "ValidationError",
        message:
          "User validation failed: accountNumber: Path `accountNumber` and `signature` is required.",
      });
    }

    const user = await User.findOne({ accountNumber });

    if (!user) {
      return res.json({
        errors: {},
        _message: "User validation failed",
        name: "ValidationError",
        message:
          "User validation failed: User associated with `accountNumber` does not exists.",
      });
    }

    const message = `Signing my leapchain nonce: ${user.nonce}`;

    const isValidSignature = verifySignature(signature, message, accountNumber);

    if (!isValidSignature) {
      return res.json({
        errors: {},
        _message: "Signature validation failed",
        name: "ValidationError",
        message: "Signature validation failed: Invalid signature.",
      });
    }

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    user.nonce = generateNonce();
    await user.save();

    return res.json({ user, accessToken: accessToken });
  } catch (err) {
    return res.json(err);
  }
};

module.exports = { authUser };
