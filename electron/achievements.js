/* eslint-disable @typescript-eslint/no-var-requires */
const greenworks = require("./greenworks");
const log = require("electron-log");

function enableAchievementsInterval(window) {
   // This is backward but the game fills in an array called `document.achievements` and we retrieve it from
  // here. Hey if it works it works.
  const steamAchievements = greenworks.getAchievementNames();
  const intervalID = setInterval(async () => {
    try {
      const playerAchievements = await window.webContents.executeJavaScript("document.achievements");
      for (const ach of playerAchievements) {
        if (!steamAchievements.includes(ach)) continue;
        greenworks.activateAchievement(ach, () => undefined);
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
