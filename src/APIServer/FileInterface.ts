import WebSocketInterface from "./WebsocketInterface";
import InterfaceQueue from "./InterfaceQueue";
import { GetServer } from "../Server/AllServers";
import { removeLeadingSlash } from "../Terminal/DirectoryHelpers";
import { Player } from "../Player";
import { Script } from "../Script/Script";

function isCustomEvent(event: Event): event is CustomEvent {
    return 'detail' in event;
}
function normalizeFileName(filename: string): string {
    filename = filename.replace(/\/\/+/g, "/");
    filename = removeLeadingSlash(filename);
    if (filename.includes("/")) {
      filename = "/" + removeLeadingSlash(filename);
    }
    return filename;
}

interface FilePayloadParams {
    filename: string;
}

export interface FilePayload {
    timestamp: number;
    filename: string;
    ramUsage?: number;
    code?: string;
    hash?: string;
}


class FileInterface {
    _queue: InterfaceQueue<FilePayloadParams>;
    
    constructor() {
        this._queue = new InterfaceQueue("_fileQueue");
    }
    initialize = ():void => {
        WebSocketInterface.initialize();
        WebSocketInterface.addEventListener("FILE", this._handleMessage);
    }
    _handleMessage = (e:Event):void => {
        if (!isCustomEvent(e)) {
            return;
        }
        const {action, payload} = e.detail;

        const homeServer = GetServer("home");
        if (homeServer === null) {
            return;
            // Do nothing
        }
        switch(action) {
            case "LIST":
                homeServer.scripts.map((script) => {
                    this._queueOrSendMessage("FILE", "INFO", {filename: script.filename});
                });
                return;
            case "GET": {
                const foundScript = homeServer.scripts.find((script) => script.filename === payload.filename);
                if (foundScript) {
                    this._queueOrSendMessage("FILE", "INFO", {filename: foundScript.filename});
                }
                return;
            }
            case "PUSH": {
                let {filename} = payload;
                const {code} = payload;
                filename = normalizeFileName(filename);
                const {success} = homeServer.writeToScriptFile(Player, filename, code);

                if (success) {
                    this._queueOrSendMessage("FILE", "INFO", {filename});
                }

                return;
            }
            case "DELETE": {
                let {filename} = payload;
                filename = normalizeFileName(filename);
                if (homeServer.getScript(filename)) {
                    homeServer.removeFile(filename);
                }
                return;
            }
            case "FLUSH":
                this._flushQueue();
                return;
        }
    }
    removeFromEditor = (host:string, filename:string):void => {
        // Only sync home server for now
        if (host !== "home") {
            return;
        }
        this._queueOrSendMessage(filename, "DELETE", {filename})
    }
    pushToEditor = (script:Script):void => {
        if (!script) {
            return;
        }

        // Only sync home server for now
        if (script.server !== "home") {
            return;
        }

        this._queueOrSendMessage(script.filename, "PUSH", script);

    }
    _flushQueue = ():void => {
        if (WebSocketInterface.connected) {
            this._queue.flush(this._queueOrSendMessage);    
        }
    }
    _createFilePayload = (params:FilePayloadParams | Script, timestamp?:number):FilePayload => {
        const homeServer = GetServer("home");
        if (!homeServer) {
            throw new Error("Home server does not exists");
        }
        // When a file is first created, script is provided, else we use params to pull
        const script = params instanceof Script ? params : homeServer.scripts.find((script) => script.filename === params.filename);

        return {
            timestamp: timestamp || Date.now(),
            filename: script?.filename || params.filename,
            hash: script?.hash(),
            code: script?.code,
            ramUsage: script?.ramUsage
        };
    }
    _queueOrSendMessage = (filename:string, action:string, script:Script | FilePayloadParams, key?:string, timestamp?:number):void => {
        if (!WebSocketInterface.connected) {
            const payloadParams:FilePayloadParams = {filename}; 
            this._queue.push("FILE", action, payloadParams, filename, timestamp || Date.now());
            return;
        }
        WebSocketInterface.send<FilePayload>("FILE", action, this._createFilePayload(script));
    }
}

const FileInterfaceSingelton = new FileInterface();

export default FileInterfaceSingelton;