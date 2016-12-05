/* Environment
 * 	NetScript program environment 
 */
function Environment(parent) {
    this.vars = Object.create(parent ? parent.vars : null);
    this.parent = parent;
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
        if (name in this.vars)
            return this.vars[name];
        throw new Error("Undefined variable " + name);
    },
	
	//Sets the value of a variable in any scope
    set: function(name, value) {
        var scope = this.lookup(name);
        // let's not allow defining globals from a nested environment
		//
		// If scope is null (aka existing variable with name could not be found)
		// and this is NOT the global scope, throw error
        if (!scope && this.parent)
            throw new Error("Undefined variable " + name);
        return (scope || this).vars[name] = value;
    },
	
	//Creates (or overwrites) a variable in the current scope
    def: function(name, value) {
        return this.vars[name] = value;
    },
	
	stopFlag: false
};