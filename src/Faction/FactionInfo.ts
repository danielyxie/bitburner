import { IMap } from "../types";

/**
 * Contains the "information" property for all the Factions, which is just a description of each faction
 */
export class FactionInfo {
  /**
   * The multiplier to apply to augmentation base purchase price.
   */
  augmentationPriceMult: number;

  /**
   * The multiplier to apply to augmentation reputation base requirement.
   */
  augmentationRepRequirementMult: number;

  /**
   * The names of all other factions considered to be enemies to this faction.
   */
  enemies: string[];

  /**
   * The descriptive text to show on the faction's page.
   */
  infoText: string;

  /**
   * A flag indicating if the faction supports field work to earn reputation.
   */
  offerFieldWork: boolean;

  /**
   * A flag indicating if the faction supports hacking missions to earn reputation.
   */
  offerHackingMission: boolean;

  /**
   * A flag indicating if the faction supports hacking work to earn reputation.
   */
  offerHackingWork: boolean;

  /**
   * A flag indicating if the faction supports security work to earn reputation.
   */
  offerSecurityWork: boolean;

  constructor(
    infoText: string,
    enemies: string[],
    offerHackingMission: boolean,
    offerHackingWork: boolean,
    offerFieldWork: boolean,
    offerSecurityWork: boolean,
  ) {
    this.infoText = infoText;
    this.enemies = enemies;
    this.offerHackingMission = offerHackingMission;
    this.offerHackingWork = offerHackingWork;
    this.offerFieldWork = offerFieldWork;
    this.offerSecurityWork = offerSecurityWork;

    // These are always all 1 for now.
    this.augmentationPriceMult = 1;
    this.augmentationRepRequirementMult = 1;
  }

  offersWork(): boolean {
    return this.offerFieldWork || this.offerHackingMission || this.offerHackingWork || this.offerSecurityWork;
  }
}

/**
 * A map of all factions and associated info to them.
 */
