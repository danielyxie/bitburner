#!/bin/sh

# Clear out any files remaining from old builds
rm -rf .package

mkdir -p .package/dist/
cp -r electron/* .package
cp -r dist .package
cp index.html .package/index.html

# Install electron sub-dependencies
cd electron
npm install
cd ..

BUILD_PLATFORM="${1:-"all"}"
# And finally build the app.
npm run electron:packager-$BUILD_PLATFORM
