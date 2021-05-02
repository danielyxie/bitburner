export class PlayerOwnedSourceFile {
    // Source-File level
    lvl = 1;

    // Source-File number
    n = 1;

    constructor(n: number, level: number) {
        this.n = n;
        this.lvl = level;
    }
}

export interface IPlayerOwnedSourceFile {
    lvl: number;
    n: number;
}
