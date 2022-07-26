const mongoose = require("mongoose");

const { PaymentStatus } = require("../constants");

const governorRequestSchema = mongoose.Schema(
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
    username: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: PaymentStatus,
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
