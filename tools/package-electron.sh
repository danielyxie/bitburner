#!/bin/bash

set -euxo pipefail

# Clear out any files remaining from old builds
rm -rf .package

mkdir -p .package/dist/ || true

cp index.html .package
cp favicon.ico .package
cp -r electron/* .package
cp -r dist .package

# Install electron sub-dependencies
cd electron
npm install
cd ..

BUILD_PLATFORM="${1:-"all"}"
# And finally build the app.
npm run electron:packager-$BUILD_PLATFORM
