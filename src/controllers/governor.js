const GovernorRequest = require("../models/GovernorRequest");
const User = require("../models/User");

const {
  UserType,
  MemoType,
  GOVERNOR_REQUEST_FEE,
  TREASURY_ACCOUNT_NUMBER,
} = require("../constants");

const applyForGovernor = async (req, res) => {
  try {
    user = req.user;

    if (user.type === UserType.GOVERNOR) {
      return res.status(403).json({
        message: "user with type governor can not apply to be a governor",
      });
    }

    var governorRequest = await GovernorRequest.findOne({
      accountNumber: user.accountNumber,
    });

    if (!governorRequest) {
      var governorRequest = await GovernorRequest.create({
        accountNumber: user.accountNumber,
      });
    }

    paymentInfo = {
      accountNumber: TREASURY_ACCOUNT_NUMBER,
      metadata: `${MemoType.GOVERNOR_REQUEST}_${user._id}`,
      amount: GOVERNOR_REQUEST_FEE,
    };

    governorRequest = governorRequest.toObject();
    governorRequest.paymentInfo = paymentInfo;

    return res.json(governorRequest);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const listGovernors = async (req, res) => {
  try {
    const governors = await User.find(
      { type: UserType.GOVERNOR },
      "-nonce -usernameChanged"
    ).sort("field -totalVotes");

    return res.json(governors);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { applyForGovernor, listGovernors };
