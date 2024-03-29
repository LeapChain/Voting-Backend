const { body, param } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;

const pollVoteSchema = [
  body("accountNumber", "accountNumber must be 64 character long..").isLength({
    min: 64,
    max: 64,
  }),
  body("signature", "signature must be 128 character long..").isLength({
    min: 128,
    max: 128,
  }),
  body("message.choices", "message.choices field is required").exists({
    checkFalsy: true,
    checkNull: true,
  }),
  body("message.nonce", "message.nonce field is required").exists({
    checkFalsy: true,
    checkNull: true,
  }),
];

const userVoteSchema = [
  param("id", "id must be a vaild ObjectId").custom((value) => {
    return ObjectId.isValid(value);
  }),
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

module.exports = { pollVoteSchema, userVoteSchema };
