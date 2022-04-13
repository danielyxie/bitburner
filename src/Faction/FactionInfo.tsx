import React from "react";
import { IMap } from "../types";
import { FactionNames } from "./data/FactionNames";

interface FactionInfoParams {
  infoText?: JSX.Element;
  enemies?: string[];
  offerHackingWork?: boolean;
  offerFieldWork?: boolean;
  offerSecurityWork?: boolean;
  special?: boolean;
  keepOnInstall?: boolean;
}

/**
 * Contains the "information" property for all the Factions, which is just a description of each faction
 */
export class FactionInfo {
  /**
   * The names of all other factions considered to be enemies to this faction.
   */
  enemies: string[];

  /**
   * The descriptive text to show on the faction's page.
   */
  infoText: JSX.Element;

  /**
   * A flag indicating if the faction supports field work to earn reputation.
   */
  offerFieldWork: boolean;

  /**
   * A flag indicating if the faction supports hacking work to earn reputation.
   */
  offerHackingWork: boolean;

  /**
   * A flag indicating if the faction supports security work to earn reputation.
   */
  offerSecurityWork: boolean;

  /**
   * Keep faction on install.
   */
  keep: boolean;

  /**
   * Special faction
   */
  special: boolean;

  constructor(params: FactionInfoParams) {
    this.infoText = params.infoText ?? <></>;
    this.enemies = params.enemies ?? [];
    this.offerHackingWork = params.offerHackingWork ?? false;
    this.offerFieldWork = params.offerFieldWork ?? false;
    this.offerSecurityWork = params.offerSecurityWork ?? false;

    this.keep = params.keepOnInstall ?? false;
    this.special = params.special ?? false;
  }

  offersWork(): boolean {
    return this.offerFieldWork || this.offerHackingWork || this.offerSecurityWork;
  }
}

/**
 * A map of all factions and associated info to them.
 */
