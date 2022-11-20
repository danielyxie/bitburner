import { CityName } from "./data/CityNames";
import { LocationName } from "../utils/enums";

/** Class representing a City in the game */
export class City {
  /** List of all locations in this city */
  locations: LocationName[];

  /** Name of this city */
  name: CityName;

  /** Metro map ascii art */
  asciiArt: string;

  constructor(name: CityName, locations: LocationName[] = [], asciiArt = "") {
    this.name = name;
    this.locations = locations;
    this.asciiArt = asciiArt;
  }

  addLocation(loc: LocationName): void {
    this.locations.push(loc);
  }
}
