/* Settings.js */
let Settings = {
    CodeInstructionRunTime: 100,
    MaxLogCapacity:         50,
    MaxPortCapacity:        50,
    SuppressMessages:       false,
    SuppressFactionInvites: false,
}

function loadSettings(saveString) {
    Settings = JSON.parse(saveString);
}

function initSettings()  {
    Settings.CodeInstructionRunTime = 100;
    Settings.MaxLogCapacity = 50;
    Settings.MaxPortCapacity = 50;
    Settings.SuppressMessages = false;
    Settings.SuppressFactionInvites = false;
}

function setSettingsLabels() {
    var nsExecTime = document.getElementById("settingsNSExecTimeRangeValLabel");
    var nsLogLimit = document.getElementById("settingsNSLogRangeValLabel");
    var nsPortLimit = document.getElementById("settingsNSPortRangeValLabel");
    var suppressMsgs = document.getElementById("settingsSuppressMessages");
    var suppressFactionInv = document.getElementById("settingsSuppressFactionInvites")

    //Initialize values on labels
    nsExecTime.innerHTML = Settings.CodeInstructionRunTime + "ms";
    nsLogLimit.innerHTML = Settings.MaxLogCapacity;
    nsPortLimit.innerHTML = Settings.MaxPortCapacity;
    suppressMsgs.checked = Settings.SuppressMessages;
    suppressFactionInv.checked = Settings.SuppressFactionInvites;

    //Set handlers for when input changes
    document.getElementById("settingsNSExecTimeRangeVal").oninput = function() {
        nsExecTime.innerHTML = this.value + 'ms';
        Settings.CodeInstructionRunTime = this.value;
    };

    document.getElementById("settingsNSLogRangeVal").oninput = function() {
        nsLogLimit.innerHTML = this.value;
        Settings.MaxLogCapacity = this.value;
    };

    document.getElementById("settingsNSPortRangeVal").oninput = function() {
        nsPortLimit.innerHTML = this.value;
        Settings.MaxPortCapacity = this.value;
    };

    document.getElementById("settingsSuppressMessages").onclick = function() {
        Settings.SuppressMessages = this.checked;
    };

    document.getElementById("settingsSuppressFactionInvites").onclick = function() {
        Settings.SuppressFactionInvites = this.checked;
    };
}

export {Settings, initSettings, setSettingsLabels, loadSettings};
