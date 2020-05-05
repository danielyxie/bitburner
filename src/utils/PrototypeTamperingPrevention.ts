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
    "entries",
    "every",
    "fill",
    "filter",
    "findIndex",
    "forEach",
    "indexOf",
    "keys",
    "lastIndexOf",
    "map",
    "pop",
    "push",
    "reduce",
    "reduceRight",
    "reverse",
    "shift",
    "slice",
    "sort",
    "some",
    "splice",
    "unshift",
    "values",
]);

unconfigurable(Array, [
    "from",
    "of",
    "isArray",
    "prototype",
]);

unconfigurable(Function.prototype, [
    "apply",
    "bind",
]);

unconfigurable(Function, [
    "apply",
    "bind",
    "call",
    "prototype",
]);

unconfigurable(Number.prototype, [
    "toExponential",
    "toFixed",
    "toPrecision",
    "valueOf",
]);

unconfigurable(Number, [
    "isFinite",
    "isNaN",
    "isInteger",
    "isSafeInteger",
    "parseFloat",
    "parseInt",
    "prototype",
]);

unconfigurable(Object, [
    "assign",
    "create",
    "defineProperties",
    "defineProperty",
    "entries",
    "freeze",
    "keys",
    "preventExtensions",
    "seal",
    "values",
    "prototype",
]);

unconfigurable(window, [
    "Array",
    "Function",
    "Number",
    "Object",
    "eval",
    "setTimeout",
    "setInterval",
]);
