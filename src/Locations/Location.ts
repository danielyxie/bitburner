/**
 * Class representing a visitable location in the world
 */
import { CityName } from "./data/CityNames";
import { LocationName } from "./data/LocationNames";
import { LocationType } from "./LocationTypeEnum";

export interface IConstructorParams {
    city?: CityName | null;
    name?: LocationName;
    types?: LocationType[];
    techVendorMaxRam?: number;
    techVendorMinRam?: number;
}

export class Location {
    /**
     * Name of city this location is in. If this property is null, it means this i
     * is a generic location that is available in all cities
     */
    city: CityName | null = null;

    /**
     * Identifier for location
     */
    name: LocationName = LocationName.Void;

    /**
     * List of what type(s) this location is. A location can be multiple types
     * (e.g. company and tech vendor)
     */
    types: LocationType[] = [];

    /**
     * Tech vendors allow you to purchase servers.
     * This property defines the max RAM server you can purchase from this vendor
     */
    techVendorMaxRam: number = 0;

    /**
     * Tech vendors allow you to purchase servers.
     * This property defines the max RAM server you can purchase from this vendor
     */
    techVendorMinRam: number = 0;

    constructor(p: IConstructorParams) {
        if (p.city)             { this.city = p.city; }
        if (p.name)             { this.name = p.name; }
        if (p.types)            { this.types = p.types; }
        if (p.techVendorMaxRam) { this.techVendorMaxRam = p.techVendorMaxRam; }
        if (p.techVendorMinRam) { this.techVendorMinRam = p.techVendorMinRam; }
    }
}
