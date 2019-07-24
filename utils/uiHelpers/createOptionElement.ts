import { createElement } from "./createElement";

export function createOptionElement(text: string, value: string= ""): HTMLOptionElement {
    let sanitizedValue: string = value;
    if (sanitizedValue === "") { sanitizedValue = text; }

    return createElement("option", {
        text,
        value: sanitizedValue,
    }) as HTMLOptionElement;
}
