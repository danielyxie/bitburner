#!/bin/sh

# See https://gist.github.com/mohanpedala/1e2ff5661761d3abd0385e8223e16425
set -euxo pipefail

APP_VERSION=$(npm pkg get version | sed 's/"//g')

echo ''
echo '|============================================|'
echo "  Preparing build v$APP_VERSION"
echo '  Taken from the root ./package.json file.'
echo '|============================================|'
echo ''
sleep 1
echo 'Do you need to increment the save file version?'
echo 'If you do, cancel/exit this script now.'
echo 'Update the following file before running this script: '
echo '> ./src/Constants.ts'
echo ''
sleep 2
echo 'Do you want to include a changelog with this release?'
echo 'If you do, cancel/exit this script now.'
echo 'Update the following file before running this script: '
echo '> ./src/Constants.ts'
echo '> ./doc/source/changelog.rst'
echo ''
sleep 2

cd ./tools/bump-version
npm ci
cd ../../
node ./tools/bump-version/basic.js --version $APP_VERSION
echo ''

echo 'Building bundles in 2 seconds...'
sleep 2

echo ''
echo 'Starting build...'
npm run doc && \
  npm run build && \
  npm run electron

echo ''
echo 'Completed!'
echo ''
