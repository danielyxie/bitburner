/* Generic Reviver, toJSON, and fromJSON functions used for saving and loading objects */

interface IReviverValue {
  ctor: string;
  data: any;
}

// A generic "smart reviver" function.
// Looks for object values with a `ctor` property and
// a `data` property. If it finds them, and finds a matching
// constructor that has a `fromJSON` property on it, it hands
// off to that `fromJSON` fuunction, passing in the value.
export function Reviver(key: string, value: IReviverValue | null): any {
  if (value == null) {
    return null;
  }

  if (typeof value === "object" && typeof value.ctor === "string" && typeof value.data !== "undefined") {
    // Compatibility for version v0.43.1
    // TODO Remove this eventually
    if (value.ctor === "AllServersMap") {
      console.warn("Converting AllServersMap for v0.43.1");
      return value.data;
    }

    const ctor = Reviver.constructors[value.ctor];

    if (typeof ctor === "function" && typeof ctor.fromJSON === "function") {
      return ctor.fromJSON(value);
    }
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Reviver {
  export const constructors: { [key: string]: any } = {};
}

// A generic "toJSON" function that creates the data expected
// by Reviver.
// `ctorName`  The name of the constructor to use to revive it
// `obj`       The object being serialized
// `keys`      (Optional) Array of the properties to serialize,
//             if not given then all of the objects "own" properties
//             that don't have function values will be serialized.
//             (Note: If you list a property in `keys`, it will be serialized
//             regardless of whether it's an "own" property.)
// Returns:    The structure (which will then be turned into a string
//             as part of the JSON.stringify algorithm)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Generic_toJSON(ctorName: string, obj: any, keys?: string[]): IReviverValue {
  if (!keys) {
    keys = Object.keys(obj); // Only "own" properties are included
  }

  const data: any = {};
  for (let index = 0; index < keys.length; ++index) {
    const key = keys[index];
    data[key] = obj[key];
  }
  return { ctor: ctorName, data: data };
}

// A generic "fromJSON" function for use with Reviver: Just calls the
// constructor function with no arguments, then applies all of the
// key/value pairs from the raw data to the instance. Only useful for
// constructors that can be reasonably called without arguments!
// `ctor`      The constructor to call
// `data`      The data to apply
// Returns:    The object
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Generic_fromJSON<T>(ctor: new () => T, data: any): T {
  const obj: any = new ctor();
  for (const name in data) {
    obj[name] = data[name];
  }
  return obj;
}
