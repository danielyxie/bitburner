/* eslint-disable @typescript-eslint/no-var-requires */
const http = require("http");
const crypto = require("crypto");
const log = require("electron-log");
const Config = require("electron-config");
const config = new Config();

let server;
let window;

async function initialize(win) {
  window = win;
  server = http.createServer(async function (req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      const providedToken = req.headers?.authorization?.replace('Bearer ', '') ?? '';
      const isValid = providedToken === getAuthenticationToken();
      if (isValid) {
        log.debug('Valid authentication token');
      } else {
        log.log('Invalid authentication token');
        res.writeHead(401);
        res.write('Invalid authentication token');
        res.end();
        return;
      }

      let data;
      try {
        data = JSON.parse(body);
      } catch (error) {
        log.warn(`Invalid body data`);
        res.writeHead(400);
        res.write('Invalid body data');
        res.end();
        return;
      }

      if (data) {
        window.webContents.executeJavaScript(`document.saveFile("${data.filename}", "${data.code}")`).then((result) => {
          res.write(result);
          res.end();
        });
      }
    });
  });

  const autostart = config.get('autostart', false);
  if (autostart) {
    try {
      await enable()
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return Promise.resolve();
}


function enable() {
  if (isListening()) {
    log.warn('API server already listening');
    return Promise.resolve();
  }

  const port = config.get('port', 9990);
  log.log(`Starting http server on port ${port}`);

  // https://stackoverflow.com/a/62289870
  let startFinished = false;
  return new Promise((resolve, reject) => {
    server.listen(port, "127.0.0.1", () => {
      if (!startFinished) {
        startFinished = true;
        resolve();
      }
    });
    server.once('error', (err) => {
      if (!startFinished) {
        startFinished = true;
        console.log(
          'There was an error starting the server in the error listener:',
          err
        );
        reject(err);
      }
    });
  });
}

function disable() {
  if (!isListening()) {
    log.warn('API server not listening');
    return Promise.resolve();
  }

  log.log('Stopping http server');
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
  config.set('autostart', newValue);
  log.log(`New autostart value is '${newValue}'`);
}

function isAutostart() {
  return config.get('autostart');
}

function getAuthenticationToken() {
  const token = config.get('token');
  if (token) return token;

  const newToken = generateToken();
  config.set('token', newToken);
  return newToken;
}

function generateToken() {
  const buffer = crypto.randomBytes(48);
  return buffer.toString('base64')
}

module.exports = {
  initialize,
  enable, disable, toggleServer,
  toggleAutostart, isAutostart,
  getAuthenticationToken, isListening,
}
