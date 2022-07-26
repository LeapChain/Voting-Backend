WHITELISTEAD_POLL_ACCOUNT_NUMBERS = [
  "3b2cb4e9276a06bafafd2344861df480fb68abf8cebac1025646cce3907fd422", // github actions account number
  "22d0f0047b572a6acb6615f7aae646b0b96ddc58bfd54ed2775f885baeba3d6a", // hussu's wallet
  "dfb24138584042044305f9417e4fe02ca4bde604da6cb2e211a825a2ab5a4e3c", // mrsky's wallet
];

MAX_GOVERNANCE_VOTE_PER_ACCOUNT = 3;

const PollStatus = {
  IN_PROGRESS: 0,
  COMPLETED: 1,
  CANCELLED: 2,
};

const UserType = {
  GENERAL: "GENERAL",
  GOVERNER: "GOVERNER",
};

const VoteType = {
  GOVERNANCE: "GOVERNANCE",
  POLL: "POLL",
};

const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

module.exports = {
  WHITELISTEAD_POLL_ACCOUNT_NUMBERS,
  MAX_GOVERNANCE_VOTE_PER_ACCOUNT,
  PollStatus,
  UserType,
  VoteType,
  PaymentStatus,
};
