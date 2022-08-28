const Vote = require("../models/Vote");
const User = require("../models/User");
const { VoteType, UserType } = require("../constants");
const { default: axios } = require("axios");
const { LEAPCHAIN_BALANCE_API_URL } = require("../constants");

const fetchAccountBalances = async () => {
  const accountBalances = await axios.get(LEAPCHAIN_BALANCE_API_URL);
  return accountBalances.data;
};

const accountBalance = (accountBalances, accountNumber) => {
  const balance = accountBalances[accountNumber];

  return typeof balance === "undefined"
    ? 0
    : balance["balance"] + balance["locked"];
};

const syncUserVotes = async () => {
  const votes = await Vote.find({ type: VoteType.GOVERNANCE });

  const accountBalances = await fetchAccountBalances();

  var governorVotes = {};

  for (const vote of votes) {
    const { accountNumber, votedTo } = vote;
    const voteWeightage = accountBalance(accountBalances, accountNumber);

    if (votedTo.toString() in governorVotes) {
      governorVotes[votedTo.toString()] += voteWeightage;
    } else {
      governorVotes[votedTo.toString()] = voteWeightage;
    }
  }

  const governors = await User.find({ type: UserType.GOVERNOR });

  for (const governor of governors) {
    const totalVotes =
      typeof governorVotes[governor._id.toString()] === "undefined"
        ? 0
        : governorVotes[governor._id.toString()];

    governor.totalVotes = totalVotes;
    governor.save();
  }
};

module.exports = { syncUserVotes };
