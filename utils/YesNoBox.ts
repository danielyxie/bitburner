/**
 * Generic Yes-No Pop-up box
 * Used to create pop-up boxes that require a yes/no response from player
 *
 * There are two types of pop ups:
 *  1. Just a Yes/No response from player
 *  2. Popup also includes a text input field in addition to the Yes/No response
 */
import { clearEventListeners } from "./uiHelpers/clearEventListeners";
import { KEY } from "./helpers/keyCodes";
import * as ReactDOM from "react-dom";

export let yesNoBoxOpen = false;

const yesNoBoxContainer: HTMLElement | null = document.getElementById("yes-no-box-container");
const yesNoBoxTextElement: HTMLElement | null = document.getElementById("yes-no-box-text");

function yesNoBoxHotkeyHandler(e: KeyboardEvent): void {
  if (e.keyCode === KEY.ESC) {
    yesNoBoxClose();
  } else if (e.keyCode === KEY.ENTER) {
    const yesBtn: HTMLElement | null = document.getElementById("yes-no-box-yes");
    if (yesBtn) {
      yesBtn.click();
    } else {
      console.error(`Could not find YesNoBox Yes button DOM element`);
    }
  }
}

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

export function yesNoBoxGetYesButton(): HTMLElement | null {
  return clearEventListeners("yes-no-box-yes");
}

export function yesNoBoxGetNoButton(): HTMLElement | null {
  return clearEventListeners("yes-no-box-no");
}

export function yesNoBoxCreate(txt: string | JSX.Element): boolean {
  if (yesNoBoxOpen) {
    return false;
  } //Already open
  yesNoBoxOpen = true;

  if (yesNoBoxTextElement) {
    ReactDOM.unmountComponentAtNode(yesNoBoxTextElement);
    yesNoBoxTextElement.innerHTML = "";
    if (typeof txt === "string") {
      yesNoBoxTextElement.innerHTML = txt as string;
    } else {
      ReactDOM.render(txt, yesNoBoxTextElement);
    }
  } else {
    console.error(`Text element not found for YesNoBox`);
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
const yesNoTextInputBoxInput: HTMLInputElement | null = document.getElementById(
  "yes-no-text-input-box-input",
) as HTMLInputElement;
const yesNoTextInputBoxTextElement: HTMLElement | null = document.getElementById("yes-no-text-input-box-text");

export function yesNoTxtInpBoxHotkeyHandler(e: KeyboardEvent): void {
  if (e.keyCode === KEY.ESC) {
    yesNoTxtInpBoxClose();
  } else if (e.keyCode === KEY.ENTER) {
    const yesBtn: HTMLElement | null = document.getElementById("yes-no-text-input-box-yes");
    if (yesBtn) {
      yesBtn.click();
    } else {
      console.error(`Could not find YesNoTxtInputBox Yes button DOM element`);
    }
  }
}

export function yesNoTxtInpBoxClose(): boolean {
  if (yesNoTextInputBoxContainer != null) {
    yesNoTextInputBoxContainer.style.display = "none";
  } else {
    console.error("Container not found for YesNoTextInputBox");
    return false;
  }
  if (!yesNoTextInputBoxInput) throw new Error("yesNoTextInputBoxInput was not set");
  yesNoBoxOpen = false;
  yesNoTextInputBoxInput.value = "";

  // Remove hotkey handler
  document.removeEventListener("keydown", yesNoTxtInpBoxHotkeyHandler);

  return false;
}

export function yesNoTxtInpBoxGetYesButton(): HTMLElement {
  const elem = clearEventListeners("yes-no-text-input-box-yes");
  if (elem === null) throw new Error("Could not find element with id: 'yes-no-text-input-box-yes'");
  return elem;
}

export function yesNoTxtInpBoxGetNoButton(): HTMLElement {
  const elem = clearEventListeners("yes-no-text-input-box-no");
  if (elem === null) throw new Error("Could not find element with id: 'yes-no-text-input-box-no'");
  return elem;
}

export function yesNoTxtInpBoxGetInput(): string {
  if (!yesNoTextInputBoxInput) {
    console.error("Could not find YesNoTextInputBox input element");
    return "";
  }
  let val: string = yesNoTextInputBoxInput.value;
  val = val.replace(/\s+/g, "");
  return val;
}

export function yesNoTxtInpBoxCreate(txt: string | JSX.Element): void {
  yesNoBoxOpen = true;

  if (yesNoTextInputBoxTextElement) {
    ReactDOM.unmountComponentAtNode(yesNoTextInputBoxTextElement);
    yesNoTextInputBoxTextElement.innerHTML = "";
    if (typeof txt === "string") {
      yesNoTextInputBoxTextElement.innerHTML = txt;
    } else {
      ReactDOM.render(txt, yesNoTextInputBoxTextElement);
    }
  }

  if (yesNoTextInputBoxContainer) {
    yesNoTextInputBoxContainer.style.display = "flex";
  } else {
    console.error("Container not found for YesNoTextInputBox");
  }

  // Add event listener for Esc and Enter hotkeys
  document.addEventListener("keydown", yesNoTxtInpBoxHotkeyHandler);

  if (!yesNoTextInputBoxInput) throw new Error("yesNoTextInputBoxInput was not set");
  yesNoTextInputBoxInput.focus();
}
