import { IOfficeSpace } from "./IOfficeSpace";
import { IMap } from "../types";

export interface IDivision {
    name: string;
    offices: IMap<IOfficeSpace | number>;
}
