const mongoose = require("mongoose");

const PollStatus = {
  IN_PROGRESS: 0,
  COMPLETED: 1,
  CANCELLED: 2,
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
      default: 0,
    },
    choices: [
      {
        type: PollChoiceSchema,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Poll", PollSchema);
