#!node

/*
This ultimately is derived from https://github.com/daton89-topperblues/node-engine-strict
Since this needs to run *before* any dependencies are installed, it must be inlined here.
*/
const path = require("path");
const exec = require("child_process").exec;
const semver = require("./semver");

const getPackageJson = () => new Promise((resolve, reject) => {
    try {
        /* eslint-disable-next-line global-require */
        resolve(require(path.resolve(process.cwd(), "package.json")));
    } catch (error) {
        reject(error);
    }
});

const getEngines = (data) => new Promise((resolve, reject) => {
    let versions = null;

    if (data.engines) {
        versions = data.engines;
    }

    if (versions) {
        resolve(versions);
    } else {
        reject("Missing or improper 'engines' property in 'package.json'");
    }
});

const checkNpmVersion = (engines) => new Promise((resolve, reject) => {
    exec("npm -v", (error, stdout, stderr) => {
        if (error) {
            reject(`Unable to find NPM version\n${stderr}`);
        }

        const npmVersion = stdout.trim();
        const engineVersion = engines.npm || ">=0";

        if (semver.satisfies(npmVersion, engineVersion)) {
            resolve();
        } else {
            reject(`Incorrect npm version\n'package.json' specifies "${engineVersion}", you are currently running "${npmVersion}".`);
        }
    });
});

const checkNodeVersion = (engines) => new Promise((resolve, reject) => {
    const nodeVersion = process.version.substring(1);

    if (semver.satisfies(nodeVersion, engines.node)) {
        resolve(engines);
    } else {
        reject(`Incorrect node version\n'package.json' specifies "${engines.node}", you are currently running "${process.version}".`);
    }
});

getPackageJson()
    .then(getEngines)
    .then(checkNodeVersion)
    .then(checkNpmVersion)
    .then(() => true, (error) => {
        // Specifically disable these as the error message gets lost in the normal unhandled output.
        /* eslint-disable no-console, no-process-exit */
        console.error(error);
        process.exit(1);
    });
