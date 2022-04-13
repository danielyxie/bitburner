import commandLineArgs from "command-line-args";

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// https://github.com/75lb/command-line-args
const optionDefinitions = [
  {
    name: "version",
    alias: "v",
    type: String,
    required: true,
  },
];

const cliArgs = commandLineArgs(optionDefinitions);

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const appPaths = {
  root,
  electronPackage: path.join(root, "./electron/package.json"),
  constants: path.join(root, "./src/Constants.ts"),
  sphinxConf: path.join(root, "./doc/source/conf.py"),
};

async function main(version) {
  console.log(`Updating app files to match v${version}`);

  const [major, minor] = version.split(".");
  const shortVersion = `${major}.${minor}`;

  const modifiedElectronPackage = (await fs.readFile(appPaths.electronPackage, "utf8")).replace(
    /(^\s*"version":\s)"(.*)",$/m,
    `$1"${version}",`,
  );
  await fs.writeFile(appPaths.electronPackage, modifiedElectronPackage);
  console.log(`> Modified ${appPaths.electronPackage}`);

  let modifiedConstants = (await fs.readFile(appPaths.constants, "utf8")).replace(
    /(^\s*?VersionString:\s)"(.*)",/m,
    `$1"${version}",`,
  );

  await fs.writeFile(appPaths.constants, modifiedConstants);
  console.log(`> Modified ${appPaths.constants}`);

  let modifiedSphinxConfig = (await fs.readFile(appPaths.sphinxConf, "utf8")).replace(
    /(^version = ')(.*)'$/m,
    `$1${shortVersion}'`,
  );
  modifiedSphinxConfig = modifiedSphinxConfig.replace(/(^release = ')(.*)'$/m, `$1${version}'`);
  await fs.writeFile(appPaths.sphinxConf, modifiedSphinxConfig);
  console.log(`> Modified ${appPaths.sphinxConf}`);
}

main(cliArgs.version).then(() => console.log("Done"));
