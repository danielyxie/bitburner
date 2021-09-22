# npm install electron --save-dev
# npm install electron-packager --save-dev

mkdir -p .package/dist/src/ThirdParty || true
mkdir -p .package/src/ThirdParty || true

cp index.html .package
cp electron/* .package
# The css files
cp dist/vendor.css .package/dist
cp main.css .package/main.css

# The js files.
cp dist/vendor.bundle.js .package/dist/vendor.bundle.js
cp main.bundle.js .package/main.bundle.js

cp src/ThirdParty/raphael.min.js .package/src/ThirdParty/raphael.min.js

npm run package-electron