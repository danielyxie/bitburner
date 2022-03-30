// import { Octokit } from "@octokit/rest";
import commandLineArgs from "command-line-args";

import fs from 'fs/promises';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pandoc from 'node-pandoc';

// https://github.com/75lb/command-line-args
const optionDefinitions = [
  { name: 'version', alias: 'v', type: String, required: true },
  { name: 'versionNumber', alias: 'n', type: Number },
  { name: 'versionDescription', alias: 'd', type: String },
  { name: 'changelog', alias: 'l', type: String },
];

const cliArgs = commandLineArgs(optionDefinitions);

const appPaths = {};
appPaths.root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
appPaths.mainPackage = path.join(appPaths.root, "./package.json");
appPaths.electronPackage = path.join(appPaths.root, "./electron/package.json");
appPaths.constants = path.join(appPaths.root, "./src/Constants.ts");
appPaths.sphinxConf = path.join(appPaths.root, "./doc/source/conf.py");
appPaths.sphinxChangelog = path.join(appPaths.root, "./doc/source/changelog.rst");

async function main(version, versionNumber, changelog) {
  console.log(`Updating app files to match v${version}`);

  const [ major, minor ]= version.split('.');
  const shortVersion = `${major}.${minor}`;
  const modifiedMainPackage = (await fs.readFile(appPaths.mainPackage, 'utf8')).
    replace(/(^\s*"version":\s)"(.*)",$/m, `$1"${version}",`);
  await fs.writeFile(appPaths.mainPackage, modifiedMainPackage);
  console.log(`Modified ${appPaths.mainPackage}`);

  const modifiedElectronPackage = (await fs.readFile(appPaths.electronPackage, 'utf8')).
    replace(/(^\s*"version":\s)"(.*)",$/m, `$1"${version}",`);
  await fs.writeFile(appPaths.electronPackage, modifiedElectronPackage);
  console.log(`Modified ${appPaths.electronPackage}`);

  let modifiedConstants = (await fs.readFile(appPaths.constants, 'utf8')).
    replace(/(^\s*?VersionString:\s)"(.*)",/m, `$1"${version}",`);
  modifiedConstants = modifiedConstants.
    replace(/(^\s*?VersionNumber:\s)(.*),/m, `$1${versionNumber},`);

  if (changelog.trim() !== '') {
    let htmlChangelog = '';
    try {
      htmlChangelog = await transform(changelog, 'html');
      console.log('Converted markdown changelog to html')
    } catch (error) {
      console.error(error);
    }

    const paddedChangelog = htmlChangelog.split('\n').
      map((line) => (line.trim() !== '' ? '    ' + line : '')).
      join('\n').replaceAll('`', '\\`');

    modifiedConstants = modifiedConstants.
      replace(/(^\s*?LatestUpdate:\s`\n)(.*)`,$/ms, `$1${paddedChangelog}\n\`,`);
  }
  await fs.writeFile(appPaths.constants, modifiedConstants);
  console.log(`Modified ${appPaths.constants}`);

  let modifiedSphinxConfig = (await fs.readFile(appPaths.sphinxConf, 'utf8')).
    replace(/(^version = ')(.*)'$/m, `$1${shortVersion}'`);
  modifiedSphinxConfig = modifiedSphinxConfig.
    replace(/(^release = ')(.*)'$/m, `$1${version}'`);
  await fs.writeFile(appPaths.sphinxConf, modifiedSphinxConfig);
  console.log(`Modified ${appPaths.sphinxConf}`);

  if (changelog.trim() !== '') {
    let modifiedSphinxChangelog = await fs.readFile(appPaths.sphinxChangelog, 'utf8');
    const lines = modifiedSphinxChangelog.split('\n');
    let rstChangelog = '';
    try {
      rstChangelog = await transform(changelog, 'rst');
      console.log('Converted markdown changelog to rst')
    } catch (error) {
      console.error(error);
    }

    lines.splice(5, 0, rstChangelog);
    modifiedSphinxChangelog = lines.join('\n');
    await fs.writeFile(appPaths.sphinxChangelog, modifiedSphinxChangelog);
    console.log(`Modified ${appPaths.sphinxChangelog}`);
  }
}

async function transform(markdown, format) {
  return new Promise((resolve, reject) => {
    const args = `-f markdown -t ${format}`;
    pandoc(markdown, args, (error, rst) => {
      if (error) {
        reject(error);
      } else {
        resolve(rst);
      }
    });
  });
}

async function getChangelog() {
  // Read from stdin
  // https://stackoverflow.com/a/56012724
  try {
    return readFileSync(0, 'utf-8').replace('\r\n', '\n');
  } catch (error) {
    return '';
  }
}

getChangelog().then((changes) => {
  main(cliArgs.version, cliArgs.versionNumber, changes).then(() => console.log('Done'));
})

