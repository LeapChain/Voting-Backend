const mongoose = require("mongoose");

const VoteType = {
  GOVERNANCE: "GOVERNANCE",
  POLL: "POLL",
};

const VoteSchema = mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      minLength: 64,
      maxLength: 64,
    },
    signature: {
      type: String,
      required: true,
      minLength: 128,
      maxLength: 128,
    },
    nonce: {
      type: Number,
      required: true,
    },
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
    },
    choices: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll.choices",
    },
    votedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: VoteType,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vote", VoteSchema);
