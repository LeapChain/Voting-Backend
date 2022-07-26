const mongoose = require("mongoose");

const { PaymentStatus } = require("../constants");

const governorRequestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: VoteType,
      default: PaymentStatus.PENDING,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GovernorRequest", governorRequestSchema);
