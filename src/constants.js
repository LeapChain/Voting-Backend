WHITELISTEAD_POLL_ACCOUNT_NUMBERS = [
  "3b2cb4e9276a06bafafd2344861df480fb68abf8cebac1025646cce3907fd422", // github actions account number
  "22d0f0047b572a6acb6615f7aae646b0b96ddc58bfd54ed2775f885baeba3d6a", // hussu's wallet
  "dfb24138584042044305f9417e4fe02ca4bde604da6cb2e211a825a2ab5a4e3c", // mrsky's wallet
];

if (process.env.NODE_ENV === "test") {
  JWT_SECRET_KEY = "test";
} else {
  JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
}

MAX_GOVERNANCE_VOTE_PER_ACCOUNT = 3;
GOVERNOR_REQUEST_FEE = 10000;
TREASURY_ACCOUNT_NUMBER =
  "dfb24138584042044305f9417e4fe02ca4bde604da6cb2e211a825a2ab5a4e3c"; // todo: add real treasury account number

const MemoType = {
  GOVERNOR_REQUEST: "GOVERNORREQUEST",
};

const PollStatus = {
  IN_PROGRESS: 0,
  COMPLETED: 1,
  CANCELLED: 2,
};

const UserType = {
  GENERAL: "GENERAL",
  GOVERNOR: "GOVERNOR",
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

const GOVERNANCE_SIZE = 3;
const POLL_DURATION = 3;

module.exports = {
  WHITELISTEAD_POLL_ACCOUNT_NUMBERS,
  MAX_GOVERNANCE_VOTE_PER_ACCOUNT,
  GOVERNOR_REQUEST_FEE,
  TREASURY_ACCOUNT_NUMBER,
  PollStatus,
  UserType,
  VoteType,
  PaymentStatus,
  MemoType,
  JWT_SECRET_KEY,
  GOVERNANCE_SIZE,
  POLL_DURATION,
};
