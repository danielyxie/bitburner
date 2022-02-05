
class APILogger {
    _enabled = false;
    log(...args: any[]):void {
        if (!this._enabled) {
            return;
        }

        console.log(...args);
    }
    error(...args: any[]):void {
        if (!this._enabled) {
            return;
        }
        console.error(...args);
    }
    enable = ():void => {
        this._enabled = true;
    }
    disable = ():void => {
        this._enabled = false;
    }
}
export default new APILogger();