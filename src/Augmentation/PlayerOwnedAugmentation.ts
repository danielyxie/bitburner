export class PlayerOwnedAugmentation {
    level: number = 1;
    name: string = "";

    constructor(name: string = "") {
        this.name = name;
    }
}

export interface IPlayerOwnedAugmentation {
    level: number;
    name: string;
}
