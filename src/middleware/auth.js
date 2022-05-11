const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
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

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, _id) => {
    if (err) {
      return res.status(401).json({
        errors: {},
        _message: "Authentication Failed.",
        name: "Unauthenticated",
        message: "Authentication Failed: Invalid access token.",
      });
    }

    req.user = _id;

    return next();
  });
};

module.exports = verifyToken;
