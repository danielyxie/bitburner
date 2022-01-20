/* eslint-disable @typescript-eslint/no-var-requires */
const { app, ipcMain } = require("electron");

const zlib = require("zlib");
const path = require("path");
const fs = require("fs/promises");
const { promisify } = require("util");
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const greenworks = require("../lib/greenworks");
const log = require("electron-log");
const Config = require("electron-config");
const config = new Config();

const utils = require("./utils");

const steamSaveName = 'bitburner-save.json.gz';

// https://stackoverflow.com/a/69418940
const dirSize = async (directory) => {
  const files = await fs.readdir(directory);
  const stats = files.map(file => fs.stat(path.join(directory, file)));
  return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0);
}

const getDirFileStats = async (directory) => {
  const files = await fs.readdir(directory);
  const stats = files.map((f) => {
    const file = path.join(directory, f);
    return fs.stat(file).then((stat) => ({ file, stat }));
  });
  const data = (await Promise.all(stats));
  return data;
};

const getNewestFile = async (directory) => {
  const data = await getDirFileStats(directory)
  return data.sort((a, b) => b.stat.mtime.getTime() - a.stat.mtime.getTime())[0];
};

async function prepareSaveFolders(window) {
  const rootFolder = await getSaveFolder(window, true);
  const currentFolder = await getSaveFolder(window);
  await prepareFolders(rootFolder, currentFolder);
}

async function prepareFolders(...folders) {
  for (const folder of folders) {
    try {
      // Making sure the folder exists
      // eslint-disable-next-line no-await-in-loop
      await fs.stat(folder);
    } catch (error) {
      if (error.code === 'ENOENT') {
        log.warn(`'${folder}' not found, creating it...`);
        // eslint-disable-next-line no-await-in-loop
        await fs.mkdir(folder);
      } else {
        log.error(error);
      }
    }
  }
}

async function getFolderSizeInBytes(saveFolder) {
  try {
    return await dirSize(saveFolder);
  } catch (error) {
    log.error(error);
  }
}

function setAutosaveConfig(value) {
  config.set("autosave-enabled", value);
}

function isAutosaveEnabled() {
  return config.get('autosave-enabled', true);
}

function setSaveCompressionConfig(value) {
  config.set("save-compression-enabled", value);
}

function isSaveCompressionEnabled() {
  return config.get('save-compression-enabled', true);
}

function setCloudEnabledConfig(value) {
  config.set("cloud-enabled", value);
}

async function getSaveFolder(window, root = false) {
  if (root) return path.join(app.getPath("userData"), `/saves`);
  const identifier = window.gameInfo?.player?.identifier ?? "";
  return path.join(app.getPath("userData"), `/saves`, `/${identifier}`);
}

function isCloudEnabled() {
  // If the Steam API could not be initialized on game start, we'll abort this.
  if (global.greenworksError) return false;

  // If the user disables it in Steam there's nothing we can do
  if (!greenworks.isCloudEnabledForUser()) return false;

  // Let's check the config file to see if it's been overriden
  const enabledInConf = config.get("cloud-enabled", true);
  if (!enabledInConf) return false;

  const isAppEnabled = greenworks.isCloudEnabled();
  if (!isAppEnabled) greenworks.enableCloud(true);

  return true;
}

function deleteSteamCloudSave() {
  return new Promise((resolve, reject) => {
    greenworks.deleteFile(steamSaveName, resolve, reject);
  });
}

function saveCloudFile(name, content) {
  return new Promise((resolve, reject) => {
    greenworks.saveTextToFile(name, content, resolve, reject);
  })
}

function getCloudFile() {
  return new Promise((resolve, reject) => {
    greenworks.readTextFromFile(steamSaveName, resolve, reject);
  });
}

async function getSteamCloudQuota() {
  return new Promise((resolve, reject) => {
    greenworks.getCloudQuota(resolve, reject)
  });
}

async function pushGameSaveToSteamCloud(base64save) {
  if (!isCloudEnabled) return Promise.reject("Steam Cloud is not Enabled");

  try {
    // We have a limit of one file only
    await deleteSteamCloudSave();
  } catch (error) {
    log.error(error);
  }

  // Let's decode the base64 string so GZIP is more efficient.
  const buffer = Buffer.from(base64save, 'base64');
  const compressedBuffer = await gzip(buffer);
  // We can't use utf8 for some reason, steamworks is unhappy.
  const content = compressedBuffer.toString('base64');
  log.debug(`Uncompressed: ${base64save.length} bytes`);
  log.debug(`Compressed: ${content.length} bytes`);
  log.debug(`Saving to Steam Cloud as ${steamSaveName}`);

  try {
    await saveCloudFile(steamSaveName, content);
  } catch (error) {
    log.error(errror);
  }
}

async function getSteamCloudSaveString() {
  if (!isCloudEnabled) return Promise.reject("Steam Cloud is not Enabled");
  log.debug(`Fetching ${steamSaveName} in Steam Cloud`);
  const cloudString = await getCloudFile();
  const gzippedBase64Buffer = Buffer.from(cloudString, 'base64');
  const uncompressedBuffer = await gunzip(gzippedBase64Buffer);
  const content = uncompressedBuffer.toString('base64');
  log.debug(`Compressed: ${cloudString.length} bytes`);
  log.debug(`Uncompressed: ${content.length} bytes`);
  return content;
}

