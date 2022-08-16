const User = require("../models/User");
const { WHITELISTEAD_POLL_ACCOUNT_NUMBERS } = require("../constants");

const isAdminAccount = async (req, res, next) => {
  const { accountNumber } = req.body;

  if (WHITELISTEAD_POLL_ACCOUNT_NUMBERS.includes(accountNumber)) {
    const user = await User.findOne({ accountNumber });

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
  } else {
    return res.json({
      errors: [
        {
          msg: "accountNumber is not in the whiltelist..",
          param: "accountNumber",
          location: "body",
        },
      ],
    });
  }
};

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

const canChangeUsername = async (req, res, next) => {
  user = req.user;

  if (user.type != UserType.GOVERNER) {
    return res.json({
      errors: [
        {
          msg: "Validation failed: You need to be a governer to change username..",
          param: "none",
          location: "none",
        },
      ],
    });
  } else if (user.usernameChanged) {
    return res.json({
      errors: [
        {
          msg: "Validation failed: You can only change username once..",
          param: "none",
          location: "none",
        },
      ],
    });
  }
  next();
};

module.exports = { isAdminAccount, userExists, canChangeUsername };
