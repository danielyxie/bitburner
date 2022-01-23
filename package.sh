#!/bin/sh

mkdir -p .package/dist/src/ThirdParty || true
mkdir -p .package/src/ThirdParty || true
mkdir -p .package/node_modules || true

cp index.html .package
cp -r electron/* .package
cp -r dist/ext .package/dist
cp -r dist/icons .package/dist

# The css files
cp dist/vendor.css .package/dist
cp main.css .package/main.css

# The js files.
cp dist/vendor.bundle.js .package/dist/vendor.bundle.js
cp main.bundle.js .package/main.bundle.js

# Source maps
cp dist/vendor.bundle.js.map .package/dist/vendor.bundle.js.map
cp main.bundle.js.map .package/main.bundle.js.map

# Install electron sub-dependencies
cd electron
npm install
cd ..

BUILD_PLATFORM="${1:-"all"}"
# And finally build the app.
npm run electron:packager-$BUILD_PLATFORM
