import { Program }                  from "./Program";
import { programsMetadata }         from "./data/programsMetadata";
import { IMap }                     from "../types";

export const Programs: IMap<Program> = {};

for (const params of programsMetadata) {
    Programs[params.key] = new Program(params.name, params.create);
}
