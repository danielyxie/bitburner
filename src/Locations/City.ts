/**
 * Class representing a City in the game
 */
import { Location } from "./Location";
import { CityName } from "./data/CityNames";

export class City {
    /**
     * List of all locations in this city
     */
    locations: Location[];

    /**
     * Name of this city
     */
    name: CityName;

    constructor(name: CityName, locations: Location[]) {
        this.name = name;
        this.locations = locations;
    }
}
