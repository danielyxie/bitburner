import { IPlayer } from "../PersonObjects/IPlayer";

export type Milestone = {
    title: string;
    fulfilled: (p: IPlayer) => boolean;
}