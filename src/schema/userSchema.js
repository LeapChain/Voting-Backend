const { body } = require("express-validator");

const userCreateSchema = [
  body("accountNumber", "accountNumber must be 64 character long..").isLength({
    min: 64,
    max: 64,
  }),
];

const changeUsernameSchema = [
  body("username").custom((value) => {
    var usernameRegex = /^[a-zA-Z0-9\-]+$/;

    if (!usernameRegex.test(value)) {
      throw new Error(
        "username can only contain alphanumeric and - characters."
      );
    } else if (value && (value.length < 3 || value.length > 32)) {
      throw new Error("username must be between 3-32 character long.");
    }
    return true;
  }),
];

const authUserSchema = [
  body("accountNumber", "accountNumber must be 64 character long..").isLength({
    min: 64,
    max: 64,
  }),
  body("signature", "signature must be 128 character long..").isLength({
    min: 128,
    max: 128,
  }),
  body("message.nonce", "message.nonce field is required").exists({
    checkFalsy: true,
    checkNull: true,
  }),
];

module.exports = { userCreateSchema, authUserSchema, changeUsernameSchema };
