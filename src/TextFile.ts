import {dialogBoxCreate} from "../utils/DialogBox";
import {Reviver, Generic_toJSON, Generic_fromJSON} from "../utils/JSONReviver";

export class TextFile {
    fn: string;
    text: string;

    constructor(fn = "", txt = "") {
        this.fn = (fn.endsWith(".txt") ? fn : `${fn}.txt`).replace(/\s+/g, '');
        this.text = txt;
    }

    append(txt: string) {
        this.text += txt;
    }

    write(txt: string) {
        this.text = txt;
    }

    read() {
        return this.text;
    }

    show() {
        dialogBoxCreate(`${this.fn}<br /><br />${this.text}`, true);
    }

    download() {
        const filename = this.fn;
        const file = new Blob([ this.text ], { type: 'text/plain' });
        if (window.navigator.msSaveOrOpenBlob) {
            // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else {
            // Others
            const a = document.createElement("a");
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = this.fn;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    toJSON() {
        return Generic_toJSON("TextFile", this);
    }

    static fromJSON(value: any) {
        return Generic_fromJSON(TextFile, value.data);
    }
}

Reviver.constructors.TextFile = TextFile;

export function getTextFile(fn: string, server: any): string | null {
    if (!fn.endsWith(".txt")) {
        fn += ".txt";
    }

    for (let i = 0; i < server.textFiles.length; i++) {
        if (server.textFiles[i].fn === fn) {
            return server.textFiles[i];
        }
    }

    return null;
}

/**
 * Creates a TextFile on the target server.
 * @param {string} fn The file name to create.
 * @param {string} txt The contents of the file.
 * @param {*} server The server that the file should be created on.
 * @returns {TextFile} The instance of the file.
 */
export function createTextFile(fn: string, txt: string, server: any): TextFile {
    if (getTextFile(fn, server) !== null) {
        console.error(`A file named "${fn}" already exists on server ${server.hostname}.`);
        return;
    }
    const file = new TextFile(fn, txt);
    server.textFiles.push(file);
    return file;
}

function deleteTextFile(fn, server) {
    if (!fn.endsWith(".txt")) {
        fn += ".txt";
    }
    for (var i = 0; i < server.textFiles.length; ++i) {
        if (server.textFiles[i].fn === fn) {
            server.textFiles.splice(i, 1);
            return true;
        }
    }
    return false;
}
