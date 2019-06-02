/**
 * Creates a Close/Cancel button that is used for removing popups
 */

import { createElement } from "./createElement";
import { removeElement } from "./removeElement";

interface ICreatePopupCloseButtonOptions {
    class?: string;
    display?: string;
    innerText?: string;
    type?: string;
}

export function createPopupCloseButton(popup: Element | string, options: ICreatePopupCloseButtonOptions) {
    let button: HTMLButtonElement;

    function closePopupWithEscFn(e: any): void {
        if (e.keyCode === 27) {
            button.click();
        }
    }

    button = createElement("button", {
        class: options.class ? options.class : "popup-box-button",
        display: options.display ? options.display : "inline-block",
        innerText: options.innerText == null ? "Cancel" : options.innerText,
        clickListener: () => {
            if (popup instanceof Element) {
                removeElement(popup);
            } else {
                try {
                    const popupEl = document.getElementById(popup);
                    if (popupEl instanceof Element) {
                        removeElement(popupEl);
                    }
                } catch(e) {
                    console.error(`createPopupCloseButton() threw: ${e}`);
                }
            }

            document.removeEventListener("keydown", closePopupWithEscFn);
            return false;
        },
    }) as HTMLButtonElement;

    document.addEventListener("keydown", closePopupWithEscFn);

    return button;
}
