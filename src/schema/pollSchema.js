const { body } = require("express-validator");

const PollSchema = [
  body("accountNumber", "accountNumber must be 64 character long..").isLength({
    min: 64,
    max: 64,
  }),
  body("signature", "signature must be 128 character long..").isLength({
    min: 128,
    max: 128,
  }),
  body("message.title", "message.title field is required").exists({
    checkFalsy: true,
    checkNull: true,
  }),
  body("message.description", "message.description field is required").exists({
    checkFalsy: true,
    checkNull: true,
  }),
  body("message.url", "message.url field is required").exists({
    checkFalsy: true,
    checkNull: true,
  }),
  body("message.nonce", "message.nonce field is required").exists({
    checkFalsy: true,
    checkNull: true,
  }),
  body("message.choices", "message.choices field is required").exists({
    checkFalsy: true,
    checkNull: true,
  }),
  body(
    "message.choices.*.title",
    "message.choices.title field is required"
  ).exists({
    checkFalsy: true,
    checkNull: true,
  }),
];

module.exports = { PollSchema };
