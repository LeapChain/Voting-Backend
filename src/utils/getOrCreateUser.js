const User = require("../models/User");

const getOrCreateUser = async (accountNumber) => {
  var user = await User.findOne({ accountNumber: accountNumber }).lean();

  if (!user) {
    user = await User.create({ accountNumber });
  }
  return user;
};

module.exports = getOrCreateUser;
