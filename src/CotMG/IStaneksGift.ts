import { ActiveFragment } from "./ActiveFragment";
import { Fragment } from "./Fragment";
import { IPlayer } from "../PersonObjects/IPlayer";

export interface IStaneksGift {
  storedCycles: number;
  fragments: ActiveFragment[];
  width(): number;
  height(): number;
  charge(player: IPlayer, fragment: ActiveFragment, threads: number): void;
  process(p: IPlayer, n: number): void;
  effect(fragment: ActiveFragment): number;
  canPlace(x: number, y: number, rotation: number, fragment: Fragment): boolean;
  place(x: number, y: number, rotation: number, fragment: Fragment): boolean;
  findFragment(rootX: number, rootY: number): ActiveFragment | undefined;
  fragmentAt(rootX: number, rootY: number): ActiveFragment | undefined;
  delete(rootX: number, rootY: number): boolean;
  clear(): void;
  count(fragment: Fragment): number;
  inBonus(): boolean;
  prestigeAugmentation(): void;
  prestigeSourceFile(): void;
}
