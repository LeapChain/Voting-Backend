const mongoose = require("mongoose");

const VoteSchema = mongoose.Schema({
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
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
    required: true,
  },
  choices: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll.choices",
    required: true,
  },
});

module.exports = mongoose.model("Vote", VoteSchema);
