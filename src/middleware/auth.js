const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      errors: {},
      _message: "Authentication Failed.",
      name: "Unauthenticated",
      message:
        "Authentication Failed: Please include `Authorization: Bearer JWT` in your headers.",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(payload._id);
    if (!user) {
      return res.json({
        errors: [
          {
            msg: "User validation failed: User associated with that JWT does not exist..",
            param: "authorization",
            location: "headers",
          },
        ],
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      errors: {},
      _message: "Authentication Failed.",
      name: "Unauthenticated",
      message: "Authentication Failed: Invalid access token.",
    });
  }
};

module.exports = verifyToken;
