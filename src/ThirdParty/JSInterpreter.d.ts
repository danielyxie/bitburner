export declare class Interpreter {
  constructor(code: string, opt_initFunc: (int: Interpreter, scope: Object) => void, lineOffset?: number);
  getProperty(obj: Value, name: Value): Value;
  hasProperty(obj: Value, name: Value): boolean;
}

// Object and Value are 2 different things in the interpreter;
export declare type Object = unknown;
export declare type Value = unknown;
