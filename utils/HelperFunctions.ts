//General helper functions
import {isString}           from "./StringHelperFunctions";
import {dialogBoxCreate}    from "./DialogBox";

function clearObject(obj: any) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            delete obj[key];
        }
    }
}

//Adds a random offset to a number within a certain percentage
//e.g. addOffset(100, 5) will return anything from 95 to 105.
//The percentage argument must be between 0 and 100;
function addOffset(n: number, percentage: number): number {
    if (percentage < 0 || percentage > 100) {return n;}

    const offset = n * (percentage / 100);

    return n + ((Math.random() * (2 * offset)) - offset);
}

//Given an element by its Id(usually an 'a' element), removes all event listeners
//from that element by cloning and replacing. Then returns the new cloned element
function clearEventListeners(elemId: string): HTMLElement | null {
    const elem: HTMLElement | null = document.getElementById(elemId);
    if(elem === null) return null;
    return clearEventListenersEl(elem as HTMLElement);
}

//Same as clearEventListeners except it takes a DOM element object rather than an ID
function clearEventListenersEl(el: HTMLElement): HTMLElement | null {
    if (el == null) {console.log("ERR: element passed into clearEventListenersEl is null"); return null;}
    const newElem: Node = el.cloneNode(true);
    if(el.parentNode === null) return null;
    (el.parentNode as Element).replaceChild(newElem, el);
    return newElem as HTMLElement;
}

//Given its id, this function removes an element AND its children
function removeElementById(id: string) {
    const elem: HTMLElement | null = document.getElementById(id);
    if(elem === null) return;
    removeElement(elem as HTMLElement);
}

// Same as removeElementById except if takes a DOM element object rather than an ID
function removeElement(elem: Element) {
    if (elem == null) {return;}
    while(elem.firstChild) {elem.removeChild(elem.firstChild);}
    if(elem.parentNode === null) return;
    (elem.parentNode as HTMLElement).removeChild(elem);
}

