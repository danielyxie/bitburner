const helpRegistry:Map<string, ManualEntry> = new Map<string, ManualEntry>();
const executableRegistry:Map<string, Function> = new Map<string, Function>();
const hiddenExecutables:Set<string> = new Set<string>();
import {Player} from "../../Player";

export class ManualEntry{
    name:string;
    synopsis:string;
    options:string;
    constructor(name:string, synopsis:string, options:string){
        this.name = name.replace(/^/gm, '\t');
        this.synopsis = synopsis.replace(/^/gm, '\t');
        this.options = options.replace(/^/gm, '\t');
    }
    toString(){
        return ["NAME",
                this.name,
                "SYNOPSIS",
                this.synopsis,
                "DESCRIPTION",
                this.options].join("\n");
    }
}

export function registerExecutable(name:string, func:Function, help:ManualEntry, hidden:boolean=false){
    helpRegistry.set(name, help);
    executableRegistry.set(name, func);
    if (hidden) hideExecutable(name); // TODO save the state of this object somewhere
    // This is a more optimized way of "buying executables" and allows the integration
    // of command documentations for those executables.
}

export function unregisterExecutable(name:string){
    helpRegistry.delete(name)
    executableRegistry.delete(name);
}

export function hideExecutable(name:string){
    hiddenExecutables.add(name);
}

export function revealExecutable(name:string){
    hiddenExecutables.delete(name);
}

export function fetchExecutable(name:string){
    if (isExecutableHidden(name)) return;
    return executableRegistry.get(name);
}

export function fetchHelp(name:string){
    if (isExecutableHidden(name)) return;
    return helpRegistry.get(name);
}

export function fetchName(name:string){
    if (isExecutableHidden(name)) return;
    let help = helpRegistry.get(name);
    if (help) return help.name;
}

export function fetchUsage(name:string){
    if (isExecutableHidden(name)) return;
    let help = helpRegistry.get(name);
    if (help) return help.synopsis;
}

export function fetchOptions(name:string){
    if (isExecutableHidden(name)) return;
    let help = helpRegistry.get(name);
    if (help) return help.options;
}

export function fetchHelpIndex(){
    let names:string[] = [];
    for(let k of helpRegistry.keys()){
        if(!isExecutableHidden(k)) names.push((helpRegistry.get(k) as ManualEntry).name)
    }
    return names.sort().join('\n');
}

export function isExecutableHidden(name:string){
    return hiddenExecutables.has(name) && !(Player as any).hasProgram(name)
}
