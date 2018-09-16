import {Engine} from "../engine";
import {Settings} from "../Settings";

import {numeralWrapper} from "./numeralFormat";


function setSettingsLabels() {
    var nsExecTime = document.getElementById("settingsNSExecTimeRangeValLabel");
    var nsLogLimit = document.getElementById("settingsNSLogRangeValLabel");
    var nsPortLimit = document.getElementById("settingsNSPortRangeValLabel");
    var suppressMsgs = document.getElementById("settingsSuppressMessages");
    var suppressFactionInv = document.getElementById("settingsSuppressFactionInvites")
    var suppressTravelConfirmation = document.getElementById("settingsSuppressTravelConfirmation");
    var suppressBuyAugmentationConfirmation = document.getElementById("settingsSuppressBuyAugmentationConfirmation");
    var suppressHospitalizationPopup = document.getElementById("settingsSuppressHospitalizationPopup");
    var autosaveInterval = document.getElementById("settingsAutosaveIntervalValLabel");
    var disableHotkeys = document.getElementById("settingsDisableHotkeys");
    var locale = document.getElementById("settingsLocale");

    //Initialize values on labels
    nsExecTime.innerHTML = Settings.CodeInstructionRunTime + "ms";
    nsLogLimit.innerHTML = Settings.MaxLogCapacity;
    nsPortLimit.innerHTML = Settings.MaxPortCapacity;
    suppressMsgs.checked = Settings.SuppressMessages;
    suppressFactionInv.checked = Settings.SuppressFactionInvites;
    suppressTravelConfirmation.checked = Settings.SuppressTravelConfirmation;
    suppressBuyAugmentationConfirmation.checked = Settings.SuppressBuyAugmentationConfirmation;
    suppressHospitalizationPopup.checked = Settings.SuppressHospitalizationPopup;
    autosaveInterval.innerHTML = Settings.AutosaveInterval;
    disableHotkeys.checked = Settings.DisableHotkeys;
    locale.value = Settings.Locale;
    numeralWrapper.updateLocale(Settings.Locale); //Initialize locale

    //Set handlers for when input changes for sliders
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

    //Set handlers for when settings change on checkboxes
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
    };

    suppressHospitalizationPopup.onclick = function() {
        Settings.SuppressHospitalizationPopup = this.checked;
    }

    disableHotkeys.onclick = function() {
        Settings.DisableHotkeys = this.checked;
    }

    //Locale selector
    locale.onchange = function() {
        if (!numeralWrapper.updateLocale(locale.value)) {
            console.warn(`Invalid locale for numeral: ${locale.value}`);

            let defaultValue = 'en';
            Settings.Locale = defaultValue;
            locale.value = defaultValue;
            return;
        }
        Settings.Locale = locale.value;
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

export { setSettingsLabels };
