import {Engine} from "./engine";

/* Settings.js */
let Settings = {
    CodeInstructionRunTime:              25,
    MaxLogCapacity:                      50,
    MaxPortCapacity:                     50,
    SuppressMessages:                    false,
    SuppressFactionInvites:              false,
    SuppressTravelConfirmation:          false,
    SuppressBuyAugmentationConfirmation: false,
    AutosaveInterval:                    60,
    DisableHotkeys:                      false,
    ThemeHighlightColor:                 "#ffffff",
    ThemeFontColor:                      "#66ff33",
    ThemeBackgroundColor:                "#000000",
    EditorTheme:                         "Monokai",
    EditorKeybinding:                    "ace",
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
    Settings.SuppressTravelConfirmation = false;
    Settings.SuppressBuyAugmentationConfirmation = false;
    Settings.AutosaveInterval = 60;
    Settings.DisableHotkeys = false;
}

function setSettingsLabels() {
    var nsExecTime = document.getElementById("settingsNSExecTimeRangeValLabel");
    var nsLogLimit = document.getElementById("settingsNSLogRangeValLabel");
    var nsPortLimit = document.getElementById("settingsNSPortRangeValLabel");
    var suppressMsgs = document.getElementById("settingsSuppressMessages");
    var suppressFactionInv = document.getElementById("settingsSuppressFactionInvites")
    var suppressTravelConfirmation = document.getElementById("settingsSuppressTravelConfirmation");
    var suppressBuyAugmentationConfirmation = document.getElementById("settingsSuppressBuyAugmentationConfirmation");
    var autosaveInterval = document.getElementById("settingsAutosaveIntervalValLabel");
    var disableHotkeys = document.getElementById("settingsDisableHotkeys");

    //Initialize values on labels
    nsExecTime.innerHTML = Settings.CodeInstructionRunTime + "ms";
    nsLogLimit.innerHTML = Settings.MaxLogCapacity;
    nsPortLimit.innerHTML = Settings.MaxPortCapacity;
    suppressMsgs.checked = Settings.SuppressMessages;
    suppressFactionInv.checked = Settings.SuppressFactionInvites;
    suppressTravelConfirmation.checked = Settings.SuppressTravelConfirmation;
    suppressBuyAugmentationConfirmation.checked = Settings.SuppressBuyAugmentationConfirmation;
    autosaveInterval.innerHTML = Settings.AutosaveInterval;
    disableHotkeys.checked = Settings.DisableHotkeys;

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

    suppressMsgs.onclick = function() {
        Settings.SuppressMessages = this.checked;
    };

    suppressFactionInv.onclick = function() {
        Settings.SuppressFactionInvites = this.checked;
    };

    suppressTravelConfirmation.onclick = function() {
        Settings.SuppressTravelConfirmation = this.checked;
    };

    suppressBuyAugmentationConfirmation.onclick = function() {
        Settings.SuppressBuyAugmentationConfirmation = this.checked;
        console.log('sup buy: '+Settings.SuppressBuyAugmentationConfirmation);
    };

    disableHotkeys.onclick = function() {
        Settings.DisableHotkeys = this.checked;
    }

    //Theme
    if (Settings.ThemeHighlightColor == null || Settings.ThemeFontColor == null || Settings.ThemeBackgroundColor == null) {
        console.log("ERROR: Cannot find Theme Settings");
        return;
    }
    if (/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(Settings.ThemeHighlightColor) &&
        /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(Settings.ThemeFontColor) &&
        /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(Settings.ThemeBackgroundColor)) {
        document.body.style.setProperty('--my-highlight-color', Settings.ThemeHighlightColor);
        document.body.style.setProperty('--my-font-color', Settings.ThemeFontColor);
        document.body.style.setProperty('--my-background-color', Settings.ThemeBackgroundColor);
    }
}

export {Settings, initSettings, setSettingsLabels, loadSettings};
