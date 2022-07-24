const User = require("../models/User");

const userExists = async (req, res, next) => {
  const user = await User.findOne({ accountNumber: req.body.accountNumber });

  if (!user) {
    return res.json({
      errors: [
        {
          msg: "User validation failed: User associated with `accountNumber` does not exist..",
          param: "accountNumber",
          location: "body",
        },
      ],
    });
  }
  req.user = user;
  next();
};

module.exports = userExists;
