import { createElement } from "./createElement";

export function createOptionElement(text: string, value: string="") {
    const sanitizedValue: string = value;
    if (sanitizedValue === "") { sanitizedValue = text; }

    return createElement("option", {
        text: text,
        value: sanitizedValue,
    });
}
