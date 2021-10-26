/**
 * Utility function that creates a "city map", which is an object where
 * each city is a key (property).
 *
 * This map uses the official name of the city, NOT its key in the 'Cities' object
 */
import { Cities } from "./Cities";
import { IMap } from "../types";

export function createCityMap<T>(initValue: T): IMap<T> {
  const map: IMap<T> = {};
  const cities = Object.keys(Cities);
  for (let i = 0; i < cities.length; ++i) {
    map[cities[i]] = initValue;
  }

  // round try JSON so to make sure none of the initial values have the same references.
  return JSON.parse(JSON.stringify(map));
}
