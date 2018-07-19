/**
 * Performs an equality check between two instances of the same type.
 */
export type EqualityFunc<T> = (a: T, b: T) => boolean;

/**
 * A map is an object that holds a mapping between string keys and some consistent type.
 */
export interface IMap<T> {
  [key: string]: T;
}

/**
 * Performs some action, with no returned value.
 */
export type Action = () => void;
