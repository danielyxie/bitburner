# npm install electron --save-dev
# npm install electron-packager --save-dev

mkdir -p .package/dist || true

cp index.html .package
cp electron/* .package
cp dist/engine.bundle.js .package/dist
cp dist/engineStyle.css .package/dist
cp dist/vendor.css .package/dist
cp dist/engineStyle.bundle.js .package/dist
cp dist/vendor.bundle.js .package/dist

npm run package-electron