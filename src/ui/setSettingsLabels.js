import { Engine } from "../engine";
import { Settings } from "../Settings/Settings";
import { numeralWrapper } from "./numeralFormat";

function setSettingsLabels() {
  function setAutosaveLabel(elem) {
    if (Settings.AutosaveInterval === 0) {
      elem.innerHTML = `disabled`;
    } else {
      elem.innerHTML = `every ${Settings.AutosaveInterval}s`;
    }
  }

  const nsExecTime = document.getElementById("settingsNSExecTimeRangeValLabel");
  const nsLogLimit = document.getElementById("settingsNSLogRangeValLabel");
  const nsPortLimit = document.getElementById("settingsNSPortRangeValLabel");
  const suppressMsgs = document.getElementById("settingsSuppressMessages");
  const suppressFactionInv = document.getElementById(
    "settingsSuppressFactionInvites",
  );
  const suppressTravelConfirmation = document.getElementById(
    "settingsSuppressTravelConfirmation",
  );
  const suppressBuyAugmentationConfirmation = document.getElementById(
    "settingsSuppressBuyAugmentationConfirmation",
  );
  const suppressHospitalizationPopup = document.getElementById(
    "settingsSuppressHospitalizationPopup",
  );
  const suppressBladeburnerPopup = document.getElementById(
    "settingsSuppressBladeburnerPopup",
  );
  const autosaveInterval = document.getElementById(
    "settingsAutosaveIntervalValLabel",
  );
  const disableHotkeys = document.getElementById("settingsDisableHotkeys");
  const disableASCIIArt = document.getElementById("settingsDisableASCIIArt");
  const disableTextEffects = document.getElementById(
    "settingsDisableTextEffects",
  );
  const locale = document.getElementById("settingsLocale");

  //Initialize values on labels
  nsExecTime.innerHTML = Settings.CodeInstructionRunTime + "ms";
  nsLogLimit.innerHTML = Settings.MaxLogCapacity;
  nsPortLimit.innerHTML = Settings.MaxPortCapacity;
  suppressMsgs.checked = Settings.SuppressMessages;
  suppressFactionInv.checked = Settings.SuppressFactionInvites;
  suppressTravelConfirmation.checked = Settings.SuppressTravelConfirmation;
  suppressBuyAugmentationConfirmation.checked =
    Settings.SuppressBuyAugmentationConfirmation;
  suppressHospitalizationPopup.checked = Settings.SuppressHospitalizationPopup;
  suppressBladeburnerPopup.checked = Settings.SuppressBladeburnerPopup;
  setAutosaveLabel(autosaveInterval);
  disableHotkeys.checked = Settings.DisableHotkeys;
  disableASCIIArt.checked = Settings.CityListView;
  disableTextEffects.checked = Settings.DisableTextEffects;
  locale.value = Settings.Locale;
  numeralWrapper.updateLocale(Settings.Locale); //Initialize locale

  //Set handlers for when input changes for sliders
  const nsExecTimeInput = document.getElementById("settingsNSExecTimeRangeVal");
  const nsLogRangeInput = document.getElementById("settingsNSLogRangeVal");
  const nsPortRangeInput = document.getElementById("settingsNSPortRangeVal");
  const nsAutosaveIntervalInput = document.getElementById(
    "settingsAutosaveIntervalVal",
  );
  nsExecTimeInput.value = Settings.CodeInstructionRunTime;
  nsLogRangeInput.value = Settings.MaxLogCapacity;
  nsPortRangeInput.value = Settings.MaxPortCapacity;
  nsAutosaveIntervalInput.value = Settings.AutosaveInterval;

  nsExecTimeInput.oninput = function () {
    nsExecTime.innerHTML = this.value + "ms";
    Settings.CodeInstructionRunTime = this.value;
  };

  nsLogRangeInput.oninput = function () {
    nsLogLimit.innerHTML = this.value;
    Settings.MaxLogCapacity = this.value;
  };

  nsPortRangeInput.oninput = function () {
    nsPortLimit.innerHTML = this.value;
    Settings.MaxPortCapacity = this.value;
  };

  nsAutosaveIntervalInput.oninput = function () {
    Settings.AutosaveInterval = Number(this.value);
    setAutosaveLabel(autosaveInterval);
    if (Number(this.value) === 0) {
      Engine.Counters.autoSaveCounter = Infinity;
    } else {
      Engine.Counters.autoSaveCounter = Number(this.value) * 5;
    }
  };

  //Set handlers for when settings change on checkboxes
  suppressMsgs.onclick = function () {
    Settings.SuppressMessages = this.checked;
  };

  suppressFactionInv.onclick = function () {
    Settings.SuppressFactionInvites = this.checked;
  };

  suppressTravelConfirmation.onclick = function () {
    Settings.SuppressTravelConfirmation = this.checked;
  };

  suppressBuyAugmentationConfirmation.onclick = function () {
    Settings.SuppressBuyAugmentationConfirmation = this.checked;
  };

  suppressHospitalizationPopup.onclick = function () {
    Settings.SuppressHospitalizationPopup = this.checked;
  };

  suppressBladeburnerPopup.onclick = function () {
    Settings.SuppressBladeburnerPopup = this.checked;
  };

  disableHotkeys.onclick = function () {
    Settings.DisableHotkeys = this.checked;
  };

  disableASCIIArt.onclick = function () {
    Settings.DisableASCIIArt = this.checked;
  };

  disableTextEffects.onclick = function () {
    Settings.DisableTextEffects = this.checked;
  };

  //Locale selector
  locale.onchange = function () {
    if (!numeralWrapper.updateLocale(locale.value)) {
      console.warn(`Invalid locale for numeral: ${locale.value}`);

      let defaultValue = "en";
      Settings.Locale = defaultValue;
      locale.value = defaultValue;
      return;
    }
    Settings.Locale = locale.value;
  };
}

export { setSettingsLabels };
