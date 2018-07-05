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

function clearSelector(selector) {
    for (var i = selector.options.length - 1; i >= 0; --i) {
        selector.remove(i);
    }
}

export {sizeOfObject,
        clearObject,
        clearEventListeners,
        clearEventListenersEl,
        removeElement,
        createAccordionElement,
        removeChildrenFromElement,
        clearSelector};
