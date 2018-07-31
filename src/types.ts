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

/**
 * Contains a method to initialize itself to a known state.
 */
export interface ISelfInitializer {
  /**
   * Initialize/reset the object to a known, default state.
   */
  init(): void;
}

/**
 * Contains a method to repopulate itself based on a JSON string.
 */
export interface ISelfLoading {
  /**
   * Loads the save state onto the current object.
   * @param saveState JSON string representing the save state.
   */
  load(saveState: string): void;
}
