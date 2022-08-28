const User = require("../models/User");
const generateNonce = require("./generateNonce");

const generateRandomUsername = () => {
  const randomUsername = Math.random().toString(36).substring(6);
  return randomUsername;
};

const getOrCreateUser = async (accountNumber) => {
  const user = await User.findOneAndUpdate(
    { accountNumber },
    {
      $setOnInsert: {
        accountNumber,
        nonce: generateNonce(),
        username: generateRandomUsername(),
      },
    },
    { upsert: true, new: true }
  );

  return user;
};

module.exports = getOrCreateUser;
