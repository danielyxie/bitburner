/* Settings.js */
Settings = {
    CodeInstructionRunTime: 100,
    suppressMessages:       false,
    MaxLogCapacity:         50,
    MaxPortCapacity:        50,
}

function initSettings()  {
    Settings.CodeInstructionRunTime = 100;
    Settings.suppressMessages = false;
    Settings.MaxLogCapacity = 50;
    Settings.MaxPortCapacity = 50;
}

function setSettingsLabels() {
    document.getElementById("settingsNSExecTimeRangeValLabel").innerHTML
        = Settings.CodeInstructionRunTime + "ms";
    document.getElementById("settingsNSLogRangeValLabel").innerHTML
        = Settings.MaxLogCapacity;
    document.getElementById("settingsNSPortRangeValLabel").innerHTML
        = Settings.MaxPortCapacity;
}
