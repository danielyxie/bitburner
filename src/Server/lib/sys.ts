const helpRegistry: Map<string, ManualEntry> = new Map<string, ManualEntry>();
const executableRegistry: Map<string, Function> = new Map<string, Function>();
const hiddenExecutables: Set<string> = new Set<string>();
const namespaceExecutable: Map<string, string[]> = new Map<string, string[]>();
const executableNamespace: Map<string, string> = new Map<string, string>();
const fileExecutables: Set<string> = new Set<string>();
export const namespaces: Set<string> = new Set<string>();
import { Player } from "../../Player";

export class ManualEntry {
    name: string;
    synopsis: string;
    options: string;

    constructor(name: string, synopsis: string, options: string) {
        this.name = name.replace(/^/gm, '\t');
        this.synopsis = synopsis.replace(/^/gm, '\t');
        this.options = options.replace(/^/gm, '\t');
    }
    toString() {
        return ["NAME",
                this.name,
                "SYNOPSIS",
                this.synopsis,
                "DESCRIPTION",
                this.options].join("\n");
    }
}

export function registerExecutable(name: string, func: Function, help: ManualEntry, hidden: boolean = false, namespace: string = "system", level: number | string = 1) {
    helpRegistry.set(name, help);
    executableRegistry.set(name, func);
    if (typeof level === "string") {
        // any string level is a specific executable needed on the player Home Machine
        fileExecutables.add(level);
    }
    namespace += `-${level}`;
    executableNamespace.set(name, namespace);
    namespaces.add(namespace);
    let ns: string[] | undefined = namespaceExecutable.get(namespace);
    if (ns === undefined) {
        ns = [name];
    } else {
        ns.push(name);
    }
    namespaceExecutable.set(namespace, ns);
    if (hidden) {
        hideExecutable(name);
    } // TODO save the state of this object somewhere
    // This is a more optimized way of "buying executables" and allows the integration
    // of command documentations for those executables.
}

export function unregisterExecutable(name:string){
    helpRegistry.delete(name);
    executableRegistry.delete(name);
}

export function hideExecutable(name:string){
    hiddenExecutables.add(name);
}

export function revealExecutable(name:string){
    hiddenExecutables.delete(name);
}

export function revealNamespace(name:string, level:number=1) {
    if (!name.includes("-")) {
        name += `-${level}`;
    }

    const ns = namespaceExecutable.get(name);
    if (ns !== undefined) {
        for (let exec of ns) {
            revealExecutable(exec);
        }
    }
}
export function hideNamespace(name:string, level:number=1){
    name+='-'+level;
    let ns =  namespaceExecutable.get(name);
    if (ns !== undefined){
        for(let exec of ns){
            hideExecutable(exec);
        }
    }
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

// see https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex (dec:number) {
    return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
function generateId (len:number|undefined=undefined) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
}

function fetchHelpNamespaceIndex(namespace:string){
    const names: string[] = [];
    let hidden = true;
    for (let k of namespaceExecutable.get(namespace) as string[]){
        if(!isExecutableHidden(k)) {
            names.push((helpRegistry.get(k) as ManualEntry).name);
            hidden= false;
        }else{
            names.push('!ERROR!\t'+generateId(k.length)+" - "+generateId((helpRegistry.get(k) as ManualEntry).name.length-(k.length + 3)))
        }
    }
    return {index:names, hidden:hidden};
}

export function fetchHelpIndex(namespaceFilter: string = "") {
    const intro: string[] = [
        "",
        "Type 'help X' to find out more about the command/function/program X",
        "",
    ];

    let tmpNamespaceIndexes: any = {};
    let tmpNamespaceHidden: any = {};

    for (let namespaceKey of namespaceExecutable.keys()) {
        if (!namespaceKey.startsWith(namespaceFilter)) {
            continue;
        }
        let namespace:string = namespaceKey.split("-")[0] as string;
        if (!Object.keys(tmpNamespaceIndexes).includes(namespace)) tmpNamespaceIndexes[namespace] = [];
        if (!Object.keys(tmpNamespaceHidden).includes(namespace)) tmpNamespaceHidden[namespace] = true;
        let fetched = fetchHelpNamespaceIndex(namespaceKey);
        let index = fetched.index;
        tmpNamespaceHidden[namespace] = tmpNamespaceHidden[namespace] && fetched.hidden;
        if (index.length > 0){
            tmpNamespaceIndexes[namespace] = tmpNamespaceIndexes[namespace].concat(index);
        }
    }

    for(let namespace of Object.keys(tmpNamespaceIndexes).sort()) {
        if (tmpNamespaceHidden[namespace]) {
            intro.push(generateId(namespace.length) + ":");
        } else {
            intro.push(namespace.toUpperCase() + ":");
        }
        let execs = (tmpNamespaceIndexes[namespace] as string[]);
        execs.sort();
        intro.push(execs.join('\n'));
    }
    return intro.join('\n');
}

export function isExecutableHidden(name:string){
    return hiddenExecutables.has(name) && !(Player as any).hasProgram(name)
}

