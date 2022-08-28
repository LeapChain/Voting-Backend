const {
  fetchTransactions,
  updateConfirmationStatus,
  processTransactions,
} = require("../utils/fetchAndProcessTransactions");
const { TREASURY_ACCOUNT_NUMBER } = require("../constants");

const scanTransaction = async (req, res) => {
  try {
    fetchTransactions(TREASURY_ACCOUNT_NUMBER);
    updateConfirmationStatus();
    processTransactions();
    return res.json({ message: "chain scan completed;" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { scanTransaction };
