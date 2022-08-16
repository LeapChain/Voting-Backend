const User = require("../models/User");

const createUser = async (req, res) => {
  /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'retrieve the user nonce for signig the requests',
        required: true,
        schema: { $ref: "#/definitions/createUser" }
    } */
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

const changeUsername = async (req, res) => {
  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'change the username of the user',
            required: true,
            schema: { $ref: "#/definitions/changeUsername" }
        } */
  try {
    const { username } = req.body;
    user = req.user;

    if (user.usernameChanged) {
      return res.status(400).json({ msg: "Username already changed" });
    }

    updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { username: username, usernameChanged: true },
      { new: true }
    );

    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { createUser, changeUsername };
