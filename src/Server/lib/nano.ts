import { BaseServer } from "../BaseServer";
import { Engine } from "../../engine";
import { createFconf } from "../../Fconf/Fconf";
import { touch } from "./touch";

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
        let filepath = term.getFilepath(filename);
        if(!server.exists(filepath)){
            touch(server, term, out, err, [filename]);
        }
        var content = term.getFileContent(filename);
        if (!options.testing) Engine.loadScriptEditorContent(filepath, content);
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
