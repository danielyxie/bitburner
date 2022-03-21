import React from "react";
import { IMap } from "../types";
import { FactionNames } from "./data/FactionNames";

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
  infoText: JSX.Element;

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

  /**
   * Keep faction on install.
   */
  keep: boolean;

  /**
   * Special faction
   */
  special: boolean;

  constructor(
    infoText: JSX.Element,
    enemies: string[],
    offerHackingMission: boolean,
    offerHackingWork: boolean,
    offerFieldWork: boolean,
    offerSecurityWork: boolean,
    special: boolean,
    keep: boolean,
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
    this.keep = keep;
    this.special = special;
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
  [FactionNames.Illuminati]: new FactionInfo(
    (
      <>
        Humanity never changes. No matter how civilized society becomes, it will eventually fall back into chaos. And
        from this chaos, we are the invisible hand that guides them to order.{" "}
      </>
    ),
    [],
    true,
    true,
    true,
    false,
    false,
    false,
  ),

  [FactionNames.Daedalus]: new FactionInfo(
    <>Yesterday we obeyed kings and bent our necks to emperors. Today we kneel only to truth.</>,
    [],
    true,
    true,
    true,
    false,
    false,
    false,
  ),

  [FactionNames.TheCovenant]: new FactionInfo(
    (
      <>
        Surrender yourself. Give up your empty individuality to become part of something great, something eternal.
        Become a slave. Submit your mind, body, and soul. Only then can you set yourself free.
        <br />
        <br />
        Only then can you discover immortality.
      </>
    ),
    [],
    true,
    true,
    true,
    false,
    false,
    false,
  ),

  // Megacorporations, each forms its own faction
  [FactionNames.ECorp]: new FactionInfo(
    (
      <>
        {FactionNames.ECorp}'s mission is simple: to connect the world of today with the technology of tomorrow. With our wide range of
        Internet-related software and commercial hardware, {FactionNames.ECorp} makes the world's information universally accessible.
      </>
    ),
    [],
    true,
    true,
    true,
    true,
    false,
    true,
  ),

  [FactionNames.MegaCorp]: new FactionInfo(
    (
      <>
        {FactionNames.MegaCorp} does what no other dares to do. We imagine. We create. We invent. We create what others have never even
        dreamed of. Our work fills the world's needs for food, water, power, and transportation on an unprecedented
        scale, in ways that no other company can.
        <br />
        <br />
        In our labs and factories and on the ground with customers, {FactionNames.MegaCorp} is ushering in a new era for the world.
      </>
    ),
    [],
    true,
    true,
    true,
    true,
    false,
    true,
  ),

  [FactionNames.BachmanAssociates]: new FactionInfo(
    (
      <>
        Where Law and Business meet - thats where we are.
        <br />
        <br />
        Legal Insight - Business Instinct - Innovative Experience.
      </>
    ),
    [],
    true,
    true,
    true,
    true,
    false,
    true,
  ),

  [FactionNames.BladeIndustries]: new FactionInfo(<>Augmentation is Salvation.</>, [], true, true, true, true, false, true),

  [FactionNames.NWO]: new FactionInfo(
    (
      <>
        Humans don't truly desire freedom. They want to be observed, understood, and judged. They want to be given
        purpose and direction in life. That is why they created God. And that is why they created civilization - not
        because of willingness, but because of a need to be incorporated into higher orders of structure and meaning.
      </>
    ),
    [],
    true,
    true,
    true,
    true,
    false,
    true,
  ),

  [FactionNames.ClarkeIncorporated]: new FactionInfo(
    <>The Power of the Genome - Unlocked.</>,
    [],
    true,
    true,
    true,
    true,
    false,
    true,
  ),

  [FactionNames.OmniTekIncorporated]: new FactionInfo(
    <>Simply put, our mission is to design and build robots that make a difference.</>,
    [],
    true,
    true,
    true,
    true,
    false,
    true,
  ),

  [FactionNames.FourSigma]: new FactionInfo(
    (
      <>
        The scientific method is the best way to approach investing. Big strategies backed up with big data. Driven by
        deep learning and innovative ideas. And improved by iteration. That's {FactionNames.FourSigma}.
      </>
    ),
    [],
    true,
    true,
    true,
    true,
    false,
    true,
  ),

  [FactionNames.KuaiGongInternational]: new FactionInfo(
    <>Dream big. Work hard. Make history.</>,
    [],
    true,
    true,
    true,
    true,
    false,
    true,
  ),

  // Other Corporations
  [FactionNames.FulcrumSecretTechnologies]: new FactionInfo(
    (
      <>
        The human organism has an innate desire to worship. That is why they created gods. If there were no gods, it
        would be necessary to create them. And now we can.
      </>
    ),
    [],
    true,
    true,
    false,
    true,
    false,
    true,
  ),

  // Hacker groups
  [FactionNames.BitRunners]: new FactionInfo(
    (
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
    [],
    true,
    true,
    false,
    false,
    false,
    false,
  ),

  [FactionNames.TheBlackHand]: new FactionInfo(
    (
      <>
        The world, so afraid of strong government, now has no government. Only power - Digital power. Financial power.
        Technological power. And those at the top rule with an invisible hand. They built a society where the rich get
        richer, and everyone else suffers.
        <br />
        <br />
        So much pain. So many lives. Their darkness must end.
      </>
    ),
    [],
    true,
    true,
    true,
    false,
    false,
    false,
  ),

  // prettier-ignore
  [FactionNames.NiteSec]: new FactionInfo(<>
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
    {"       NITESECNITESECNIT         /$b :   "}<br /></>,
    [],
    true,
    true,
    false,
    false,
    false,
    false,
  ),

  // City factions, essentially governments
  [FactionNames.Aevum]: new FactionInfo(
    <>The Silicon City.</>,
    [FactionNames.Chongqing, FactionNames.NewTokyo, FactionNames.Ishima, FactionNames.Volhaven],
    true,
    true,
    true,
    true,
    false,
    false,
  ),
  [FactionNames.Chongqing]: new FactionInfo(
    <>Serve the People.</>,
    [FactionNames.Sector12, FactionNames.Aevum, FactionNames.Volhaven],
    true,
    true,
    true,
    true,
    false,
    false,
  ),
  [FactionNames.Ishima]: new FactionInfo(
    <>The East Asian Order of the Future.</>,
    [FactionNames.Sector12, FactionNames.Aevum, FactionNames.Volhaven],
    true,
    true,
    true,
    true,
    false,
    false,
  ),
  [FactionNames.NewTokyo]: new FactionInfo(
    <>Asia's World City.</>,
    [FactionNames.Sector12, FactionNames.Aevum, FactionNames.Volhaven],
    true,
    true,
    true,
    true,
    false,
    false,
  ),
  [FactionNames.Sector12]: new FactionInfo(
    <>The City of the Future.</>,
    [FactionNames.Chongqing, FactionNames.NewTokyo, FactionNames.Ishima, FactionNames.Volhaven],
    true,
    true,
    true,
    true,
    false,
    false,
  ),
  [FactionNames.Volhaven]: new FactionInfo(
    <>Benefit, Honor, and Glory.</>,
    [FactionNames.Chongqing, FactionNames.Sector12, FactionNames.NewTokyo, FactionNames.Aevum, FactionNames.Ishima],
    true,
    true,
    true,
    true,
    false,
    false,
  ),

  // Criminal Organizations/Gangs
  [FactionNames.SpeakersForTheDead]: new FactionInfo(
    <>It is better to reign in Hell than to serve in Heaven.</>,
    [],
    true,
    true,
    true,
    true,
    false,
    false,
  ),

  [FactionNames.TheDarkArmy]: new FactionInfo(
    <>The World doesn't care about right or wrong. It only cares about power.</>,
    [],
    true,
    true,
    true,
    false,
    false,
    false,
  ),

  [FactionNames.TheSyndicate]: new FactionInfo(<>Honor holds you back.</>, [], true, true, true, true, false, false),

  [FactionNames.Silhouette]: new FactionInfo(
    (
      <>
        Corporations have filled the void of power left behind by the collapse of Western government. The issue is
        they've become so big that you don't know who they're working for. And if you're employed at one of these
        corporations, you don't even know who you're working for.
        <br />
        <br />
        That's terror. Terror, fear, and corruption. All born into the system, all propagated by the system.
      </>
    ),
    [],
    true,
    true,
    true,
    false,
    false,
    false,
  ),

  [FactionNames.Tetrads]: new FactionInfo(
    <>Following the mandate of Heaven and carrying out the way.</>,
    [],
    false,
    false,
    true,
    true,
    false,
    false,
  ),

  [FactionNames.SlumSnakes]: new FactionInfo(<>{FactionNames.SlumSnakes} rule!</>, [], false, false, true, true, false, false),

  // Earlygame factions - factions the player will prestige with early on that don't belong in other categories.
  [FactionNames.Netburners]: new FactionInfo(<>{"~~//*>H4CK||3T 8URN3R5**>?>\\~~"}</>, [], true, true, false, false, false, false),

  [FactionNames.TianDiHui]: new FactionInfo(<>Obey Heaven and work righteously.</>, [], true, true, false, true, false, false),

  [FactionNames.CyberSec]: new FactionInfo(
    (
      <>
        The Internet is the first thing that was built that we don't fully understand, the largest experiment in anarchy
        that we have ever had. And as the world becomes increasingly dominated by it, society approaches the brink of
        total chaos. We serve only to protect society, to protect humanity, to protect the world from imminent collapse.
      </>
    ),
    [],
    true,
    true,
    false,
    false,
    false,
    false,
  ),

  // Special Factions
  [FactionNames.Bladeburners]: new FactionInfo(
    (
      <>
        It's too bad they won't live. But then again, who does?
        <br />
        <br />
        Note that for this faction, reputation can only be gained through {FactionNames.Bladeburners} actions. Completing {FactionNames.Bladeburners}
        contracts/operations will increase your reputation.
      </>
    ),
    [],
    false,
    false,
    false,
    false,
    true,
    false,
  ),

  // prettier-ignore
  [FactionNames.ChurchOfTheMachineGod]: new FactionInfo(<>
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
    only be gained by charging Stanek's gift.</>,
    [],
    false,
    false,
    false,
    false,
    true,
    true,
  ),

  [FactionNames.Infiltrators]: new FactionInfo(<>
    {".  ;<<;. '>><'...<<<'  I+<l  .>>>: .'<i<.  I~~!' `l<!+jYJJCJJJJJLJJLc{ii<! .'><i' .;<<~  .l~>:  `<>>. .:<i!.. <<~I ..><>`..;<>> ' !<<;. `>~<'  ,<>l...!i>; . +<<' "}<br /><br />
    {"llI,^^'I!l^^^Iil:^^^;l!,^^:ll!,^^:!!:^^'!!l:'^'i>;{UUJCJUCCJJJJJUUJCJUCOY<IlI'^^;!l,^^,!!l,^`;!l:^^^:!!:^^'llI'`^,I!l``'Il!;^^'l!!,^^:!!I,^^llI,^^^;!l,^^,!lI^`^:l"}<br /><br />
    {"><<, .'>~i' .l><i..'>><' .^<<>' ':<<I...<<~'  :fUJCLLQ0QCCCJJJJJCCJUUUJCCv><l. 'i>>,'..<>>^ .:<>l '.><>: '^!<~`..,<>>.''!>>: ..<i+^. ,><!...i><;.'`>>>^'.,>>_...I<"}<br /><br />
    {"..'I>iI..'i<>' .^>>i^..l>i;'. >><,'.`<<i.^>(YLCCLLQ0QQLCCJJJUCLJJJJCCCLZq?'.`i<>'  ;<>!. 'Ii>'.''i>>`..:<<I..'i>i,'.'>>!' .:>~!.  l<<;. ^li>...'i<l' 'l<>, .^>>i'."}<br /><br />
    {"`'^,ll;^`';II''^,ll;''^;ll;^^'i>l;l>}uYCCJJCLLLCCCJJJCCCJJJJJJC0LCUUCLwZqI``'lII:'':!l;^`';!!,'^'lll'^',II:'^^lI;:^`'!lI'`':;lI'^';li;`^'Ii!'^';l;I''`,I;'^^'!!;:'"}<br /><br />
    {">i+I ^,+ii.'.I>++'.^<ii,` `>!+nLUJLCJJCJXCLLLJJCCCCCCUJJJCJCCJCZZOQQOmmmm'~>i ''>>>, . <>i' .;!<> '.-<iI''^>i_''.I<iI'  I+i^  '~i>'' ;i<I  'ii~I ^^<<i'..;><_  '!>"}<br /><br />
    {" .`;><l`.'!<>'.',>>!'` i>>:lXCJJCCCJJJJJJJJJJJJJJJJJJJJJJJCCCJLZmmmmw0q_<>.'`i_i`..;<<!' ';i>'.''i>>'. ,>>;..^i>>;`.'>il^..,><i'..!<>;'''i<~..`:i>i^..I>>,.''<>i,'"}<br /><br />
    {" .';><l' 'i<<^ .^<<i^' I~icJUCJCJJCJJJJJJJJJJJJJJJJJJJJJJJCJJQOmwqwOph+>[11_li~>`. I<<i' .I><' '^i><^. :<<I. '>><:' .<ii^. :<<i.  !<<;..^><~ .',><i`..l><: .`<<>'."}<br /><br />
    {">>~; ',+!i.'.I><~ ..!i>''rCUJJJJJJJJJJJCCJJJJJJJJJJJJCJJJJUQ0mpZZZk8%B8t}]-?]1]'<i>, . ~~>`  ;i>>.  +>>; .^>i+'. ;~<i.' l>i' .'+i~`. :>~!. .ii<l '`<>>''.,<<+  .l<"}<br /><br />
    {";:',:,:,;:,,,,;:,:,,,IIlJLUUCCCCJJJJJJJJJLLLLLQQQQQQQ00OZmwZZQwo%@@@B@W{?-tf||_{il;,:::;;::;::;;,,,,,;;',,,::,;,,:,;I,;;;,I:,::;;,,;;;;;::;:';;:,'::I,'',;:::::,:;"}<br /><br />
    {" ..;>i;.'^i>>,'.'><i' ^YUJJCJUUJJCC00ZmwwmmmmmmmmmmmmZmmmwmmZwW@@@@$@@o[_[n|1][?{. :>>i. .I><,. ^><i...:<<I...!<>:. .ii>'..I>>l   l><;  ^!<~^. '>iI' `l<<: .'i<>'."}<br /><br />
    {"><~;..^><!' .li<!'.'!<jZ0CUJCJCQOZZmmmmmmZZmmwmZmwmZZpwJJQwQ*BB%B@8B%Y??-?(xf}---<<,'  <>>^.':>!l ' i<>I.'`l~+^..:<><.'.l!i,  .~>~^. '>>l...!ii:.''i>i^' 'i>_'..l<"}<br /><br />
    {"<<!^  ^!<>' .l~iI..`IiwZZ0Q00mmmmmmmmmmZZZZmmmmZZ0LCJYU0Zq*@@B%@@B%@L???-_-??][,!-~, .^<<>,. ;~<I.  ;~+;  ^>>i`  'i~>  ^!<~l' '>~+' .;<<i^  ><>,. .l+<'  ,~<i.  :>"}<br /><br />
    {".  I~<I  .<<~^  .>!i^^YZZZZZZmZOOZmZZZZZZZO0LCJJJUJCLQm#@WQjjp@BB@%C?-[-_-?-|1~>^ .I~<<   l+<:  `<>i' .,<i!.. >><I ..><>` .I<>! ' l><I. '>~<'  ,<>l. .li>; . ~<<' "}<br /><br />
    {"!lI,^`'l!!^^^;!I;^^^Ili(0dOmOmZwm0mZQJUCQJJJUUJLLOpo&8@&m?<~<(%@B&X]?]-}({-_]{t>IIl:`^'lil''^Iil;'^';l!:'''!ll'^`:Il!^^';ll;`^,I!!'^^:li;^^`!!l;^`^;!;,,^:ill'^^;;"}<br /><br />
    {"<>>, .'><!'..I><! .'>>~'..,+{1i;;W%obqm0C00OwkaW%B@@&zuqBb?>(*B%Mt}_?_jf-}-]--ft-~>^. '<>!'  I>>l.. i~>;  '>>>' ':>~i..'l~>'..`><i`. ;>>I'  <>>;.'`i~<' .;><i. ';<"}<br /><br />
    {" . :~!l .'>>>'...~i!^''!>>I.. ><~fB8B@@@@@@@BBB@B@BO|[[}|U*@BB8C{}-[-]U--]--?-tt}..I>~+. '!<>'. `>><. .,<<l.' >>>,..`i><' 'I+>l.. li+I. ^><> . '<i>. 'I<<, . <>i` "}<br /><br />
    {"^^^:II:^'';:;''^^;I;'^`:II;^^::lI;b&M&%BW%%@&B&@88W&&%@@BB@&oz/?-[+?uZ]-?--?-(jt_:':;;I'^^;lI:'''III^^^,II;'^`,II,^^^;;I,'';I;;^,';;;:'^'III^^^'III''^;II:'^';ll,^"}<br /><br />
    {"i<~,  '>i!.  Iii<  .l>>' .`<<>   ;(W?+>{c8B}1W#t_+?~][1tvt})-??]xY]<!1_?-???}ff{~i<'.. >~<`  ;<>!   <>>:  ^ii<'. :<<i.'.l>>^ ''+>~`. ,><i. .ii>l  ^>l!^` 'i>_   l~"}<br /><br />
    {"^' ;<il..'>><^..'>>!^'';iil...!>>;'pb-li}Za@8)}_?]]?_}1_??-?--cc))?<_jJ_]~-[fft!'. I>i>'..l>i'.'`><<.'':><l.. i!<:.'^i!>^. ;<ii . !>>;''`>>i^`'^iii...!i>;.. <>>^ "}<br /><br />
    {" .`I<<!` 'i~<^ .'~~i'' l>i;'  l<<:.]@BBBB%@8z|({{1(tt1-??-?]}}?]t{-]!iC-_?}t/?<i^  ;~<I  'I><, `'><~^. ,~_l..`<<<;`.'<i!^  ,>~!  .!<>'  'i<<'..,>+i' .!~+: .^<<i''"}<br /><br />
    {"<<i'  '<+i.  ;~~!..`l<<'..'>>i.  I<+p%hdQzf|[_/tfjt{?__--_?X]>+1(i~+1J(-t?t1i..'><~;  .i<i'..;<>l'..!<+:  `><<^..:><i ..l~>'  '<++^  ,><!' .!<<I. ^i<<`  ,<<>' .;>"}<br /><br />
    {",^':;I;'^,III;^^:;;:,',;II;''::II''''])t(]_[_-__??--?-??[t}?(]<~iu1u1-])|[tf+;;l:^,:II:'',,I;''^;:I;;'^,I,;,^,:;:;',:;I:'^,,;;;,'':lI:,'':I:,',;;I;:'^:I;;,',:;;:^"}<br /><br />
    {".  I<>;' `i<<'..^i<>^  I~<;  .>i~,..:{/(?]??vdmOc|{1)jt_>~<!YJOU?_-[]txjtt//|/{](fnzUJLzvjf/}!^'`I>+. .:~ii.`.i><I. '!ii'..I><!.. li>l. 'i~<'  ,>>l' 'l><I.. <><, "}<br /><br />
    {"i<>' .,i>l.  ;>>!' .l~>,  ,~>>.' I<il.+n1_}![]?-?]]?-[--?<_}<???f)tnnnj|/ftjjf|/fwQCQLCLOZLUCLJYZdf,+<~l `^>!<`. ^<<i`'.Iii^. `>>_^'.'i<i' .:i<: .^i>!` ''>>+.  ;~"}<br /><br />
    {"i!l,`'^l>!` .Ii!;''^;li''^,l!i'.`:><;`':~/j/trftf||)[?_--]{(|)ttjt//t/ttfjt/ft//JmZwpddqOLCCJUJQQQQQQLc(_lII;,''^:llI``.IIi:'''l<i,'',ilI,'.I!iI` `I>!'.':liI^`^,i"}<br /><br />
    {".'.:>!I .`i<>^' 'i>!`..Ii>I.. >~>:  ,>~>..^l<?(ff//ft//ttttjf|_~<<l`''}(/|f/fj)UmwmqpppqOJUUJCQ00Q0m0JUUYJUUJ0Z0OZZO0OLYJn:;ii!. .l>+;  ^!<>'. '>>!'  I+<,. .>>>' "}<br /><br />
    {"i!!,'',i!I`.';!>l`'`I!i''`'!!i^'';<<I`'`!i!;`''i!;^,I+-?~'^`;ii,`''!>!`'zXff/nqwwmqpdpqqmO0QJCQ00OqwZZmZQCCCQ0OQ00QLCJCCJCc;`.'iii^'`;iiI^`'l!i;'.`I!i,'.:>i!'..I>"}<br /><br />
    {">><:  '>>i' .l>>! .'!i<' .^<~~'..;<<I..'~<<,'.'<ii`  l>>!...i>>,' ^i<> ;OOmwZmmwqqpppppwZZZZZmqddpdqmZZmmmZmpdppbpOqZZmLJJJ? .'<>~'  ,><i...iiiI. 'ii>^'.;><>. .I<"}<br /><br />
    {" . :~+I .'<<~^  .<<>'' I~>!   <>>,  '>>~.  ;><> ..i~~' .`~>~'. :>+l   !}qwwwmwqqpppddpmZZZZZZmpddpppwZmwmmmwpdppwqmOwwwOLJJC>>i.  !>>;  '<~<   ^<<i '.ii<:.  ~~<^ "}<br /><br />
    {",:I;,,;I,:':,;:;l,:,I:::''^;::`,,,,,:,,`:,:'^,,::I,,,l;::':':,:,:,,I;:'zwpdkdddpppbqmZZmZZZZZZwpqwqwmOZZZmmwpbdmLZmZZOZw0CLL(^,,:l,,`'',:^',',;;,,:I,:';,,:;!,,';I"}<br /><br />
    {">>>, .,>i!.`.I><<' .i>!'  ^i+>;::>-<;'..<i<, .^><>' .i>il.' li~;'.,l<!tpwwqmqqqqqwmZZZZmmZZmwpppdpZ0QCUUJUL}<>.'U0pmmpdpdQ0OO..<<+'' '>>l...i<~I..'>ii^^ ,<<~'. I+"}<br /><br />
    {"'.`I><l. ^<<<:  `i<l`.'l><_{1}{11)1(){_<'.';><l. `l>>,  '>><^ .:!<;..)qZZZwqmmmZZZZZZZZZZmwpppqqddpmLULLUCU/ `i><,.QppdpdQQQZ}> . I<<I..'!<>. .:i>!`..l<~I  '!>i:."}<br /><br />
    {".`^:!I;^'`Il!^^`'l>l^_(11{{||{)1||ff/1}{1'',lll`^`;i!'^^`!il''`:lll^-0qZOwOOmmZZZZZZZZZmqpddpppddmCJOmLJJCUQ''!!iI`tqpdpdQQ0QrI`.`II!:``^lIi'``'!il'''Il!,^^`l!i^."}<br /><br />
    {"i_)+:'^ii!. .,i!l'i-tXJYYzXYXYYYCn/t/tt({]<>' ^><>^  !<>l '.Ii~;.``tZmpqwmZZmqO;)CwmmqdpddddddpmmZQQLCCCJJOm~<'..I>}bwmmOUJJLt.<>+^. ,><i. .!><;  `><>^..;<>~   I~"}<br /><br />
    {"}>!,1zLJQQn|/zCUYzYYXUJUUUCQCCJCLQJrjft|11[{X0|~,^l<>'''^>!~`,`:i+cCmppddpwmmxlI,. ~ddpdddppqwmZmwmQCUJLQJ0q;'!l!:.:dmmmCJJUJz!``.Iii,'.`lii..',i<l^'`Iii:'^^>>>,."}<br /><br />
    {"{I,';:/CCJ000CYYYCLJCCLL|]xJQt)X0LCrftfft[}[zJUUQOO0O0Qzjt)])0mmLXQmOwppppkbIi+l'  ,l<vbqwmZZmmZmmZZqp0L00Ow' <~~:  OZmOUJCQLC~ ..l>>;  `><~'  ,>!i. .lli,' .<>>^ "}<br /><br />
    {"(I,',:'/UQUQCCCCCQQXYC0j{)vO/})xr|(ftftt/]}[LmZJLQQQQLJJJJUJLmppwZOZmm0mZd(lI..'!+~'   (mZqZOZmmwqqwppwOQQ0O<~'..:<!zdqQLQZZC0<~>>^  ;!<l' .>i>;.'^i>i^  ,i>i'..I~"}<br /><br />
    {"~<l'':^`vCLLLCCCCL0f|})x[)(/)1|/ftffft)1<<CmZZOmwqqwZLJJJJCL0wdppwZZmZwwv;l;;,:::':''::_ZqwwppdddbbddppmQQ0C:I,I:::'tbZCcrxjnY/;;;::,,;;,,:,,;II:::;;,:;:;III::;;:"}<br /><br />
    {"'_>I:,,^;JQJJLLu[{~i';'I~<l . >~<l:,I~<<.' :?jJkqqpppmZmZZwmZwddqqmwZZQ?>I  ^<>>' .'~><cqpqqqwmmmZZmmmwOUUL)'.<><,.'|m1|{11{}1}?+~-i~;..'>>>'' '<>> ..l>+;.  _<>^ "}<br /><br />
    {"i<(;;',:;YJQCc-i>  'l>~' ''<~<`. ;<<;..`<~i, .`ii-jCOmmOZmZmqpdpdpqq0{ . '+>!' 'i<>'  .>fwOwmZZZZZZZZZZQUJL]>>`..,<i>:|[{{{{{{{{{11(+I~<l'.`>>i;..'i>>^. :<<<. .I>"}<br /><br />
    {"i>l+-I,'iLU?'l>;i.'^;!>''^,!ii,'.:i>;'''!>>'..^>i!;''Ill<}vJOqdkkdw{ii''.:>>l^.`Iii'`''!xdqpmqqqqqqwww0CJCv<<i^'',<!i]f(}1{{{{{{1[1}}))xf<'.>il:`'`Iii'.':>>l`'`;l"}<br /><br />
    {".. ^i~cJ1.!l<'  .<<!' .I<_i'  <!>:`''>i~.^.:i>!. '!+<''''>~+'``li<;  '!~_I  ,<!>''.:<~i]pppppqqqpdbpbmCQQZ)   >>>,.lj({}11{11{{{11{}{)/|ll<cQi.,><! ' il<; . >>+' "}<br /><br />
    {"><l'''^i>!`'^I~i'''^;>>'.':!>!;'':llI`^,!ll,`':!il,^`;i~l''.;<>'.^:I!>'.^;!>l,`';l!:^`jbqqqqqpdddpppw00OQOlIII`^',:}t{}{11{1111)1{1(/t/t>``,i[U-`'`;i>,`';<>:''`,l"}<br /><br />
    {"i<<, .^>~!.' Ii>i' `Ii<'..'i<>' .:<<;. .il-zppMW8@%88&oaadpOYr)!. ^>~< ..,><!' 'i<>^'vZmZZZZZZZmmwwm000Qm<^~><'' l~///(|(1}{{1)(/tfft/?~l. '>i>rj'`i<i^. :iii'  ;<"}<br /><br />
    {"`. :>i;. '>><^. .><i' .;<<l '.<<>:..^><~Q$$$$$$$$$$$$$$$$$$$$$$$$B@$*0Qj]I..`>ii`'./qwOZmmZZZOZmZZmwLJC0xl!'. i><; irttfjtj||jtjtf[-?I'.`<~<''.,xfl'.`l~>I.. >>>^ "}<br /><br />
    {"^^,;Il;,^';lI,^';llI,'^;l;,'^^:Il:'`,:l?%$$$$$$$$$$$$$$$$$$$$$$$@BB@$$@%B@B$Qw%%d(qppbZppqqmmmZOLLOmQCJc>I:'^,Ill;'^'[fj}^~|xt_}?;;li;^^';l!^'`!xz]^,^;,I,^':IlI:'"}<br /><br />
    {"!><, .'><i.. l>>i. .!~>,  ^<>>. .:><I^.`o$$$$$$$$$$$$$$$$$$$$$$$$@BB@@$B%@$BB@@@B&@BBB#bddpdpdpw0JUJUUC>'`^!><'. ;<<>` [)i<,  .<~l^. :><!.  >>)Ync[|}>``.'i>_.  I~"}<br /><br />
    {"  .;~-!' `!_<,  ,>~i'. !+<I' 'l~+:  '~+l!$$@@B$$$$$$@$B$$B&%BBBB$$$$$$$$$$$$$$$$$@@@@@@@@%opqdpppOLJXU,,>_l. `i_>I' .>~-t'':+<!' `l~<'..^!>~.'ucfJl:u_|,<;  '~~<;."}<br /><br />
    {" . :<<I. `i<<^. `>~i^. l<<l' .>+<; .^i>!'X%%@$$$$$$$$B@$@%8W@%BB$$$$$$$$$$$$$$$$$$@@@@@@@@@@WbqppOLLJ_ ;<_l. .i><,...ii>f/<>>i>'. >+~;  ^~i<'_trjYYYi!!)>l  '+<<^ "}<br /><br />
    {"<>+: `'~i!``'I!<~' '><i^' ^~<_ .',>>I` .>tBB$@B$$$$$@BB%@r(%B@@B@$$$$$$$$$$$$$$$$$@@@@@@B@@BBBWkmQ0w?i<I` ^>>+'. ;~<i'';/{c|vr^+i<.. I+~;.|vnuzX_'I[|~I<[>!~~. .l<"}<br /><br />
    {"'',:IlI:,,;I;,,:;Il;:,,;I;:''':Il;:::II:'~*%$B@$$$$$@%j,^!l,,~Y&B@$8%@B@@%@B$$$$$$$$$$$$$$$$$BB8OQJ>',,;I;::,;III:,,:l;[+';/CffzvJX[{nunvcj|xY};/il,,,;lI:]t/>'!:,"}<br /><br />
    {" ..:><I..`<<>'``'><!^..I>il.  i>>:..'>ii.'p@@@$$$$$$B%o,`ii>' ';>|Q*BB8%B@B$$$$$$$$$$$$$$$$$$@@@8U>>. .'<!I'`'ii<:..'<ifYj/ru1uzujJujff|nYzzx{/XX~>` 'l<<;'luucY: "}<br /><br />
    {"l!<: .'>>>.'.lii<  .!<<,..'i>~ . ;<>I . <~p@BB$$$$$$@Li~i.` !i<: .,>i~)Za%$@$$$$$$$$$$$$@$$$$@%BJ ..!~i:`.^li>'. ,<<i `}iI!|`ix~+!)<~j_!_c~'ut{[}:`>ii^'.:>i>?]]j+"}<br /><br />
    {"ilI,'.'!>l^.'IiiI'.^;!<''`,i>i'.`;><;`.^i>p$$@B$$$$$$j~<!..`lil,'.,i>~`|&@@$$$$$$$$$$$$@B8@8BBM{!.,`Ii!:'.'lil,.',!i>`',?/};';vzvn)I`nXYzc]'l~f{+`'l>i,'.:iiI`.`I>"}<br /><br />
    {"...:>>,..^<<<,''.!<!^..IiiI`.^>ii' .^!i>''w%$@$$$$$$B%!``>>~'. '~~l. ,&B%@@$$$$$$$$$$$$$B&@$o>..`~i!.'';>il`'.l><I..'<!)f`':l~|1+<|<?+1-{X>~, '?t<!'..!>i;''.!+>` "}<br /><br />
    {"l>>,'',!i!`''liil''`!<i,.''>i!''':!l;'`'!+h$$$@$$$$$B%#<!'^'l!!:^''lt%@$@$@$$$$$$$%%$B$%B#}^^:>il'''!ii:','l!>`'',>>i''j1!i,^`'+t-^'':>]t;''l>il}Y`l>!'`^,!!~.''I>"}<br /><br />
    {"<>!'  ^i+i' .I~<;  'I>~' ',><>^  ;~~I  ^>1WBB@$$$$$$@%Bx!. .!~i^' 'w@@$$$$$$$$$$$$@@B@kt>>'  I<i;.  I<~:  '>~!' .'i<> :j)l~:..`~f?'..;~~/{  ~i>,l|f>!<^. :<<l.  ;<"}<br /><br />
    {".  ;>>l. '>+~^  ^<~i`  ;<>I  .i>>,  '<>>.1$@@@@$$$$$$$@f'+~<` .:~+d%BB$$$$$$$$$$$$Bk/>+...li~: .^<><'  :~il'..i<<; ..<>_tc':>>!In;I<>; .]x~~   '>1x~ 'ii>;...<><' "}<br /><br />
    {"^:,:l;:,^'li!,''';I;:,'II;:'^';lI:'':iI:'O@BB@@$$$$$$BM~';I!:^',:kBB@B$$$$$$BB%#p]^;;II;'';;I:^,';;!'^:,!!I''';II,,:'ll!)u'^iI:ln>:l!;''?([l''',I!1x,';Il,^,'Il;',"}<br /><br />
    {"<ii:'^,<>l'..I!>>' ^ii>''`'ii<..`,ii; `.}@B$@B@$$$$$@@Qi!  ,;>l:Y@B$@@$$$$$$%t ^i>i,^. i<l`'.:>i! '.i>!;''^ii~`.'I>i>.+Cn>>,''`+f[`'.'!>itj'i!iI..,/i+^'.;>i~'.`li"}<br /><br />
    {"'  I+~I  `>+<,. .i<>` .;>+l   ><i' .,i<>oB@B$$@$$$$$$o . <~i^ .vB$@%B$$$$$$$8Y->'  :i<>.  l~>^  '>+i'  ;~~l'. ii<;  ,ctI'  l<<i;cii~?I' `f/?`  '~><icU(>+l'  >><' "}<br /><br />
    {" .';<+I..'<~+' .'<+i'. i~>;. .>>~, .'>lC@$$$$$$$$$$$@z  `><>^:M@$$$$$$$$$$$$$*I!.' ;<>>. 'I>+,  '>_+`. :<~!...i>i''1uvn)^ ';~<!;v<:~<I. ,}xuu `:~~>`[z/l>,  ^~<>'."}<br /><br />
    {"ii<;..:<!!.`'I!i~' '!>>^..'>>i '';i<l.1%@$$$$$$$$$$$$Z!i! ..-aB%$$$$$$$$$$$$%}`'i><''. ><i`..;<i!   <i>;.'^!!<^..,>>|j+.!~i`.'`+fY: ',+i>{uf]~>I'.^<vvz(,,~><.. l<"}<br /><br />
    {",'`,lII',,;;I,:'^III'',::I;',^lI::,',[$@B$$$$$$$$$$$@@:^'ll!'<U#$$$$$$$$$$$$$8L<^:,;:;l'''II;,','l;!'',,I;:,''lI;,,''ll;:'':llI;c)~iI:^:'>tv/?`,lII,':[<I;'',Il!'`"}<br /><br />
    {"'. ;<<;. '><<^..'>>!` .Ii<l.' >]/Y&%@$$$@$$$$$$@BBB8@B1''~>+'  :ljd@B@$%B@B$B@%@$*}I~i] ..l<>: .^<><'..:><l...!><I..'>>i`  :><!`)XUX+:'.^!}vY:.:~>!..'!>>;..'<<>' "}<br /><br />
    {"+<!'  ^!>i.  ;<>;'..i->>[CMBB@@%@@$@@$@@@$$$$$$@@BBhW%k>I'' I<<,`':<+O8B%B$@@$$@@@@WC',i~i,. I~>I. .I>>,  ^<>!'  'i<~  `l~+;..`<>i'  ;><!^ :~!>,  `!<i`  :~>!. .:i"}<br /><br />
    {"Ii~:'^'i>l^''lii>.,Q$8B@@BB@BB@$@@$@$$B@$$$$$$$%$@%} ,n!I .'l>>; .'l>l^,J$B$%%$$@BB$@@W~I!` ^:>>l '.i!iI^',l>!''',<ll''.llI'.''~!!:'',PHYZ|C@L!<I'^'i!i:.`'i!i^'`,"}<br /><br />
    {". .;>>I. '>+<'  'i~@$%$@@$@@@$$$$$$$$$$$$BB%%@@@@@@*i^  ^~+<`  ,>>I. .+!>Ii8@B8B%@$$$$$$h~I+<:^ 'i>>'  :+>!'. l>>;..'>>i` .:<<i . l><>W@Z. `i<~. .:<<!. .!~~:  .><"}<br /><br />
    {"!i!'..'!>!'.'Ii!I'.%%@%B@@B@@$$$$$$$$$$$$@@@BB@$$%@Ml;i>l'''lil'..^!i!`'';<<<JBBBB$$$$$@@%Wc^:!iI'`'l>i:.`'l!!`..'!!!''`lii;''`>ii'``:H3R3i>l^''ii!,'.^!>i^'':iil."}<br /><br />
    {"ii>, .,><l'. I!>>'.'i-11(rcL0mZwdoW%B@@@@f+@B8@BB@@#Il>il.. l>i;. ^>>>'. '<<i'^Q@%@$@B$@@@BB@WQ>i . i>!;..^i>>`. ,>i>.'.l>>:.'`>i+`..,>~!'. !<<;..`>>l^'.:!>+'  l<"}<br /><br />
    {" .';<>I..`i+<'..'><i^' l<>I.  i<<:. '!<>' ',>>I^'`!i<'..`><~`..;<<;'. <>>:..'l>i?BB@@@$@$$$$$@$BC~><^..,><l...>~>,...<ii^..;>>l. .!<>:. 'i<~ .',<~!' .l<<,...i~>'."}<br /><br />
    {",;;,:,;;,::,:,:::;,,;;:;,,;;I;',:::,:,:,;I:',;I,::,:,;::,,,:,,I;,:,:;::,:;;;;'II;>8$BBB$$$$$$$$8B%]::,;,::,,:;;,:,;;,:,;;;:',::;:;;::::::,,;::;,,:I:,,,:;,::,,:::;"}<br /><br />
    {"ii>:  ,>li.'.l>i~. 'lii,..'><~ ' ;>>l ' <i>'..'ili`  >ii! . ii>;`.,>i>''.'i+I`..I>iM$$$$$$$$$@$B$$@)l>!!..^>!<''.;>ii '.l><'..'<!+''.,!<l. .!i<I  ^<ii^' :<i+.. l<"}<br /><br />
    {"   ;<>;  '<~+'. .i>l'  l~>l  .~<i,  'i<~'  ;><> ..lii'  `~<~'  ,i<;'. i><: .'!;{b&8&@B@%$$$$$@$$$wM@v..;~<l.  l>>,.''>>~^  I>>l   l><I  ^i>~   ^<+i' 'l<<,.. !><^ "}<br /><br />
    {".'^:l>I^ 'l<>,.`:!!I,' Iil:^.^;i<,  '>i;^.`,Ii!.',Ii!:` ^!>!` `;>iI,' ii>^`+w8%B@B@@BBBB$$$$$$%@W~i<''.'i>;..'I>!;''.!il:'.,l>I' 'l>l,''^;i>.'`,l<!,..I<<: .'Iii:'"}<br /><br />
    {"i<~: .'><!.. I>>i. ^i>>,. ^><<.'.I~<l'. >ii'  `<<!` .l><l . !>~:  ^i<>`-UW@$$$$$$$$$@@@@BB$$BBBB%W! i>i: .^i<>'' '<ii. .!>>:  .+>-`. :i>!. .!<~; .`><>^..:><+   I~"}<br /><br />
    {"`^,;liI''^I>!,'`;!!I:'`I!l;''`I!<,`',!lI`'`:!iI'.^:II,^'^ll!''`:l>[upBBBBB@B$$$$$$$$@@@@B%$@@@$@$%L!:`',!<I`''I!l;,`^lI:'^`'liI^''I!l:``':l!'^,;l!l,'^I>>:'`:l!I:'"}<br /><br />
    {".  ;<<;  'i>>^. .>~!'  I><I'`^><il:'I>~<,,,!<++;Il+--<l!>?]-ii!__(&B%%@@$8B@$$$$$$$$@@@8Jfk@%B@@8Wj<.  'iiI. .!><; ..>>>`..:<<> ` li>;  '><<.  ,<<i. .lii,.. ~<<' "}<br /><br />
    {"::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"}<br /><br />
    Experts in getting in and out in plain sight<br /><br />
    Some some speculate that the oceans movies are documentaries based on this group<br /><br />
    Some members are even rumored to be able to pick locks like the fonz, one hit and it will swing open ayeeeee<br /><br />
    Note that for this faction, reputation can only be gained by performing infiltration tasks</>,
    [],
    false,
    false,
    false,
    false,
    true,
    true,
  ),
};
