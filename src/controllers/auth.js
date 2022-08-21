const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../constants");

const generateNonce = require("../utils/generateNonce");

const authUser = async (req, res) => {
  /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'generate jwt token for authentication.',
        required: true,
        schema: { $ref: "#/definitions/authUser" }
    } */
  try {
    user = req.user;

    const accessToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    user.nonce = generateNonce();
    user.save();

    user = user.toObject();
    user.accessToken = accessToken;

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { authUser };
