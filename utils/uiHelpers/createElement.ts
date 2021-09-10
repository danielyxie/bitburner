/**
 * Options specific to creating an anchor ("<a>") element.
 */
interface ICreateElementAnchorOptions {
  href?: string;
  target?: string;
  text?: string;
}

/**
 * Options specific to creating an input ("<input>") element.
 */
interface ICreateElementInputOptions {
  checked?: boolean;
  max?: string;
  maxLength?: number;
  min?: string;
  name?: string;
  pattern?: string;
  placeholder?: string;
  step?: string;
  type?: string;
  value?: string;
}

/**
 * Options specific to creating a label ("<label>") element.
 */
interface ICreateElementLabelOptions {
  for?: string;
}

/**
 * Options for setting up event listeners on the element.
 */
interface ICreateElementListenerOptions {
  changeListener?(this: HTMLElement, ev: Event): any;
  clickListener?(this: HTMLElement, ev: MouseEvent): any;
  mouseDown?(this: HTMLElement, ev: MouseEvent): any;
  inputListener?(this: HTMLElement, ev: Event): any;
  onfocus?(this: HTMLElement, ev: FocusEvent): any;
  onkeydown?(this: HTMLElement, ev: KeyboardEvent): any;
  onkeyup?(this: HTMLElement, ev: KeyboardEvent): any;
}

/**
 * Options for setting up the inline-styling of element.
 * NOTE: Relying on CSS styling should be preferred over forcing the higher specificity via inline styles.
 */
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
  overflow?: string;
  padding?: string;
  position?: string;
  visibility?: string;
  whiteSpace?: string;
  width?: string;
  height?: string;
  top?: string;
  left?: string;
}

/**
 * Options for adding an in-game tooltip to the element.
 */
interface ICreateElementTooltipOptions {
  tooltip?: string;
  tooltipleft?: string;
  tooltipsmall?: string;
  tooltiplow?: string;
}

/**
 * All possible configuration options when creating an element.
 */
interface ICreateElementOptions
  extends ICreateElementStyleOptions,
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

function setElementAnchor(el: HTMLAnchorElement, params: ICreateElementAnchorOptions): void {
  if (params.text !== undefined) {
    el.text = params.text;
  }
  if (params.href !== undefined) {
    el.href = params.href;
  }
  if (params.target !== undefined) {
    el.target = params.target;
  }
}

function setElementInput(el: HTMLInputElement, params: ICreateElementInputOptions): void {
  if (params.name !== undefined) {
    el.name = params.name;
  }
  if (params.value !== undefined) {
    el.value = params.value;
  }
  if (params.type !== undefined) {
    el.type = params.type;
  }
  if (params.checked !== undefined) {
    el.checked = params.checked;
  }
  if (params.pattern !== undefined) {
    el.pattern = params.pattern;
  }
  if (params.maxLength !== undefined) {
    el.maxLength = params.maxLength;
  }
  if (params.placeholder !== undefined) {
    el.placeholder = params.placeholder;
  }
  if (params.max !== undefined) {
    el.max = params.max;
  }
  if (params.min !== undefined) {
    el.min = params.min;
  }
  if (params.step !== undefined) {
    el.step = params.step;
  }
}

function setElementLabel(el: HTMLLabelElement, params: ICreateElementLabelOptions): void {
  if (params.for !== undefined) {
    el.htmlFor = params.for;
  }
}

function setElementListeners(el: HTMLElement, params: ICreateElementListenerOptions): void {
  // tslint:disable:no-unbound-method
  if (params.clickListener !== undefined) {
    el.addEventListener("click", params.clickListener);
  }
  if (params.mouseDown !== undefined) {
    el.addEventListener("mousedown", params.mouseDown);
  }
  if (params.inputListener !== undefined) {
    el.addEventListener("input", params.inputListener);
  }
  if (params.changeListener !== undefined) {
    el.addEventListener("change", params.changeListener);
  }
  if (params.onkeyup !== undefined) {
    el.addEventListener("keyup", params.onkeyup);
  }
  if (params.onkeydown !== undefined) {
    el.addEventListener("keydown", params.onkeydown);
  }
  if (params.onfocus !== undefined) {
    el.addEventListener("focus", params.onfocus);
  }
  // tslint:enable:no-unbound-method
}

function setElementStyle(el: HTMLElement, params: ICreateElementStyleOptions): void {
  if (params.display !== undefined) {
    el.style.display = params.display;
  }
  if (params.visibility !== undefined) {
    el.style.visibility = params.visibility;
  }
  if (params.margin !== undefined) {
    el.style.margin = params.margin;
  }
  if (params.marginLeft !== undefined) {
    el.style.marginLeft = params.marginLeft;
  }
  if (params.marginTop !== undefined) {
    el.style.marginTop = params.marginTop;
  }
  if (params.padding !== undefined) {
    el.style.padding = params.padding;
  }
  if (params.color !== undefined) {
    el.style.color = params.color;
  }
  if (params.border !== undefined) {
    el.style.border = params.border;
  }
  if (params.float !== undefined) {
    el.style.cssFloat = params.float;
  }
  if (params.fontSize !== undefined) {
    el.style.fontSize = params.fontSize;
  }
  if (params.whiteSpace !== undefined) {
    el.style.whiteSpace = params.whiteSpace;
  }
  if (params.width !== undefined) {
    el.style.width = params.width;
  }
  if (params.height !== undefined) {
    el.style.height = params.height;
  }
  if (params.top !== undefined) {
    el.style.top = params.top;
  }
  if (params.left !== undefined) {
    el.style.left = params.left;
  }
  if (params.backgroundColor !== undefined) {
    el.style.backgroundColor = params.backgroundColor;
  }
  if (params.position !== undefined) {
    el.style.position = params.position;
  }
  if (params.overflow !== undefined) {
    el.style.overflow = params.overflow;
  }
}

function setElementTooltip(el: HTMLElement, params: ICreateElementTooltipOptions): void {
  if (params.tooltip !== undefined && params.tooltip !== "") {
    el.className += " tooltip";
    el.appendChild(
      createElement("span", {
        class: "tooltiptext",
        innerHTML: params.tooltip,
      }),
    );
  } else if (params.tooltipleft !== undefined) {
    el.className += " tooltip";
    el.appendChild(
      createElement("span", {
        class: "tooltiptextleft",
        innerHTML: params.tooltipleft,
      }),
    );
  } else if (params.tooltipsmall !== undefined) {
    el.className += " tooltip";
    el.appendChild(
      createElement("span", {
        class: "tooltiptext smallfont",
        innerHTML: params.tooltipsmall,
      }),
    );
  } else if (params.tooltiplow !== undefined) {
    el.className += "tooltip";
    el.appendChild(
      createElement("span", {
        class: "tooltiptextlow",
        innerHTML: params.tooltiplow,
      }),
    );
  }
}

/**
 * An all-in-one-call way of creating an element to be added to the DOM at some point.
 * @param tagName The HTML tag/element name
 * @param params Additional parameters to set on the element
 */
export function createElement(tagName: string, params: ICreateElementOptions = {}): HTMLElement {
  const el: HTMLElement = document.createElement(tagName);

  if (params.id !== undefined) {
    el.id = params.id;
  }
  if (params.class !== undefined) {
    el.className = params.class;
  }
  if (params.innerHTML !== undefined) {
    el.innerHTML = params.innerHTML;
  }
  if (params.innerText !== undefined) {
    el.innerText = params.innerText;
  }
  if (params.tabIndex !== undefined) {
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
