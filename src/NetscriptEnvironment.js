import {NetscriptFunctions}             from "./NetscriptFunctions";
import {NetscriptPort}                  from "./NetscriptPort";

/* Environment
 * 	NetScript program environment
 */
function Environment(workerScript,parent) {
    if (parent){
        //Create a copy of parent's variables
        //this.vars = parent.vars;
        this.vars = Object.assign({}, parent.vars);
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
        return new Environment(null, this);
    },

	//Finds the scope where the variable with the given name is defined
    lookup: function(name) {
        var scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
                return scope;
            }
            scope = scope.parent;
        }
        return null;
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

        //If scope has a value, then this variable is already set in a higher scope, so
        //set is there. Otherwise, create a new variable in the local scope
        if (scope !== null) {
            return scope.vars[name] = value;
        } else {
            return this.vars[name] = value;
        }
    },

	//Creates (or overwrites) a variable in the current scope
    def: function(name, value) {
        return this.vars[name] = value;
    }
};

export {Environment};
