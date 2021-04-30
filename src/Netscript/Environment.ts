/**
 * The environment in which a script runs. The environment holds
 * Netscript functions and arguments for that script.
 */
import { IMap } from "../types";

export class Environment {
    /**
     * Parent environment. Used to implement "scope"
     */
    parent: Environment | null = null;

    /**
     * Whether or not the script that uses this Environment should stop running
     */
    stopFlag = false;

    /**
     * Environment variables (currently only Netscript functions)
     */
    vars: IMap<any> = {};

    constructor(parent: Environment | null) {
        if (parent instanceof Environment) {
            this.vars = Object.assign({}, parent.vars);
        }

        this.parent = parent;
    }

    /**
     * Finds the scope where the variable with the given name is defined
     */
    lookup(name: string): Environment | null {
        let scope: Environment | null = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
                return scope;
            }
            scope = scope.parent;
        }

        return null;
    }

	//Get the current value of a variable
    get(name: string): any {
        if (name in this.vars) {
            return this.vars[name];
        }

        throw new Error(`Undefined variable ${name}`);
    }

	//Sets the value of a variable in any scope
    set(name: string, value: any) {
        const scope = this.lookup(name);

        //If scope has a value, then this variable is already set in a higher scope, so
        //set is there. Otherwise, create a new variable in the local scope
        if (scope !== null) {
            return scope.vars[name] = value;
        } else {
            return this.vars[name] = value;
        }
    }

	//Creates (or overwrites) a variable in the current scope
    def(name: string, value: any) {
        return this.vars[name] = value;
    }
}
