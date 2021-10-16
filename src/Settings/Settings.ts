import { ISelfInitializer, ISelfLoading } from "../types";
import { OwnedAugmentationsOrderSetting, PurchaseAugmentationsOrderSetting } from "./SettingEnums";

/**
 * Represents the default settings the player could customize.
 */
interface IDefaultSettings {
  /**
   * How many servers per page
   */
  ActiveScriptsServerPageSize: number;
  /**
   * How many scripts per page
   */
  ActiveScriptsScriptPageSize: number;
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
   * Enable bash hotkeys
   */
  EnableBashHotkeys: boolean;

  /**
   * Enable timestamps
   */
  EnableTimestamps: boolean;

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
   * Limit the number of entries in the terminal.
   */
  MaxTerminalCapacity: number;

  /**
   * Save the game when you save any file.
   */
  SaveGameOnFileSave: boolean;

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

  /*
   * Theme colors
   */
  theme: {
    [key: string]: string | undefined;
    primarylight: string;
    primary: string;
    primarydark: string;
    errorlight: string;
    error: string;
    errordark: string;
    secondarylight: string;
    secondary: string;
    secondarydark: string;
    warninglight: string;
    warning: string;
    warningdark: string;
    infolight: string;
    info: string;
    infodark: string;
    welllight: string;
    well: string;
    white: string;
    black: string;
    hp: string;
    money: string;
    hack: string;
    combat: string;
    cha: string;
    int: string;
    rep: string;
    disabled: string;
  };
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

  MonacoFontSize: number;
}

export const defaultSettings: IDefaultSettings = {
  ActiveScriptsServerPageSize: 10,
  ActiveScriptsScriptPageSize: 10,
  AutosaveInterval: 60,
  CodeInstructionRunTime: 50,
  DisableASCIIArt: false,
  DisableHotkeys: false,
  DisableTextEffects: false,
  EnableBashHotkeys: false,
  EnableTimestamps: false,
  Locale: "en",
  MaxLogCapacity: 50,
  MaxPortCapacity: 50,
  MaxTerminalCapacity: 200,
  SaveGameOnFileSave: true,
  SuppressBuyAugmentationConfirmation: false,
  SuppressFactionInvites: false,
  SuppressHospitalizationPopup: false,
  SuppressMessages: false,
  SuppressTravelConfirmation: false,
  SuppressBladeburnerPopup: false,

  theme: {
    primarylight: "#0f0",
    primary: "#0c0",
    primarydark: "#090",
    errorlight: "#f00",
    error: "#c00",
    errordark: "#900",
    secondarylight: "#AAA",
    secondary: "#888",
    secondarydark: "#666",
    warninglight: "#ff0",
    warning: "#cc0",
    warningdark: "#990",
    infolight: "#69f",
    info: "#36c",
    infodark: "#039",
    welllight: "#444",
    well: "#222",
    white: "#fff",
    black: "#000",
    hp: "#dd3434",
    money: "#ffd700",
    hack: "#adff2f",
    combat: "#faffdf",
    cha: "#a671d1",
    int: "#6495ed",
    rep: "#faffdf",
    disabled: "#66cfbc",
  },
};

/**
 * The current options the player has customized to their play style.
 */
// tslint:disable-next-line:variable-name
export const Settings: ISettings & ISelfInitializer & ISelfLoading = {
  ActiveScriptsServerPageSize: defaultSettings.ActiveScriptsServerPageSize,
  ActiveScriptsScriptPageSize: defaultSettings.ActiveScriptsScriptPageSize,
  AutosaveInterval: defaultSettings.AutosaveInterval,
  CodeInstructionRunTime: 25,
  DisableASCIIArt: defaultSettings.DisableASCIIArt,
  DisableHotkeys: defaultSettings.DisableHotkeys,
  DisableTextEffects: defaultSettings.DisableTextEffects,
  EnableBashHotkeys: defaultSettings.EnableBashHotkeys,
  EnableTimestamps: defaultSettings.EnableTimestamps,
  Locale: "en",
  MaxLogCapacity: defaultSettings.MaxLogCapacity,
  MaxPortCapacity: defaultSettings.MaxPortCapacity,
  MaxTerminalCapacity: defaultSettings.MaxTerminalCapacity,
  OwnedAugmentationsOrder: OwnedAugmentationsOrderSetting.AcquirementTime,
  PurchaseAugmentationsOrder: PurchaseAugmentationsOrderSetting.Default,
  SaveGameOnFileSave: defaultSettings.SaveGameOnFileSave,
  SuppressBuyAugmentationConfirmation: defaultSettings.SuppressBuyAugmentationConfirmation,
  SuppressFactionInvites: defaultSettings.SuppressFactionInvites,
  SuppressHospitalizationPopup: defaultSettings.SuppressHospitalizationPopup,
  SuppressMessages: defaultSettings.SuppressMessages,
  SuppressTravelConfirmation: defaultSettings.SuppressTravelConfirmation,
  SuppressBladeburnerPopup: defaultSettings.SuppressBladeburnerPopup,
  MonacoTheme: "monokai",
  MonacoInsertSpaces: false,
  MonacoFontSize: 20,

  theme: {
    primarylight: defaultSettings.theme.primarylight,
    primary: defaultSettings.theme.primary,
    primarydark: defaultSettings.theme.primarydark,
    errorlight: defaultSettings.theme.errorlight,
    error: defaultSettings.theme.error,
    errordark: defaultSettings.theme.errordark,
    secondarylight: defaultSettings.theme.secondarylight,
    secondary: defaultSettings.theme.secondary,
    secondarydark: defaultSettings.theme.secondarydark,
    warninglight: defaultSettings.theme.warninglight,
    warning: defaultSettings.theme.warning,
    warningdark: defaultSettings.theme.warningdark,
    infolight: defaultSettings.theme.infolight,
    info: defaultSettings.theme.info,
    infodark: defaultSettings.theme.infodark,
    welllight: defaultSettings.theme.welllight,
    well: defaultSettings.theme.well,
    white: defaultSettings.theme.white,
    black: defaultSettings.theme.black,
    hp: defaultSettings.theme.hp,
    money: defaultSettings.theme.money,
    hack: defaultSettings.theme.hack,
    combat: defaultSettings.theme.combat,
    cha: defaultSettings.theme.cha,
    int: defaultSettings.theme.int,
    rep: defaultSettings.theme.rep,
    disabled: defaultSettings.theme.disabled,
  },
  init() {
    Object.assign(Settings, defaultSettings);
  },
  load(saveString: string) {
    Object.assign(Settings, JSON.parse(saveString));
  },
};
