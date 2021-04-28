import { IPlayer } from "../PersonObjects/IPlayer";

export class Milestone {
    title: string;
    fulfilled: (p: IPlayer) => boolean;

    constructor(title: string, fulfilled: (p: IPlayer) => boolean) {
        this.title = title;
        this.fulfilled = fulfilled;
    }
}