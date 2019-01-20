export function getSelectValue(selector: HTMLSelectElement | null): string {
    if (selector == null) { return ""; }
    if (selector.options.length <= 0) { return ""; }
    return selector.options[selector.selectedIndex].value;
}

export function getSelectText(selector: HTMLSelectElement | null): string {
    if (selector == null) { return ""; }
    if (selector.options.length <= 0) { return ""; }
    return selector.options[selector.selectedIndex].text;
}
