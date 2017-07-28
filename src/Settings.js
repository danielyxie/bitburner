/* Settings.js */
Settings = {
    CodeInstructionRunTime: 100,
    MaxLogCapacity:         50,
    MaxPortCapacity:        50,
    SuppressMessages:       false,
    SuppressFactionInvites: false,
}

function initSettings()  {
    Settings.CodeInstructionRunTime = 100;
    Settings.MaxLogCapacity = 50;
    Settings.MaxPortCapacity = 50;
    Settings.SuppressMessages = false;
    Settings.SuppressFactionInvites = false;
}

function setSettingsLabels() {
    document.getElementById("settingsNSExecTimeRangeValLabel").innerHTML
        = Settings.CodeInstructionRunTime + "ms";
    document.getElementById("settingsNSLogRangeValLabel").innerHTML
        = Settings.MaxLogCapacity;
    document.getElementById("settingsNSPortRangeValLabel").innerHTML
        = Settings.MaxPortCapacity;
    document.getElementById("settingsSuppressMessages").checked
        = Settings.SuppressMessages;
    document.getElementById("settingsSuppressFactionInvites").checked
        = Settings.SuppressFactionInvites;
}
