/* Holds IP of Special Servers */
function SpecialServerIpsMap() {
}

SpecialServerIpsMap.prototype.addIp = function(name, ip) {
    this[name] = ip;
}

SpecialServerIpsMap.prototype.toJSON = function() {
    return Generic_toJSON("SpecialServerIpsMap", this);
}

SpecialServerIpsMap.fromJSON = function(value) {
    return Generic_fromJSON(SpecialServerIpsMap, value.data);
}

Reviver.constructors.SpecialServerIpsMap = SpecialServerIpsMap();

SpecialServerIps = null;