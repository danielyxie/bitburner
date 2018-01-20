import {Engine} from "./engine.js";

/* Settings.js */
let Settings = {
    CodeInstructionRunTime: 50,
    MaxLogCapacity:         50,
    MaxPortCapacity:        50,
    SuppressMessages:       false,
    SuppressFactionInvites: false,
    AutosaveInterval:       60,
}

function loadSettings(saveString) {
    Settings = JSON.parse(saveString);
}

function initSettings()  {
    Settings.CodeInstructionRunTime = 50;
    Settings.MaxLogCapacity = 50;
    Settings.MaxPortCapacity = 50;
    Settings.SuppressMessages = false;
    Settings.SuppressFactionInvites = false;
    Settings.AutosaveInterval = 60;
}

function setSettingsLabels() {
    var nsExecTime = document.getElementById("settingsNSExecTimeRangeValLabel");
    var nsLogLimit = document.getElementById("settingsNSLogRangeValLabel");
    var nsPortLimit = document.getElementById("settingsNSPortRangeValLabel");
    var suppressMsgs = document.getElementById("settingsSuppressMessages");
    var suppressFactionInv = document.getElementById("settingsSuppressFactionInvites")
    var autosaveInterval = document.getElementById("settingsAutosaveIntervalValLabel");

    //Initialize values on labels
    nsExecTime.innerHTML = Settings.CodeInstructionRunTime + "ms";
    nsLogLimit.innerHTML = Settings.MaxLogCapacity;
    nsPortLimit.innerHTML = Settings.MaxPortCapacity;
    suppressMsgs.checked = Settings.SuppressMessages;
    suppressFactionInv.checked = Settings.SuppressFactionInvites;
    autosaveInterval.innerHTML = Settings.AutosaveInterval;

    //Set handlers for when input changes
    var nsExecTimeInput = document.getElementById("settingsNSExecTimeRangeVal");
    var nsLogRangeInput = document.getElementById("settingsNSLogRangeVal");
    var nsPortRangeInput = document.getElementById("settingsNSPortRangeVal");
    var nsAutosaveIntervalInput = document.getElementById("settingsAutosaveIntervalVal");
    nsExecTimeInput.value = Settings.CodeInstructionRunTime;
    nsLogRangeInput.value = Settings.MaxLogCapacity;
    nsPortRangeInput.value = Settings.MaxPortCapacity;
    nsAutosaveIntervalInput.value = Settings.AutosaveInterval;

    nsExecTimeInput.oninput = function() {
        nsExecTime.innerHTML = this.value + 'ms';
        Settings.CodeInstructionRunTime = this.value;
    };

    nsLogRangeInput.oninput = function() {
        nsLogLimit.innerHTML = this.value;
        Settings.MaxLogCapacity = this.value;
    };

    nsPortRangeInput.oninput = function() {
        nsPortLimit.innerHTML = this.value;
        Settings.MaxPortCapacity = this.value;
    };

    nsAutosaveIntervalInput.oninput = function() {
        autosaveInterval.innerHTML = this.value;
        Settings.AutosaveInterval = Number(this.value);
        if (Number(this.value) === 0) {
            Engine.Counters.autoSaveCounter = Infinity;
        } else {
            Engine.Counters.autoSaveCounter = Number(this.value) * 5;
        }
    };

    document.getElementById("settingsSuppressMessages").onclick = function() {
        Settings.SuppressMessages = this.checked;
    };

    document.getElementById("settingsSuppressFactionInvites").onclick = function() {
        Settings.SuppressFactionInvites = this.checked;
    };
}

export {Settings, initSettings, setSettingsLabels, loadSettings};
