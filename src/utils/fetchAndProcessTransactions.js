const axios = require("axios");
const Transaction = require("../models/Transaction");
const GovernorRequest = require("../models/GovernorRequest");
const User = require("../models/User");
const {
  GOVERNOR_REQUEST_FEE,
  UserType,
  PaymentStatus,
  MemoType,
} = require("../constants");

const fetchTransactions = async (accountNumber) => {
  try {
    const response = await axios.get(
      `${process.env.BANK_URL}/bank_transactions?recipient=${accountNumber}`
    );

    if (response.status === 200) {
      for (let i = 0; i < response.data.results.length; i++) {
        let transaction = response.data.results[i];

        let transactionExists = await Transaction.find({
          transactionHash: transaction.block.signature,
        });

        if (transactionExists.length == 0) {
          await Transaction.create({
            accountNumber: transaction.block.sender,
            amount: transaction.amount,
            transactionId: transaction.block.id,
            transactionHash: transaction.block.signature,
            metadata: transaction.memo,
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const updateConfirmationStatus = async () => {
  try {
    var scanTransactionUntil = new Date();
    scanTransactionUntil.setDate(scanTransactionUntil.getDate() - 7);

    const unconfirmedTransactions = await Transaction.find({
      confirmationStatus: "WAITING_CONFIRMATION",
      createdAt: {
        $gte: scanTransactionUntil,
      },
    });

    for (let i = 0; i < unconfirmedTransactions.length; i++) {
      let unconfirmedTransaction = unconfirmedTransactions[i];
      let transactionConfirmationResponse = await axios({
        method: "GET",
        url: `${process.env.BANK_URL}/confirmation_blocks?block__signature=${unconfirmedTransaction.transactionHash}`,
        validateStatus: () => true,
      });

      if (transactionConfirmationResponse.status == 200) {
        if (transactionConfirmationResponse.data.count > 0) {
          unconfirmedTransaction.confirmationStatus = "CONFIRMED";
          unconfirmedTransaction.save();
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const processTransactions = async () => {
  const confirmedTransactions = await Transaction.find({
    confirmationStatus: "CONFIRMED",
    transactionStatus: "NEW",
  });

  for (let i = 0; i < confirmedTransactions.length; i++) {
    let confirmedTransaction = confirmedTransactions[i];
    const parsedMetadata = confirmedTransaction.metadata.split("_");

    if (
      parsedMetadata[0] == MemoType.GOVERNOR_REQUEST &&
      parsedMetadata.length >= 2
    ) {
      const userId = parsedMetadata[1];

      const user = await User.findById(userId);

      if (user) {
        if (confirmedTransaction.amount >= GOVERNOR_REQUEST_FEE) {
          await User.updateOne({ _id: userId }, { type: UserType.GOVERNOR });

          const governorRequest = await GovernorRequest.findOne({
            accountNumber: user.accountNumber,
          });

          governorRequest.transactions.push(confirmedTransaction);
          governorRequest.paymentStatus = PaymentStatus.COMPLETED;
          governorRequest.save();

          confirmedTransaction.transactionStatus = "IDENTIFIED";
          confirmedTransaction.save();
        } else {
          confirmedTransaction.transactionStatus = "UNIDENTIFIED";
          confirmedTransaction.remarks =
            "GOVERNOR_REQUEST transaction underpaid";
          confirmedTransaction.save();
        }
      } else {
        confirmedTransaction.transactionStatus = "UNIDENTIFIED";
        confirmedTransaction.remarks =
          "GOVERNOR_REQUEST transaction's user unidentified";
        confirmedTransaction.save();
      }
    } else {
      confirmedTransaction.transactionStatus = "UNIDENTIFIED";
      confirmedTransaction.remarks = "invalid memo format";
      confirmedTransaction.save();
    }
  }
};

module.exports = {
  fetchTransactions,
  updateConfirmationStatus,
  processTransactions,
};
