/**
 * Utility function that creates a "city map", which is an object where
 * each city is a key (property).
 *
 * This map uses the official name of the city, NOT its key in the 'Cities' object
 */
import { IMap } from "../types";
import { Cities } from "./Cities";

export function createCityMap<T>(initValue: T): IMap<T> {
    const map: IMap<any> = {};
    const cities = Object.keys(Cities);
    for (let i = 0; i < cities.length; ++i) {
        map[cities[i]] = initValue;
    }

    return map;
}
