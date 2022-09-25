const User = require("../models/User");
const {
  WHITELISTEAD_POLL_ACCOUNT_NUMBERS,
  UserType,
  GOVERNANCE_SIZE,
} = require("../constants");

const isAdminAccount = async (req, res, next) => {
  const { accountNumber } = req.body;

  if (WHITELISTEAD_POLL_ACCOUNT_NUMBERS.includes(accountNumber)) {
    const user = await User.findOne({ accountNumber });

    if (!user) {
      return res.status(404).json({
        message: "User associated with accountNumber does not exist.",
      });
    }
    req.user = user;
    next();
  } else {
    return res.json({
      errors: [
        {
          message: "accountNumber is not in the whiltelist..",
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
    return res.status(404).json({
      message: "User associated with accountNumber does not exist.",
    });
  }
  req.user = user;
  next();
};

const canChangeUsername = async (req, res, next) => {
  user = req.user;

  if (user.type != UserType.GOVERNOR) {
    return res.status(403).json({
      message: "user type GOVERNOR is required to change the username.",
    });
  } else if (user.usernameChanged) {
    return res.status(403).json({
      message: "Username can only be changed once.",
    });
  }
  next();
};

const usernameExists = async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return res.status(409).json({
      message: "Username is already taken.",
    });
  }
  next();
};

const isCandidateGovernor = async (req, res, next) => {
  const userID = req.params.id;

  const userIsGovernor = await User.find({
    type: UserType.GOVERNOR,
    _id: userID,
  });

  if (userIsGovernor.length === 0) {
    return res.status(403).json({
      message: "the user is not GOVERNOR and cannot be voted.",
    });
  }
  next();
};

const isOnGovernance = async (req, res, next) => {
  const { accountNumber } = req.body;

  const governors = await User.find({ type: UserType.GOVERNOR })
    .sort("field -totalVotes")
    .limit(GOVERNANCE_SIZE)
    .lean();

  if (!governors.some((governor) => governor.accountNumber === accountNumber)) {
    return res.status(403).json({
      message: "User is not on governance.",
    });
  }

  next();
};

module.exports = {
  isAdminAccount,
  userExists,
  canChangeUsername,
  usernameExists,
  isCandidateGovernor,
  isOnGovernance,
};
