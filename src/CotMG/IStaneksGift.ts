import { ActiveFragment } from "./ActiveFragment";
import { Fragment } from "./Fragment";
import { IPlayer } from "../PersonObjects/IPlayer";

export interface IStaneksGift {
  storedCycles: number;
  fragments: ActiveFragment[];
  width(): number;
  height(): number;
  charge(worldX: number, worldY: number, ram: number): number;
  process(p: IPlayer, n: number): void;
  effect(fragment: ActiveFragment): number;
  canPlace(x: number, y: number, fragment: Fragment): boolean;
  place(x: number, y: number, fragment: Fragment): boolean;
  fragmentAt(worldX: number, worldY: number): ActiveFragment | null;
  deleteAt(worldX: number, worldY: number): boolean;
  clear(): void;
  count(fragment: Fragment): number;
  inBonus(): boolean;
  prestigeAugmentation(): void;
  prestigeSourceFile(): void;
}
