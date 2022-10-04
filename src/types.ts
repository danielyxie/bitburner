/** Construct a type using the values from an object. Requires object to be defined "as const" */
export type ValuesFrom<T> = T[keyof T];

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
  /** Value by which the bounds are to be divided for the final range */
  divisor?: number;

  /** The maximum bound of the range. */
  max: number;

  /** The minimum bound of the range. */
  min: number;
}
