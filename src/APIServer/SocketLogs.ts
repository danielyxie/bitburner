
class APILogger {
    _enabled:boolean = false;
    log(...args: any[]) {
        if (!this._enabled) {
            return;
        }

        console.log(...args);
    }
    error(...args: any[]) {
        if (!this._enabled) {
            return;
        }
    }
    enable = () => {
        this._enabled = true;
    }
    disable = () => {
        this._enabled = false;
    }
}
export default new APILogger();