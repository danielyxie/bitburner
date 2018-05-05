// A utility function that adds a preamble to each Netscript JS
// script. This preamble will set all the global functions and
// variables appropriately for the module.
//
// One caveat is that we don't allow the variables in the preable
// to change. Unlike in normal Javascript, this would not change
// properties of self. It would instead just change the variable
// within the given module -- not good! Users should not really
// need to do this anyway.

import uuidv4 from "uuid/v4";
import {sprintf} from "sprintf-js";

window.__NSJS__environments = {};

// Returns the UUID for the env.
export function registerEnv(env) {
    const uuid = uuidv4();
    window.__NSJS__environments[uuid] = env;
    return uuid;
}

export function unregisterEnv(uuid) {
    delete window.__NSJS__environments[uuid];
}

export function makeEnvHeader(uuid) {
    if (!(uuid in window.__NSJS__environments)) throw new Error("uuid is not in the environment" + uuid);

    const env = window.__NSJS__environments[uuid];
    var envLines = [];
    for (const prop in env) {
        envLines.push("const ", prop, " = ", "__NSJS_ENV[\"", prop, "\"];\n");
    }

    return sprintf(`
        'use strict';
        const __NSJS_ENV = window.__NSJS__environments['%s'];
        // The global variable assignments (hack, weaken, etc.).
        %s
    `, uuid, envLines.join(""));
}