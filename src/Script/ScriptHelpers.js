import { Script } from "./Script";

import { RamCalculationErrorCode } from "./RamCalculationErrorCodes";
import { calculateRamUsage } from "./RamCalculations";
import { isScriptFilename } from "./ScriptHelpersTS";

import {CONSTANTS} from "../Constants";
import {Engine} from "../engine";
import { parseFconfSettings } from "../Fconf/Fconf";
import {
    iTutorialSteps,
    iTutorialNextStep,
    ITutorial,
} from "../InteractiveTutorial";
import { Player } from "../Player";
import { AceEditor } from "../ScriptEditor/Ace";
import { CodeMirrorEditor } from "../ScriptEditor/CodeMirror";
import { CursorPositions } from "../ScriptEditor/CursorPositions";
import { AllServers } from "../Server/AllServers";
import { processSingleServerGrowth } from "../Server/ServerHelpers";
import { Settings } from "../Settings/Settings";
import { EditorSetting } from "../Settings/SettingEnums";
import { isValidFilePath } from "../Terminal/DirectoryHelpers";
import { TextFile } from "../TextFile";

import { Page, routing } from "../ui/navigationTracking";
import { numeralWrapper } from "../ui/numeralFormat";

import { dialogBoxCreate } from "../../utils/DialogBox";
import { compareArrays } from "../../utils/helpers/compareArrays";
import { createElement } from "../../utils/uiHelpers/createElement";

var scriptEditorRamCheck = null, scriptEditorRamText = null;
export function scriptEditorInit() {
    // Wrapper container that holds all the buttons below the script editor
    const wrapper = document.getElementById("script-editor-buttons-wrapper");
    if (wrapper == null) {
        console.error("Could not find 'script-editor-buttons-wrapper'");
        return false;
    }

    // Beautify button
    const beautifyButton = createElement("button", {
        class: "std-button",
        display: "inline-block",
        innerText: "Beautify",
        clickListener:()=>{
            let editor = getCurrentEditor();
            if (editor != null) {
                editor.beautifyScript();
            }
            return false;
        },
    });

    // Text that displays RAM calculation
    scriptEditorRamText = createElement("p", {
        display:"inline-block", margin:"10px", id:"script-editor-status-text",
    });

    // Label for checkbox (defined below)
    const checkboxLabel = createElement("label", {
        for:"script-editor-ram-check", margin:"4px", marginTop: "8px",
        innerText:"Dynamic RAM Usage Checker", color:"white",
        tooltip:"Enable/Disable the dynamic RAM Usage display. You may " +
                "want to disable it for very long scripts because there may be " +
                "performance issues",
    });

    // Checkbox for enabling/disabling dynamic RAM calculation
    scriptEditorRamCheck = createElement("input", {
        type:"checkbox", name:"script-editor-ram-check", id:"script-editor-ram-check",
        margin:"4px", marginTop: "8px",
    });
    scriptEditorRamCheck.checked = true;

    // Link to Netscript documentation
    const documentationButton = createElement("a", {
        class: "std-button",
        display: "inline-block",
        href:"https://bitburner.readthedocs.io/en/latest/index.html",
        innerText:"Netscript Documentation",
        target:"_blank",
    });

    // Save and Close button
    const closeButton = createElement("button", {
        class: "std-button",
        display: "inline-block",
        innerText: "Save & Close (Ctrl/Cmd + b)",
        clickListener:()=>{
            saveAndCloseScriptEditor();
            return false;
        },
    });

    // Add all buttons to the UI
    wrapper.appendChild(beautifyButton);
    wrapper.appendChild(closeButton);
    wrapper.appendChild(scriptEditorRamText);
    wrapper.appendChild(scriptEditorRamCheck);
    wrapper.appendChild(checkboxLabel);
    wrapper.appendChild(documentationButton);

    // Initialize editors
    const initParams = {
        saveAndCloseFn: saveAndCloseScriptEditor,
        quitFn: Engine.loadTerminalContent,
    }

    AceEditor.init(initParams);
    CodeMirrorEditor.init(initParams);

    // Setup the selector for which Editor to use
    const editorSelector = document.getElementById("script-editor-option-editor");
    if (editorSelector == null) {
        console.error(`Could not find DOM Element for editor selector (id=script-editor-option-editor)`);
        return false;
    }

    for (let i = 0; i < editorSelector.options.length; ++i) {
        if (editorSelector.options[i].value === Settings.Editor) {
            editorSelector.selectedIndex = i;
            break;
        }
    }

    editorSelector.onchange = () => {
        const opt = editorSelector.value;
        switch (opt) {
            case EditorSetting.Ace: {
                const codeMirrorCode = CodeMirrorEditor.getCode();
                const codeMirrorFn = CodeMirrorEditor.getFilename();
                AceEditor.create();
                CodeMirrorEditor.setInvisible();
                AceEditor.openScript(codeMirrorFn, codeMirrorCode);
                break;
            }
            case EditorSetting.CodeMirror: {
                const aceCode = AceEditor.getCode();
                const aceFn = AceEditor.getFilename();
                CodeMirrorEditor.create();
                AceEditor.setInvisible();
                CodeMirrorEditor.openScript(aceFn, aceCode);
                break;
            }
            default:
                console.error(`Unrecognized Editor Setting: ${opt}`);
                return;
        }

        Settings.Editor = opt;
    }

    editorSelector.onchange(); // Trigger the onchange event handler
}

