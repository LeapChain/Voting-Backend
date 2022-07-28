const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { accountNumber } = req.body;

    var user = await User.findOne({ accountNumber: accountNumber }).lean();

    if (!user) {
      var user = await User.create({ accountNumber });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { createUser };
