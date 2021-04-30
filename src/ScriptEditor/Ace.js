import { ScriptEditor } from "./ScriptEditor";

const ace = require('brace');

require('brace/mode/javascript');
require('./AceNetscriptMode');
require('brace/theme/chaos');
require('brace/theme/chrome');
require('brace/theme/monokai');
require('brace/theme/solarized_dark');
require('brace/theme/solarized_light');
require('brace/theme/terminal');
require('brace/theme/twilight');
require('brace/theme/xcode');
require("brace/keybinding/vim");
require("brace/keybinding/emacs");
require("brace/ext/language_tools");

import { NetscriptFunctions } from "../NetscriptFunctions";
import { Settings } from "../Settings/Settings";
import { AceKeybindingSetting } from "../Settings/SettingEnums";

import { clearEventListeners } from "../../utils/uiHelpers/clearEventListeners";
import { createElement } from "../../utils/uiHelpers/createElement";
import { createOptionElement } from "../../utils/uiHelpers/createOptionElement";
import { getSelectText,
         getSelectValue } from "../../utils/uiHelpers/getSelectData";
import { removeChildrenFromElement } from "../../utils/uiHelpers/removeChildrenFromElement";

// Wrapper for Ace editor
const Keybindings = {
    ace: null,
    vim: "ace/keyboard/vim",
    emacs: "ace/keyboard/emacs",
};

function validateInitializationParamters(params) {
    if (params.saveAndCloseFn == null)                          { return false; } // Save & close button function
    if (params.quitFn == null)                                  { return false; } // Quitting editor, aka Engine.loadTerminalContent

    return true;
}

class AceEditorWrapper extends ScriptEditor {
    constructor() {
        super();
        this.vimCommandDisplayWrapper = null;
    }

