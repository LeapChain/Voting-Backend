const Vote = require("../models/Vote");
const User = require("../models/User");
const Poll = require("../models/Poll");
const { VoteType, UserType, POLL_DURATION } = require("../constants");
const { default: axios } = require("axios");
const { PollStatus, GOVERNANCE_SIZE } = require("../constants");

const fetchAccountBalances = async () => {
  const accountBalances = await axios.get(process.env.ACCOUNT_BALANCE_URL);
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

const syncPollVotes = async () => {
  const activePolls = await Poll.find({ status: PollStatus.IN_PROGRESS });
  const governors = await User.find({ type: UserType.GOVERNOR })
    .sort("field -totalVotes")
    .limit(GOVERNANCE_SIZE)
    .lean();

  for (const poll of activePolls) {
    var pollVotes = {};
    const votes = await Vote.find({ poll: poll._id });

    for (const vote of votes) {
      if (
        governors.some(
          (governor) => governor.accountNumber === vote.accountNumber
        )
      ) {
        if (vote.choices in pollVotes) {
          pollVotes[vote.choices] += 1;
        } else {
          pollVotes[vote.choices] = 1;
        }
      }
    }

    for (const choice of poll.choices) {
      const totalVotes =
        typeof pollVotes[choice._id.toString()] === "undefined"
          ? 0
          : pollVotes[choice._id.toString()];

      choice_subdoc = poll.choices.id(choice._id.toString());
      choice_subdoc.totalVotes = totalVotes;
    }

    var pollStatus = PollStatus.IN_PROGRESS;

    if (new Date() > poll.expiresAt) {
      pollStatus = PollStatus.COMPLETED;
    }

    poll.status = pollStatus;
    poll.voteWeightage = Object.keys(pollVotes).length;
    poll.save();
  }
};

module.exports = { syncUserVotes, syncPollVotes };
