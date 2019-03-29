/**
 * Class representing a City in the game
 */
import { CityName } from "./data/CityNames";
import { LocationName } from "./data/LocationNames";

export class City {
    /**
     * List of all locations in this city
     */
    locations: LocationName[];

    /**
     * Name of this city
     */
    name: CityName;

    constructor(name: CityName, locations: LocationName[]=[]) {
        this.name = name;
        this.locations = locations;
    }

    addLocation(loc: LocationName): void {
        this.locations.push(loc);
    }
}
