export class PlayerOwnedAugmentation {
    level = 1;
    name = "";

    constructor(name = "") {
        this.name = name;
    }
}

export interface IPlayerOwnedAugmentation {
    level: number;
    name: string;
}
