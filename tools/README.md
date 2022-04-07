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

## Fetch Changelog

Used to generate a changelog of merged pull requests & commits between A & B.
The key is a personnal access token, from https://github.com/settings/tokens.
It requires the "gist" scope as the result is pushed to a secret gist.

**Usage**

```sh
cd ./tools/fetch-changelog
npm install
export GITHUB_API_TOKEN=tokenhere # this could go into your .bashrc or .profile etc.
node index.js --from=31ebdbb139981a604bd0e8fc1e364916762e11b9 > ../bump-version/changes.md
```

## Bump Version

Used to update the game's various version identifier.
Requires pandoc installed to convert .md to .rst

**Usage**

```sh
cd ./tools/bump-version
npm install
node index.js --version=1.10.3 --versionNumber=10 < changes.md
```
