const User = require("../models/User");
const generateNonce = require("../utils/generateNonce");

const getOrCreateUser = async (accountNumber) => {
  const user = await User.findOneAndUpdate(
    { accountNumber },
    { $setOnInsert: { accountNumber, nonce: generateNonce() } },
    { upsert: true, new: true }
  );

  return user;
};

module.exports = getOrCreateUser;
