import { Player } from "../Player";
import { isScriptFilename } from "../Script/isScriptFilename";
import { GetServer } from "../Server/AllServers";
import { isValidFilePath } from "../Terminal/DirectoryHelpers";
import { TextFile } from "../TextFile";
import { RFAMessage, FileData, FileContent, isFileServer, isFileLocation, FileLocation, isFileData } from "./MessageDefinitions";
//@ts-ignore: Complaint of import ending with .d.ts
import libSource from "!!raw-loader!../ScriptEditor/NetscriptDefinitions.d.ts";


function error(errorMsg: string, { id }: RFAMessage): RFAMessage {
    console.error("[RFA-ERROR]" + (typeof (id) === "undefined" ? "" : `Request ${id}: `) + errorMsg);
    return new RFAMessage({ error: errorMsg, id: id });
}

export const RFARequestHandler: Record<string, (message: RFAMessage) => void | RFAMessage> = {

    pushFile: function (msg: RFAMessage): RFAMessage {
        if (!isFileData(msg.params)) return error("pushFile message misses parameters", msg);

        const fileData: FileData = msg.params;
        if (!isValidFilePath(fileData.filename)) return error("pushFile with an invalid filename", msg);

        const server = GetServer(fileData.server);
        if (server == null) return error("Server hostname invalid", msg);

        if (isScriptFilename(fileData.filename))
            server.writeToScriptFile(Player, fileData.filename, fileData.content);
        else // Assume it's a text file
            server.writeToTextFile(fileData.filename, fileData.content);

        // If and only if the content is actually changed correctly, send back an OK.
        const savedCorrectly = server.getScript(fileData.filename)?.code === fileData.content
            || server.textFiles.filter((t: TextFile) => t.filename == fileData.filename).at(0)?.text === fileData.content;

        if (!savedCorrectly) return error("File wasn't saved correctly", msg);

        return new RFAMessage({ result: "OK", id: msg.id });
    },

    getFile: function (msg: RFAMessage): RFAMessage {
        if (!isFileLocation(msg.params)) return error("getFile message misses parameters", msg);

        const fileData: FileLocation = msg.params;
        if (!isValidFilePath(fileData.filename)) return error("getFile with an invalid filename", msg);

        const server = GetServer(fileData.server);
        if (server == null) return error("Server hostname invalid", msg);

        if (isScriptFilename(fileData.filename)) {
            const scriptContent = server.getScript(fileData.filename);
            if (!scriptContent) return error("Requested script doesn't exist", msg);
            return new RFAMessage({ result: scriptContent.code, id: msg.id });
        }
        else { // Assume it's a text file
            const file = server.textFiles.filter((t: TextFile) => t.filename == fileData.filename).at(0);
            if (file === undefined) return error("Requested textfile doesn't exist", msg);
            return new RFAMessage({ result: file.text, id: msg.id });
        }
    },

    deleteFile: function (msg: RFAMessage): RFAMessage {
        if (!isFileLocation(msg.params)) return error("deleteFile message misses parameters", msg);
        const fileData: FileLocation = msg.params;
        if (!isValidFilePath(fileData.filename)) return error("deleteFile with an invalid filename", msg);

        const server = GetServer(fileData.server);
        if (server == null) return error("Server hostname invalid", msg);

        const fileExists = (): boolean => !!server.getScript(fileData.filename)
            || server.textFiles.some((t: TextFile) => t.filename === fileData.filename);

        if (!fileExists()) return error("deleteFile file doesn't exist", msg);
        server.removeFile(fileData.filename);
        if (fileExists()) return error("deleteFile failed to delete the file", msg);

        return new RFAMessage({ result: "OK", id: msg.id });
    },

   getFileNames: function (msg: RFAMessage): RFAMessage {
        if (!isFileServer(msg.params)) return error("getFileNames message misses parameters", msg);

        const server = GetServer(msg.params.server);
        if (server == null) return error("Server hostname invalid", msg);

        const fileNameList: string[] = [
            ...server.textFiles.map((txt): string => txt.filename),
            ...server.scripts.map((scr): string => scr.filename)
        ];

        return new RFAMessage({ result: JSON.stringify(fileNameList), id: msg.id });
    },

    getAllFiles: function (msg: RFAMessage): RFAMessage {
        if (!isFileServer(msg.params)) return error("getAllFiles message misses parameters", msg);

        const server = GetServer(msg.params.server);
        if (server == null) return error("Server hostname invalid", msg);

        const fileList: FileContent[] = [
            ...server.textFiles.map((txt): FileContent => { return { filename: txt.filename, content: txt.text } }),
            ...server.scripts.map((scr): FileContent => { return { filename: scr.filename, content: scr.code } })
        ];

        return new RFAMessage({ result: JSON.stringify(fileList), id: msg.id });
    },

    calculateRam: function (msg: RFAMessage): RFAMessage {
        if (!isFileLocation(msg.params)) return error("calculateRam message misses parameters", msg);
        const fileData: FileLocation = msg.params;
        if (!isValidFilePath(fileData.filename)) return error("deleteFile with an invalid filename", msg);

        const server = GetServer(fileData.server);
        if (server == null) return error("Server hostname invalid", msg);

        if (!isScriptFilename(fileData.filename)) return error("Filename isn't a script filename", msg);
        const script = server.getScript(fileData.filename);
        if (!script) return error("File doesn't exist", msg);
        const ramUsage = script.ramUsage;

        return new RFAMessage({result: String(ramUsage), id: msg.id});
    },

    getDefinitionFile: function (msg: RFAMessage): RFAMessage {
        const source = (libSource + "").replace(/export /g, "");
        console.log(source);
        return new RFAMessage({result: source, id: msg.id});
    }
}
