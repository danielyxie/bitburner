import { ISelfInitializer, ISelfLoading } from "../types";
import { OwnedAugmentationsOrderSetting, PurchaseAugmentationsOrderSetting } from "./SettingEnums";

/**
 * Represents the default settings the player could customize.
 */
interface IDefaultSettings {
  /**
   * How often the game should autosave the player's progress, in seconds.
   */
  AutosaveInterval: number;

  /**
   * How many milliseconds between execution points for Netscript 1 statements.
   */
  CodeInstructionRunTime: number;

  /**
   * Render city as list of buttons.
   */
  DisableASCIIArt: boolean;

  /**
   * Whether global keyboard shortcuts should be recognized throughout the game.
   */
  DisableHotkeys: boolean;

  /**
   * Whether text effects such as corruption should be visible.
   */
  DisableTextEffects: boolean;

  /**
   * Locale used for display numbers
   */
  Locale: string;

  /**
   * Limit the number of log entries for each script being executed on each server.
   */
  MaxLogCapacity: number;

  /**
   * Limit how many entries can be written to a Netscript Port before entries start to get pushed out.
   */
  MaxPortCapacity: number;

  /**
   * Whether the player should be asked to confirm purchasing each and every augmentation.
   */
  SuppressBuyAugmentationConfirmation: boolean;

  /**
   * Whether the user should be prompted to join each faction via a dialog box.
   */
  SuppressFactionInvites: boolean;

  /**
   * Whether to show a popup message when player is hospitalized from taking too much damage
   */
  SuppressHospitalizationPopup: boolean;

  /**
   * Whether the user should be shown a dialog box whenever they receive a new message file.
   */
  SuppressMessages: boolean;

  /**
   * Whether the user should be asked to confirm travelling between cities.
   */
  SuppressTravelConfirmation: boolean;

  /**
   * Whether the user should be displayed a popup message when his Bladeburner actions are cancelled.
   */
  SuppressBladeburnerPopup: boolean;
}

/**
 * Represents all possible settings the player wants to customize to their play style.
 */
interface ISettings extends IDefaultSettings {
  /**
   * What order the player's owned Augmentations/Source Files should be displayed in
   */
  OwnedAugmentationsOrder: OwnedAugmentationsOrderSetting;

  /**
   * What order the Augmentations should be displayed in when purchasing from a Faction
   */
  PurchaseAugmentationsOrder: PurchaseAugmentationsOrderSetting;

  MonacoTheme: string;

  MonacoInsertSpaces: boolean;
}

const defaultSettings: IDefaultSettings = {
  AutosaveInterval: 60,
  CodeInstructionRunTime: 50,
  DisableASCIIArt: false,
  DisableHotkeys: false,
  DisableTextEffects: false,
  Locale: "en",
  MaxLogCapacity: 50,
  MaxPortCapacity: 50,
  SuppressBuyAugmentationConfirmation: false,
  SuppressFactionInvites: false,
  SuppressHospitalizationPopup: false,
  SuppressMessages: false,
  SuppressTravelConfirmation: false,
  SuppressBladeburnerPopup: false,
};

/**
 * The current options the player has customized to their play style.
 */
// tslint:disable-next-line:variable-name
export const Settings: ISettings & ISelfInitializer & ISelfLoading = {
  AutosaveInterval: defaultSettings.AutosaveInterval,
  CodeInstructionRunTime: 25,
  DisableASCIIArt: defaultSettings.DisableASCIIArt,
  DisableHotkeys: defaultSettings.DisableHotkeys,
  DisableTextEffects: defaultSettings.DisableTextEffects,
  Locale: "en",
  MaxLogCapacity: defaultSettings.MaxLogCapacity,
  MaxPortCapacity: defaultSettings.MaxPortCapacity,
  OwnedAugmentationsOrder: OwnedAugmentationsOrderSetting.AcquirementTime,
  PurchaseAugmentationsOrder: PurchaseAugmentationsOrderSetting.Default,
  SuppressBuyAugmentationConfirmation: defaultSettings.SuppressBuyAugmentationConfirmation,
  SuppressFactionInvites: defaultSettings.SuppressFactionInvites,
  SuppressHospitalizationPopup: defaultSettings.SuppressHospitalizationPopup,
  SuppressMessages: defaultSettings.SuppressMessages,
  SuppressTravelConfirmation: defaultSettings.SuppressTravelConfirmation,
  SuppressBladeburnerPopup: defaultSettings.SuppressBladeburnerPopup,
  MonacoTheme: "vs-dark",
  MonacoInsertSpaces: false,
  init() {
    Object.assign(Settings, defaultSettings);
  },
  load(saveString: string) {
    Object.assign(Settings, JSON.parse(saveString));
  },
};
