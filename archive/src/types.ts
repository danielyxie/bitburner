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

/**
 * Status object for functions that return a boolean indicating success/failure
 * and an optional message
 */
export interface IReturnStatus {
  res: boolean;
  msg?: string;
}

/**
 * Defines the minimum and maximum values for a range.
 * It is up to the consumer if these values are inclusive or exclusive.
 * It is up to the implementor to ensure max > min.
 */
export interface IMinMaxRange {
  /**
   * Value by which the bounds are to be divided for the final range
   */
  divisor?: number;

  /**
   * The maximum bound of the range.
   */
  max: number;

  /**
   * The minimum bound of the range.
   */
  min: number;
}
