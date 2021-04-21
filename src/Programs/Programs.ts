import { Program }                  from "./Program";
import { IProgramCreationParams,
         programsMetadata }         from "./data/ProgramsMetadata";
import { IMap }                     from "../types";

export const Programs: IMap<Program> = {};

for (const params of programsMetadata) {
    Programs[params.key] = new Program(params.name, params.create);
}
