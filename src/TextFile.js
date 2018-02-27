import {Server}                             from "./Server.js";
import {dialogBoxCreate}                    from "../utils/DialogBox.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                   from "../utils/JSONReviver.js";

function TextFile(fn="", txt="") {
    this.fn = fn.endsWith(".txt") ? fn : fn + ".txt";
    this.text = String(txt);
}

TextFile.prototype.append = function(txt) {
    this.text += String(txt);
}

TextFile.prototype.write = function(txt) {
    this.text = String(txt);
}

TextFile.prototype.read = function() {
    return this.txt;
}

TextFile.prototype.show = function() {
    dialogBoxCreate(this.fn + "<br><br>" + this.text, true);
}

TextFile.prototype.download = function() {
    var filename = this.fn;
    var file = new Blob([this.text], {type: 'text/plain'});
    if (window.navigator.msSaveOrOpenBlob) {// IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = this.fn;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

TextFile.prototype.toJSON = function() {
	return Generic_toJSON("TextFile", this);
}

TextFile.fromJSON = function(value) {
	return Generic_fromJSON(TextFile, value.data);
}

Reviver.constructors.TextFile = TextFile;

function getTextFile(fn, server) {
    if (!fn.endsWith(".txt")) {fn += ".txt";}
    for (var i = 0; i < server.textFiles.length; ++i) {
        if (server.textFiles[i].fn === fn) {
            return server.textFiles[i];
        }
    }
    return null;
}

//Returns the TextFile object that was just created
function createTextFile(fn, txt, server) {
    if (getTextFile(fn, server) !== null) {
        console.log("ERROR: createTextFile failed because the specified " +
                    "server already has a text file with the same fn");
        return;
    }
    var file = new TextFile(fn, txt);
    server.textFiles.push(file);
    return file;
}

function deleteTextFile(fn, server) {
    if (!fn.endsWith(".txt")) {fn += ".txt";}
    for (var i = 0; i < server.textFiles.length; ++i) {
        if (server.textFiles[i].fn === fn) {
            server.textFiles.splice(i, 1);
            return true;
        }
    }
    return false;
}

export {TextFile, getTextFile, createTextFile};
