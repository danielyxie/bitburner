import { getRamCost } from "./RamCostGenerator";
import type { WorkerScript } from "./WorkerScript";
import { helpers } from "./NetscriptHelpers";
import { ScriptArg } from "./ScriptArg";
import { NSFull } from "src/NetscriptFunctions";
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

export type NetscriptContext = {
  workerScript: WorkerScript;
  function: string;
  functionPath: string;
};

export function wrapAPI(ws: WorkerScript, internalAPI: InternalAPI<NSFull>, args: ScriptArg[]): ExternalAPI<NSFull> {
  function wrapAPILayer<API>(eLayer: ExternalAPI<API>, iLayer: InternalAPI<API>, tree: string[]): ExternalAPI<API> {
    for (const [key, value] of Object.entries(iLayer) as [Key<API>, InternalValues][]) {
      if (key === "enums") {
        (eLayer[key] as Enums) = cloneDeep(value as Enums);
      } else if (key === "args") continue;
      // Args are added in wrapAPI function and should only exist at top level
      else if (typeof value === "function") {
        wrapFunction(eLayer, value as InternalFn<APIFn>, tree, key);
      } else if (typeof value === "object") {
        wrapAPILayer((eLayer[key] = {} as ExternalAPI<API>[Key<API>]), value, [...tree, key as string]);
      } else {
        console.warn(`Unexpected data while wrapping API.`, "tree:", tree, "key:", key, "value:", value);
        throw new Error("Error while wrapping netscript API. See console.");
      }
    }
    return eLayer;
  }
  function wrapFunction<API>(eLayer: ExternalAPI<API>, func: InternalFn<APIFn>, tree: string[], key: Key<API>) {
    const arrayPath = [...tree, key];
    const functionPath = arrayPath.join(".");
    const ctx = { workerScript: ws, function: key, functionPath };
    function wrappedFunction(...args: unknown[]): unknown {
      helpers.checkEnvFlags(ctx);
      helpers.updateDynamicRam(ctx, getRamCost(...tree, key));
      return func(ctx)(...args);
    }
    (eLayer[key] as WrappedFn) = wrappedFunction;
  }

  const wrappedAPI = wrapAPILayer({ args } as ExternalAPI<NSFull>, internalAPI, []);
  return wrappedAPI;
}
