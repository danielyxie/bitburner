// Wrapper for CodeMirror editor
// https://github.com/codemirror/codemirror
import { ScriptEditor } from "./ScriptEditor";

import 'codemirror/lib/codemirror.css';

import 'codemirror/theme/monokai.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/abcdef.css';
import 'codemirror/theme/ambiance-mobile.css';
import 'codemirror/theme/ambiance.css';
import 'codemirror/theme/base16-dark.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/bespin.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/theme/colorforth.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/duotone-dark.css';
import 'codemirror/theme/duotone-light.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/elegant.css';
import 'codemirror/theme/erlang-dark.css';
import 'codemirror/theme/gruvbox-dark.css';
import 'codemirror/theme/hopscotch.css';
import 'codemirror/theme/icecoder.css';
import 'codemirror/theme/idea.css';
import 'codemirror/theme/isotope.css';
import 'codemirror/theme/lesser-dark.css';
import 'codemirror/theme/liquibyte.css';
import 'codemirror/theme/lucario.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/mbo.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/theme/neat.css';
import 'codemirror/theme/neo.css';
import 'codemirror/theme/night.css';
import 'codemirror/theme/oceanic-next.css';
import 'codemirror/theme/panda-syntax.css';
import 'codemirror/theme/paraiso-dark.css';
import 'codemirror/theme/paraiso-light.css';
import 'codemirror/theme/pastel-on-dark.css';
import 'codemirror/theme/railscasts.css';
import 'codemirror/theme/rubyblue.css';
import 'codemirror/theme/seti.css';
import 'codemirror/theme/shadowfox.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/ssms.css';
import 'codemirror/theme/the-matrix.css';
import 'codemirror/theme/tomorrow-night-bright.css';
import 'codemirror/theme/tomorrow-night-eighties.css';
import 'codemirror/theme/ttcn.css';
import 'codemirror/theme/twilight.css';
import 'codemirror/theme/vibrant-ink.css';
import 'codemirror/theme/xq-dark.css';
import 'codemirror/theme/xq-light.css';
import 'codemirror/theme/yeti.css';
import 'codemirror/theme/zenburn.css';

import CodeMirror from "codemirror/lib/codemirror.js";
import "codemirror/mode/javascript/javascript.js";
import "./CodeMirrorNetscriptMode";

import 'codemirror/keymap/sublime.js';
import 'codemirror/keymap/vim.js';
import 'codemirror/keymap/emacs.js';

import 'codemirror/addon/comment/continuecomment.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/selection/active-line.js';

window.JSHINT = require('jshint').JSHINT;
import './CodeMirrorNetscriptLint.js';

import { NetscriptFunctions } from "../NetscriptFunctions";
import { CodeMirrorKeybindingSetting,
         CodeMirrorThemeSetting } from "../Settings/SettingEnums";
import { Settings } from "../Settings/Settings";

import { clearEventListeners } from "../../utils/uiHelpers/clearEventListeners";
import { createElement } from "../../utils/uiHelpers/createElement";
import { createOptionElement } from "../../utils/uiHelpers/createOptionElement";
import { removeChildrenFromElement } from "../../utils/uiHelpers/removeChildrenFromElement";

// Max number of invisibles to be shown in a group if the "Show Invisibles" option
// is marked
const MaxInvisibles = 20;

function validateInitializationParamters(params) {
    if (params.saveAndCloseFn == null)                          { return false; } // Save & close button function
    if (params.quitFn == null)                                  { return false; } // Quitting editor, aka Engine.loadTerminalContent

    return true;
}

class CodeMirrorEditorWrapper extends ScriptEditor {
    constructor() {
        super();
        this.vimCommandDisplay = null;
        this.vimCommandDisplayWrapper = null;
        this.tabsStyleElement = null;
    }

