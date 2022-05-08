const mongoose = require("mongoose");
const generateNonce = require("../utils/generateNonce");

const UserSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      minLength: 64,
      maxLength: 64,
    },
    nonce: {
      type: Number,
      default: generateNonce(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
