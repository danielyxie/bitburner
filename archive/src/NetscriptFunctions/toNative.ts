import { Interpreter } from "../ThirdParty/JSInterpreter";

const defaultInterpreter = new Interpreter("", () => undefined);

interface PseudoObject {
  properties: Record<string, unknown>;
  class: string;
}

const isPseudoObject = (v: unknown): v is PseudoObject =>
  !!v &&
  typeof v === "object" &&
  v.hasOwnProperty("properties") &&
  v.hasOwnProperty("getter") &&
  v.hasOwnProperty("setter") &&
  v.hasOwnProperty("proto");

// the acorn interpreter has a bug where it doesn't convert arrays correctly.
// so we have to more or less copy it here.
export function toNative(pseudoObj: unknown): unknown {
  if (pseudoObj == null) return null;
  if (!isPseudoObject(pseudoObj)) {
    return pseudoObj; // it wasn't a pseudo object anyway.
  }

  if (pseudoObj.hasOwnProperty("class") && pseudoObj.class === "Array") {
    const arr: unknown[] = [];
    const length = defaultInterpreter.getProperty(pseudoObj, "length");
    if (typeof length === "number") {
      for (let i = 0; i < length; i++) {
        if (defaultInterpreter.hasProperty(pseudoObj, i)) {
          arr[i] = toNative(defaultInterpreter.getProperty(pseudoObj, i));
        }
      }
    }
    return arr;
  } else {
    // Object.
    const obj: Record<string, unknown> = {};
    for (const key of Object.keys(pseudoObj.properties)) {
      const val = pseudoObj.properties[key];
      obj[key] = toNative(val);
    }
    return obj;
  }
}