    init(params) {
        if (this.editor != null) {
            console.error(`CodeMirrorEditor.init() called when it's already initialized`);
            return false;
        }

        // Validate/Sanitize input
        if (!validateInitializationParamters(params)) {
            console.error(`'params' argument passed into CodeMirrorEditor.init() does not have proper properties`);
            return false;
        }

        // Store the filename input
        this.filenameInput = document.getElementById("script-editor-filename");
        if (this.filenameInput == null) {
            console.error(`Could not get Script Editor filename element (id=script-editor-filename)`);
            return false;
        }

        // Add styling for the "Show Invisibles" option for spaces
        const classBase = '.CodeMirror .cm-whitespace-';
        const spaceChar = '·';
        const style = document.createElement('style');

        style.setAttribute('data-name', 'js-show-invisibles');

        let rules = '';
        let spaceChars = '';

        for (let i = 1; i <= MaxInvisibles; ++i) {
            spaceChars += spaceChar;

            const rule = classBase + i + '::before { content: "' + spaceChars + '";}\n';
            rules += rule;
        }

        style.textContent = rules;
        document.head.appendChild(style);

        // Add an element for the "Show Invisible" option for tabs
        this.tabsStyleElement = document.createElement('style');
        document.head.appendChild(this.tabsStyleElement);

        // Store a reference to the VIM command display
        this.vimCommandDisplay = document.getElementById("codemirror-vim-command-display");
        this.vimCommandDisplayWrapper = document.getElementById("codemirror-vim-command-display-wrapper");

        // Define a "Save" command for CodeMirror so shortcuts like Ctrl + s
        // will save in-game
        CodeMirror.commands.save = function() { params.saveAndCloseFn(); }

        // Add Netscript Functions to the autocompleter
        const netscriptFns = [];
        var fnsObj = NetscriptFunctions(null);
        for (let name in fnsObj) {
            if (fnsObj.hasOwnProperty(name)) {
                netscriptFns.push(name);

                //Get functions from namespaces
                const namespaces = ["bladeburner", "hacknet", "codingcontract", "gang", "sleeve", "heart", "formulas"];
                if (namespaces.includes(name)) {
                    let namespace = fnsObj[name];
                    if (typeof namespace !== "object") {continue;}
                    let namespaceFns = Object.keys(namespace);
                    for (let i = 0; i < namespaceFns.length; ++i) {
                        netscriptFns.push(namespaceFns[i]);
                    }
                }
            }
        }
        netscriptFns.sort().reverse();

        CodeMirror.hint.netscript = function(editor) {
            const origList = CodeMirror.hint.javascript(editor) || {from: editor.getCursor(), to: editor.getCursor(), list: []};
            origList.list.push(...netscriptFns);
            let list = origList.list || [];
            let cursor = editor.getCursor();
            let currentLine = editor.getLine(cursor.line);
            let start = cursor.ch;
            let end = start;
            while (end < currentLine.length && /[\w$]+/.test(currentLine.charAt(end))) ++end;
            while (start && /[\w$]+/.test(currentLine.charAt(start - 1))) --start;
            let curWord = start != end && currentLine.slice(start, end);
            let regex = new RegExp('^' + curWord, 'i');
            let result = {
                list: (!curWord ? list : list.filter(function (item) {
                    return item.match(regex);
                })).sort(),
                from: CodeMirror.Pos(cursor.line, start),
                to: CodeMirror.Pos(cursor.line, end),
            };

            return result;
        };

        // Configure VIM keybindings
        var VimApi = CodeMirror.Vim;
        VimApi.defineEx('write', 'w', function() {
            params.saveAndCloseFn();
        });
        VimApi.defineEx('quit', 'q', function() {
            params.quitFn();
        });
        VimApi.defineEx('xwritequit', 'x', function() {
            params.saveAndCloseFn();
        });
        VimApi.defineEx('wqwritequit', 'wq', function() {
            params.saveAndCloseFn();
        });
    }

    initialized() {
        return (this.filenameInput != null);
    }

