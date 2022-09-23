const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET_KEY } = require("../constants");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      message:
        "Authentication Failed: Please include `Authorization: Bearer JWT` in your headers.",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findById(payload._id);
    if (!user) {
      return res.status(404).json({
        message:
          "User validation failed: User associated with that JWT does not exist.",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentication Failed: Invalid access token.",
    });
  }
};

module.exports = verifyToken;
