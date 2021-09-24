export declare let inMission: boolean;
export declare class HackingMission {
  constructor(reputation: number, faction: Faction);
  init(): void;
}
export declare function setInMission(inMission: boolean, mission: HackingMission): void;
