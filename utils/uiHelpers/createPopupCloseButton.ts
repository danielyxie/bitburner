/* Creates a Close/Cancel button that is used for removing popups */

import { createElement } from "./createElement";
import { getElementById } from "./getElementById";
import { removeElement } from "./removeElement";

interface ICreatePopupCloseButtonOptions {
    innerText?: string;
}

export function createPopupCloseButton(popup: Element | string, options: ICreatePopupCloseButtonOptions) {
    let button: HTMLButtonElement;


    // TODO event listener works with escape. Add and remove event listener
    // from document
    function closePopupWithEscFn(e: any): void {
        if (e.keyCode === 27) {
            button.click();
        }
    }

    button = createElement("button", {
        class: "std-button",
        innerText: options.innerText == null ? "Cancel" : options.innerText,
        clickListener: () => {
            if (popup instanceof Element) {
                removeElement(popup);
            } else {
                try {
                    const popupEl = getElementById(popup);
                    removeElement(popupEl);
                } catch(e) {
                    console.error(`createPopupCloseButton() threw: ${e}`);
                }
            }

            document.removeEventListener("keydown", closePopupWithEscFn);
        },
    }) as HTMLButtonElement;

    document.addEventListener("keydown", closePopupWithEscFn);

    return button;
}
