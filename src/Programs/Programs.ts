import { IMap }                     from "../types";
import { programsMetadata }         from "./data/programsMetadata";
import { Program }                  from "./Program";

export const Programs: IMap<Program> = {};

for (const params of programsMetadata) {
    Programs[params.key] = new Program(params.name, params.create);
}