async function saveGameToDisk(window, saveData, isAutomatic = false) {
  const currentFolder = await getSaveFolder(window);
  let saveFolderSizeBytes = await getFolderSizeInBytes(currentFolder);
  const maxFolderSizeBytes = config.get('autosave-quota', 1e8); // 100Mb per playerIndentifier
  const remainingSpaceBytes = maxFolderSizeBytes - saveFolderSizeBytes;
  log.debug(`Folder Usage: ${saveFolderSizeBytes} bytes`);
  log.debug(`Folder Capacity: ${maxFolderSizeBytes} bytes`);
  log.debug(`Remaining: ${remainingSpaceBytes} bytes (${(saveFolderSizeBytes / maxFolderSizeBytes * 100).toFixed(2)}% used)`)
  const shouldCompress = isSaveCompressionEnabled();
  const fileName = isAutomatic
    ? saveData.fileName.replace(".json", "__autosave.json")
    : saveData.fileName
  const file = path.join(currentFolder, fileName + (shouldCompress ? ".gz" : ""));
  try {
    let saveContent = saveData.save;
    if (shouldCompress) {
      // Let's decode the base64 string so GZIP is more efficient.
      const buffer = Buffer.from(saveContent, 'base64').toString('utf8');
      saveContent = await gzip(buffer);
    }
    await fs.writeFile(file, saveContent, 'utf8');
    log.debug(`Saved Game to '${file}'`);
    log.debug(`Save Size: ${saveContent.length} bytes`);
  } catch (error) {
    log.error(error);
  }

  const fileStats = await getDirFileStats(currentFolder);
  const oldestFiles = fileStats
    .sort((a, b) => a.stat.mtime.getTime() - b.stat.mtime.getTime())
    .map(f => f.file).filter(f => f !== file);
  while (saveFolderSizeBytes > maxFolderSizeBytes && oldestFiles.length > 0) {
    const fileToRemove = oldestFiles.shift();
    log.info(`Over Quota -> Removing "${fileToRemove}"`);
    try {
      // eslint-disable-next-line no-await-in-loop
      await fs.unlink(fileToRemove);
    } catch (error) {
      log.error(error);
    }
    // eslint-disable-next-line no-await-in-loop
    saveFolderSizeBytes = await getFolderSizeInBytes(currentFolder);
    log.debug(`Save Folder: ${saveFolderSizeBytes} bytes`);
    log.debug(`Remaining: ${maxFolderSizeBytes - saveFolderSizeBytes} bytes (${(saveFolderSizeBytes / maxFolderSizeBytes * 100).toFixed(2)}% used)`)
  }

  return file;
}

async function loadLastFromDisk() {
  const folder = await getSaveFolder();
  const last = await getNewestFile(folder);
  log.debug(`Last modified file: "${last.file}" (${last.stat.mtime.toLocaleString()})`);
  return loadFileFromDisk(last.file);
}

async function loadFileFromDisk(path) {
  const buffer = await fs.readFile(path);
  let content;
  if (path.endsWith('.gz')) {
    const uncompressedBuffer = await gunzip(buffer);
    content = uncompressedBuffer.toString('base64');
    log.debug(`Uncompressed file content (new size: ${content.length} bytes)`);
  } else {
    content = buffer.toString('utf8');
    log.debug(`Loaded file with ${content.length} bytes`)
  }
  return content;
}

function getSaveInformation(window, save) {
  return new Promise((resolve) => {
    ipcMain.once('get-save-info-response', async (event, data) => {
      resolve(data);
    });
    window.webContents.send('get-save-info-request', save);
  });
}

function enableAutosaveInterval(window) {
  const interval = 1000 * 60 * config.get("autosave-interval-mins", 15);
  if (window.autosaveInterval) {
    log.warn("Autosave interval was already defined");
    return;
  }

  function autosaveHandler() {
    if (!isAutosaveEnabled()) return;
    ipcMain.once('get-save-data-response', async (event, arg) => {
      try {
        const file = await saveGameToDisk(window, arg.save, arg.fileName);
        utils.writeToast(window, `Saved Game to '${file.replaceAll('\\', '\\\\')}'!`, "success", 5000);
      } catch (error) {
        log.error(error);
        utils.writeToast(window, `Could not save to disk`, "error", 5000);
      }
    });
    window.webContents.send('get-save-data-request');
  }

  log.info("Initializing auto-save interval");
  window.autosaveInterval = setInterval(autosaveHandler, interval);
}

function disableAutosaveInterval(window) {
  if (!window.autosaveInterval) {
    log.warn("Autosave interval could not be found");
    return;
  }

  log.info("Disabling auto-save interval");
  clearInterval(window.autosaveInterval);
}

function importIfRequired(window) {
  log.info(window.gameInfo);
}

module.exports = {
  pushGameSaveToSteamCloud, getSteamCloudSaveString, getSteamCloudQuota,
  saveGameToDisk, loadLastFromDisk, loadFileFromDisk, getSaveFolder,
  enableAutosaveInterval, disableAutosaveInterval,
  isCloudEnabled, setCloudEnabledConfig,
  isAutosaveEnabled, setAutosaveConfig,
  isSaveCompressionEnabled, setSaveCompressionConfig,
  importIfRequired, getSaveInformation, prepareSaveFolders,
 };
