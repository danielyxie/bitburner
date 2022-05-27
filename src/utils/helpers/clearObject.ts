/**
 * Clears defined properties from an object.
 * Does not delete up the prototype chain.
 * @deprecated Look into using `Map` or `Set` rather than manipulating properties on an Object.
 * @param obj the object to clear all properties
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function clearObject(obj: unknown): void {
  if (typeof obj !== "object" || obj === null || obj === undefined) return;
  const o = obj as Record<string, unknown>;
  for (const key of Object.getOwnPropertyNames(o)) {
    if (o.hasOwnProperty(key)) {
      delete o[key];
    }
  }
}
