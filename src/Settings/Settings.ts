import { ISelfInitializer, ISelfLoading } from "../types";
import { CodeMirrorThemeSetting,
         EditorSetting,
         OwnedAugmentationsOrderSetting,
         PurchaseAugmentationsOrderSetting } from "./SettingEnums";

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
}

/**
 * Represents all possible settings the player wants to customize to their play style.
 */
interface ISettings extends IDefaultSettings {
    /**
     * Which editor should be used (CodeMirror or Ace)?
     */
    Editor: EditorSetting;

    /**
     * The keybinding to use in the script editor.
     * TODO: This should really be an enum of allowed values.
     */
    EditorKeybinding: string;

    /**
     * The theme used in the script editor.
     * TODO: This should really be an enum of allowed values.
     */
    EditorTheme: string | CodeMirrorThemeSetting;

    /**
     * What order the player's owned Augmentations/Source Files should be displayed in
     */
    OwnedAugmentationsOrder: OwnedAugmentationsOrderSetting;

    /**
     * What order the Augmentations should be displayed in when purchasing from a Faction
     */
    PurchaseAugmentationsOrder: PurchaseAugmentationsOrderSetting;
}

const defaultSettings: IDefaultSettings = {
    AutosaveInterval:                    60,
    CodeInstructionRunTime:              50,
    DisableHotkeys:                      false,
    Locale:                              "en",
    MaxLogCapacity:                      50,
    MaxPortCapacity:                     50,
    SuppressBuyAugmentationConfirmation: false,
    SuppressFactionInvites:              false,
    SuppressHospitalizationPopup:        false,
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
    Editor:                              EditorSetting.Ace,
    EditorKeybinding:                    "ace",
    EditorTheme:                         "Monokai",
    Locale:                              "en",
    MaxLogCapacity:                      defaultSettings.MaxLogCapacity,
    MaxPortCapacity:                     defaultSettings.MaxPortCapacity,
    OwnedAugmentationsOrder:             OwnedAugmentationsOrderSetting.AcquirementTime,
    PurchaseAugmentationsOrder:          PurchaseAugmentationsOrderSetting.Default,
    SuppressBuyAugmentationConfirmation: defaultSettings.SuppressBuyAugmentationConfirmation,
    SuppressFactionInvites:              defaultSettings.SuppressFactionInvites,
    SuppressHospitalizationPopup:        defaultSettings.SuppressHospitalizationPopup,
    SuppressMessages:                    defaultSettings.SuppressMessages,
    SuppressTravelConfirmation:          defaultSettings.SuppressTravelConfirmation,
    init() {
        Object.assign(Settings, defaultSettings);
    },
    load(saveString: string) {
        Object.assign(Settings, JSON.parse(saveString));
    },
};
