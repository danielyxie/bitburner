import { Engine } from "./engine";
import { setTimeoutRef } from "./utils/SetTimeoutRef";

import { removeChildrenFromElement } from "../utils/uiHelpers/removeChildrenFromElement";
import { createElement } from "../utils/uiHelpers/createElement";
import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { isString } from "../utils/helpers/isString";

export let cinematicTextFlag = false;

/**
 * Print a message using a hacking-style "typing" effect.
 * Note that this clears the UI so that the text from this is the only thing visible.
 *
 * @param lines {string[]} Array of strings to print, where each element is a separate line
 */
export function writeCinematicText(lines) {
  cinematicTextFlag = true;

  if (lines.constructor !== Array) {
    throw new Error("Invalid non-array argument passed into writeCinematicText()");
  }

  // Reuse the 'Red Pill' content
  Engine.loadCinematicTextContent();
  const container = document.getElementById("cinematic-text-container");
  container.style.width = "75%";
  if (container == null) {
    throw new Error("Could not find cinematic-text-container for writeCinematicText()");
  }
  removeChildrenFromElement(container);

  for (let i = 0; i < lines.length; ++i) {
    if (!isString(lines[i])) {
      throw new Error("Invalid non-string element in 'lines' argument. writeCinematicText() failed");
    }
  }

  return writeCinematicTextRecurse(lines)
    .then(function () {
      return cinematicTextEnd(); //Puts the continue button
    })
    .catch(function (e) {
      exceptionAlert(e);
    });
}

function writeCinematicTextRecurse(lines, lineNumber = 0) {
  if (lineNumber >= lines.length) {
    return Promise.resolve(true);
  }
  return writeCinematicTextLine(lines[lineNumber]).then(function () {
    return writeCinematicTextRecurse(lines, lineNumber + 1);
  });
}

function writeCinematicTextLine(line) {
  return new Promise(function (resolve, reject) {
    const container = document.getElementById("cinematic-text-container");
    const pElem = document.createElement("p");
    container.appendChild(pElem);

    const promise = writeCinematicTextLetter(pElem, line, 0);
    promise.then(
      function (res) {
        resolve(res);
      },
      function (e) {
        reject(e);
      },
    );
  });
}

function writeCinematicTextLetter(pElem, line, i = 0) {
  return new Promise(function (resolve, reject) {
    setTimeoutRef(function () {
      const textToShow = line.substring(0, i);

      if (i >= line.length) {
        pElem.innerHTML = textToShow;
        return resolve(true);
      }

      pElem.innerHTML = textToShow + "<span class='typed-cursor'> &#9608; </span>";
      const promise = writeCinematicTextLetter(pElem, line, i + 1);
      promise.then(
        function (res) {
          resolve(res);
        },
        function (e) {
          reject(e);
        },
      );
    }, 15);
  });
}

function cinematicTextEnd() {
  var container = document.getElementById("cinematic-text-container");
  var mainMenu = document.getElementById("mainmenu-container");
  container.appendChild(createElement("br"));

  return new Promise(function (resolve) {
    container.appendChild(
      createElement("a", {
        class: "a-link-button",
        innerText: "Continue...",
        clickListener: () => {
          removeChildrenFromElement(container);
          Engine.loadTerminalContent();
          mainMenu.style.visibility = "visible";
          cinematicTextFlag = false;
          resolve();
        },
      }),
    );
  });
}
