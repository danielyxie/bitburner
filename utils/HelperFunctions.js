//General helper functions
import {isString}           from "./StringHelperFunctions.js";
import {dialogBoxCreate}    from "./DialogBox.js";

//Returns the size (number of keys) of an object
function sizeOfObject(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}

//Adds a random offset to a number within a certain percentage
//e.g. addOffset(100, 5) will return anything from 95 to 105.
//The percentage argument must be between 0 and 100;
function addOffset(n, percentage) {
    if (percentage < 0 || percentage > 100) {return;}

    var offset = n * (percentage / 100);

    return n + ((Math.random() * (2 * offset)) - offset);
}

//Given an element by its Id(usually an 'a' element), removes all event listeners
//from that element by cloning and replacing. Then returns the new cloned element
function clearEventListeners(elemId) {
    var elem = document.getElementById(elemId);
    if (elem == null) {console.log("ERR: Could not find element for: " + elemId); return null;}
    var newElem = elem.cloneNode(true);
    elem.parentNode.replaceChild(newElem, elem);
    return newElem;
}

//Same as clearEventListeners except it takes a DOM element object rather than an ID
function clearEventListenersEl(el) {
    if (el == null) {console.log("ERR: element passed into clearEventListenersEl is null"); return null;}
    var newElem = el.cloneNode(true);
    el.parentNode.replaceChild(newElem, el);
    return newElem;
}

//Given its id, this function removes an element AND its children
function removeElementById(id) {
    var elem = document.getElementById(id);
    if (elem == null) {return;}
    while(elem.firstChild) {elem.removeChild(elem.firstChild);}
    elem.parentNode.removeChild(elem);
}

function removeElement(elem) {
    if (elem == null) {return;}
    while(elem.firstChild) {elem.removeChild(elem.firstChild);}
    elem.parentNode.removeChild(elem);
}

function removeChildrenFromElement(el) {
    if (isString(el)) {
        el = document.getElementById(el);
    }
    if (el == null) {return;}
    if (el instanceof Element) {
        while(el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }
}

function createElement(type, params={}) {
    var el = document.createElement(type);
    if (params.id)          {el.id = params.id;}
    if (params.class)       {el.className = params.class;}
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
    if (params.tooltip)     {
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
    return el;
}

function createPopup(id, elems) {
    var container = createElement("div", {
            class:"popup-box-container",
            id:id,
            display:"block"
        }),
        content = createElement("div", {
            class:"popup-box-content",
            id:id + "-content",
        });

    for (var i = 0; i < elems.length; ++i) {
        content.appendChild(elems[i]);
    }
    container.appendChild(content);
    document.getElementById("entire-game-container").appendChild(container);
    return container;
}

//Creates both the header and panel element of an accordion and sets the click handler
function createAccordionElement(params) {
    var li = document.createElement("li"),
        hdr = document.createElement("button"),
        panel = document.createElement("div");
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
        var tmpPanel = this.nextElementSibling;
        if (tmpPanel.style.display === "block") {
            tmpPanel.style.display = "none";
        } else {
            tmpPanel.style.display = "block";
        }
    }
    return [li, hdr, panel];
}

function clearSelector(selector) {
    for (var i = selector.options.length - 1; i >= 0; --i) {
        selector.remove(i);
    }
}

function getRandomInt(min, max) {
    if (min > max) {return getRandomInt(max, min);}
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Returns true if all elements are equal, and false otherwise
//Assumes both arguments are arrays and that there are no nested arrays
function compareArrays(a1, a2) {
    if (a1.length != a2.length) {
        return false;
    }

    for (var i = 0; i < a1.length; ++i) {
        if (a1[i] != a2[i]) {return false;}
    }
    return true;
}

function printArray(a) {
    return "[" + a.join(", ") + "]";
}

//Returns bool indicating whether or not its a power of 2
function powerOfTwo(n) {
    if (isNaN(n)) {return false;}
    return n && (n & (n-1)) === 0;
}

function exceptionAlert(e) {
    dialogBoxCreate("Caught an exception: " + e + "<br><br>" +
                    "This is a bug, please report to game developer with this " +
                    "message as well as details about how to reproduce the bug.<br><br>" +
                    "If you want to be safe, I suggest refreshing the game WITHOUT saving so that your " +
                    "safe doesn't get corrupted");
}

export {sizeOfObject, addOffset, clearEventListeners, getRandomInt,
        compareArrays, printArray, powerOfTwo, clearEventListenersEl,
        removeElementById, removeElement, createElement, createAccordionElement,
        removeChildrenFromElement, createPopup, clearSelector, exceptionAlert};
