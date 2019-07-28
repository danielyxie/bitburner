const helpRegistry:Map<string, ManualEntry> = new Map<string, ManualEntry>();
const executableRegistry:Map<string, Function> = new Map<string, Function>();

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
                "OPTIONS",
                this.options].join("\n");
    }
}

export function registerExecutable(name:string, func:Function, help:ManualEntry){
    helpRegistry.set(name, help);
    executableRegistry.set(name, func);
}

export function fetchExecutable(name:string){
    return executableRegistry.get(name);
}

export function fetchHelp(name:string){
    return helpRegistry.get(name);
}

export function fetchName(name:string){
    let help = helpRegistry.get(name);
    if (help) return help.name;
}

export function fetchUsage(name:string){
    let help = helpRegistry.get(name);
    if (help) return help.synopsis;
}

export function fetchOptions(name:string){
    let help = helpRegistry.get(name);
    if (help) return help.options;
}

export function fetchHelpIndex(){
    let names:string[] = [];
    for(let k of helpRegistry.keys()){
        names.push((helpRegistry.get(k) as ManualEntry).name)
    }
    return names.sort().join('\n');
}
