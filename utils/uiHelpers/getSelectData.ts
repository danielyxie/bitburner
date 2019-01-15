export function getSelectValue(selector: HTMLSelectElement | null): string {
    if (selector == null) { return ""; }
    return selector[selector.selectedIndex].value;
}

export function getSelectText(selector: HTMLSelectElement | null): string {
    if (selector == null) { return ""; }
    return selector[selector.selectedIndex].text;
}
