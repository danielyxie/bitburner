// Contains an array containing information about the player's source files
// Array[n] returns what level the player has of Source-File N.

import { CONSTANTS } from "../Constants";
import { IPlayer } from "../PersonObjects/IPlayer";

export const SourceFileFlags: number[] = Array(CONSTANTS.TotalNumBitNodes + 1); // Skip index 0

export function updateSourceFileFlags(p: IPlayer): void {
    for (let i = 0; i < SourceFileFlags.length; ++i) {
        SourceFileFlags[i] = 0;
    }

    for (let i = 0; i < p.sourceFiles.length; ++i) {
        const sf = p.sourceFiles[i];
        SourceFileFlags[sf.n] = sf.lvl;
    }
}
