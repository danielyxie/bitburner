import { WorkerScript } from "./Netscript/WorkerScript";
import { getServer } from "./Server/ServerHelpers";

import { setTimeoutRef } from "./utils/SetTimeoutRef";
import { parse, Node } from "../utils/acorn";

import { isValidIPAddress } from "../utils/helpers/isValidIPAddress";
import { isString } from "../utils/helpers/isString";

export function killNetscriptDelay(workerScript) {
    if (workerScript instanceof WorkerScript) {
        if (workerScript.delay) {
            clearTimeout(workerScript.delay);
            workerScript.delayResolve();
        }
    }
}

export function netscriptDelay(time, workerScript) {
    return new Promise(function(resolve, reject) {
       workerScript.delay = setTimeoutRef(() => {
           workerScript.delay = null;
           resolve();
       }, time);
       workerScript.delayResolve = resolve;
   });
}

export function makeRuntimeRejectMsg(workerScript, msg, exp=null) {
    var lineNum = "";
    if (exp != null) {
        var num = getErrorLineNumber(exp, workerScript);
        lineNum = " (Line " + num + ")"
    }
    return "|"+workerScript.serverIp+"|"+workerScript.name+"|" + msg + lineNum;
}

export function getErrorLineNumber(exp, workerScript) {
    var code = workerScript.scriptRef.codeCode();

    //Split code up to the start of the node
    try {
        code = code.substring(0, exp.start);
        return (code.match(/\n/g) || []).length + 1;
    } catch(e) {
        return -1;
    }
}

export function isScriptErrorMessage(msg) {
    if (!isString(msg)) {return false;}
    let splitMsg = msg.split("|");
    if (splitMsg.length != 4){
        return false;
    }
    var ip = splitMsg[1];
    if (!isValidIPAddress(ip)) {
        return false;
    }
    return true;
}
