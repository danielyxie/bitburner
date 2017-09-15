import {NetscriptFunctions}             from "./NetscriptFunctions.js";
/* Environment
 * 	NetScript program environment
 */
function Environment(workerScript,parent) {
    if (parent){
        this.vars = parent.vars;
    } else {
        this.vars = NetscriptFunctions(workerScript);
    }
    this.parent = parent;
	this.stopFlag = false;
}
Environment.prototype = {
	//Create a "subscope", which is a new new "sub-environment"
	//The subscope is linked to this through its parent variable
    extend: function() {
        return new Environment(this);
    },

	//Finds the scope where the variable with the given name is defined
    lookup: function(name) {
        var scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name))
                return scope;
            scope = scope.parent;
        }
    },

	//Get the current value of a variable
    get: function(name) {
        if (name in this.vars) {
            return this.vars[name];
        }
        throw new Error("Undefined variable " + name);
    },

	//Sets the value of a variable in any scope
    set: function(name, value) {
        var scope = this.lookup(name);
        // let's not allow defining globals from a nested environment
		//
		// If scope is null (aka existing variable with name could not be found)
		// and this is NOT the global scope, throw error
        if (!scope && this.parent) {
            console.log("Here");
            throw new Error("Undefined variable " + name);
        }
        return (scope || this).vars[name] = value;
    },

    setArrayElement: function(name, idx, value) {
        if (!(idx instanceof Array)) {
            throw new Error("idx parameter is not an Array");
        }
        var scope = this.lookup(name);
        if (!scope && this.parent) {
            console.log("Here");
            throw new Error("Undefined variable " + name);
        }
        var arr = (scope || this).vars[name];
        if (!(arr.constructor === Array || arr instanceof Array)) {
            throw new Error("Variable is not an array: " + name);
        }
        var res = arr;
        for (var iterator = 0; iterator < idx.length-1; ++iterator) {
            var i = idx[iterator];
            if (!(res instanceof Array) || i >= res.length) {
                throw new Error("Out-of-bounds array access");
            }
            res = res[i];
        }
        return res[idx[idx.length-1]] = value;
    },
    /*
    setArrayElement: function(name, idx, value) {
        var scope = this.lookup(name);
        if (!scope && this.parent) {
            console.log("Here");
            throw new Error("Undefined variable " + name);
        }
        var arr = (scope || this).vars[name];
        if (!(arr.constructor === Array || arr instanceof Array)) {
            throw new Error("Variable is not an array: " + name);
        }
        return (scope || this).vars[name][idx] = value;
    },*/

	//Creates (or overwrites) a variable in the current scope
    def: function(name, value) {
        return this.vars[name] = value;
    }
};

export {Environment};
