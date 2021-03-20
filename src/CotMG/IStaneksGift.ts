import { StaneksGift } from "./StaneksGift";
import { ActiveFragment } from "./ActiveFragment";
import { Fragment } from "./Fragment";
import { IPlayer } from "../PersonObjects/IPlayer";

export interface IStaneksGift {
    fragments: ActiveFragment[];
    width(): number;
    height(): number;
    charge(worldX: number, worldY: number, ram: number): number;
    process(p: IPlayer, n: number): void;
    canPlace(x: number, y: number, fragment: Fragment): boolean;
    place(x: number, y: number, fragment: Fragment): boolean;
    fragmentAt(worldX: number, worldY: number): ActiveFragment | null;
    deleteAt(worldX: number, worldY: number): boolean;
    clear(): void;
    count(fragment: Fragment): number;
};