    create() {
        function safeGetElementById(id, whatFor="") {
            const elem = document.getElementById(id);
            if (elem == null) {
                throw new Error(`Could not find ${whatFor} DOM element(id=${id})`);
            }

            return elem;
        }

        function safeClearEventListeners(id, whatFor="") {
            const elem = clearEventListeners(id);
            if (elem == null) {
                throw new Error(`Could not find ${whatFor} DOM element(id=${id})`);
            }

            return elem;
        }

        try {
            if (!this.initialized()) {
                console.warn(`CodeMirrorEditor.create() called when editor was not initialized`);
                return;
            }

            // Get and sanitize the keybinding (keymap) setting
            if (!(Object.values(CodeMirrorKeybindingSetting).includes(Settings.EditorKeybinding))) {
                Settings.EditorKeybinding = CodeMirrorKeybindingSetting.Default;
            }

            // Initialize CodeMirror Editor
            const textAreaElement = safeGetElementById("codemirror-editor", "CodeMirror Textarea");
            const formElement = safeGetElementById("codemirror-form-wrapper", "CodeMirror Form Wrapper");
            formElement.style.display = "block";

            this.editor = CodeMirror.fromTextArea(textAreaElement, {
                autofocus: true,
                extraKeys: { "Ctrl-Space": "autocomplete" },
                foldGutter: true,
                gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                highlightSelectionMatches: true,
                hintOptions: { hint: CodeMirror.hint.netscript },
                indentUnit: 4,
                keyMap: "default",
                lineNumbers: true,
                matchBrackets: true,
                maxInvisibles: 32,
                mode: "netscript",
                theme: Settings.EditorTheme,
            });

            // Setup Theme Option
            const themeDropdown = safeClearEventListeners("script-editor-option-theme", "Theme Selector");
            removeChildrenFromElement(themeDropdown);
            const themeOptions = Object.keys(CodeMirrorThemeSetting);
            for (let i = 0; i < themeOptions.length; ++i) {
                const themeKey = themeOptions[i];
                const themeValue = CodeMirrorThemeSetting[themeKey];
                themeDropdown.add(createOptionElement(themeKey, themeValue));
            }
            if (Settings.EditorTheme) {
                var initialIndex = 0;
                for (var i = 0; i < themeDropdown.options.length; ++i) {
                    if (themeDropdown.options[i].value === Settings.EditorTheme) {
                        initialIndex = i;
                        break;
                    }
                }
                themeDropdown.selectedIndex = initialIndex;
            } else {
                themeDropdown.selectedIndex = 0;
            }

            themeDropdown.onchange = () => {
                const val = themeDropdown.value;
                Settings.EditorTheme = val;
                this.editor.setOption("theme", val);
            };
            themeDropdown.onchange();

            // Setup Keymap Option
            const keybindingDropdown = safeClearEventListeners("script-editor-option-keybinding", "Keymap Selector");
            if (keybindingDropdown == null) {
                console.error(`Could not find Script Editor's keybinding selector element (id="script-editor-option-keybinding")`);
                return false;
            }
            removeChildrenFromElement(keybindingDropdown);
            keybindingDropdown.add(createOptionElement("Default", CodeMirrorKeybindingSetting.Default));
            keybindingDropdown.add(createOptionElement("Sublime", CodeMirrorKeybindingSetting.Sublime));
            keybindingDropdown.add(createOptionElement("Vim", CodeMirrorKeybindingSetting.Vim));
            keybindingDropdown.add(createOptionElement("Emacs", CodeMirrorKeybindingSetting.Emacs));
            if (Settings.EditorKeybinding) {
                var initialIndex = 0;
                for (var i = 0; i < keybindingDropdown.options.length; ++i) {
                    if (keybindingDropdown.options[i].value === Settings.EditorKeybinding) {
                        initialIndex = i;
                        break;
                    }
                }
                keybindingDropdown.selectedIndex = initialIndex;
            } else {
                keybindingDropdown.selectedIndex = 0;
            }
            keybindingDropdown.onchange = () => {
                // Set Vim command display to be invisible initially
                this.vimCommandDisplayWrapper.style.display = "none";

                const val = keybindingDropdown.value;
                Settings.EditorKeybinding = val;
                this.editor.removeKeyMap(CodeMirror.keyMap.default);
                this.editor.removeKeyMap(CodeMirror.keyMap.sublime);
                this.editor.removeKeyMap(CodeMirror.keyMap.emacs);
                this.editor.removeKeyMap(CodeMirror.keyMap.vim);

                // Setup the VIM command display
                let keys = '';
                const handleVimKeyPress = (key) => {
                    keys = keys + key;
                    this.vimCommandDisplay.innerHTML = keys;
                }
                const handleVimCommandDone = () => {
                    keys = '';
                    this.vimCommandDisplay.innerHTML = keys;
                }
                if (val === CodeMirrorKeybindingSetting.Vim) {
                    this.vimCommandDisplayWrapper.style.display = "block";
                    this.editor.on('vim-keypress', handleVimKeyPress);
                    this.editor.on('vim-command-done', handleVimCommandDone);

                } else {
                    this.vimCommandDisplayWrapper.style.display = "none";
                    this.editor.off('vim-keypress', handleVimKeyPress);
                    this.editor.off('vim-command-done', handleVimCommandDone);
                }

                this.editor.addKeyMap(val);
                this.editor.setOption("keyMap", val);
            };
            keybindingDropdown.onchange();

            // Highlight Active line
            const highlightActiveChkBox = safeClearEventListeners("script-editor-option-highlightactiveline", "Active Line Checkbox");
            highlightActiveChkBox.onchange = () => {
                this.editor.setOption("styleActiveLine", highlightActiveChkBox.checked);
            };
            highlightActiveChkBox.onchange();

            // Show Invisibles
            const showInvisiblesChkBox = safeClearEventListeners("script-editor-option-showinvisibles", "Show Invisible Checkbox");
            showInvisiblesChkBox.onchange = () => {
                const overlayMode = {
                    name: 'invisibles',
                    token:  function(stream) {
                        var ret,
                            spaces  = 0,
                            space   = stream.peek() === ' ';

                        if (space) {
                            while (space && spaces < MaxInvisibles) {
                                ++spaces;

                                stream.next();
                                space = stream.peek() === ' ';
                            }

                            ret = 'whitespace whitespace-' + spaces;
                        } else {
                            while (!stream.eol() && !space) {
                                stream.next();

                                space = stream.peek() === ' ';
                            }

                            ret = 'cm-eol';
                        }

                        return ret;
                    },
                };

                if (showInvisiblesChkBox.checked) {
                    // Spaces
                    this.editor.addOverlay(overlayMode);

                    // Tabs
                    this.tabsStyleElement.innerHTML = ".cm-tab {background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAYAAAAkuj5RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABDSURBVEhLYxgFo2BkAGYH/9r/QFoAxIGyhx6AORzZA4xD1TcHNjYzQplDB2CLgaECYHkADIZqqgGBoZdsRsHgBgwMAB8iFHF42AERAAAAAElFTkSuQmCC);background-position: right;background-repeat: no-repeat;}";
                } else {
                    this.editor.removeOverlay("invisibles");
                    this.tabsStyleElement.innerHTML = "";
                }
            };
            showInvisiblesChkBox.onchange();

            //Use Soft Tab
            const softTabChkBox = safeClearEventListeners("script-editor-option-usesofttab", "Soft Tab Checkbox");
            softTabChkBox.onchange = () => {
                this.editor.setOption("indentWithTabs", !softTabChkBox.checked);
                if (softTabChkBox.checked) {
                    this.editor.addKeyMap({
                        name: "soft-tabs-keymap",
                        "Tab": function (cm) {
                            if (cm.somethingSelected()) {
                                var sel = cm.getSelection("\n");
                                // Indent only if there are multiple lines selected, or if the selection spans a full line
                                if (sel.length > 0 && (sel.indexOf("\n") > -1 || sel.length === cm.getLine(cm.getCursor().line).length)) {
                                    cm.indentSelection("add");
                                    return;
                                }
                            }

                            if (cm.options.indentWithTabs)
                                cm.execCommand("insertTab");
                            else
                                cm.execCommand("insertSoftTab");
                        },
                        "Shift-Tab": function (cm) {
                            cm.indentSelection("subtract");
                        },
                    });
                } else {
                    this.editor.removeKeyMap("soft-tabs-keymap");
                }
            };
            softTabChkBox.onchange();

            // Some helper functions for dealing with flexible options
            function resetFlexibleOption(id) {
                const fieldset = safeGetElementById(id);
                removeChildrenFromElement(fieldset);
                fieldset.style.display = "block";
                return fieldset;
            }

            function removeFlexibleOption(id) {
                // This doesn't really remove it, just sets it to invisible
                const fieldset = resetFlexibleOption(id);
                fieldset.style.display = "none";
                return fieldset;
            }

            // Flex 1: Automatically Close Brackets and Quotes
            const flex1Fieldset = resetFlexibleOption("script-editor-option-flex1-fieldset");
            const flex1Id = "script-editor-option-flex1";
            flex1Fieldset.appendChild(createElement("label", {
                for: flex1Id,
                innerText: "Auto-Close Brackets/Quotes",
            }));

            const flex1Checkbox = createElement("input", {
                checked: true,
                id: flex1Id,
                name: flex1Id,
                type: "checkbox",
            });
            flex1Fieldset.appendChild(flex1Checkbox);
            flex1Checkbox.onchange = () => {
                this.editor.setOption("autoCloseBrackets", flex1Checkbox.checked);
            };
            flex1Checkbox.onchange();

            // Flex 2: Disable/Enable Linting
            const flex2Fieldset = resetFlexibleOption("script-editor-option-flex2-fieldset");
            const flex2Id = "script-editor-option-flex2";
            flex2Fieldset.appendChild(createElement("label", {
                for: flex2Id,
                innerText: "Enable Linting",
            }));

            const flex2Checkbox = createElement("input", {
                checked: true,
                id: flex2Id,
                name: flex2Id,
                type: "checkbox",
            });
            flex2Fieldset.appendChild(flex2Checkbox);
            flex2Checkbox.onchange = () => {
                if (flex2Checkbox.checked) {
                    this.editor.setOption("lint", CodeMirror.lint.netscript);
                } else {
                    this.editor.setOption("lint", false);
                }
            }
            flex2Checkbox.onchange();

            // Flex 3: Continue Comments
            const flex3Fieldset = resetFlexibleOption("script-editor-option-flex3-fieldset");
            const flex3Id = "script-editor-option-flex3";
            flex3Fieldset.appendChild(createElement("label", {
                for: flex3Id,
                innerText: "Continue Comments",
            }));

            const flex3Checkbox = createElement("input", {
                checked: true,
                id: flex3Id,
                name: flex3Id,
                type: "checkbox",
            });
            flex3Fieldset.appendChild(flex3Checkbox);
            flex3Checkbox.onchange = () => {
                this.editor.setOption("continueComments", flex3Checkbox.checked);
            }
            flex3Checkbox.onchange();

            removeFlexibleOption("script-editor-option-flex4-fieldset");

            this.editor.refresh();
        } catch(e) {
            console.error(`Exception caught: ${e}. ${e.stack}`);
            return false;
        }
    }

    isFocused() {
        if (this.editor == null) { return false; }
        return this.editor.hasFocus();
    }

    // Sets the editor to be invisible
    setInvisible() {
        if (!this.initialized()) {
            console.warn(`CodeMirrorEditor.setInvisible() called when editor was not initialized`);
            return;
        }

        if (this.editor != null) {
            this.editor.toTextArea();
            this.editor = null;
        }

        const elem = document.getElementById("codemirror-form-wrapper");
        if (elem instanceof HTMLElement) {
            elem.style.display = "none";
        }
    }

    getCursor() {
        const c = this.editor.getCursor();  //I need to get the cursor position
        return {row: c.line, column: c.ch};
    }

    setCursor(pos) {
        this.editor.setCursor({line: pos.row, ch: pos.column});
    }
}

export const CodeMirrorEditor = new CodeMirrorEditorWrapper();
