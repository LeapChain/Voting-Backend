const User = require("../models/User");
const { WHITELISTEAD_POLL_ACCOUNT_NUMBERS } = require("../constants");

const isAdminAccount = async (req, res, next) => {
  const { accountNumber } = req.body;

  if (accountNumber == null) {
    return res.status(401).json({
      errors: {},
      _message: "Authentication Failed.",
      name: "Unauthenticated",
      message:
        "Authentication Failed: Please include `accountNumber` in the body of request.",
    });
  }

  if (WHITELISTEAD_POLL_ACCOUNT_NUMBERS.includes(accountNumber)) {
    const user = await User.findOne({ accountNumber });

    if (!user) {
      return res.json({
        error:
          "User validation failed: User associated with `accountNumber` does not exist..",
      });
    }
    req.user = user;
    next();
  } else {
    return res.json({
      error: "accountNumber is not in the whiltelist..",
    });
  }
};

module.exports = isAdminAccount;
