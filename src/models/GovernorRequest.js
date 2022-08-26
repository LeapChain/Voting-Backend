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
    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GovernorRequest", governorRequestSchema);
