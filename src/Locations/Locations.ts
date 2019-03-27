/**
 * Map of all Locations in the game
 * Key = Location name, value = Location object
 */
import { Location,
         IConstructorParams } from "./Location";
import { LocationsMetadata } from "./data/LocationsMetadata";

import { IMap } from "../types";

export const Locations: IMap<Location> = {};

function constructLocation(p: IConstructorParams) {
    if (!p.name) {
        throw new Error(`Invalid constructor parameters for Location. No 'name' property`);
    }

    if (Locations[p.name] instanceof Location) {
        console.warn(`Property with name ${p.name} already exists and is being overwritten`);
    }

    Locations[p.name] = new Location(p);
}

for (const metadata of LocationsMetadata {
    constructLocation(metadata);
}
