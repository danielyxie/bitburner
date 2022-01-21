# Tools

## Pretty Save

Useful to analyze a player's save game for anomalies.

It decodes the save and prettifies the output. Canno be used to modify a save game directly since it drops some properties.

**Usage**
```sh
node ./pretty-save.js 'C:\\Users\\martin\\Desktop\\bitburnerSave_1641395736_BN12x14.json' 'C:\\Users\\martin\\Desktop\\pretty.json'
```

## Fetch Steam Achievements Data

Used to synchronize the achievements info in steamworks to the game's data.json

**Usage**
```sh
# Get your key here: https://steamcommunity.com/dev/apikey
node fetch-steam-achievements-data.js DEVKEYDEVKEYDEVKEYDEVKEY
```

## Changelog script

Used to generate a changelog of merged pull requests & commits
The key is a personnal access token, from https://github.com/settings/tokens

**Usage**
```sh
cd ./tools/changelog
npm install
node index.js --key=GITHUB-TOKEN-HERE --from=31ebdbb139981a604bd0e8fc1e364916762e11b9 --to=07fe3c1906b569799652cd1f7a36de2abe306802 > changelog.md
```
