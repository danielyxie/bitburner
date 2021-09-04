interface IReviverValue {
  ctor: string;
  data: any;
}
export function Generic_fromJSON<T>(ctor: new () => T, data: any): T;
export function Generic_toJSON(
  ctorName: string,
  obj: any,
  keys?: string[],
): string;
export function Reviver(key, value: IReviverValue);
export namespace Reviver {
  export let constructors: any;
}