    init(params) {
        if (this.editor != null) {
            console.error(`AceEditor.init() called when it's already initialized`);
            return false;
        }

        // Validate/Sanitize input
        if (!validateInitializationParamters(params)) {
            console.error(`'params' argument passed into initAceEditor() does not have proper properties`);
            return false;
        }

        // Store the filename input
        this.filenameInput = document.getElementById("script-editor-filename");
        if (this.filenameInput == null) {
            console.error(`Could not get Script Editor filename element (id=script-editor-filename)`);
            return false;
        }

        // Initialize ACE Script editor
        this.editor = ace.edit('ace-editor');
        this.editor.getSession().setMode('ace/mode/netscript');
        this.editor.setTheme('ace/theme/monokai');
        const editorElement = document.getElementById('ace-editor');
        if (editorElement == null) { return false; }
        editorElement.style.fontSize = '16px';
        this.editor.setOption("showPrintMargin", false);

        // Configure some of the VIM keybindings
        ace.config.loadModule('ace/keyboard/vim', function(module) {
            var VimApi = module.CodeMirror.Vim;
            VimApi.defineEx('write', 'w', function(cm, input) {
                params.saveAndCloseFn();
            });
            VimApi.defineEx('quit', 'q', function(cm, input) {
                params.quitFn();
            });
            VimApi.defineEx('xwritequit', 'x', function(cm, input) {
                params.saveAndCloseFn();
            });
            VimApi.defineEx('wqwritequit', 'wq', function(cm, input) {
                params.saveAndCloseFn();
            });
        });

        // Store a reference to the VIM command display
        this.vimCommandDisplayWrapper = document.getElementById("codemirror-vim-command-display-wrapper");
        if (this.vimCommandDisplayWrapper == null) {
            console.error(`Could not get Vim Command Display element (id=codemirror-vim-command-display-wrapper)`);
            return false;
        }

        //Function autocompleter
        this.editor.setOption("enableBasicAutocompletion", true);
        var autocompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                if (prefix.length === 0) {callback(null, []); return;}
                var words = [];
                var fns = NetscriptFunctions(null);
                for (let name in fns) {
                    if (fns.hasOwnProperty(name)) {
                        words.push({
                            name:   name,
                            value:  name,
                        });

                        //Get functions from namespaces
                        const namespaces = ["bladeburner", "hacknet", "codingcontract", "gang", "sleeve"];
                        if (namespaces.includes(name)) {
                            let namespace       = fns[name];
                            if (typeof namespace !== "object") {continue;}
                            let namespaceFns    = Object.keys(namespace);
                            for (let i = 0; i < namespaceFns.length; ++i) {
                                words.push({
                                    name:   namespaceFns[i],
                                    value:  namespaceFns[i],
                                });
                            }
                        }
                    }
                }
                callback(null, words);
            },
        }
        this.editor.completers = [autocompleter];

        return true;
    }

    initialized() {
        return (this.editor != null);
    }

    // Create the configurable Options for this Editor
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
            const optionsPanel = safeGetElementById("script-editor-options-panel", "Script Editor Options Panel");

            // Set editor to visible
            const elem = document.getElementById("ace-editor");
            if (elem instanceof HTMLElement) {
                elem.style.display = "block";
            }

            // Make sure the Vim command display from CodeMirror is invisible
            if (this.vimCommandDisplayWrapper instanceof HTMLElement) {
                this.vimCommandDisplayWrapper.style.display = "none";
            }

            // Theme
            const themeDropdown = safeClearEventListeners("script-editor-option-theme", "Theme Selector");
            removeChildrenFromElement(themeDropdown);
            themeDropdown.add(createOptionElement("Chaos"));
            themeDropdown.add(createOptionElement("Chrome"));
            themeDropdown.add(createOptionElement("Monokai"));
            themeDropdown.add(createOptionElement("Solarized Dark", "Solarized_Dark"));
            themeDropdown.add(createOptionElement("Solarized Light", "Solarized_Light"));
            themeDropdown.add(createOptionElement("Terminal"));
            themeDropdown.add(createOptionElement("Twilight"));
            themeDropdown.add(createOptionElement("XCode"));
            if (Settings.EditorTheme) {
                var initialIndex = 2;
                for (var i = 0; i < themeDropdown.options.length; ++i) {
                    if (themeDropdown.options[i].value === Settings.EditorTheme) {
                        initialIndex = i;
                        break;
                    }
                }
                themeDropdown.selectedIndex = initialIndex;
            } else {
                themeDropdown.selectedIndex = 2;
            }

            themeDropdown.onchange = () => {
                const val = themeDropdown.value;
                Settings.EditorTheme = val;
                const themePath = "ace/theme/" + val.toLowerCase();
                this.editor.setTheme(themePath);
            };
            themeDropdown.onchange();

            // Keybinding
            const keybindingDropdown = safeClearEventListeners("script-editor-option-keybinding", "Keybinding Selector");
            removeChildrenFromElement(keybindingDropdown);
            keybindingDropdown.add(createOptionElement("Ace", AceKeybindingSetting.Ace));
            keybindingDropdown.add(createOptionElement("Vim", AceKeybindingSetting.Vim));
            keybindingDropdown.add(createOptionElement("Emacs", AceKeybindingSetting.Emacs));
            if (Settings.EditorKeybinding) {
                // Sanitize the Keybinding setting
                if (!(Object.values(AceKeybindingSetting).includes(Settings.EditorKeybinding))) {
                    Settings.EditorKeybinding = AceKeybindingSetting.Ace;
                }
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
                var val = keybindingDropdown.value;
                Settings.EditorKeybinding = val;
                this.editor.setKeyboardHandler(Keybindings[val.toLowerCase()]);
            };
            keybindingDropdown.onchange();

            // Highlight Active line
            const highlightActiveChkBox = safeClearEventListeners("script-editor-option-highlightactiveline", "Active Line Checkbox");
            highlightActiveChkBox.onchange = () => {
                this.editor.setHighlightActiveLine(highlightActiveChkBox.checked);
            };

            // Show Invisibles
            const showInvisiblesChkBox = safeClearEventListeners("script-editor-option-showinvisibles", "Show Invisible Checkbox");
            showInvisiblesChkBox.onchange = () => {
                this.editor.setShowInvisibles(showInvisiblesChkBox.checked);
            };

            // Use Soft Tab
            const softTabChkBox = safeClearEventListeners("script-editor-option-usesofttab", "Soft Tab Checkbox");
            softTabChkBox.onchange = () => {
                this.editor.getSession().setUseSoftTabs(softTabChkBox.checked);
            };

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

            // Jshint Maxerr (Flex 1)
            const flex1Fieldset = resetFlexibleOption("script-editor-option-flex1-fieldset");
            const flex1Id = "script-editor-option-maxerr";
            const flex1ValueLabel = createElement("em", { innerText: "200" });
            flex1Fieldset.appendChild(createElement("label", {
                for: flex1Id,
                innerText: "Max Error Count",
            }));
            const flex1Input = createElement("input", {
                id: flex1Id,
                max: "1000",
                min: "50",
                name: flex1Id,
                step: "1",
                type: "range",
                value: "200",
                changeListener: () => {
                    this.editor.getSession().$worker.send("changeOptions", [{maxerr:flex1Input.value}]);
                    flex1ValueLabel.innerText = flex1Input.value;
                },
            });
            flex1Fieldset.appendChild(flex1Input);
            flex1Fieldset.appendChild(flex1ValueLabel);

            // Nothing for Flex Options 2-4
            removeFlexibleOption("script-editor-option-flex2-fieldset");
            removeFlexibleOption("script-editor-option-flex3-fieldset");
            removeFlexibleOption("script-editor-option-flex4-fieldset");
        } catch(e) {
            console.error(`Exception caught: ${e}`);
            return false;
        }
    }

    isFocused() {
        if (this.editor == null) { return false; }
        return this.editor.isFocused();
    }

    // Sets the editor to be invisible. Does not require this class to be initialized
    setInvisible() {
        const elem = document.getElementById("ace-editor");
        if (elem instanceof HTMLElement) {
            elem.style.display = "none";
        }
    }

    getCursor() {
        return this.editor.getCursorPosition();
    }

    setCursor(pos) {
        this.editor.gotoLine(pos.row+1, pos.column);
    }
}

export const AceEditor = new AceEditorWrapper();
