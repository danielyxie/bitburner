export declare class Interpreter {
  constructor(code: string, opt_initFunc: (int: Interpreter, scope: Object) => void, lineOffset?: number);
  getProperty(obj: Value, name: Value): Value;
  setProperty(obj: Object, name: Value, value: Value): void;
  hasProperty(obj: Value, name: Value): boolean;
  pseudoToNative(obj: Value): unknown;
  nativeToPseudo(obj: Value): unknown;
  createAsyncFunction(f: (...args: unknown[]) => unknown): Object;
  createNativeFunction(f: (...args: unknown[]) => unknown): Object;
  step(): boolean;
}

// Object and Value are 2 different things in the interpreter;
export declare type Object = unknown;
export declare type Value = unknown;
