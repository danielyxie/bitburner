import { isString } from "../helpers/isString";
import { getElementById } from "./getElementById";

export function removeChildrenFromElement(el: string | null | Element) {
    if (el === null) {
        return;
    }

    try {
        const elem: HTMLElement | Element = (isString(el) ? getElementById(el as string) : el as Element);

        if (elem instanceof Element) {
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
        }
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.debug(e);

        return;
    }
}
