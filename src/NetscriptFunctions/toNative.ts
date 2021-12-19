import { Interpreter } from "../ThirdParty/JSInterpreter";

const defaultInterpreter = new Interpreter("", () => undefined);

// the acorn interpreter has a bug where it doesn't convert arrays correctly.
// so we have to more or less copy it here.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function toNative(pseudoObj: any): any {
  if (pseudoObj == null) return null;
  if (
    !pseudoObj.hasOwnProperty("properties") ||
    !pseudoObj.hasOwnProperty("getter") ||
    !pseudoObj.hasOwnProperty("setter") ||
    !pseudoObj.hasOwnProperty("proto")
  ) {
    return pseudoObj; // it wasn't a pseudo object anyway.
  }

  let nativeObj: any;
  if (pseudoObj.hasOwnProperty("class") && pseudoObj.class === "Array") {
    nativeObj = [];
    const length = defaultInterpreter.getProperty(pseudoObj, "length");
    for (let i = 0; i < length; i++) {
      if (defaultInterpreter.hasProperty(pseudoObj, i)) {
        nativeObj[i] = toNative(defaultInterpreter.getProperty(pseudoObj, i));
      }
    }
  } else {
    // Object.
    nativeObj = {};
    for (const key in pseudoObj.properties) {
      const val = pseudoObj.properties[key];
      nativeObj[key] = toNative(val);
    }
  }
  return nativeObj;
}
