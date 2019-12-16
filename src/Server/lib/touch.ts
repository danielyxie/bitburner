import { BaseServer } from "../BaseServer";
import { Engine } from "../../engine";
import { createFconf } from "../../Fconf/Fconf";

export function touch(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
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
            server.touch(filepath);
            if (filename.endsWith(".js")|| filename.endsWith(".ns")||filename.endsWith(".ns2")){
                const TEMPLATE = "export async function main(ns){ }";
                server.writeFile(filepath, TEMPLATE);
            }
            else if (filename.endsWith(".fconf")){
                const TEMPLATE = createFconf();
                server.writeFile(filepath, TEMPLATE);
            }
        }
    } catch(e) {
        err(e);
    }
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`touch - Creates the specified file if non existent`,
`touch FILENAME`,
`Creates the specified file. If the file already exists,
nothing will occur.`);

registerExecutable("touch", touch, MANUAL);
