const { body } = require("express-validator");

const userCreateSchema = [
  body("accountNumber", "accountNumber must be 64 character long..").isLength({
    min: 64,
    max: 64,
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

module.exports = { userCreateSchema, authUserSchema };
