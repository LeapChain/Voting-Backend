const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    accountNumber: String,
    amount: Number,
    transactionId: String,
    transactionHash: String,
    metadata: String,
    transactionStatus: {
      type: String,
      enum: ["NEW", "IDENTIFIED", "UNIDENTIFIED", "REFUNDED"],
      default: "NEW",
    },
    confirmationStatus: {
      type: String,
      enum: ["WAITING_CONFIRMATION", "CONFIRMED"],
      default: "WAITING_CONFIRMATION",
    },
    remarks: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
