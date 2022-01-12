/* eslint-disable @typescript-eslint/no-var-requires */
const greenworks = require("./greenworks");
const log = require("electron-log");

async function enableAchievementsInterval(window) {
  // If the Steam API could not be initialized on game start, we'll abort this.
  if (global.greenworksError) return;

   // This is backward but the game fills in an array called `document.achievements` and we retrieve it from
  // here. Hey if it works it works.
  const steamAchievements = greenworks.getAchievementNames();
  log.info(`All Steam achievements ${JSON.stringify(steamAchievements)}`);
  const playerAchieved = (await Promise.all(steamAchievements.map(name => new Promise((resolve, reject) => { greenworks.getAchievement(name, (playerHas) => resolve(playerHas ? name : ""), reject); })))).filter(name => !!name);
  log.info(`Player has Steam achievements ${JSON.stringify(playerAchieved)}`);
  const intervalID = setInterval(async () => {
    try {
      const playerAchievements = await window.webContents.executeJavaScript("document.achievements");
      for (const ach of playerAchievements) {
        if (!steamAchievements.includes(ach)) continue; // Don't try activating achievements that don't exist Steam-side
        if (playerAchieved.includes(ach)) continue;     // Don't spam achievements that have already been recorded
        log.info(`Granting Steam achievement ${ach}`);
        greenworks.activateAchievement(ach, () => undefined);
        playerAchieved.push(ach);
      }
    } catch (error) {
      log.error(error);

      // The interval probably did not get cleared after a window kill
      log.warn('Clearing achievements timer');
      clearInterval(intervalID);
      return;
    }
  }, 1000);
  window.achievementsIntervalID = intervalID;
}

function disableAchievementsInterval(window) {
  if (window.achievementsIntervalID) {
    clearInterval(window.achievementsIntervalID);
  }
}

module.exports = {
  enableAchievementsInterval, disableAchievementsInterval
}
