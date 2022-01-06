/* eslint-disable @typescript-eslint/no-var-requires */
const https = require('https')
const fs = require('fs').promises;
const path = require('path');

const key = process.argv[2]

function getRawJSON() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.steampowered.com',
      port: 443,
      path: `/ISteamUserStats/GetSchemaForGame/v0002/?appid=1812820&key=${key}`,
      method: 'GET',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      }
    }

    let data = [];
    const req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      res.on('data', chunk => {
        data.push(chunk)
      })

      res.on('end', () => {
        console.log('Response ended: ');
        resolve(Buffer.concat(data).toString());
      });
    })

    req.on('error', error => {
      console.error(error)
      req.end();
      reject(error);
    });

    req.end();
  });
}

async function fetchAchievementsData() {
  const raw = await getRawJSON();
  const o = JSON.parse(raw);
  const achievements = {};
  o.game.availableGameStats.achievements.forEach((a) => {
    achievements[a.name] = {
      ID: a.name,
      Name: a.displayName,
      Description: a.description,
    };
  })

  const data = {
    note: '***** Generated from a script, overwritten by steam achievements data *****',
    fetchedOn: new Date().getTime(),
    achievements,
  }

  const jsonPath = path.resolve(__dirname, '../src/Achievements/AchievementData.json');
  await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
  return data;
}

fetchAchievementsData().
  then((json) => console.log(JSON.stringify(json, null, 2)));
