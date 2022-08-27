const GovernorRequest = require("../models/GovernorRequest");

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
        msg: "user with type governor can not apply to be a governor",
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
      metadata: `${MemoType.GOVERNER_REQUEST}_${user._id}`,
      amount: GOVERNOR_REQUEST_FEE,
    };

    governorRequest = governorRequest.toObject();
    governorRequest.paymentInfo = paymentInfo;

    return res.json(governorRequest);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { applyForGovernor };
