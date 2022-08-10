class RemoteFileAPILogger {
  _enabled = true;
  _prefix = "[RFA]";
  _error_prefix = "[RFA-ERROR]";

  constructor(enabled: boolean) {
    this._enabled = enabled;
  }

  public error(...message: any[]): void {
    if (this._enabled) console.error(this._error_prefix, ...message);
  }

  public log(...message: any[]): void {
    if (this._enabled) console.log(this._prefix, ...message);
  }

  public disable(): void {
    this._enabled = false;
  }

  public enable(): void {
    this._enabled = true;
  }
}

export const RFALogger = new RemoteFileAPILogger(true);
