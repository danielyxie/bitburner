import { dialogBoxCreate } from "../utils/DialogBox";
import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver,
} from "../utils/JSONReviver";
import { setTimeoutRef } from "./utils/SetTimeoutRef";

/**
 * Represents a plain text file that is typically stored on a server.
 */
export class TextFile {
    /**
     * Initiatizes a TextFile from a JSON save state.
     */
    static fromJSON(value: any): TextFile {
        return Generic_fromJSON(TextFile, value.data);
    }

    /**
     * The full file name.
     */
    fn: string;

    /**
     * The content of the file.
     */
    text: string;

    constructor(fn: string = "", txt: string = "") {
        this.fn = (fn.endsWith(".txt") ? fn : `${fn}.txt`).replace(/\s+/g, "");
        this.text = txt;
    }

    /**
     * Concatenates the raw values to the end of current content.
     */
    append(txt: string): void {
        this.text += txt;
    }

    /**
     * Serves the file to the user as a downloadable resource through the browser.
     */
    download(): void {
        const filename: string = this.fn;
        const file: Blob = new Blob([ this.text ], { type: "text/plain" });
        /* tslint:disable-next-line:strict-boolean-expressions */
        if (window.navigator.msSaveOrOpenBlob) {
            // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else {
            // Others
            const a: HTMLAnchorElement = document.createElement("a");
            const url: string = URL.createObjectURL(file);
            a.href = url;
            a.download = this.fn;
            document.body.appendChild(a);
            a.click();
            setTimeoutRef(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },            0);
        }
    }

    /**
     * Retrieve the content of the file.
     */
    read(): string {
        return this.text;
    }

    /**
     * Shows the content to the user via the game's dialog box.
     */
    show(): void {
        dialogBoxCreate(`${this.fn}<br /><br />${this.text}`, true);
    }

    /**
     * Serialize the current file to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("TextFile", this);
    }

    /**
     * Replaces the current content with the text provided.
     */
    write(txt: string): void {
        this.text = txt;
    }
}

Reviver.constructors.TextFile = TextFile;

/**
 * Retrieve the file object for the filename on the specified server.
 * @param fn The file name to look for
 * @param server The server object to look in
 * @returns The file object, or null if it couldn't find it.
 */
export function getTextFile(fn: string, server: any): TextFile | null {
    const filename: string = !fn.endsWith(".txt") ? `${fn}.txt` : fn;

    for (const file of (server.textFiles as TextFile[])) {
        if (file.fn === filename) {
            return file;
        }
    }

    return null;
}

/**
 * Creates a TextFile on the target server.
 * @param fn The file name to create.
 * @param txt The contents of the file.
 * @param server The server that the file should be created on.
 * @returns The instance of the file.
 */
export function createTextFile(fn: string, txt: string, server: any): TextFile | undefined {
    if (getTextFile(fn, server) !== null) {
        // This should probably be a `throw`...
        /* tslint:disable-next-line:no-console */
        console.error(`A file named "${fn}" already exists on server ${server.hostname}.`);

        return undefined;
    }
    const file: TextFile = new TextFile(fn, txt);
    server.textFiles.push(file);

    return file;
}

/* tslint:disable-next-line:no-unused-variable */
function deleteTextFile(fn: string, server: any): boolean {
    const filename: string = !fn.endsWith(".txt") ? `${fn}.txt` : fn;
    /* tslint:disable-next-line:typedef */
    for (let i = 0; i < server.textFiles.length; ++i) {
        if (server.textFiles[i].fn === filename) {
            server.textFiles.splice(i, 1);

            return true;
        }
    }

    return false;
}
