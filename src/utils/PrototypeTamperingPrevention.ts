// Prevent modification of important prototypes

interface Window {
    [key:string]: any; // Add index signature
}

interface Object {
    [key:string]: any; // Add index signature
}

function unconfigurable(parent: Object, keys: string[]) {
    keys.forEach((key) => Object.defineProperty(parent, key, {
        configurable: false,
        writable: false,
        value: parent[key]
    }));
}

[
    'String', 
    ...Object.getOwnPropertyNames(window).filter((key) => key.startsWith('HTML'))
]
    .filter((key) => window[key])
    .forEach((key) => {
        Object.freeze(window[key]);
        Object.freeze(window[key].prototype);
        unconfigurable(window, [key]);
    });
    
unconfigurable(Array.prototype, [
    'pop', 
    'push', 
    'shift', 
    'unshift', 
    'map', 
    'sort', 
    'splice', 
    'slice', 
    'reduce',  
    'reduceRight',  
    'forEach' 
]);

unconfigurable(Function.prototype, [
    'apply', 
    'bind'
]);

unconfigurable(Object, [
    'values', 
    'keys'
]);

unconfigurable(Array, ['prototype']);
unconfigurable(Function, ['prototype']);
unconfigurable(Object, ['prototype']);
unconfigurable(window, [
    'Array',
    'Function',
    'Object',
    'eval', 
    'setTimeout', 
    'setInterval'
]);
   
