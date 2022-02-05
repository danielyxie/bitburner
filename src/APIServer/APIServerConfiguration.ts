
interface APIServerConfig {
  authToken: string,
  autostart: boolean,
}

class APIServerConfiguration {
  _config:APIServerConfig = {
    authToken: "",
    autostart: false,
  }

  constructor() {
    let localconfig = JSON.parse(localStorage.getItem("_APIServer")|| "{}");
    this._config = Object.assign(this._config, localconfig)
  }

  get autostart() {
    return this._config.autostart;
  }
  set autostart(val) {
    this._config.autostart = val; 
    this.save();
  }
  get authToken() {
    return this._config.authToken;
  }
  set authToken(val) {
    this._config.authToken = val;
    this.save();
  }
  save = () => {
    localStorage.setItem("_APIServer", JSON.stringify(this._config));
  }
}



export default new APIServerConfiguration();