/* eslint-disable @typescript-eslint/no-var-requires */
const crypto = require("crypto");
const http = require("http");

const Config = require("electron-config");
const log = require("electron-log");
const config = new Config();

let server;
let window;

async function initialize(win) {
  window = win;
  server = http.createServer(async function (req, res) {
    let body = "";
    res.setHeader("Content-Type", "application/json");

    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });

    req.on("end", async () => {
      const providedToken = req.headers?.authorization?.replace("Bearer ", "") ?? "";
      const isValid = providedToken === getAuthenticationToken();
      if (isValid) {
        log.debug("Valid authentication token");
      } else {
        log.log("Invalid authentication token");
        res.writeHead(401);

        res.end(
          JSON.stringify({
            success: false,
            msg: "Invalid authentication token",
          }),
        );
        return;
      }

      let data;
      try {
        data = JSON.parse(body);
      } catch (error) {
        log.warn(`Invalid body data`);
        res.writeHead(400);
        res.end(
          JSON.stringify({
            success: false,
            msg: "Invalid body data",
          }),
        );

        return;
      }

      let result;
      switch (req.method) {
        // Request files
        case "GET":
          result = await window.webContents.executeJavaScript(`document.getFiles()`);
          break;

        // Create or update files
        // Support POST for VScode implementation
        case "POST":
        case "PUT":
          if (!data) {
            log.warn(`Invalid script update request - No data`);
            res.writeHead(400);
            res.end(
              JSON.stringify({
                success: false,
                msg: "Invalid script update request - No data",
              }),
            );
            return;
          }

          result = await window.webContents.executeJavaScript(`document.saveFile("${data.filename}", "${data.code}")`);
          break;

        // Delete files
        case "DELETE":
          result = await window.webContents.executeJavaScript(`document.deleteFile("${data.filename}")`);
          break;
      }

      if (!result.res) {
        //We've encountered an error
        res.writeHead(400);
        log.warn(`Api Server Error`, result.msg);
      }

      res.end(
        JSON.stringify({
          success: result.res,
          msg: result.msg,
          data: result.data,
        }),
      );
    });
  });

  const autostart = config.get("autostart", false);
  if (autostart) {
    try {
      await enable();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return Promise.resolve();
}

function enable() {
  if (isListening()) {
    log.warn("API server already listening");
    return Promise.resolve();
  }

  const port = config.get("port", 9990);
  const host = config.get("host", "127.0.0.1");
  log.log(`Starting http server on port ${port} - listening on ${host}`);

  // https://stackoverflow.com/a/62289870
  let startFinished = false;
  return new Promise((resolve, reject) => {
    server.listen(port, host, () => {
      if (!startFinished) {
        startFinished = true;
        resolve();
      }
    });
    server.once("error", (err) => {
      if (!startFinished) {
        startFinished = true;
        console.log("There was an error starting the server in the error listener:", err);
        reject(err);
      }
    });
  });
}

function disable() {
  if (!isListening()) {
    log.warn("API server not listening");
    return Promise.resolve();
  }

  log.log("Stopping http server");
  return server.close();
}

function toggleServer() {
  if (isListening()) {
    return disable();
  } else {
    return enable();
  }
}

function isListening() {
  return server?.listening ?? false;
}

function toggleAutostart() {
  const newValue = !isAutostart();
  config.set("autostart", newValue);
  log.log(`New autostart value is '${newValue}'`);
}

function isAutostart() {
  return config.get("autostart");
}

function getAuthenticationToken() {
  const token = config.get("token");
  if (token) return token;

  const newToken = generateToken();
  config.set("token", newToken);
  return newToken;
}

function generateToken() {
  const buffer = crypto.randomBytes(48);
  return buffer.toString("base64");
}

module.exports = {
  initialize,
  enable,
  disable,
  toggleServer,
  toggleAutostart,
  isAutostart,
  getAuthenticationToken,
  isListening,
};
