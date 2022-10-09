const ObjectId = require("mongoose").Types.ObjectId;
const { body, param, query } = require("express-validator");

const PollCreateSchema = [
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

const PollGetSchema = [
  param("id", "id must be a vaild ObjectId").custom((value) => {
    return ObjectId.isValid(value);
  }),
];

const PollGetAllSchema = [
  query(
    "status",
    "status must be a vaild status; available choices are IN_PROGRESS: 0, COMPLETED: 1, CANCELLED: 2"
  ).custom((value) => {
    if (value) {
      return value === "0" || value === "1" || value === "2";
    }
    return true;
  }),
];

module.exports = { PollCreateSchema, PollGetSchema, PollGetAllSchema };
