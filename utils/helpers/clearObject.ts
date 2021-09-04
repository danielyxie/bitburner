/**
 * Clears defined properties from an object.
 * Does not delete up the prototype chain.
 * @deprecated Look into using `Map` or `Set` rather than manipulating properties on an Object.
 * @param obj the object to clear all properties
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function clearObject(obj: any): void {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // tslint:disable-next-line:no-dynamic-delete
      delete obj[key];
    }
  }
}
