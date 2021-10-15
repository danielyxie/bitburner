import { toNative } from "./toNative";
import * as libarg from "arg";

export function Flags(vargs: string[]): any {
  return function (data: any): any {
    data = toNative(data);
    // We always want the help flag.
    const args: {
      [key: string]: any;
    } = {};

    for (const d of data) {
      let t: any = String;
      if (typeof d[1] === "number") {
        t = Number;
      } else if (typeof d[1] === "boolean") {
        t = Boolean;
      } else if (Array.isArray(d[1])) {
        t = [String];
      }
      const numDashes = d[0].length > 1 ? 2 : 1;
      args["-".repeat(numDashes) + d[0]] = t;
    }
    const ret = libarg(args, { argv: vargs });
    for (const d of data) {
      if (!ret.hasOwnProperty("--" + d[0]) || !ret.hasOwnProperty("-" + d[0])) ret[d[0]] = d[1];
    }
    for (const key of Object.keys(ret)) {
      if (!key.startsWith("-")) continue;
      const value = ret[key];
      delete ret[key];
      const numDashes = key.length === 2 ? 1 : 2;
      ret[key.slice(numDashes)] = value;
    }
    return ret;
  };
}
