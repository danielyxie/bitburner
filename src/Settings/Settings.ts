import { ISelfInitializer, ISelfLoading } from "../types";
import { OwnedAugmentationsOrderSetting, PurchaseAugmentationsOrderSetting } from "./SettingEnums";
import { defaultTheme, ITheme } from "./Themes";
import { defaultStyles, IStyleSettings } from "./Styles";
import { WordWrapOptions } from "../ScriptEditor/ui/Options";
import { OverviewSettings } from "../ui/React/Overview";

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
   * Whether overview progress bars should be visible.
   */
  DisableOverviewProgressBars: boolean;

  /**
   * Enable bash hotkeys
   */
  EnableBashHotkeys: boolean;

  /**
   * Timestamps format
   */
  TimestampsFormat: string;

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

  /**
   * Whether the user should be displayed a popup message on stock market actions.
   */
  SuppressTIXPopup: boolean;

  /**
   * Whether the user should be displayed a toast alert when the game is saved.
   */
  SuppressSavedGameToast: boolean;

  /*
   * Theme colors
   */
  theme: ITheme;

  /*
   * Interface styles
   */
  styles: IStyleSettings;

  /*
   * Use GiB instead of GB
   */
  UseIEC60027_2: boolean;

  /*
   * Character overview settings
   */
  overview: OverviewSettings;
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

  MonacoVim: boolean;

  MonacoWordWrap: WordWrapOptions;
}

export const defaultSettings: IDefaultSettings = {
  ActiveScriptsServerPageSize: 10,
  ActiveScriptsScriptPageSize: 10,
  AutosaveInterval: 60,
  CodeInstructionRunTime: 50,
  DisableASCIIArt: false,
  DisableHotkeys: false,
  DisableTextEffects: false,
  DisableOverviewProgressBars: false,
  EnableBashHotkeys: false,
  TimestampsFormat: "",
  Locale: "en",
  MaxLogCapacity: 50,
  MaxPortCapacity: 50,
  MaxTerminalCapacity: 500,
  SaveGameOnFileSave: true,
  SuppressBuyAugmentationConfirmation: false,
  SuppressFactionInvites: false,
  SuppressMessages: false,
  SuppressTravelConfirmation: false,
  SuppressBladeburnerPopup: false,
  SuppressTIXPopup: false,
  SuppressSavedGameToast: false,
  UseIEC60027_2: false,

  theme: defaultTheme,
  styles: defaultStyles,
  overview: { x: 0, y: 0, opened: true },
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
  DisableOverviewProgressBars: defaultSettings.DisableOverviewProgressBars,
  EnableBashHotkeys: defaultSettings.EnableBashHotkeys,
  TimestampsFormat: defaultSettings.TimestampsFormat,
  Locale: "en",
  MaxLogCapacity: defaultSettings.MaxLogCapacity,
  MaxPortCapacity: defaultSettings.MaxPortCapacity,
  MaxTerminalCapacity: defaultSettings.MaxTerminalCapacity,
  OwnedAugmentationsOrder: OwnedAugmentationsOrderSetting.AcquirementTime,
  PurchaseAugmentationsOrder: PurchaseAugmentationsOrderSetting.Default,
  SaveGameOnFileSave: defaultSettings.SaveGameOnFileSave,
  SuppressBuyAugmentationConfirmation: defaultSettings.SuppressBuyAugmentationConfirmation,
  SuppressFactionInvites: defaultSettings.SuppressFactionInvites,
  SuppressMessages: defaultSettings.SuppressMessages,
  SuppressTravelConfirmation: defaultSettings.SuppressTravelConfirmation,
  SuppressBladeburnerPopup: defaultSettings.SuppressBladeburnerPopup,
  SuppressTIXPopup: defaultSettings.SuppressTIXPopup,
  SuppressSavedGameToast: defaultSettings.SuppressSavedGameToast,
  UseIEC60027_2: defaultSettings.UseIEC60027_2,
  MonacoTheme: "monokai",
  MonacoInsertSpaces: false,
  MonacoFontSize: 20,
  MonacoVim: false,
  MonacoWordWrap: "off",

  theme: { ...defaultTheme },
  styles: { ...defaultStyles },
  overview: defaultSettings.overview,
  init() {
    Object.assign(Settings, defaultSettings);
  },
  load(saveString: string) {
    const save = JSON.parse(saveString);
    Object.assign(Settings.theme, save.theme);
    delete save.theme;
    Object.assign(Settings.styles, save.styles);
    delete save.styles;
    Object.assign(Settings.overview, save.overview);
    delete save.overview;
    Object.assign(Settings, save);
  },
};