function removeChildrenFromElement(el: string | Element) {
    let elem: Element
    if(isString(el)){
        const foundElem: Element | null = document.getElementById(el as string);
        if(foundElem === null) {
            return;
        }
        elem = foundElem as Element;
    } else {
        elem = el as Element;
    }
    if (elem == null) {return;}
    if (elem instanceof Element) {
        while(elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }
}

/**
 * Returns a reference to the first object with the specified value of the ID or NAME attribute, throwing an error if it is unable to find it.
 * @param {string} elementId The HTML ID to retrieve the element by.
 * @returns {HTMLElement} The single element.
 * @throws {Error} When the 'idString' cannot be found.
 */
function getElementById(elementId: string): HTMLElement {
    const el: HTMLElement | null = document.getElementById(elementId);
    if (el == null) {
        throw new Error("Unable to find element with id '" + elementId + "'");
    }

    return el;
}

interface createElementParams {
    id?: any;
    class?: any;
    name?: any;
    innerHTML?: any;
    innerText?: any;
    value?: any;
    text?: any;
    display?: any;
    visibility?: any;
    margin?: any;
    marginLeft?: any;
    marginTop?: any;
    padding?: any;
    color?: any;
    border?: any;
    float?: any;
    fontSize?: any;
    whiteSpace?: any;
    width?: any;
    backgroundColor?: any;
    position?: any;
    type?: any;
    checked?: any;
    for?: any;
    pattern?: any;
    maxLength?: any;
    placeholder?: any;
    tooltip?: any;
    tooltipleft?: any;
    href?: any;
    target?: any;
    tabIndex?: any;
    clickListener?: any;
    inputListener?: any;
    changeListener?: any;
    onkeyup?: any;
    onfocus?: any;
}

function createElement(type: string, params: createElementParams): any {
    var el: any = document.createElement(type);
    if (params.id)          {el.id = params.id;}
    if (params.class)       {el.className = params.class;}
    if (params.name)        {el.name = params.name;}
    if (params.innerHTML)   {el.innerHTML = params.innerHTML;}
    if (params.innerText)   {el.innerText = params.innerText;}
    if (params.value)       {el.value = params.value;}
    if (params.text)        {el.text = params.text;}
    if (params.display)     {el.style.display = params.display;}
    if (params.visibility)  {el.style.visibility = params.visibility;}
    if (params.margin)      {el.style.margin = params.margin;}
    if (params.marginLeft)  {el.style.marginLeft = params.marginLeft;}
    if (params.marginTop)   {el.style.marginTop = params.marginTop;}
    if (params.padding)     {el.style.padding = params.padding;}
    if (params.color)       {el.style.color = params.color;}
    if (params.border)      {el.style.border = params.border;}
    if (params.float)       {el.style.cssFloat = params.float;}
    if (params.fontSize)    {el.style.fontSize = params.fontSize;}
    if (params.whiteSpace)  {el.style.whiteSpace = params.whiteSpace;}
    if (params.width)       {el.style.width = params.width;}
    if (params.backgroundColor) {
        el.style.backgroundColor = params.backgroundColor
    }
    if (params.position)    {el.style.position = params.position;}
    if (params.type)        {el.type = params.type;}
    if (params.checked)     {el.checked = params.checked;}
    if (params.for)         {el.htmlFor = params.for;}
    if (params.pattern)     {el.pattern = params.pattern;}
    if (params.maxLength)   {el.maxLength = params.maxLength;}
    if (params.placeholder) {el.placeholder = params.placeholder;}
    if (params.tooltip && params.tooltip !== "")     {
        el.className += " tooltip";
        el.appendChild(createElement("span", {
            class:"tooltiptext",
            innerHTML:params.tooltip
        }));
    } else if (params.tooltipleft) {
        el.className += " tooltip";
        el.appendChild(createElement("span", {
            class:"tooltiptextleft",
            innerHTML:params.tooltipleft
        }));
    }
    if (params.href)        {el.href = params.href;}
    if (params.target)      {el.target = params.target;}
    if (params.tabIndex)    {el.tabIndex = params.tabIndex;}
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
    return el;
}

function createPopup(id: string, elems: any[]) {
    const container = createElement("div", {
            class:"popup-box-container",
            id:id,
            display:"block"
        }),
        content = createElement("div", {
            class:"popup-box-content",
            id:id + "-content",
        });

    for (let i = 0; i < elems.length; ++i) {
        content.appendChild(elems[i]);
    }
    container.appendChild(content);
    const game = document.getElementById("entire-game-container");
    if(game === null) {
        throw new Error('unable to find entire-game-container, massive problem');
    }
    (game as Element).appendChild(container);
    return container;
}

//Creates both the header and panel element of an accordion and sets the click handler
function createAccordionElement(params: any) {
    const li: HTMLElement = document.createElement("li");
    const hdr: HTMLElement = document.createElement("button");
    const panel: HTMLElement = document.createElement("div");
    hdr.classList.add("accordion-header");
    panel.classList.add("accordion-panel");

    if (params.id) {
        hdr.id = params.id + "-hdr";
        panel.id = params.id + "-panel";
    }
    if (params.hdrText)         {hdr.innerHTML = params.hdrText;}
    if (params.panelText)       {panel.innerHTML = params.panelText;}
    li.appendChild(hdr);
    li.appendChild(panel);
    //Click handler
    hdr.onclick = function() {
        this.classList.toggle("active");
        const tmpPanel = <HTMLElement>this.nextElementSibling;
        if (tmpPanel.style.display === "block") {
            tmpPanel.style.display = "none";
        } else {
            tmpPanel.style.display = "block";
        }
    }
    return [li, hdr, panel];
}

//Appends n line breaks (as children) to the Element el
function appendLineBreaks(el: Element, n: number) {
    for (let i = 0; i < n; ++i) {
        el.appendChild(createElement("br", {}));
    }
}

function clearSelector(selector: any) {
    for (let i = selector.options.length - 1; i >= 0; --i) {
        selector.remove(i);
    }
}

function getRandomInt(min: number, max: number): number {
    if (min > max) {return getRandomInt(max, min);}
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Returns true if all elements are equal, and false otherwise
//Assumes both arguments are arrays and that there are no nested arrays
function compareArrays(a1: any[], a2: any[]): boolean {
    if (a1.length != a2.length) {
        return false;
    }

    for (var i = 0; i < a1.length; ++i) {
        if (a1[i] != a2[i]) {return false;}
    }
    return true;
}

function printArray(a: any[]): string {
    return "[" + a.join(", ") + "]";
}

//Returns bool indicating whether or not its a power of 2
function powerOfTwo(n: number): boolean {
    if (isNaN(n)) {return false;}
    return n !== 0 && ((n & (n-1)) === 0);
}

function exceptionAlert(e: any) {
    dialogBoxCreate("Caught an exception: " + e + "<br><br>" +
                    "Filename: " + e.fileName + "<br><br>" +
                    "Line Number: " + e.lineNumber + "<br><br>" +
                    "This is a bug, please report to game developer with this " +
                    "message as well as details about how to reproduce the bug.<br><br>" +
                    "If you want to be safe, I suggest refreshing the game WITHOUT saving so that your " +
                    "safe doesn't get corrupted", false);
}

interface progressBarParams {
    totalTicks: number;
    progress: number;
}

/*Creates a graphical "progress bar"
 *  e.g.: [||||---------------]
 *  params:
 *      @totalTicks - Total number of ticks in progress bar. Preferably a factor of 100
 *      @progress - Current progress, taken as a decimal (i.e. 0.6 to represent 60%)
 */
function createProgressBarText(params: progressBarParams) {
    //Default values
    const totalTicks: number = (params.totalTicks == null ? 20 : params.totalTicks);
    const progress: number = (params.progress == null ? 0 : params.progress);

    const percentPerTick: number = 1 / totalTicks;
    const numTicks: number = Math.floor(progress / percentPerTick);
    const numDashes: number = totalTicks - numTicks;
    return "[" + Array(numTicks+1).join("|") + Array(numDashes+1).join("-") + "]";
}

export {clearObject, addOffset, clearEventListeners, getRandomInt,
        compareArrays, printArray, powerOfTwo,
        removeElementById, removeElement, createElement, createAccordionElement,
        appendLineBreaks,
        removeChildrenFromElement, createPopup, clearSelector, exceptionAlert,
        createProgressBarText, getElementById};
