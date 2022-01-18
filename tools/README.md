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

Used to generate a basic git commit log (in markdown) between commit A & commit B

**Usage**
```sh
# Will default to HEAD if second is not specified.
./tools/changelog.sh 9a0062b 05cbc25
```
