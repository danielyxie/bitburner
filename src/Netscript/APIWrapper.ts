import { getRamCost } from "./RamCostGenerator";
import type { WorkerScript } from "./WorkerScript";
import { helpers } from "./NetscriptHelpers";
import { ScriptArg } from "./ScriptArg";
import { cloneDeep } from "lodash";

/** Generic type for an enums object */
type Enums = Record<string, Record<string, string>>;
/** Permissive type for the documented API functions */
type APIFn = (...args: any[]) => void;
/** Type for the actual wrapped function given to the player */
type WrappedFn = (...args: unknown[]) => unknown;
/** Type for internal, unwrapped ctx function that produces an APIFunction */
type InternalFn<F extends APIFn> = (ctx: NetscriptContext) => ((...args: unknown[]) => ReturnType<F>) & F;
type Key<API> = keyof API & string;

export type ExternalAPI<API> = {
  [key in keyof API]: API[key] extends Enums
    ? Enums
    : key extends "args"
    ? ScriptArg[] // "args" required to be ScriptArg[]
    : API[key] extends APIFn
    ? WrappedFn
    : ExternalAPI<API[key]>;
};

export type InternalAPI<API> = {
  [key in keyof API]: API[key] extends Enums
    ? API[key] & Enums
    : key extends "args"
    ? ScriptArg[]
    : API[key] extends APIFn
    ? InternalFn<API[key]>
    : InternalAPI<API[key]>;
};
/** Any of the possible values on a internal API layer */
type InternalValues = Enums | ScriptArg[] | InternalFn<APIFn> | InternalAPI<unknown>;

export class StampedLayer {
  #workerScript: WorkerScript;
  constructor(ws: WorkerScript, obj: ExternalAPI<unknown>) {
    this.#workerScript = ws;
    Object.setPrototypeOf(this, obj);
  }
  static wrapFunction<API>(eLayer: ExternalAPI<API>, internalFunc: InternalFn<APIFn>, tree: string[], key: Key<API>) {
    const arrayPath = [...tree, key];
    const functionPath = arrayPath.join(".");
    function wrappedFunction(this: StampedLayer, ...args: unknown[]): unknown {
      if (!this)
        throw new Error(`
ns.${functionPath} called with no this value.
ns functions must be bound to ns if placed in a new
variable. e.g.

const ${key} = ns.${functionPath}.bind(ns);
${key}(${JSON.stringify(args).replace(/^\[|\]$/g, "")});\n\n`);
      const ctx = { workerScript: this.#workerScript, function: key, functionPath };
      const func = internalFunc(ctx); //Allows throwing before ram chack
      helpers.checkEnvFlags(ctx);
      helpers.updateDynamicRam(ctx, getRamCost(...tree, key));
      return func(...args);
    }
    Object.defineProperty(eLayer, key, { value: wrappedFunction, enumerable: true, writable: false });
  }
}
Object.defineProperty(StampedLayer.prototype, "constructor", {
  value: Object,
  enumerable: false,
  writable: false,
  configurable: false,
});

export type NetscriptContext = {
  workerScript: WorkerScript;
  function: string;
  functionPath: string;
};

export function wrapAPILayer<API>(
  eLayer: ExternalAPI<API>,
  iLayer: InternalAPI<API>,
  tree: string[],
): ExternalAPI<API> {
  for (const [key, value] of Object.entries(iLayer) as [Key<API>, InternalValues][]) {
    if (key === "enums") {
      const enumObj = Object.freeze(cloneDeep(value as Enums));
      for (const member of Object.values(enumObj)) Object.freeze(member);
      (eLayer[key] as Enums) = enumObj;
    } else if (key === "args") continue;
    // Args only added on individual instances.
    else if (typeof value === "function") {
      StampedLayer.wrapFunction(eLayer, value as InternalFn<APIFn>, tree, key);
    } else if (typeof value === "object") {
      wrapAPILayer((eLayer[key] = {} as ExternalAPI<API>[Key<API>]), value, [...tree, key as string]);
    } else {
      console.warn(`Unexpected data while wrapping API.`, "tree:", tree, "key:", key, "value:", value);
      throw new Error("Error while wrapping netscript API. See console.");
    }
  }
  return eLayer;
}

/** Specify when a function was removed from the game, and its replacement function. */
export function removedFunction(version: string, replacement: string, replaceMsg?: boolean) {
  return (ctx: NetscriptContext) => {
    throw helpers.makeRuntimeErrorMsg(
      ctx,
      `Function removed in ${version}. ` + replaceMsg ? replacement : `Please use ${replacement} instead.`,
    );
  };
}
