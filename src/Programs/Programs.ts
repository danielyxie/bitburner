import { Program } from "./Program";
import { programsMetadata } from "./data/ProgramsMetadata";
import { IMap } from "../types";

export const Programs: IMap<Program> = {};
export function initPrograms() {
  for (const params of programsMetadata) {
    Programs[params.key] = new Program(params.name, params.create, params.run);
  }
}
