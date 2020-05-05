// Prevent modification of important prototypes

// tslint:disable-next-line:interface-name
interface Window {
    [key: string]: any; // Add index signature
}

// tslint:disable-next-line:interface-name
interface Object {
    [key: string]: any; // Add index signature
}

function unconfigurable(parent: object, keys: string[]) {
    keys.forEach((key: string) => Object.defineProperty(parent, key, {
        configurable: false,
        value: (parent as any)[key],
        writable: false,
    }));
}

[
    "String",
    ...Object.getOwnPropertyNames(window)
        .filter((key: string) => key.startsWith("HTML")),
]
    .filter((key: string) => window[key])
    .forEach((key: string) => {
        Object.freeze(window[key]);
        Object.freeze(window[key].prototype);
        unconfigurable(window, [key]);
    });

unconfigurable(Array.prototype, [
    "pop",
    "push",
    "shift",
    "unshift",
    "map",
    "sort",
    "splice",
    "slice",
    "reduce",
    "reduceRight",
    "forEach",
]);

unconfigurable(Function.prototype, [
    "apply",
    "bind",
]);

unconfigurable(Object, [
    "values",
    "keys",
]);

unconfigurable(Array, ["prototype"]);
unconfigurable(Function, ["prototype"]);
unconfigurable(Object, ["prototype"]);
unconfigurable(window, [
    "Array",
    "Function",
    "Object",
    "eval",
    "setTimeout",
    "setInterval",
]);
