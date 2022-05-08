const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { accountNumber } = req.body;

    var user = await User.findOne({ accountNumber: accountNumber }).lean();

    if (!user) {
      var user = await User.create(req.body);
    }
    return res.json(user);
  } catch (err) {
    return res.json(err);
  }
};

module.exports = { createUser };
