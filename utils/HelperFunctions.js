//General helper functions
import {isString}           from "./helpers/isString";
import { createElement } from "./uiHelpers/createElement";

//Returns the size (number of keys) of an object
function sizeOfObject(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}

function clearObject(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            delete obj[key];
        }
    }
}

//Adds a random offset to a number within a certain percentage
//e.g. addOffset(100, 5) will return anything from 95 to 105.
//The percentage argument must be between 0 and 100;
function addOffset(n, percentage) {
    if (percentage < 0 || percentage > 100) {return n;}

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

function removeElement(elem) {
    if (elem == null || !(elem instanceof Element)) {return;}
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

//Appends n line breaks (as children) to the Element el
function appendLineBreaks(el, n) {
    for (var i = 0; i < n; ++i) {
        el.appendChild(createElement("br"));
    }
}

function clearSelector(selector) {
    for (var i = selector.options.length - 1; i >= 0; --i) {
        selector.remove(i);
    }
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

export {sizeOfObject,
        clearObject,
        addOffset,
        clearEventListeners,
        compareArrays,
        printArray,
        powerOfTwo,
        clearEventListenersEl,
        removeElement,
        createAccordionElement,
        appendLineBreaks,
        removeChildrenFromElement,
        clearSelector};
