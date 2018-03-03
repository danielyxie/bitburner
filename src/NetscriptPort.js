import {Settings} from          "./Settings.js";

function NetscriptPort() {
    this.data = [];
}

NetscriptPort.prototype.write = function(data) {
    this.data.push(data);
    if (this.data.length > Settings.MaxPortCapacity) {
        return this.data.shift();
    }
    return null;
}

NetscriptPort.prototype.tryWrite = function(data) {
    if (this.data.length >= Settings.MaxPortCapacity) {
        return false;
    }
    this.data.push(data);
    return true;
}

NetscriptPort.prototype.read = function() {
    if (this.data.length === 0) {
        return "NULL PORT DATA";
    }
    return this.data.shift();
}

NetscriptPort.prototype.peek = function() {
    if (this.data.length === 0) {
        return "NULL PORT DATA";
    } else {
        var foo = this.data.slice();
        return foo[0];
    }
}

NetscriptPort.prototype.full = function() {
    return this.data.length == Settings.MaxPortCapacity;
}

NetscriptPort.prototype.empty = function() {
    return this.data.length === 0;
}

NetscriptPort.prototype.clear = function() {
    this.data.length = 0;
}

export {NetscriptPort};
