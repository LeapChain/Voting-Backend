const mongoose = require("mongoose");
const generateNonce = require("../utils/generateNonce");
const { UserType } = require("../constants");

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
    type: {
      type: String,
      default: UserType.GENERAL,
    },
    username: String,
    usernameChanged: {
      type: Boolean,
      default: false,
    },
    totalVotes: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
