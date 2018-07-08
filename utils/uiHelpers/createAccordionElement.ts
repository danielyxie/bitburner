import { createElement } from "./createElement";

/**
 * Possible configuration parameters when creating the accordion element.
 */
interface IAccordionConfigurationParameters {
    /**
     * The HTML to appear in the accordion header.
     */
    hdrText?: string;

    /**
     * A (hopefully) unique identifier for the accordion.
     */
    id?: string;

    /**
     * The HTML to appear in the expanded accordion.
     */
    panelText?: string;
}

/**
 * Creates both the header and panel element of an accordion and sets the click handler
 * @param params The creation parameters.
 */
export function createAccordionElement(params: IAccordionConfigurationParameters) {
    const liElem: HTMLLIElement = createElement("li") as HTMLLIElement;
    const header: HTMLButtonElement = createElement("button", {
        clickListener() {
            this.classList.toggle("active");
            const pnl: CSSStyleDeclaration = (this.nextElementSibling as HTMLDivElement).style;
            pnl.display = pnl.display === "block" ? "none" : "block";
        },
        id: params.id !== undefined ? `${params.id}-hdr` : undefined,
        innerHTML: params.hdrText,
    }) as HTMLButtonElement;
    const panel: HTMLDivElement = createElement("div", {
        id: params.id !== undefined ? `${params.id}-panel` : undefined,
        innerHTML: params.panelText,
    }) as HTMLDivElement;

    liElem.appendChild(header);
    liElem.appendChild(panel);

    return [
        liElem,
        header,
        panel,
    ];
}
