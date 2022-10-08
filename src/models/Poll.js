const mongoose = require("mongoose");
const { PollStatus, POLL_DURATION } = require("../constants");

const calculateExpirationDate = () => {
  const now = new Date();
  const expirationDate = now.setDate(now.getDate() + POLL_DURATION);
  return expirationDate;
};

const PollChoiceSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 32,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
});

const PollSchema = mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 264,
    },
    description: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 512,
    },
    url: String,
    voteWeightage: {
      type: Number,
      default: 0,
    },
    nonce: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      enum: PollStatus,
      default: PollStatus.IN_PROGRESS,
    },
    choices: [
      {
        type: PollChoiceSchema,
        required: true,
      },
    ],
    expiresAt: { type: Date, default: calculateExpirationDate() },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Poll", PollSchema);
