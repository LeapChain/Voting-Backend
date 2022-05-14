const mongoose = require("mongoose");

const PollChoiceSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 32,
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
      maxLength: 64,
    },
    description: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 264,
    },
    url: String,
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "IN_PROGRESS",
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
