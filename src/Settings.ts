import { ISelfInitializer, ISelfLoading } from "./types";

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
     * Whether global keyboard shortcuts should be recognized throughout the game.
     */
    DisableHotkeys: boolean;

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
     * Whether the user should be shown a dialog box whenever they receive a new message file.
     */
    SuppressMessages: boolean;

    /**
     * Whether the user should be asked to confirm travelling between cities.
     */
    SuppressTravelConfirmation: boolean;
}

/**
 * Represents all possible settings the player wants to customize to their play style.
 */
interface ISettings extends IDefaultSettings {
    /**
     * The keybinding to use in the script editor.
     * TODO: This should really be an enum of allowed values.
     */
    EditorKeybinding: string;

    /**
     * The theme used in the script editor.
     * TODO: This should really be an enum of allowed values.
     */
    EditorTheme: string;

    /**
     * The CSS background theme color to apply across the game.
     */
    ThemeBackgroundColor: string;

    /**
     * The CSS text theme color to apply across the game.
     */
    ThemeFontColor: string;

    /**
     * The CSS foreground theme color to apply across the game.
     */
    ThemeHighlightColor: string;
}

const defaultSettings: IDefaultSettings = {
    AutosaveInterval:                    60,
    CodeInstructionRunTime:              50,
    DisableHotkeys:                      false,
    MaxLogCapacity:                      50,
    MaxPortCapacity:                     50,
    SuppressBuyAugmentationConfirmation: false,
    SuppressFactionInvites:              false,
    SuppressMessages:                    false,
    SuppressTravelConfirmation:          false,
};

/**
 * The current options the player has customized to their play style.
 */
// tslint:disable-next-line:variable-name
export const Settings: ISettings & ISelfInitializer & ISelfLoading = {
    AutosaveInterval:                    defaultSettings.AutosaveInterval,
    CodeInstructionRunTime:              25,
    DisableHotkeys:                      defaultSettings.DisableHotkeys,
    EditorKeybinding:                    "ace",
    EditorTheme:                         "Monokai",
    MaxLogCapacity:                      defaultSettings.MaxLogCapacity,
    MaxPortCapacity:                     defaultSettings.MaxPortCapacity,
    SuppressBuyAugmentationConfirmation: defaultSettings.SuppressBuyAugmentationConfirmation,
    SuppressFactionInvites:              defaultSettings.SuppressFactionInvites,
    SuppressMessages:                    defaultSettings.SuppressMessages,
    SuppressTravelConfirmation:          defaultSettings.SuppressTravelConfirmation,
    ThemeBackgroundColor:                "#000000",
    ThemeFontColor:                      "#66ff33",
    ThemeHighlightColor:                 "#ffffff",
    init() {
        Object.assign(Settings, defaultSettings);
    },
    load(saveString: string) {
        Object.assign(Settings, JSON.parse(saveString));
    },
};
