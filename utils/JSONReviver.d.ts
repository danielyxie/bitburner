interface IReviverValue {
    ctor: string;
    data: object
}
export function Generic_fromJSON<T>(ctor: new () => T, data: any): T;
export function Generic_toJSON(ctorName: string, obj: object, keys?: string[]): string;
export function Reviver(key, value: IReviverValue);
export namespace Reviver {
    export var constructors: any;
}
