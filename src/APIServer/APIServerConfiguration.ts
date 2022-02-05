
interface APIServerConfig {
  authToken: string;
  autostart: boolean;
}

class APIServerConfiguration {
  _config:APIServerConfig = {
    authToken: "",
    autostart: false,
  }

  constructor() {
    const localconfig = JSON.parse(localStorage.getItem("_APIServer")|| "{}");
    this._config = Object.assign(this._config, localconfig)
  }

  get autostart():boolean {
    return this._config.autostart;
  }
  set autostart(val) {
    this._config.autostart = val; 
    this.save();
  }
  get authToken():string {
    return this._config.authToken;
  }
  set authToken(val) {
    this._config.authToken = val;
    this.save();
  }
  save = ():void => {
    localStorage.setItem("_APIServer", JSON.stringify(this._config));
  }
}



export default new APIServerConfiguration();