interface ICreateElementAnchorOptions {
    href?: string;
    target?: string;
    text?: string;
}

interface ICreateElementInputOptions {
    checked?: boolean;
    maxLength?: number;
    name?: string;
    pattern?: string;
    placeholder?: string;
    type?: string;
    value?: string;
}

interface ICreateElementLabelOptions {
    for?: string;
}

interface ICreateElementListenerOptions {
    changeListener?(this: HTMLElement, ev: Event): any;
    clickListener?(this: HTMLElement, ev: MouseEvent): any;
    inputListener?(this: HTMLElement, ev: Event): any;
    onfocus?(this: HTMLElement, ev: FocusEvent): any;
    onkeyup?(this: HTMLElement, ev: KeyboardEvent): any;
}

interface ICreateElementStyleOptions {
    backgroundColor?: string;
    border?: string;
    color?: string;
    display?: string;
    float?: string;
    fontSize?: string;
    margin?: string;
    marginLeft?: string;
    marginTop?: string;
    padding?: string;
    position?: string;
    visibility?: string;
    whiteSpace?: string;
    width?: string;
}

interface ICreateElementTooltipOptions {
    tooltip?: string;
    tooltipleft?: string;
}

interface ICreateElementOptions extends
    ICreateElementStyleOptions,
    ICreateElementListenerOptions,
    ICreateElementInputOptions,
    ICreateElementAnchorOptions,
    ICreateElementLabelOptions,
    ICreateElementTooltipOptions {
    /**
     * CSS Class(es) to initially set.
     */
    class?: string;

    /**
     * A (hopefully) unique identifier for the element.
     */
    id?: string;

    innerHTML?: string;
    innerText?: string;
    tabIndex?: number;
}

function setElementAnchor(el: HTMLAnchorElement, params: ICreateElementAnchorOptions) {
    if (params.text) {
        el.text = params.text;
    }
    if (params.href) {
        el.href = params.href;
    }
    if (params.target) {
        el.target = params.target;
    }
}

function setElementInput(el: HTMLInputElement, params: ICreateElementInputOptions) {
    if (params.name) {
        el.name = params.name;
    }
    if (params.value) {
        el.value = params.value;
    }
    if (params.type) {
        el.type = params.type;
    }
    if (params.checked) {
        el.checked = params.checked;
    }
    if (params.pattern) {
        el.pattern = params.pattern;
    }
    if (params.maxLength) {
        el.maxLength = params.maxLength;
    }
    if (params.placeholder) {
        el.placeholder = params.placeholder;
    }
}

function setElementLabel(el: HTMLLabelElement, params: ICreateElementLabelOptions) {
    if (params.for) {
        el.htmlFor = params.for;
    }
}

function setElementListeners(el: HTMLElement, params: ICreateElementListenerOptions) {
    if (params.clickListener) {
        el.addEventListener("click", params.clickListener);
    }
    if (params.inputListener) {
        el.addEventListener("input", params.inputListener);
    }
    if (params.changeListener) {
        el.addEventListener("change", params.changeListener);
    }
    if (params.onkeyup) {
        el.addEventListener("keyup", params.onkeyup);
    }
    if (params.onfocus) {
        el.addEventListener("focus", params.onfocus);
    }
}

function setElementStyle(el: HTMLElement, params: ICreateElementStyleOptions) {
    if (params.display) {
        el.style.display = params.display;
    }
    if (params.visibility) {
        el.style.visibility = params.visibility;
    }
    if (params.margin) {
        el.style.margin = params.margin;
    }
    if (params.marginLeft) {
        el.style.marginLeft = params.marginLeft;
    }
    if (params.marginTop) {
        el.style.marginTop = params.marginTop;
    }
    if (params.padding) {
        el.style.padding = params.padding;
    }
    if (params.color) {
        el.style.color = params.color;
    }
    if (params.border) {
        el.style.border = params.border;
    }
    if (params.float) {
        el.style.cssFloat = params.float;
    }
    if (params.fontSize) {
        el.style.fontSize = params.fontSize;
    }
    if (params.whiteSpace) {
        el.style.whiteSpace = params.whiteSpace;
    }
    if (params.width) {
        el.style.width = params.width;
    }
    if (params.backgroundColor) {
        el.style.backgroundColor = params.backgroundColor;
    }
    if (params.position) {
        el.style.position = params.position;
    }
}

function setElementTooltip(el: HTMLElement, params: ICreateElementTooltipOptions) {
    if (params.tooltip && params.tooltip !== "")     {
        el.className += " tooltip";
        el.appendChild(createElement("span", {
            class: "tooltiptext",
            innerHTML: params.tooltip,
        }));
    } else if (params.tooltipleft) {
        el.className += " tooltip";
        el.appendChild(createElement("span", {
            class: "tooltiptextleft",
            innerHTML: params.tooltipleft,
        }));
    }
}

export function createElement(tagName: string, params: ICreateElementOptions = {}) {
    const el: HTMLElement = document.createElement(tagName);

    if (params.id) {
        el.id = params.id;
    }
    if (params.class) {
        el.className = params.class;
    }
    if (params.innerHTML) {
        el.innerHTML = params.innerHTML;
    }
    if (params.innerText) {
        el.innerText = params.innerText;
    }
    if (params.tabIndex) {
        el.tabIndex = params.tabIndex;
    }

    setElementAnchor(el as HTMLAnchorElement, params);
    setElementInput(el as HTMLInputElement, params);
    setElementLabel(el as HTMLLabelElement, params);
    setElementListeners(el, params);
    setElementStyle(el, params);
    setElementTooltip(el, params);

    return el;
}
