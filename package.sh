#!/bin/sh

mkdir -p .package/dist/src/ThirdParty || true
mkdir -p .package/src/ThirdParty || true
mkdir -p .package/node_modules || true

cp index.html .package
cp -r electron/* .package
cp -r dist/ext .package/dist

# The css files
cp dist/vendor.css .package/dist
cp main.css .package/main.css

# The js files.
cp dist/vendor.bundle.js .package/dist/vendor.bundle.js
cp main.bundle.js .package/main.bundle.js

npm run electron:packager
