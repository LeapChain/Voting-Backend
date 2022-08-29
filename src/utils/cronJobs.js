const cron = require("node-cron");
const { syncUserVotes, syncPollVotes } = require("./syncVote");

exports.initCronJobs = () => {
  const updateGovernorEveryFourHour = cron.schedule("0 */4 * * *", () => {
    syncUserVotes();
  });

  const updatePollEverySixHour = cron.schedule("0 */6 * * *", () => {
    syncPollVotes();
  });

  updateGovernorEveryFourHour.start();
  updatePollEverySixHour.start();
};