export function getCurrentEditor() {
    switch (Settings.Editor) {
        case EditorSetting.Ace:
            return AceEditor;
        case EditorSetting.CodeMirror:
            return CodeMirrorEditor;
        default:
            throw new Error(`Invalid Editor Setting: ${Settings.Editor}`);
            return null;
    }
}

//Updates RAM usage in script
export async function updateScriptEditorContent() {
    var filename = document.getElementById("script-editor-filename").value;
    if (scriptEditorRamCheck == null || !scriptEditorRamCheck.checked || !isScriptFilename(filename)) {
        scriptEditorRamText.innerText = "N/A";
        return;
    }

    let code;
    try {
        code = getCurrentEditor().getCode();
    } catch(e) {
        scriptEditorRamText.innerText = "RAM: ERROR";
        return;
    }

    var codeCopy = code.repeat(1);
    var ramUsage = await calculateRamUsage(codeCopy, Player.getCurrentServer().scripts);
    if (ramUsage > 0) {
        scriptEditorRamText.innerText = "RAM: " + numeralWrapper.formatRAM(ramUsage);
    } else {
        switch (ramUsage) {
            case RamCalculationErrorCode.ImportError:
                scriptEditorRamText.innerText = "RAM: Import Error";
                break;
            case RamCalculationErrorCode.URLImportError:
                scriptEditorRamText.innerText = "RAM: HTTP Import Error";
                break;
            case RamCalculationErrorCode.SyntaxError:
            default:
                scriptEditorRamText.innerText = "RAM: Syntax Error";
                break;
        }

    }
}

//Define key commands in script editor (ctrl o to save + close, etc.)
$(document).keydown(function(e) {
    if (Settings.DisableHotkeys === true) {return;}
	if (routing.isOn(Page.ScriptEditor)) {
		//Ctrl + b
        if (e.keyCode == 66 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
			saveAndCloseScriptEditor();
        }
	}
});

function saveAndCloseScriptEditor() {
    var filename = document.getElementById("script-editor-filename").value;

    let code, cursor;
    try {
        code = getCurrentEditor().getCode();
        cursor = getCurrentEditor().getCursor();
        CursorPositions.saveCursor(filename, cursor);
    } catch(e) {
        dialogBoxCreate("Something went wrong when trying to save (getCurrentEditor().getCode() or getCurrentEditor().getCursor()). Please report to game developer with details");
        return;
    }

    if (ITutorial.isRunning && ITutorial.currStep === iTutorialSteps.TerminalTypeScript) {
        //Make sure filename + code properly follow tutorial
        if (filename !== "foodnstuff.script") {
            dialogBoxCreate("Leave the script name as 'foodnstuff'!");
            return;
        }
        code = code.replace(/\s/g, "");
        if (code.indexOf("while(true){hack('foodnstuff');}") == -1) {
            dialogBoxCreate("Please copy and paste the code from the tutorial!");
            return;
        }

        //Save the script
        let s = Player.getCurrentServer();
        for (var i = 0; i < s.scripts.length; i++) {
            if (filename == s.scripts[i].filename) {
                s.scripts[i].saveScript(getCurrentEditor().getCode(), Player.currentServer, Player.getCurrentServer().scripts);
                Engine.loadTerminalContent();
                return iTutorialNextStep();
            }
        }

        // If the current script does NOT exist, create a new one
        let script = new Script();
        script.saveScript(getCurrentEditor().getCode(), Player.currentServer, Player.getCurrentServer().scripts);
        s.scripts.push(script);

        return iTutorialNextStep();
    }

    if (filename == "") {
        dialogBoxCreate("You must specify a filename!");
        return;
    }

    if (filename !== ".fconf" && !isValidFilePath(filename)) {
        dialogBoxCreate("Script filename can contain only alphanumerics, hyphens, and underscores, and must end with an extension.");
        return;
    }

    var s = Player.getCurrentServer();
    if (filename === ".fconf") {
        try {
            parseFconfSettings(code);
        } catch(e) {
            dialogBoxCreate(`Invalid .fconf file: ${e}`);
            return;
        }
    } else if (isScriptFilename(filename)) {
        //If the current script already exists on the server, overwrite it
        for (let i = 0; i < s.scripts.length; i++) {
            if (filename == s.scripts[i].filename) {
                s.scripts[i].saveScript(getCurrentEditor().getCode(), Player.currentServer, Player.getCurrentServer().scripts);
                Engine.loadTerminalContent();
                return;
            }
        }

        //If the current script does NOT exist, create a new one
        const script = new Script();
        script.saveScript(getCurrentEditor().getCode(), Player.currentServer, Player.getCurrentServer().scripts);
        s.scripts.push(script);
    } else if (filename.endsWith(".txt")) {
        for (let i = 0; i < s.textFiles.length; ++i) {
            if (s.textFiles[i].fn === filename) {
                s.textFiles[i].write(code);
                Engine.loadTerminalContent();
                return;
            }
        }
        const textFile = new TextFile(filename, code);
        s.textFiles.push(textFile);
    } else {
        dialogBoxCreate("Invalid filename. Must be either a script (.script) or " +
                        " or text file (.txt)")
        return;
    }
    Engine.loadTerminalContent();
}

