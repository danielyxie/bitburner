// The Research Map is an object that holds all Corporation Research objects
// as values. They are identified by their names
import { Research,
         IConstructorParams } from "./Research";
import { researchMetadata } from "./data/ResearchMetadata";
import { IMap } from "../types";

export let ResearchMap: IMap<Research> = {};

function addResearch(p: IConstructorParams) {
    if (ResearchMap[p.name] != null) {
        console.warn(`Duplicate Research being defined: ${p.name}`);
    }
    ResearchMap[p.name] = new Research(p);
}

for (const metadata of researchMetadata) {
    addResearch(metadata);
}
