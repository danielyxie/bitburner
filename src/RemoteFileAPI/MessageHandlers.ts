import { isScriptFilename } from "../Script/isScriptFilename";
import { GetServer } from "../Server/AllServers";
import { isValidFilePath } from "../Terminal/DirectoryHelpers";
import { TextFile } from "../TextFile";
import {
  RFAMessage,
  FileData,
  FileContent,
  isFileServer,
  isFileLocation,
  FileLocation,
  isFileData,
} from "./MessageDefinitions";

import libSource from "!!raw-loader!../ScriptEditor/NetscriptDefinitions.d.ts";

function error(errorMsg: string, { id }: RFAMessage): RFAMessage {
  return new RFAMessage({ error: errorMsg, id: id });
}

export const RFARequestHandler: Record<string, (message: RFAMessage) => void | RFAMessage> = {
  pushFile: function (msg: RFAMessage): RFAMessage {
    if (!isFileData(msg.params)) return error("Misses parameters", msg);

    const fileData: FileData = msg.params;
    if (!isValidFilePath(fileData.filename)) return error("Invalid filename", msg);

    const server = GetServer(fileData.server);
    if (!server) return error("Server hostname invalid", msg);

    if (isScriptFilename(fileData.filename)) server.writeToScriptFile(fileData.filename, fileData.content);
    // Assume it's a text file
    else server.writeToTextFile(fileData.filename, fileData.content);

    // If and only if the content is actually changed correctly, send back an OK.
    const savedCorrectly =
      server.getScript(fileData.filename)?.code === fileData.content ||
      server.textFiles.filter((t: TextFile) => t.filename == fileData.filename).at(0)?.text === fileData.content;

    if (!savedCorrectly) return error("File wasn't saved correctly", msg);

    return new RFAMessage({ result: "OK", id: msg.id });
  },

  getFile: function (msg: RFAMessage): RFAMessage {
    if (!isFileLocation(msg.params)) return error("Message misses parameters", msg);

    const fileData: FileLocation = msg.params;
    if (!isValidFilePath(fileData.filename)) return error("Invalid filename", msg);

    const server = GetServer(fileData.server);
    if (!server) return error("Server hostname invalid", msg);

    if (isScriptFilename(fileData.filename)) {
      const scriptContent = server.getScript(fileData.filename);
      if (!scriptContent) return error("File doesn't exist", msg);
      return new RFAMessage({ result: scriptContent.code, id: msg.id });
    } else {
      // Assume it's a text file
      const file = server.textFiles.filter((t: TextFile) => t.filename == fileData.filename).at(0);
      if (!file) return error("File doesn't exist", msg);
      return new RFAMessage({ result: file.text, id: msg.id });
    }
  },

  deleteFile: function (msg: RFAMessage): RFAMessage {
    if (!isFileLocation(msg.params)) return error("Message misses parameters", msg);
    const fileData: FileLocation = msg.params;
    if (!isValidFilePath(fileData.filename)) return error("Invalid filename", msg);

    const server = GetServer(fileData.server);
    if (!server) return error("Server hostname invalid", msg);

    const fileExists = (): boolean =>
      !!server.getScript(fileData.filename) || server.textFiles.some((t: TextFile) => t.filename === fileData.filename);

    if (!fileExists()) return error("File doesn't exist", msg);
    server.removeFile(fileData.filename);
    if (fileExists()) return error("Failed to delete the file", msg);

    return new RFAMessage({ result: "OK", id: msg.id });
  },

  getFileNames: function (msg: RFAMessage): RFAMessage {
    if (!isFileServer(msg.params)) return error("Message misses parameters", msg);

    const server = GetServer(msg.params.server);
    if (!server) return error("Server hostname invalid", msg);

    const fileNameList: string[] = [
      ...server.textFiles.map((txt): string => txt.filename),
      ...server.scripts.map((scr): string => scr.filename),
    ];

    return new RFAMessage({ result: fileNameList, id: msg.id });
  },

  getAllFiles: function (msg: RFAMessage): RFAMessage {
    if (!isFileServer(msg.params)) return error("Message misses parameters", msg);

    const server = GetServer(msg.params.server);
    if (!server) return error("Server hostname invalid", msg);

    const fileList: FileContent[] = [
      ...server.textFiles.map((txt): FileContent => {
        return { filename: txt.filename, content: txt.text };
      }),
      ...server.scripts.map((scr): FileContent => {
        return { filename: scr.filename, content: scr.code };
      }),
    ];

    return new RFAMessage({ result: fileList, id: msg.id });
  },

  calculateRam: function (msg: RFAMessage): RFAMessage {
    if (!isFileLocation(msg.params)) return error("Message misses parameters", msg);
    const fileData: FileLocation = msg.params;
    if (!isValidFilePath(fileData.filename)) return error("Invalid filename", msg);

    const server = GetServer(fileData.server);
    if (!server) return error("Server hostname invalid", msg);

    if (!isScriptFilename(fileData.filename)) return error("Filename isn't a script filename", msg);
    const script = server.getScript(fileData.filename);
    if (!script) return error("File doesn't exist", msg);
    const ramUsage = script.ramUsage;

    return new RFAMessage({ result: ramUsage, id: msg.id });
  },

  getDefinitionFile: function (msg: RFAMessage): RFAMessage {
    return new RFAMessage({ result: libSource + "", id: msg.id });
  },
};
