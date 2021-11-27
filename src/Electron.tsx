import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { Exploit } from "./Exploits/Exploit";
import { Player } from "./Player";

interface Achievement {
  ID: string;
  Condition: () => boolean;
}

function sfAchievement(): Achievement[] {
  const achs: Achievement[] = [];
  for (let i = 0; i <= 11; i++) {
    for (let j = 1; j <= 3; j++) {
      achs.push({
        ID: `SF${i}.${j}`,
        Condition: () => Player.sourceFileLvl(i) >= j,
      });
    }
  }
  return achs;
}

const achievements: Achievement[] = [
  {
    ID: `UNACHIEVABLE`,
    Condition: () => false,
  },
  ...sfAchievement(),
  {
    ID: `SF12.100`,
    Condition: () => Player.sourceFileLvl(12) >= 100,
  },
  { ID: "BYPASS", Condition: () => Player.exploits.includes(Exploit.Bypass) },
  { ID: "PROTOTYPETAMPERING", Condition: () => Player.exploits.includes(Exploit.PrototypeTampering) },
  { ID: "UNCLICKABLE", Condition: () => Player.exploits.includes(Exploit.Unclickable) },
  { ID: "UNDOCUMENTEDFUNCTIONCALL", Condition: () => Player.exploits.includes(Exploit.UndocumentedFunctionCall) },
  { ID: "TIMECOMPRESSION", Condition: () => Player.exploits.includes(Exploit.TimeCompression) },
  { ID: "REALITYALTERATION", Condition: () => Player.exploits.includes(Exploit.RealityAlteration) },
  { ID: "N00DLES", Condition: () => Player.exploits.includes(Exploit.N00dles) },
  { ID: "EDITSAVEFILE", Condition: () => Player.exploits.includes(Exploit.EditSaveFile) },
  {
    ID: "MONEY_1Q",
    Condition: () => Player.money >= 1e18,
  },
  {
    ID: "MONEY_M1B",
    Condition: () => Player.money <= -1e9,
  },
  {
    ID: "INSTALL_1",
    Condition: () => Player.augmentations.length >= 1,
  },
  {
    ID: "INSTALL_100",
    Condition: () => Player.augmentations.length >= 100,
  },
  {
    ID: "QUEUE_40",
    Condition: () => Player.queuedAugmentations.length >= 40,
  },
  {
    ID: "SLEEVE_8",
    Condition: () => Player.sleeves.length === 8,
  },
  {
    ID: "HACKING_100000",
    Condition: () => Player.hacking >= 100000,
  },
  {
    ID: "INTELLIGENCE_100",
    Condition: () => Player.intelligence >= 100,
  },
  {
    ID: "COMBAT_1000",
    Condition: () =>
      Player.strength >= 1000 && Player.defense >= 1000 && Player.dexterity >= 1000 && Player.agility >= 1000,
  },
  {
    ID: "NEUROFLUX_255",
    Condition: () => Player.augmentations.some((a) => a.name === AugmentationNames.NeuroFluxGovernor && a.level >= 255),
  },
  { ID: "ILLUMINATI", Condition: () => Player.factions.includes("Illuminati") },
  { ID: "DAEDALUS", Condition: () => Player.factions.includes("Daedalus") },
  { ID: "THE_COVENANT", Condition: () => Player.factions.includes("The Covenant") },
  { ID: "ECORP", Condition: () => Player.factions.includes("ECorp") },
  { ID: "MEGACORP", Condition: () => Player.factions.includes("MegaCorp") },
  { ID: "BACHMAN_&_ASSOCIATES", Condition: () => Player.factions.includes("Bachman & Associates") },
  { ID: "BLADE_INDUSTRIES", Condition: () => Player.factions.includes("Blade Industries") },
  { ID: "NWO", Condition: () => Player.factions.includes("NWO") },
  { ID: "CLARKE_INCORPORATED", Condition: () => Player.factions.includes("Clarke Incorporated") },
  { ID: "OMNITEK_INCORPORATED", Condition: () => Player.factions.includes("OmniTek Incorporated") },
  { ID: "FOUR_SIGMA", Condition: () => Player.factions.includes("Four Sigma") },
  { ID: "KUAIGONG_INTERNATIONAL", Condition: () => Player.factions.includes("KuaiGong International") },
  { ID: "FULCRUM_SECRET_TECHNOLOGIES", Condition: () => Player.factions.includes("Fulcrum Secret Technologies") },
  { ID: "BITRUNNERS", Condition: () => Player.factions.includes("BitRunners") },
  { ID: "THE_BLACK_HAND", Condition: () => Player.factions.includes("The Black Hand") },
  { ID: "NITESEC", Condition: () => Player.factions.includes("NiteSec") },
  { ID: "AEVUM", Condition: () => Player.factions.includes("Aevum") },
  { ID: "CHONGQING", Condition: () => Player.factions.includes("Chongqing") },
  { ID: "ISHIMA", Condition: () => Player.factions.includes("Ishima") },
  { ID: "NEW_TOKYO", Condition: () => Player.factions.includes("New Tokyo") },
  { ID: "SECTOR-12", Condition: () => Player.factions.includes("Sector-12") },
  { ID: "VOLHAVEN", Condition: () => Player.factions.includes("Volhaven") },
  { ID: "SPEAKERS_FOR_THE_DEAD", Condition: () => Player.factions.includes("Speakers for the Dead") },
  { ID: "THE_DARK_ARMY", Condition: () => Player.factions.includes("The Dark Army") },
  { ID: "THE_SYNDICATE", Condition: () => Player.factions.includes("The Syndicate") },
  { ID: "SILHOUETTE", Condition: () => Player.factions.includes("Silhouette") },
  { ID: "TETRADS", Condition: () => Player.factions.includes("Tetrads") },
  { ID: "SLUM_SNAKES", Condition: () => Player.factions.includes("Slum Snakes") },
  { ID: "NETBURNERS", Condition: () => Player.factions.includes("Netburners") },
  { ID: "TIAN_DI_HUI", Condition: () => Player.factions.includes("Tian Di Hui") },
  { ID: "CYBERSEC", Condition: () => Player.factions.includes("CyberSec") },
  { ID: "BLADEBURNERS", Condition: () => Player.factions.includes("Bladeburners") },
];

function setAchievements(achs: string[]): void {
  (document as any).achievements = achs;
}

function calculateAchievements(): void {
  setAchievements(achievements.filter((a) => a.Condition()).map((a) => a.ID));
}

export function initElectron(): void {
  setAchievements([]);
  setInterval(calculateAchievements, 5000);
}
