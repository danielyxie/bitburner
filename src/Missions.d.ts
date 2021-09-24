export declare let inMission: boolean;
export declare class HackingMission {
  constructor(reputation: number, faction: Faction);
  init(): void;
  process(numCycles: number): void;
}
export declare function setInMission(inMission: boolean, mission: HackingMission): void;
export declare let currMission: HackingMission;
