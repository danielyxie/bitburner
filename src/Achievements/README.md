# Adding Achievements

* Add a .svg in `./assets/Steam/achievements/real`
* Create the achievement in Steam Dev Portal
* Run `sh ./assets/Steam/achievements/pack-for-web.sh`
* Run `node ./tools/fetch-steam-achievements-data DEVKEYHERE`
  * Get your key here: https://steamcommunity.com/dev/apikey
* Add an entry in `./src/Achievements/Achievements.ts` -> achievements
* Commit `./dist/icons/achievements` & `./src/Achievements/AchievementData.json`
