/**
 * Generic Yes-No Pop-up box
 * Used to create pop-up boxes that require a yes/no response from player
 *
 * There are two types of pop ups:
 *  1. Just a Yes/No response from player
 *  2. Popup also includes a text input field in addition to the Yes/No response
 */
import {clearEventListeners} from "./uiHelpers/clearEventListeners";

export let yesNoBoxOpen: boolean = false;

const yesNoBoxContainer: HTMLElement | null = document.getElementById("yes-no-box-container");
const yesNoBoxYesButton: HTMLElement | null = document.getElementById("yes-no-box-yes");
const yesNoBoxNoButton: HTMLElement | null = document.getElementById("yes-no-box-no");
const yesNoBoxTextElement: HTMLElement | null = document.getElementById("yes-no-box-text");

export function yesNoBoxClose(): boolean {
    if (yesNoBoxContainer) {
        yesNoBoxContainer.style.display = "none";
    } else {
        console.error("Container not found for YesNoBox");
    }
    yesNoBoxOpen = false;

    // Remove hotkey handler
    document.removeEventListener("keydown", yesNoBoxHotkeyHandler);

    return false; //So that 'return yesNoBoxClose()' is return false in event listeners
}

export function yesNoBoxHotkeyHandler(e: KeyboardEvent) {
    if (e.keyCode === 27) {
        yesNoBoxClose();
    } else if (e.keyCode === 13) {
        if (yesNoBoxNoButton) {
            yesNoBoxNoButton.click();
        } else {
            console.error(`Could not find YesNoBox No button DOM element`)
        }
    }
}

export function yesNoBoxGetYesButton() {
    return clearEventListeners("yes-no-box-yes");
}

export function yesNoBoxGetNoButton() {
    return clearEventListeners("yes-no-box-no");
}

export function yesNoBoxCreate(txt: string) {
    if (yesNoBoxOpen) { return false; }   //Already open
    yesNoBoxOpen = true;

    if (yesNoBoxTextElement) {
        yesNoBoxTextElement.innerHTML = txt;
    }

    if (yesNoBoxContainer) {
        yesNoBoxContainer.style.display = "flex";
    } else {
        console.error("Container not found for YesNoBox");
    }

    // Add event listener for Esc and Enter hotkeys
    document.addEventListener("keydown", yesNoBoxHotkeyHandler);

    return true;
}

/**
 * Yes-No pop up box with text input field
 */
const yesNoTextInputBoxContainer: HTMLElement | null = document.getElementById("yes-no-text-input-box-container");
const yesNoTextInputBoxYesButton: HTMLElement | null = document.getElementById("yes-no-text-input-box-yes");
const yesNoTextInputBoxNoButton: HTMLElement | null = document.getElementById("yes-no-text-input-box-no");
const yesNoTextInputBoxInput: HTMLInputElement | null = document.getElementById("yes-no-text-input-box-input") as HTMLInputElement;
const yesNoTextInputBoxTextElement: HTMLElement | null = document.getElementById("yes-no-text-input-box-text");

export function yesNoTxtInpBoxClose(): boolean {
    if (yesNoTextInputBoxContainer != null) {
        yesNoTextInputBoxContainer.style.display = "none";
    } else {
        console.error("Container not found for YesNoTextInputBox");
        return false;
    }
    yesNoBoxOpen = false;
    yesNoTextInputBoxInput!.value = "";
    return false;
}

export function yesNoTxtInpBoxGetYesButton(): HTMLElement | null {
    return clearEventListeners("yes-no-text-input-box-yes");
}

export function yesNoTxtInpBoxGetNoButton(): HTMLElement | null {
    return clearEventListeners("yes-no-text-input-box-no");
}

export function yesNoTxtInpBoxGetInput(): string {
    if (yesNoTextInputBoxInput == null) {
        console.error("Could not find YesNoTextInputBox input element");
        return "";
    }
    let val: string = yesNoTextInputBoxInput!.value;
    val = val.replace(/\s+/g, '');
    return val;
}

export function yesNoTxtInpBoxCreate(txt: string) {
    yesNoBoxOpen = true;

    if (yesNoTextInputBoxTextElement) {
        yesNoTextInputBoxTextElement.innerHTML = txt;
    }

    if (yesNoTextInputBoxContainer) {
        yesNoTextInputBoxContainer.style.display = "flex";
    } else {
        console.error("Container not found for YesNoTextInputBox");
    }

    yesNoTextInputBoxInput!.focus();
}
