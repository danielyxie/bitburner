/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const url = require("url");

function getAppPath(page, query) {
  return url.format({
    pathname: path.join(__dirname, page),
    protocol: "file:",
    slashes: true,
    search: query,
  });
}

const pagePaths = {
  main: (noScripts) => getAppPath("../index.html", noScripts ? 'noScripts' : undefined),
  exit: () => getAppPath("../pages/exit.html"),
  export: () => getAppPath("../pages/export.html"),
}

module.exports = {
  pagePaths,
}
