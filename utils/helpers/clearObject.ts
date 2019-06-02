/**
 * Clears defined properties from an object.
 * Does not delete up the prototype chain.
 * @deprecated Look into using `Map` or `Set` rather than manipulating properties on an Object.
 * @param obj the object to clear all properties
 */
export function clearObject(obj: any) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // tslint:disable-next-line:no-dynamic-delete
            delete obj[key];
        }
    }
}