export function scriptCalculateOfflineProduction(runningScriptObj) {
	//The Player object stores the last update time from when we were online
	const thisUpdate = new Date().getTime();
	const lastUpdate = Player.lastUpdate;
	const timePassed = (thisUpdate - lastUpdate) / 1000;	//Seconds

	//Calculate the "confidence" rating of the script's true production. This is based
	//entirely off of time. We will arbitrarily say that if a script has been running for
	//4 hours (14400 sec) then we are completely confident in its ability
	let confidence = (runningScriptObj.onlineRunningTime) / 14400;
	if (confidence >= 1) {confidence = 1;}

    //Data map: [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]

    // Grow
    for (const ip in runningScriptObj.dataMap) {
        if (runningScriptObj.dataMap.hasOwnProperty(ip)) {
            if (runningScriptObj.dataMap[ip][2] == 0 || runningScriptObj.dataMap[ip][2] == null) {continue;}
            const serv = AllServers[ip];
            if (serv == null) {continue;}
            const timesGrown = Math.round(0.5 * runningScriptObj.dataMap[ip][2] / runningScriptObj.onlineRunningTime * timePassed);
            runningScriptObj.log(`Called on ${serv.hostname} ${timesGrown} times while offline`);
            const growth = processSingleServerGrowth(serv, timesGrown, Player);
            runningScriptObj.log(`'${serv.hostname}' grown by ${numeralWrapper.format(growth * 100 - 100, '0.000000%')} while offline`);
        }
    }

    // Offline EXP gain
	// A script's offline production will always be at most half of its online production.
	const expGain = confidence * (runningScriptObj.onlineExpGained / runningScriptObj.onlineRunningTime) * timePassed;
	Player.gainHackingExp(expGain);

	// Update script stats
	runningScriptObj.offlineRunningTime += timePassed;
	runningScriptObj.offlineExpGained += expGain;

    // Weaken
    for (const ip in runningScriptObj.dataMap) {
        if (runningScriptObj.dataMap.hasOwnProperty(ip)) {
            if (runningScriptObj.dataMap[ip][3] == 0 || runningScriptObj.dataMap[ip][3] == null) {continue;}
            const serv = AllServers[ip];
            if (serv == null) {continue;}
            const timesWeakened = Math.round(0.5 * runningScriptObj.dataMap[ip][3] / runningScriptObj.onlineRunningTime * timePassed);
            runningScriptObj.log(`Called weaken() on ${serv.hostname} ${timesWeakened} times while offline`);
            serv.weaken(CONSTANTS.ServerWeakenAmount * timesWeakened);
        }
    }
}

//Returns a RunningScript object matching the filename and arguments on the
//designated server, and false otherwise
export function findRunningScript(filename, args, server) {
    for (var i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].filename === filename &&
            compareArrays(server.runningScripts[i].args, args)) {
            return server.runningScripts[i];
        }
    }
    return null;
}

//Returns a RunningScript object matching the pid on the
//designated server, and false otherwise
export function findRunningScriptByPid(pid, server) {
    for (var i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].pid === pid) {
            return server.runningScripts[i];
        }
    }
    return null;
}