// tslint:disable-next-line:variable-name
export const FactionInfos: IMap<FactionInfo> = {
  // Endgame
  [FactionNames.Illuminati]: new FactionInfo({
    infoText: (
      <>
        Humanity never changes. No matter how civilized society becomes, it will eventually fall back into chaos. And
        from this chaos, we are the invisible hand that guides them to order.{" "}
      </>
    ),
    offerHackingWork: true,
    offerFieldWork: true,
  }),

  [FactionNames.Daedalus]: new FactionInfo({
    infoText: <>Yesterday we obeyed kings and bent our necks to emperors. Today we kneel only to truth.</>,
    offerHackingWork: true,
    offerFieldWork: true,
  }),

  [FactionNames.TheCovenant]: new FactionInfo({
    infoText: (
      <>
        Surrender yourself. Give up your empty individuality to become part of something great, something eternal.
        Become a slave. Submit your mind, body, and soul. Only then can you set yourself free.
        <br />
        <br />
        Only then can you discover immortality.
      </>
    ),
    offerHackingWork: true,
    offerFieldWork: true,
  }),

  // Megacorporations, each forms its own faction
  [FactionNames.ECorp]: new FactionInfo({
    infoText: (
      <>
        {FactionNames.ECorp}'s mission is simple: to connect the world of today with the technology of tomorrow. With
        our wide range of Internet-related software and commercial hardware, {FactionNames.ECorp} makes the world's
        information universally accessible.
      </>
    ),
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  [FactionNames.MegaCorp]: new FactionInfo({
    infoText: (
      <>
        {FactionNames.MegaCorp} does what no other dares to do. We imagine. We create. We invent. We create what others
        have never even dreamed of. Our work fills the world's needs for food, water, power, and transportation on an
        unprecedented scale, in ways that no other company can.
        <br />
        <br />
        In our labs and factories and on the ground with customers, {FactionNames.MegaCorp} is ushering in a new era for
        the world.
      </>
    ),
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  [FactionNames.BachmanAssociates]: new FactionInfo({
    infoText: (
      <>
        Where Law and Business meet - thats where we are.
        <br />
        <br />
        Legal Insight - Business Instinct - Innovative Experience.
      </>
    ),
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  [FactionNames.BladeIndustries]: new FactionInfo({
    infoText: <>Augmentation is Salvation.</>,
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  [FactionNames.NWO]: new FactionInfo({
    infoText: (
      <>
        Humans don't truly desire freedom. They want to be observed, understood, and judged. They want to be given
        purpose and direction in life. That is why they created God. And that is why they created civilization - not
        because of willingness, but because of a need to be incorporated into higher orders of structure and meaning.
      </>
    ),
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  [FactionNames.ClarkeIncorporated]: new FactionInfo({
    infoText: <>The Power of the Genome - Unlocked.</>,
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  [FactionNames.OmniTekIncorporated]: new FactionInfo({
    infoText: <>Simply put, our mission is to design and build robots that make a difference.</>,
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  [FactionNames.FourSigma]: new FactionInfo({
    infoText: (
      <>
        The scientific method is the best way to approach investing. Big strategies backed up with big data. Driven by
        deep learning and innovative ideas. And improved by iteration. That's {FactionNames.FourSigma}.
      </>
    ),
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  [FactionNames.KuaiGongInternational]: new FactionInfo({
    infoText: <>Dream big. Work hard. Make history.</>,
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  // Other Corporations
  [FactionNames.FulcrumSecretTechnologies]: new FactionInfo({
    infoText: (
      <>
        The human organism has an innate desire to worship. That is why they created gods. If there were no gods, it
        would be necessary to create them. And now we can.
      </>
    ),
    offerHackingWork: true,
    offerSecurityWork: true,
    keepOnInstall: true,
  }),

  // Hacker groups
  [FactionNames.BitRunners]: new FactionInfo({
    infoText: (
      <>
        Our entire lives are controlled by bits. All of our actions, our thoughts, our personal information. It's all
        transformed into bits, stored in bits, communicated through bits. It’s impossible for any person to move, to
        live, to operate at any level without the use of bits. And when a person moves, lives, and operates, they leave
        behind their bits, mere traces of seemingly meaningless fragments of information. But these bits can be
        reconstructed. Transformed. Used.
        <br />
        <br />
        Those who run the bits, run the world.
      </>
    ),
    offerHackingWork: true,
  }),

  [FactionNames.TheBlackHand]: new FactionInfo({
    infoText: (
      <>
        The world, so afraid of strong government, now has no government. Only power - Digital power. Financial power.
        Technological power. And those at the top rule with an invisible hand. They built a society where the rich get
        richer, and everyone else suffers.
        <br />
        <br />
        So much pain. So many lives. Their darkness must end.
      </>
    ),
    offerHackingWork: true,
    offerFieldWork: true,
  }),

  // prettier-ignore
  [FactionNames.NiteSec]: new FactionInfo({
  infoText:(<>
    {"                  __..__               "}<br />
    {"                _.nITESECNIt.            "}<br />
    {"             .-'NITESECNITESEc.          "}<br />
    {"           .'    NITESECNITESECn         "}<br />
    {"          /       NITESECNITESEC;        "}<br />
    {"         :        :NITESECNITESEC;       "}<br />
    {"         ;       $ NITESECNITESECN       "}<br />
    {"        :    _,   ,N'ITESECNITESEC       "}<br />
    {"        : .+^^`,  :    `NITESECNIT       "}<br />
    {"         ) /),     `-,-=,NITESECNI       "}<br />
    {"        /  ^         ,-;|NITESECN;       "}<br />
    {"       /     _.'     '-';NITESECN        "}<br />
    {"      (  ,           ,-''`^NITE'         "}<br />
    {"       )`            :`.    .'           "}<br />
    {"       )--           ;  `- /             "}<br />
    {"       '        _.-'     :              "}<br />
    {"       (     _.-'   .                  "}<br />
    {"        ------.                       "}<br />
    {"                .                     "}<br />
    {"                         _.nIt          "}<br />
    {"                    _.nITESECNi         "}<br />
    {"                   nITESECNIT^'         "}<br />
    {"                   NITE^' ___           "}<br />
    {"                  /    .gP''''Tp.       "}<br />
    {"                 :    d'     .  `b      "}<br />
    {"                 ;   d'       o  `b ;    "}<br />
    {"                /   d;            `b|    "}<br />
    {"               /,   $;          @  `:    "}<br />
    {"              /'    $/               ;   "}<br />
    {"            .'      $/b          o   |   "}<br />
    {"          .'       d$/$;             :   "}<br />
    {"         /       .d/$/$;          ,   ;  "}<br />
    {"        d      .dNITESEC          $   |  "}<br />
    {"       :bp.__.gNITESEC/$         :$   ;  "}<br />
    {"       NITESECNITESECNIT         /$b :   "}<br /></>),
  offerHackingWork:  true,
  offerFieldWork:  false,
  offerSecurityWork:  false,
  special:  false,
  keepOnInstall:  false,
  }),

  // City factions, essentially governments
  [FactionNames.Aevum]: new FactionInfo({
    infoText: <>The Silicon City.</>,
    enemies: [FactionNames.Chongqing, FactionNames.NewTokyo, FactionNames.Ishima, FactionNames.Volhaven],
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
  }),
  [FactionNames.Chongqing]: new FactionInfo({
    infoText: <>Serve the People.</>,
    enemies: [FactionNames.Sector12, FactionNames.Aevum, FactionNames.Volhaven],
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
  }),
  [FactionNames.Ishima]: new FactionInfo({
    infoText: <>The East Asian Order of the Future.</>,
    enemies: [FactionNames.Sector12, FactionNames.Aevum, FactionNames.Volhaven],
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
  }),
  [FactionNames.NewTokyo]: new FactionInfo({
    infoText: <>Asia's World City.</>,
    enemies: [FactionNames.Sector12, FactionNames.Aevum, FactionNames.Volhaven],
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
  }),
  [FactionNames.Sector12]: new FactionInfo({
    infoText: <>The City of the Future.</>,
    enemies: [FactionNames.Chongqing, FactionNames.NewTokyo, FactionNames.Ishima, FactionNames.Volhaven],
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
  }),
  [FactionNames.Volhaven]: new FactionInfo({
    infoText: <>Benefit, Honor, and Glory.</>,
    enemies: [
      FactionNames.Chongqing,
      FactionNames.Sector12,
      FactionNames.NewTokyo,
      FactionNames.Aevum,
      FactionNames.Ishima,
    ],
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
  }),

  // Criminal Organizations/Gangs
  [FactionNames.SpeakersForTheDead]: new FactionInfo({
    infoText: <>It is better to reign in Hell than to serve in Heaven.</>,
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
  }),

  [FactionNames.TheDarkArmy]: new FactionInfo({
    infoText: <>The World doesn't care about right or wrong. It only cares about power.</>,
    offerHackingWork: true,
    offerFieldWork: true,
  }),

  [FactionNames.TheSyndicate]: new FactionInfo({
    infoText: <>Honor holds you back.</>,
    offerHackingWork: true,
    offerFieldWork: true,
    offerSecurityWork: true,
  }),

  [FactionNames.Silhouette]: new FactionInfo({
    infoText: (
      <>
        Corporations have filled the void of power left behind by the collapse of Western government. The issue is
        they've become so big that you don't know who they're working for. And if you're employed at one of these
        corporations, you don't even know who you're working for.
        <br />
        <br />
        That's terror. Terror, fear, and corruption. All born into the system, all propagated by the system.
      </>
    ),
    offerHackingWork: true,
    offerFieldWork: true,
  }),

  [FactionNames.Tetrads]: new FactionInfo({
    infoText: <>Following the mandate of Heaven and carrying out the way.</>,

    offerFieldWork: true,
    offerSecurityWork: true,
  }),

  [FactionNames.SlumSnakes]: new FactionInfo({
    infoText: <>{FactionNames.SlumSnakes} rule!</>,

    offerFieldWork: true,
    offerSecurityWork: true,
  }),

  // Earlygame factions - factions the player will prestige with early on that don't belong in other categories.
  [FactionNames.Netburners]: new FactionInfo({
    infoText: <>{"~~//*>H4CK||3T 8URN3R5**>?>\\~~"}</>,
    offerHackingWork: true,
  }),

  [FactionNames.TianDiHui]: new FactionInfo({
    infoText: <>Obey Heaven and work righteously.</>,
    offerHackingWork: true,

    offerSecurityWork: true,
  }),

  [FactionNames.CyberSec]: new FactionInfo({
    infoText: (
      <>
        The Internet is the first thing that was built that we don't fully understand, the largest experiment in anarchy
        that we have ever had. And as the world becomes increasingly dominated by it, society approaches the brink of
        total chaos. We serve only to protect society, to protect humanity, to protect the world from imminent collapse.
      </>
    ),
    offerHackingWork: true,
  }),

  // Special Factions
  [FactionNames.Bladeburners]: new FactionInfo({
    infoText: (
      <>
        It's too bad they won't live. But then again, who does?
        <br />
        <br />
        Note that for this faction, reputation can only be gained through {FactionNames.Bladeburners} actions.{" "}
        Completing {FactionNames.Bladeburners} contracts/operations will increase your reputation.
      </>
    ),

    special: true,
  }),

  // prettier-ignore
  [FactionNames.ChurchOfTheMachineGod]: new FactionInfo({
  infoText:(<>
    {"                 ``          "}<br />
    {"             -odmmNmds:      "}<br />
    {"           `hNmo:..-omNh.    "}<br />
    {"           yMd`      `hNh    "}<br />
    {"           mMd        oNm    "}<br />
    {"           oMNo      .mM/    "}<br />
    {"           `dMN+    -mM+     "}<br />
    {"            -mMNo  -mN+      "}<br />
    {"  .+-        :mMNo/mN/       "}<br />
    {":yNMd.        :NMNNN/        "}<br />
    {"-mMMMh.        /NMMh`        "}<br />
    {" .dMMMd.       /NMMMy`       "}<br />
    {"  `yMMMd.     /NNyNMMh`      "}<br />
    {"   `sMMMd.   +Nm: +NMMh.     "}<br />
    {"     oMMMm- oNm:   /NMMd.    "}<br />
    {"      +NMMmsMm-     :mMMd.   "}<br />
    {"       /NMMMm-       -mMMd.  "}<br />
    {"        /MMMm-        -mMMd. "}<br />
    {"       `sMNMMm-        .mMmo "}<br />
    {"      `sMd:hMMm.        ./.  "}<br />
    {"     `yMy` `yNMd`            "}<br />
    {"    `hMs`    oMMy            "}<br />
    {"   `hMh       sMN-           "}<br />
    {"   /MM-       .NMo           "}<br />
    {"   +MM:       :MM+           "}<br />
    {"    sNNo-.`.-omNy`           "}<br />
    {"     -smNNNNmdo-             "}<br />
    {"        `..`                 "}<br /><br />
    Many cultures predict an end to humanity in the near future, a final
    Armageddon that will end the world; but we disagree.
    <br /><br />Note that for this faction, reputation can
     only be gained by charging Stanek's gift.</>),
     special:  true,
     keepOnInstall:  true,
  }),
  // prettier-ignore
  [FactionNames.Infiltrators]: new FactionInfo({
    infoText:(<>
    {".,=,.==.²=.'=,.=░.==.:=,,▄▓▓▓▓▓▓▓▓▓╬░.==.²!.,=,.=⌐.==.!=,.=,.==.²=.,=,.==.²=.!=,"}<br />
    {"'¡»⌐^»∩^:»^:=^`=∩':+]▄▄▓▓▓▓▓▓▓▓▓▓▓▓▓▒^»∩^»=^:»^²»⌐^»∩^:=^`»^`»∩^:»^¡»^`»⌐'»÷'\»'"}<br />
    {"░░_|░_'░⌐_░∩`|▒▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░`,░``░∩`»░_|░¬`░⌐_░░`'PHYZ|C@L`»░_!░⌐`░░_|"}<br />
    {".,=,.»\.²=,,[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▒╦╔░¡_²².,=,,=:.==_!²,,=,_==,W@Z,=,,=\.!=./²,"}<br />
    {"'`»^^»∩':»')▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████▒▐▒Ü▒^»=^¡»^^»⌐'»∩':»^`»^'=^:=^H3R3^»∩^:»':=^"}<br />
    {"░∩`:░_'░⌐`░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█████ÑÜP╩Ü╙░`_░∩`|░`:░_`░∩`|∩`:░_`░⌐_░░`|░`,░⌐`░∩`»"}<br />
    {".,=,,==_²=,▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▌Ñ▓██ÑÜÜ▒Ü▒░_»=,,=,.==_»=,!=,,=,_==,»░,,=,,==_»=,!=,"}<br />
    {"'`=^^=∩^:»^:»└'µ╫█████████╬▓▓▓██Ññ▒NÜÜ▒╠^»=':=^^=∩^»=^:=^`=⌐^»»':»`¡»^`=∩^:=^\»'"}<br />
    {"░░`:░_,░⌐`=∩`|░_¡█╬▀███▓╬╬▀▓▓▀Ñ▒ÄÜ╟ñÜÜ╠D░¬_░░_|=_!░_`░⌐`=∩_:░_'░⌐_░░`!=`┌░__░∩_»"}<br />
    {".,=,.==.!=,,=,.=░╠████Ñ▒▒ÄÜñÜÜÖ╠╩Ü║Üû╠╙».»░.:=,.=⌐.==.!=,,=,.==.!=.,=,_==.»=.!=,"}<br />
    {"^`»^`»∩`:»'\»^^»⌐^╚╬▒Ü▒▒▒ÜÜ▒╚╩▒▒RÖÜ╠╠▒∩∩';╓';»^'»⌐`»»^:»^^»⌐^»∩':»^¡»''»∩`:»^\»^"}<br />
    {"░░ :░ '░⌐_░░_|░`!░`╙▒▒╠╠ÜÉ▒╚Ö╠╠╠╠╟╬╠╠╠╬╬▓▓█▓▓▓▓▓▌▄▒,,░⌐_|░_:░`,░⌐`░░ |░ '░_`░∩_|"}<br />
    {".,=,.=».!=,,=,.=░.==.└╙╙╜╚╩╩╙╙Ü7┘,░╚╬╠╬▓████▓▓▓▓▓█▓▓▓▓▓▓▓▓▓▓▒==,²».,»,,=░.!=.!=,"}<br />
    {"'^»⌐^»∩^:÷^\»^^»⌐'»»^:»^^»⌐^»∩^:»'`║██████████████▓████████▓▓m»'»»^¡»^^»∩^»»^\»^"}<br />
    {"░∩`!░_'░⌐`░░`|░,;░__░⌐`░░`|░-'░⌐`░µ▓█████████████▓▓▓▓▀▀╫▓███▓▌`░⌐_░░`|░`!░⌐`░∩`|"}<br />
    {"_,=,_²».:=:▒▒╠▒▒╠╠▒▒,:=,,=⌐_»░_:=,▓██████████████▓▓▓▓▒!=,███▓▓░_»=_,=,_=░_!░.'=,"}<br />
    {"▒╙R▓▓▄▄╣▓▓▓▓▓▓▓▓▓╬╬╠▒╠▄▄▄µ∩'»=]▄▄▓████Ñ»╙▀███████▓▓▓▓Ñ:»^╫█▓▓▓H`:='`=^`=∩`»=`\=^"}<br />
    {"Ü⌐»╙▓▓▓▓▓▓╬▌╠╬▒╬╬╬╠╠Ö╣▓▓▓▓▓▓▓▓██▓███▀U``░``╫███████▓▓Ñ⌐_=╫█▓▓▓Ñ░_`░░_|░_┌░``░░_»"}<br />
    {"|░::╟▓▓▀╚╙░/=,,╙░░╙░,⌡╩▀▓█████████▓╙,,==_²²╫███████▓▓░!=,╙╬╩▒▒▒╦╦░,,=,_=\.²=.!=,"}<br />
    {"^'ÜµÅÑ»`:='\=^^»⌐^»=':÷^^=^┴╚╢▀▀▀╙`»^'=∩`:»║██████▓▓▌^:»'╔╠▒▒▒▒▒▒▒╠M≡╦`»⌐'»=^╒»`"}<br />
    {"░░_|░_'░⌐`░░_»░`!░¬`░▄▄▄▌▄▄▄▄▄▄╥,░░_:░`,░,╫███████▓▓Ü░⌐`=╠▒▒▒▒▒▒╠╠╩░`»╝╦:░_`░∩`»"}<br />
    {"_,»,_!\_!=,,=,_»░_²1████████████████▓▄▓▓▄▓█████▓▓▓▓Ñ»_!=,7╝╬╚╝╩╩░ù,,»,,╫▒,²»_!=,"}<br />
    {"'¡»^^»∩^:÷^\»^^»⌐^»=████████████████████████████▓▓Ñ»∩':»^^»╬^÷∩^:»^¡÷^║╣ÜR≈»^\÷^"}<br />
    {"░░`|░¬'░⌐`░░`|░`:░``╫███████▀▀██████████████████▓▀░¬`░⌐`|░`╠╣╣░▒░_▒╥║╬╣▒╙Ü^=░░`|"}<br />
    {"_,=,_»░_²=,,=,_=░_==|██████░==_╙╩▀██████████████Ñ⌐_!=_:=,_░╟%╩╬╟╣╣╣╬Ñ╣Φ╬»_²=┐╟╣╓"}<br />
    {"`¡»^^»∩^»»^\»^^»⌐^»»[█████▓^»∩'»:^)▓██████████▀┴=⌐`»='»»^`»╠^»╠╬╠n╬╬▒^[╠∩^»»^:=^"}<br />
    {"░∩`:░_'░⌐`░∩_»░_:░¬_▐██████▒``░⌐`▄█████████▓Ñ`»░`!░_`░⌐_|∩|╬░``╠⌐_░╠_»░╚Ü░_`░⌐`|"}<br />
    {",,=,,==_²=.,=,,=░,==╫██████▒==,²▓███████▓╨░,,=,_=⌐,=»,!=,,=╠░»=╬==.╠Ü,_=╢,!=,!=,"}<br />
    {"^¡÷^^»∩^:='\»^^»⌐^»»███████^»»^╫██████▄┐':»':=^^»⌐`»»^\=^░╬Ü'»┐╬░»''╢^^»∩Φ░»^\»^"}<br />
    {"░=`!░`¡░⌐`░░`|░`:░,███████▓░_`▓███████▌'░¬`░░`|░ ¡░``░⌐`|╝╨|░``╬H_░û╬▒░`:╟╬^░∩_»"}<br />
    {",_=,,»»_!»,,░╓▄▄▓▓█████████,=»,╙▀███████▌▄».,=,_=⌐_»»_²=,,=,,²=╚ÑÜ,,╚Ñ_=»_!=.!»_"}<br />
    {"^^»^^»∩^:Φ███████████████▌╜^»»':»^¡╬▓██████▄░»^^»⌐'»»':»^^»''»»^»»^¡»^^»⌐':»'\»^"}<br />
    {"░∩`:░`'░⌐╨████████████████:░``░⌐`░░`|░▀██████▓▄░`:░_`░░`»░`:░``░⌐`░░`|░`,░⌐`░░`|"}<br />
    {"_,=,,==_!=,,=,_»=_==_²ù││ù,_==_!=,,=,,=░████████▄░_»»_!=,_=░_==_»»_,=,,=░_»=,'»,"}<br />
    {"^¡»^^»∩^:=^\=^^»⌐^»»^:»^^=^^»∩^:=^`='^;▄▓████████▌^»»^:=^`»⌐^»»^»»^¡»^^»∩^:=^\»^"}<br />
    {"░∩`!=_'░⌐`░∩`|░`!░``░⌐`|░`|░`'░⌐`░µ▄▓███████████▄¡░_`░⌐`|░`!░_`░⌐`░∩`|░_¡░⌐`░░`|"}<br />
    {"################################################################################"}<br /><br />
    Experts in getting in and out in plain sight<br /><br />
    Some some speculate that the oceans movies are documentaries based on this group<br /><br />
    Some members are even rumored to be able to pick locks like the fonz, one hit and it will swing open ayeeeee<br /><br />
    Note that for this faction, reputation can only be gained by performing infiltration tasks</>),
     special:  true,
     keepOnInstall:  true,
    }),
};