// tslint:disable-next-line:variable-name
export const FactionInfos: IMap<FactionInfo> = {
  // Endgame
  Illuminati: new FactionInfo(
    "Humanity never changes. No matter how civilized society becomes, it will eventually fall back into chaos. " +
      "And from this chaos, we are the invisible hand that guides them to order. ",
    [],
    true,
    true,
    true,
    false,
  ),

  Daedalus: new FactionInfo(
    "Yesterday we obeyed kings and bent our necks to emperors. Today we kneel only to truth.",
    [],
    true,
    true,
    true,
    false,
  ),

  "The Covenant": new FactionInfo(
    "Surrender yourself. Give up your empty individuality to become part of something great, something eternal. " +
      "Become a slave. Submit your mind, body, and soul. Only then can you set yourself free.<br>" +
      "<br>" +
      "Only then can you discover immortality.",
    [],
    true,
    true,
    true,
    false,
  ),

  // Megacorporations, each forms its own faction
  ECorp: new FactionInfo(
    "ECorp's mission is simple: to connect the world of today with the technology of tomorrow. With our wide " +
      "range of Internet-related software and commercial hardware, ECorp makes the world's information " +
      "universally accessible.",
    [],
    true,
    true,
    true,
    true,
  ),

  MegaCorp: new FactionInfo(
    "MegaCorp does what no other dares to do. We imagine. We create. We invent. We create what others have " +
      "never even dreamed of. Our work fills the world's needs for food, water, power, and transporation on an " +
      "unprecendented scale, in ways that no other company can.<br>" +
      "<br>" +
      "In our labs and factories and on the ground with customers, MegaCorp is ushering in a new era for the world.",
    [],
    true,
    true,
    true,
    true,
  ),

  "Bachman & Associates": new FactionInfo(
    "Where Law and Business meet - thats where we are.<br>" +
      "<br>" +
      "Legal Insight - Business Instinct - Innovative Experience.",
    [],
    true,
    true,
    true,
    true,
  ),

  "Blade Industries": new FactionInfo("Augmentation is Salvation.", [], true, true, true, true),

  NWO: new FactionInfo(
    "Humans don't truly desire freedom. They want to be observed, understood, and judged. They want to " +
      "be given purpose and direction in life. That is why they created God. And that is why they created " +
      "civilization - not because of willingness, but because of a need to be incorporated into higher orders of " +
      "structure and meaning.",
    [],
    true,
    true,
    true,
    true,
  ),

  "Clarke Incorporated": new FactionInfo("The Power of the Genome - Unlocked.", [], true, true, true, true),

  "OmniTek Incorporated": new FactionInfo(
    "Simply put, our mission is to design and build robots that make a difference.",
    [],
    true,
    true,
    true,
    true,
  ),

  "Four Sigma": new FactionInfo(
    "The scientific method is the best way to approach investing. Big strategies backed up with big data. Driven " +
      "by deep learning and innovative ideas. And improved by iteration. That's Four Sigma.",
    [],
    true,
    true,
    true,
    true,
  ),

  "KuaiGong International": new FactionInfo("Dream big. Work hard. Make history.", [], true, true, true, true),

  // Other Corporations
  "Fulcrum Secret Technologies": new FactionInfo(
    "The human organism has an innate desire to worship. That is why they created gods. If there were no gods, it " +
      "would be necessary to create them. And now we can.",
    [],
    true,
    true,
    false,
    true,
  ),

  // Hacker groups
  BitRunners: new FactionInfo(
    "Our entire lives are controlled by bits. All of our actions, our thoughts, our personal information. It's " +
      "all transformed into bits, stored in bits, communicated through bits. It’s impossible for any person to move, " +
      "to live, to operate at any level without the use of bits. And when a person moves, lives, and operates, they " +
      "leave behind their bits, mere traces of seemingly meaningless fragments of information. But these bits can be " +
      "reconstructed. Transformed. Used.<br>" +
      "<br>" +
      "Those who run the bits, run the world.",
    [],
    true,
    true,
    false,
    false,
  ),

  "The Black Hand": new FactionInfo(
    "The world, so afraid of strong government, now has no government. Only power - Digital power. Financial " +
      "power. Technological power. And those at the top rule with an invisible hand. They built a society where the " +
      "rich get richer, and everyone else suffers.<br>" +
      "<br>" +
      "So much pain. So many lives. Their darkness must end.",
    [],
    true,
    true,
    true,
    false,
  ),

  NiteSec: new FactionInfo(
    "                          __..__               <br>" +
      "                      _.nITESECNIt.            <br>" +
      "                   .-'NITESECNITESEc.          <br>" +
      "                 .'    NITESECNITESECn         <br>" +
      "                /       NITESECNITESEC;        <br>" +
      "               :        :NITESECNITESEC;       <br>" +
      "               ;       $ NITESECNITESECN       <br>" +
      "              :    _,   ,N'ITESECNITESEC       <br>" +
      "              : .+^^`,  :    `NITESECNIT       <br>" +
      "               ) /),     `-,-=,NITESECNI       <br>" +
      "              /  ^         ,-;|NITESECN;       <br>" +
      "             /     _.'     '-';NITESECN        <br>" +
      "            (  ,           ,-''`^NITE'         <br>" +
      "             )`            :`.    .'           <br>" +
      "             )--           ;  `- /             <br>" +
      "             '        _.-'     :              <br>" +
      "             (     _.-'   .                  <br>" +
      "              ------.                       <br>" +
      "                      .                     <br>" +
      "                               _.nIt          <br>" +
      "                          _.nITESECNi         <br>" +
      "                         nITESECNIT^'         <br>" +
      "                         NITE^' ___           <br>" +
      "                        /    .gP''''Tp.       <br>" +
      "                       :    d'     .  `b      <br>" +
      "                       ;   d'       o  `b ;    <br>" +
      "                      /   d;            `b|    <br>" +
      "                     /,   $;          @  `:    <br>" +
      "                    /'    $$               ;   <br>" +
      "                  .'      $$b          o   |   <br>" +
      "                .'       d$$$;             :   <br>" +
      "               /       .d$$$$;          ,   ;  <br>" +
      "              d      .dNITESEC          $   |  <br>" +
      "             :bp.__.gNITESEC$$         :$   ;  <br>" +
      "             NITESECNITESECNIT         $$b :   <br>",
    [],
    true,
    true,
    false,
    false,
  ),

  // City factions, essentially governments
  Aevum: new FactionInfo("The Silicon City.", ["Chongqing", "New Tokyo", "Ishima", "Volhaven"], true, true, true, true),
  Chongqing: new FactionInfo("Serve the People.", ["Sector-12", "Aevum", "Volhaven"], true, true, true, true),
  Ishima: new FactionInfo(
    "The East Asian Order of the Future.",
    ["Sector-12", "Aevum", "Volhaven"],
    true,
    true,
    true,
    true,
  ),
  "New Tokyo": new FactionInfo("Asia's World City.", ["Sector-12", "Aevum", "Volhaven"], true, true, true, true),
  "Sector-12": new FactionInfo(
    "The City of the Future.",
    ["Chongqing", "New Tokyo", "Ishima", "Volhaven"],
    true,
    true,
    true,
    true,
  ),
  Volhaven: new FactionInfo(
    "Benefit, Honor, and Glory.",
    ["Chongqing", "Sector-12", "New Tokyo", "Aevum", "Ishima"],
    true,
    true,
    true,
    true,
  ),

  // Criminal Organizations/Gangs
  "Speakers for the Dead": new FactionInfo(
    "It is better to reign in Hell than to serve in Heaven.",
    [],
    true,
    true,
    true,
    true,
  ),

  "The Dark Army": new FactionInfo(
    "The World doesn't care about right or wrong. It only cares about power.",
    [],
    true,
    true,
    true,
    false,
  ),

  "The Syndicate": new FactionInfo("Honor holds you back.", [], true, true, true, true),

  Silhouette: new FactionInfo(
    "Corporations have filled the void of power left behind by the collapse of Western government. The issue is " +
      "they've become so big that you don't know who they're working for. And if you're employed at one of these " +
      "corporations, you don't even know who you're working for.<br>" +
      "<br>" +
      "That's terror. Terror, fear, and corruption. All born into the system, all propagated by the system.",
    [],
    true,
    true,
    true,
    false,
  ),

  Tetrads: new FactionInfo("Following the mandate of Heaven and carrying out the way.", [], false, false, true, true),

  "Slum Snakes": new FactionInfo("Slum Snakes rule!", [], false, false, true, true),

  // Earlygame factions - factions the player will prestige with early on that don't belong in other categories.
  Netburners: new FactionInfo("~~//*>H4CK||3T 8URN3R5**>?>\\~~", [], true, true, false, false),

  "Tian Di Hui": new FactionInfo("Obey Heaven and work righteously.", [], true, true, false, true),

  CyberSec: new FactionInfo(
    "The Internet is the first thing that was built that we don't fully understand, the largest " +
      "experiment in anarchy that we have ever had. And as the world becomes increasingly dominated by it, " +
      "society approaches the brink of total chaos. We serve only to protect society, to protect humanity, to " +
      "protect the world from imminent collapse.",
    [],
    true,
    true,
    false,
    false,
  ),

  // Special Factions
  Bladeburners: new FactionInfo(
    "It's too bad they won't live. But then again, who does?<br><br>Note that for this faction, reputation can " +
      "only be gained through Bladeburner actions. Completing Bladeburner contracts/operations will increase your " +
      "reputation.",
    [],
    false,
    false,
    false,
    false,
  ),
};
