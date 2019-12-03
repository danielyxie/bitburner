
import { ls } from "./ls";
import { BaseServer } from "../BaseServer";
const micromatch = require('micromatch');
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";

export function download(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={testing:false}){
    // will contain every valid path
    let filepathSet:Set<string> = new Set<string>();
    // filters out invalid paths and push the valid ones into the set
    // can be seen as a "pipe" into grep "piping" into a file
    function fileFilter (pathsBlock:string){
        for(let path of pathsBlock.split("\n")){
            if (micromatch.isMatch(path, args)) {
                if (!server.isDir(path)) {
                    filepathSet.add(path);
                }
            }
        }
    };
    // Call to the ls function, to list every file from the current working directory using the default depth
    // the standard output is "piped" into fileFilter which will "pipe" into filepatSet
    ls(server, term, fileFilter, err, []);
    if(filepathSet.size==0){
        err(`No files found.`);
        return;
    }
    // Download all scripts as a zip
    var zip = new JSZip();
    filepathSet.forEach((path:string)=>{
        var file = new Blob([server.readFile(path)], {type:"text/plain"});
        zip.file(path, file);
        out(`Zipping up ${path}..`);
    })
    let zipFn:string = "bitburnerFiles.zip";
    zip.generateAsync({type:"blob"}).then(function(content:any) {
        FileSaver.saveAs(content, zipFn);
        out(`${zipFn} ready to be downloaded!`);
    });
}
import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`download - Downloads a script or text file to your real computer.`,
`download FILE...`,
`Downloads a script or text file to your real computer.

You can also download all of your scripts/text files as a zip file
using the following command:
    download *

--help
    display this help and exit
`)
registerExecutable("download", download, MANUAL);
