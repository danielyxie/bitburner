import { CursorPositions } from './CursorPositions';

// Base Script Editor class for the Ace/CodeMirror/etc. wrappers
const beautify = require('js-beautify').js_beautify;

export class ScriptEditor {
    constructor() {
        this.editor = null; // Stores the CodeMirror editor reference
        this.filenameInput = null; // Stores the filename input DOM element
    }

    init() {
        throw new Error(`Tried to initialize base ScriptEditor class`);
    }

    beautifyScript() {
        if (this.editor == null) {
            console.warn(`ScriptEditor.beautifyScript() called when editor was not initialized`);
            return;
        }
        let code = this.editor.getValue();
        code = beautify(code, {
            indent_size: 4,
            brace_style: "preserve-inline",
        });
        this.editor.setValue(code);
    }

    openScript(filename="", code="") {
        if (this.editor == null || this.filenameInput == null) {
            console.warn(`ScriptEditor.openScript() called when editor was not initialized`);
            return;
        }

        if (filename != "") {
            this.filenameInput.value = filename;
            this.editor.setValue(code);
            this.setCursor(CursorPositions.getCursor(filename));
        }

        this.editor.focus();
    }

    getCode() {
        if (this.editor == null) {
            console.warn(`ScriptEditor.getCode() called when editor was not initialized`);
            return "";
        }

        return this.editor.getValue();
    }

    getFilename() {
        if (this.filenameInput == null) {
            console.warn(`ScriptEditor.getFilename() called when editor was not initialized`);
            return "";
        }

        return this.filenameInput.value;
    }
}
