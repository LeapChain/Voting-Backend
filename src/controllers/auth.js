const jwt = require("jsonwebtoken");

const generateNonce = require("../utils/generateNonce");

const authUser = async (req, res) => {
  try {
    user = req.user;

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    user.nonce = generateNonce();
    user.save();

    user = user.toObject();
    user.accessToken = accessToken;

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { authUser };
