import { Program } from "./Program";
import { programsMetadata } from "./data/ProgramsMetadata";

export const Programs: Record<string, Program> = {};
export function initPrograms() {
  for (const params of programsMetadata) {
    Programs[params.key] = new Program(params.name, params.create, params.run);
  }
}
