import { IMap } from "../types";

// Map of material (by name) to their sizes (how much space it takes in warehouse)
export const MaterialSizes: IMap<number> = {
    Water:      0.05,
    Energy:     0.01,
    Food:       0.03,
    Plants:     0.05,
    Metal:      0.1,
    Hardware:   0.06,
    Chemicals:  0.05,
    Drugs:      0.02,
    Robots:     0.5,
    AICores:    0.1,
    RealEstate: 0,
}
