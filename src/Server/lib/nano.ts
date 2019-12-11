import { BaseServer } from "../BaseServer";
import { Engine } from "../../engine";
import { createFconf } from "../../Fconf/Fconf";

export function nano(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
    if (args.length < 1) {
        err("You must specify a filename.");
        return;
    }

    const filename = args[0];
    if (filename.endsWith(".exe")){
        err("An error seem to have occured. Permission not granted");
        return;
    }
    try {
        if(!server.exists(filename)){
            server.touch(filename);
            if (filename.endsWith(".js")|| filename.endsWith(".ns")||filename.endsWith(".ns2")){
                const TEMPLATE = "export async function main(ns){ }";
                server.writeFile(filename, TEMPLATE);
            }
        }
        var content = term.getFileContent(filename);
        const filepath = term.getFilepath(filename);
        if (filename === ".fconf" && content === "") {
            content = createFconf();
            filepath = filename;
        } else {
            content = term.getFileContent(filename);
            filepath = term.getFilepath(filename);
        }

        Engine.loadScriptEditorContent(filepath, content);
    } catch(e) {
        err(e);
    }
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`nano - opens up the specified file in the Text Editor`,
`nano FILENAME`,
`Opens up the specified file in the Text Editor. If the file
does not already exist, then a new, empty one will be created.`);

registerExecutable("nano", nano, MANUAL);
