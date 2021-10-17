import { ActiveFragment } from "./ActiveFragment";
import { Fragment } from "./Fragment";
import { IPlayer } from "../PersonObjects/IPlayer";

export interface IStaneksGift {
  storedCycles: number;
  fragments: ActiveFragment[];
  width(): number;
  height(): number;
  charge(rootX: number, rootY: number, ram: number): number;
  process(p: IPlayer, n: number): void;
  effect(fragment: ActiveFragment): number;
  canPlace(x: number, y: number, rotation: number, fragment: Fragment): boolean;
  place(x: number, y: number, rotation: number, fragment: Fragment): boolean;
  findFragment(rootX: number, rootY: number): ActiveFragment | undefined;
  fragmentAt(worldX: number, worldY: number): ActiveFragment | undefined;
  deleteAt(worldX: number, worldY: number): boolean;
  clear(): void;
  count(fragment: Fragment): number;
  inBonus(): boolean;
  prestigeAugmentation(): void;
  prestigeSourceFile(): void;
}
