/**
 * Map of all Locations in the game
 * Key = Location name, value = Location object
 */
import { Cities }               from "./Cities";
import { City }                 from "./City";
import { CityName }             from "./data/CityNames";
import { LocationsMetadata }    from "./data/LocationsMetadata";
import { IConstructorParams,
         Location }   from "./Location";

import { IMap } from "../types";

export const Locations: IMap<Location> = {};

/**
 * Here, we'll initialize both Locations and Cities data. These can both
 * be initialized from the `LocationsMetadata`
 */
function constructLocation(p: IConstructorParams): Location {
    if (!p.name) {
        throw new Error("Invalid constructor parameters for Location. No 'name' property");
    }

    if (Locations[p.name] instanceof Location) {
        console.warn(`Property with name ${p.name} already exists and is being overwritten`);
    }

    Locations[p.name] = new Location(p);

    return Locations[p.name];
}

// First construct all cities
Cities[CityName.Aevum]          = new City(CityName.Aevum);
Cities[CityName.Chongqing]      = new City(CityName.Chongqing);
Cities[CityName.Ishima]         = new City(CityName.Ishima);
Cities[CityName.NewTokyo]       = new City(CityName.NewTokyo);
Cities[CityName.Sector12]       = new City(CityName.Sector12);
Cities[CityName.Volhaven]       = new City(CityName.Volhaven);

// Then construct all locations, and add them to the cities as we go.
for (const metadata of LocationsMetadata) {
    const loc = constructLocation(metadata);

    const cityName = loc.city;
    if (cityName === null) {
        // Generic location, add to all cities
        for (const city in Cities) {
            Cities[city].addLocation(loc.name);
        }
    } else {
        Cities[cityName].addLocation(loc.name);
    }
}
