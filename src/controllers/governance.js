const GovernorRequest = require("../models/GovernorRequest");
const User = require("../models/User");

const generateNonce = require("../utils/generateNonce");
const {
  UserType,
  PaymentStatus,
  MemoType,
  GOVERNOR_REQUEST_FEE,
  TREASURY_ACCOUNT_NUMBER,
} = require("../constants");

const applyForGovernor = async (req, res) => {
  try {
    const { accountNumber, signature } = req.body;
    const { username, nonce } = req.body.message;

    user = req.user;

    if (user.type === UserType.GOVERNER) {
      return res.status(400).json({
        errors: [
          {
            msg: "oops, you are already a governor. Why applying again??",
            param: "none",
            location: "none",
          },
        ],
      });
    }

    const isUsernameNotAvailable = await User.exists({
      username: username,
    });

    if (isUsernameNotAvailable) {
      return res.status(400).json({
        errors: [
          {
            msg: "oops, the username is already taken. Please use a new one..",
            param: "none",
            location: "none",
          },
        ],
      });
    }

    GovernorRequest.deleteMany({
      accountNumber: accountNumber,
      paymentStatus: PaymentStatus.PENDING,
    });

    var governorRequest = await GovernorRequest.create({
      accountNumber,
      signature,
      username,
      nonce,
    });

    paymentInfo = {
      accountNumber: TREASURY_ACCOUNT_NUMBER,
      metadata: `${MemoType.GOVERNER_REQUEST}_${user._id}`,
      amount: GOVERNOR_REQUEST_FEE,
    };

    governorRequest = governorRequest.toObject();
    governorRequest.paymentInfo = paymentInfo;

    user.nonce = generateNonce();
    user.save();

    return res.json(governorRequest);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { applyForGovernor };
