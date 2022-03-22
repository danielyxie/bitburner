import { Augmentation, IConstructorParams } from "./Augmentation";
import { Augmentations } from "./Augmentations";
import { AugmentationNames } from "./data/AugmentationNames";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";
import { Player } from "../Player";
import { Programs } from "../Programs/Programs";

import { WHRNG } from "../Casino/RNG";

import React from "react";
import { FactionNames } from "../Faction/data/FactionNames";
import { augmentationExists } from "./AugmentationHelpers";

function getRandomBonus(): any {
  const bonuses = [
    {
      bonuses: {
        hacking_chance_mult: 1.25,
        hacking_speed_mult: 1.1,
        hacking_money_mult: 1.25,
        hacking_grow_mult: 1.1,
      },
      description:
        "Increases the player's hacking chance by 25%.<br>" +
        "Increases the player's hacking speed by 10%.<br>" +
        "Increases the amount of money the player's gains from hacking by 25%.<br>" +
        "Improves grow() by 10%.",
    },
    {
      bonuses: {
        hacking_mult: 1.15,
        hacking_exp_mult: 2,
      },
      description:
        "Increases the player's hacking skill by 15%.<br>" +
        "Increases the player's hacking experience gain rate by 100%.",
    },
    {
      bonuses: {
        strength_mult: 1.25,
        strength_exp_mult: 2,
        defense_mult: 1.25,
        defense_exp_mult: 2,
        dexterity_mult: 1.25,
        dexterity_exp_mult: 2,
        agility_mult: 1.25,
        agility_exp_mult: 2,
      },
      description:
        "Increases all of the player's combat stats by 25%.<br>" +
        "Increases all of the player's combat stat experience gain rate by 100%.",
    },
    {
      bonuses: {
        charisma_mult: 1.5,
        charisma_exp_mult: 2,
      },
      description:
        "This augmentation increases the player's charisma by 50%.<br>" +
        "Increases the player's charisma experience gain rate by 100%.",
    },
    {
      bonuses: {
        hacknet_node_money_mult: 1.2,
        hacknet_node_purchase_cost_mult: 0.85,
        hacknet_node_ram_cost_mult: 0.85,
        hacknet_node_core_cost_mult: 0.85,
        hacknet_node_level_cost_mult: 0.85,
      },
      description:
        "Increases the amount of money produced by Hacknet Nodes by 20%.<br>" +
        "Decreases all costs related to Hacknet Node by 15%.",
    },
    {
      bonuses: {
        company_rep_mult: 1.25,
        faction_rep_mult: 1.15,
        work_money_mult: 1.7,
      },
      description:
        "Increases the amount of money the player gains from working by 70%.<br>" +
        "Increases the amount of reputation the player gains when working for a company by 25%.<br>" +
        "Increases the amount of reputation the player gains for a faction by 15%.",
    },
    {
      bonuses: {
        crime_success_mult: 2,
        crime_money_mult: 2,
      },
      description:
        "Increases the player's crime success rate by 100%.<br>" +
        "Increases the amount of money the player gains from crimes by 100%.",
    },
  ];

  const randomNumber = new WHRNG(Math.floor(Player.lastUpdate / 3600000));
  for (let i = 0; i < 5; i++) randomNumber.step();

  return bonuses[Math.floor(bonuses.length * randomNumber.random())];
}

export const infiltratorsAugmentations = [
  new Augmentation({
    name: AugmentationNames.BagOfSand,
    repCost: 100,
    moneyCost: 1e9,
    info:
      "You watched a bittube video about sword fighting, " +
      "it suggested the best way to win a sword fight was to play dirty " +
      "so you filled a bag full of sand from outside your house.",
    stats: <>This augmentation makes the Slash minigame easier buy extending the time you can slash.</>,
    factions: [FactionNames.Infiltrators],
  }),
  new Augmentation({
    name: AugmentationNames.IntellisenseModule,
    repCost: 100,
    moneyCost: 1e9,
    info:
      "A brain implant with AI power that focuses in auto linting and intelisense, which " +
      "provides the ability to perform code completion better than any exisiting " +
      "IDE envronment on the market to date.",
    stats: <>This augmentation makes the Bracket minigame easier buy letting you get a few incorrect guesses.</>,
    factions: [FactionNames.Infiltrators],
  }),
  new Augmentation({
    name: AugmentationNames.ReverseDictionary,
    repCost: 100,
    moneyCost: 1e9,
    info:
      "An ancient dictionary with a thick layer of dust it looks like a differnet language, " +
      "as you examine it further you relise that its actually just a normal dictonary but the words are " +
      "written backwards if only you could take the book home, you think it would become like a second language.",
    stats: <>This augmentation makes the Backwards minigame easier by making the words no longer backwards.</>,
    factions: [FactionNames.Infiltrators],
  }),
  new Augmentation({
    name: AugmentationNames.AmuletOfPersuasian,
    repCost: 100,
    moneyCost: 1e9,
    info:
      "A fancy looking amulet that looks like something an Egyptian goddess would wear, " +
      "you hear faint whispers that are trying to convince you to do things you wouldnt normaly do, " +
      "apon touching it the voices stop how strange.",
    stats: <>This augmentation makes the Bribe minigame easier by TODO.</>,
    factions: [FactionNames.Infiltrators],
  }),
  new Augmentation({
    name: AugmentationNames.LameSharkRepository,
    repCost: 100,
    moneyCost: 1e9,
    info:
      "You stumble accross an old opensource repository for a weird defunct version of LameShark, " +
      "apon studing the source code it seems to just have a bunch of arrow key cheat codes. ",
    stats: (
      <>
        This augmentation makes the Cheat Code minigame easier by letting you see the full sequence before entering it.
      </>
    ),
    factions: [FactionNames.Infiltrators],
  }),
  new Augmentation({
    name: AugmentationNames.CyberDecoder,
    repCost: 100,
    moneyCost: 1e9,
    info:
      "A cool looking do hickey that odly resembles Keanu Reeves face, " +
      "it has a usb cable that looks like it plugs into something.",
    stats: <>This augmentation makes the Symbol matching minigame easier by TODO.</>,
    factions: [FactionNames.Infiltrators],
  }),
  new Augmentation({
    name: AugmentationNames.MineDetector,
    repCost: 100,
    moneyCost: 1e9,
    info:
      "You stumble across an old mine detector at an army surplus store, " +
      "on the side is inscribed 'X(' i wonder what happend to the orginal owner, " +
      "its a bit beaten up but looks like it should still do the job.",
    stats: <>This augmentation makes the Minesweeper minigame easier by showing the location of all mines.</>,
    factions: [FactionNames.Infiltrators],
  }),
  new Augmentation({
    name: AugmentationNames.WireCuttingManual,
    repCost: 100,
    moneyCost: 1e9,
    info:
      "You found an old wire cutting for dummys book in the local library, " +
      "how hard can it be to cut wires, right?",
    stats: <>This augmentation makes the Wire Cutting minigame easier by highlighting the correct wires to cut.</>,
    factions: [FactionNames.Infiltrators],
  }),
];

export const generalAugmentations = [
  new Augmentation({
    name: AugmentationNames.HemoRecirculator,
    moneyCost: 4.5e7,
    repCost: 1e4,
    info: "A heart implant that greatly increases the body's ability to effectively use and pump blood.",
    strength_mult: 1.08,
    defense_mult: 1.08,
    agility_mult: 1.08,
    dexterity_mult: 1.08,
    factions: [FactionNames.Tetrads, FactionNames.TheDarkArmy, FactionNames.TheSyndicate],
  }),
  new Augmentation({
    name: AugmentationNames.Targeting1,
    moneyCost: 1.5e7,
    repCost: 5e3,
    info:
      "A cranial implant that is embedded within the inner ear structures and optic nerves. It regulates " +
      "and enhances balance and hand-eye coordination.",
    dexterity_mult: 1.1,
    factions: [
      FactionNames.SlumSnakes,
      FactionNames.TheDarkArmy,
      FactionNames.TheSyndicate,
      FactionNames.Sector12,
      FactionNames.Ishima,
      FactionNames.OmniTekIncorporated,
      FactionNames.KuaiGongInternational,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.Targeting2,
    moneyCost: 4.25e7,
    repCost: 8.75e3,
    info:
      "This upgraded version of the 'Augmented Targeting' implant is capable of augmenting " +
      "reality by digitally displaying weaknesses and vital signs of threats.",
    prereqs: [AugmentationNames.Targeting1],
    dexterity_mult: 1.2,
    factions: [
      FactionNames.TheDarkArmy,
      FactionNames.TheSyndicate,
      FactionNames.Sector12,
      FactionNames.OmniTekIncorporated,
      FactionNames.KuaiGongInternational,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.Targeting3,
    moneyCost: 1.15e8,
    repCost: 2.75e4,
    info: "The latest version of the 'Augmented Targeting' implant adds the ability to lock-on and track threats.",
    prereqs: [AugmentationNames.Targeting2],
    dexterity_mult: 1.3,
    factions: [
      FactionNames.TheDarkArmy,
      FactionNames.TheSyndicate,
      FactionNames.OmniTekIncorporated,
      FactionNames.KuaiGongInternational,
      FactionNames.BladeIndustries,
      FactionNames.TheCovenant,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.SyntheticHeart,
    moneyCost: 2.875e9,
    repCost: 7.5e5,
    info:
      "This advanced artificial heart, created from plasteel and graphene, is capable of pumping blood " +
      "more efficiently than an organic heart.",
    agility_mult: 1.5,
    strength_mult: 1.5,
    factions: [
      FactionNames.KuaiGongInternational,
      FactionNames.FulcrumSecretTechnologies,
      FactionNames.SpeakersForTheDead,
      FactionNames.NWO,
      FactionNames.TheCovenant,
      FactionNames.Daedalus,
      FactionNames.Illuminati,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.SynfibrilMuscle,
    repCost: 4.375e5,
    moneyCost: 1.125e9,
    info:
      "The myofibrils in human muscles are injected with special chemicals that react with the proteins inside " +
      "the myofibrils, altering their underlying structure. The end result is muscles that are stronger and more elastic. " +
      "Scientists have named these artificially enhanced units 'synfibrils'.",
    strength_mult: 1.3,
    defense_mult: 1.3,
    factions: [
      FactionNames.KuaiGongInternational,
      FactionNames.FulcrumSecretTechnologies,
      FactionNames.SpeakersForTheDead,
      FactionNames.NWO,
      FactionNames.TheCovenant,
      FactionNames.Daedalus,
      FactionNames.Illuminati,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.CombatRib1,
    repCost: 7.5e3,
    moneyCost: 2.375e7,
    info:
      "The rib cage is augmented to continuously release boosters into the bloodstream " +
      "which increase the oxygen-carrying capacity of blood.",
    strength_mult: 1.1,
    defense_mult: 1.1,
    factions: [
      FactionNames.SlumSnakes,
      FactionNames.TheDarkArmy,
      FactionNames.TheSyndicate,
      FactionNames.Volhaven,
      FactionNames.Ishima,
      FactionNames.OmniTekIncorporated,
      FactionNames.KuaiGongInternational,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.CombatRib2,
    repCost: 1.875e4,
    moneyCost: 6.5e7,
    info:
      "An upgraded version of the 'Combat Rib' augmentation that adds potent stimulants which " +
      "improve focus and endurance while decreasing reaction time and fatigue.",
    prereqs: [AugmentationNames.CombatRib1],
    strength_mult: 1.14,
    defense_mult: 1.14,
    factions: [
      FactionNames.TheDarkArmy,
      FactionNames.TheSyndicate,
      FactionNames.Volhaven,
      FactionNames.OmniTekIncorporated,
      FactionNames.KuaiGongInternational,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.CombatRib3,
    repCost: 3.5e4,
    moneyCost: 1.2e8,
    info:
      "The latest version of the 'Combat Rib' augmentation releases advanced anabolic steroids that " +
      "improve muscle mass and physical performance while being safe and free of side effects.",
    prereqs: [AugmentationNames.CombatRib2],
    strength_mult: 1.18,
    defense_mult: 1.18,
    factions: [
      FactionNames.TheDarkArmy,
      FactionNames.TheSyndicate,
      FactionNames.OmniTekIncorporated,
      FactionNames.KuaiGongInternational,
      FactionNames.BladeIndustries,
      FactionNames.TheCovenant,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.NanofiberWeave,
    repCost: 3.75e4,
    moneyCost: 1.25e8,
    info:
      "Synthetic nanofibers are woven into the skin's extracellular matrix using electrospinning, " +
      "which improves its regenerative and extracellular homeostasis abilities.",
    strength_mult: 1.2,
    defense_mult: 1.2,
    factions: [
      FactionNames.TheDarkArmy,
      FactionNames.TheSyndicate,
      FactionNames.OmniTekIncorporated,
      FactionNames.BladeIndustries,
      FactionNames.TianDiHui,
      FactionNames.SpeakersForTheDead,
      FactionNames.FulcrumSecretTechnologies,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.SubdermalArmor,
    repCost: 8.75e5,
    moneyCost: 3.25e9,
    info:
      "The NEMEAN Subdermal Weave is a thin, light-weight, graphene plating that houses a dilatant fluid. " +
      "The material is implanted underneath the skin, and is the most advanced form of defensive enhancement " +
      "that has ever been created. The dilatant fluid, despite being thin and light, is extremely effective " +
      "at stopping piercing blows and reducing blunt trauma. The properties of graphene allow the plating to " +
      "mitigate damage from any fire or electrical traumas.",
    defense_mult: 2.2,
    factions: [
      FactionNames.TheSyndicate,
      FactionNames.FulcrumSecretTechnologies,
      FactionNames.Illuminati,
      FactionNames.Daedalus,
      FactionNames.TheCovenant,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.WiredReflexes,
    repCost: 1.25e3,
    moneyCost: 2.5e6,
    info:
      "Synthetic nerve-enhancements are injected into all major parts of the somatic nervous system, " +
      "supercharging the spread of neural signals and increasing reflex speed.",
    agility_mult: 1.05,
    dexterity_mult: 1.05,
    factions: [
      FactionNames.TianDiHui,
      FactionNames.SlumSnakes,
      FactionNames.Sector12,
      FactionNames.Volhaven,
      FactionNames.Aevum,
      FactionNames.Ishima,
      FactionNames.TheSyndicate,
      FactionNames.TheDarkArmy,
      FactionNames.SpeakersForTheDead,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.GrapheneBoneLacings,
    repCost: 1.125e6,
    moneyCost: 4.25e9,
    info: "Graphene is grafted and fused into the skeletal structure, enhancing bone density and tensile strength.",
    strength_mult: 1.7,
    defense_mult: 1.7,
    factions: [FactionNames.FulcrumSecretTechnologies, FactionNames.TheCovenant],
  }),
  new Augmentation({
    name: AugmentationNames.BionicSpine,
    repCost: 4.5e4,
    moneyCost: 1.25e8,
    info:
      "The spine is reconstructed using plasteel and carbon fibers. " +
      "It is now capable of stimulating and regulating neural signals " +
      "passing through the spinal cord, improving senses and reaction speed. " +
      "The 'Bionic Spine' also interfaces with all other 'Bionic' implants.",
    strength_mult: 1.15,
    defense_mult: 1.15,
    agility_mult: 1.15,
    dexterity_mult: 1.15,
    factions: [
      FactionNames.SpeakersForTheDead,
      FactionNames.TheSyndicate,
      FactionNames.KuaiGongInternational,
      FactionNames.OmniTekIncorporated,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.GrapheneBionicSpine,
    repCost: 1.625e6,
    moneyCost: 6e9,
    info:
      "An upgrade to the 'Bionic Spine' augmentation. The spine is fused with graphene " +
      "which enhances durability and supercharges all body functions.",
    prereqs: [AugmentationNames.BionicSpine],
    strength_mult: 1.6,
    defense_mult: 1.6,
    agility_mult: 1.6,
    dexterity_mult: 1.6,
    factions: [FactionNames.FulcrumSecretTechnologies, FactionNames.ECorp],
  }),
  new Augmentation({
    name: AugmentationNames.BionicLegs,
    repCost: 1.5e5,
    moneyCost: 3.75e8,
    info: "Cybernetic legs, created from plasteel and carbon fibers, enhance running speed.",
    agility_mult: 1.6,
    factions: [
      FactionNames.SpeakersForTheDead,
      FactionNames.TheSyndicate,
      FactionNames.KuaiGongInternational,
      FactionNames.OmniTekIncorporated,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.GrapheneBionicLegs,
    repCost: 7.5e5,
    moneyCost: 4.5e9,
    info:
      "An upgrade to the 'Bionic Legs' augmentation. The legs are fused " +
      "with graphene, greatly enhancing jumping ability.",
    prereqs: [AugmentationNames.BionicLegs],
    agility_mult: 2.5,
    factions: [FactionNames.MegaCorp, FactionNames.ECorp, FactionNames.FulcrumSecretTechnologies],
  }),
  new Augmentation({
    name: AugmentationNames.SpeechProcessor,
    repCost: 7.5e3,
    moneyCost: 5e7,
    info:
      "A cochlear implant with an embedded computer that analyzes incoming speech. " +
      "The embedded computer processes characteristics of incoming speech, such as tone " +
      "and inflection, to pick up on subtle cues and aid in social interactions.",
    charisma_mult: 1.2,
    factions: [
      FactionNames.TianDiHui,
      FactionNames.Chongqing,
      FactionNames.Sector12,
      FactionNames.NewTokyo,
      FactionNames.Aevum,
      FactionNames.Ishima,
      FactionNames.Volhaven,
      FactionNames.Silhouette,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.TITN41Injection,
    repCost: 2.5e4,
    moneyCost: 1.9e8,
    info:
      "TITN is a series of viruses that targets and alters the sequences of human DNA in genes that " +
      "control personality. The TITN-41 strain alters these genes so that the subject becomes more " +
      "outgoing and socialable.",
    charisma_mult: 1.15,
    charisma_exp_mult: 1.15,
    factions: [FactionNames.Silhouette],
  }),
  new Augmentation({
    name: AugmentationNames.EnhancedSocialInteractionImplant,
    repCost: 3.75e5,
    moneyCost: 1.375e9,
    info:
      "A cranial implant that greatly assists in the user's ability to analyze social situations " +
      "and interactions. The system uses a wide variety of factors such as facial expressions, body " +
      "language, and the voice tone, and inflection to determine the best course of action during social" +
      "situations. The implant also uses deep learning software to continuously learn new behavior" +
      "patterns and how to best respond.",
    charisma_mult: 1.6,
    charisma_exp_mult: 1.6,
    factions: [
      FactionNames.BachmanAssociates,
      FactionNames.NWO,
      FactionNames.ClarkeIncorporated,
      FactionNames.OmniTekIncorporated,
      FactionNames.FourSigma,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.BitWire,
    repCost: 3.75e3,
    moneyCost: 1e7,
    info:
      "A small brain implant embedded in the cerebrum. This regulates and improves the brain's computing " +
      "capabilities.",
    hacking_mult: 1.05,
    factions: [FactionNames.CyberSec, FactionNames.NiteSec],
  }),
  new Augmentation({
    name: AugmentationNames.ArtificialBioNeuralNetwork,
    repCost: 2.75e5,
    moneyCost: 3e9,
    info:
      "A network consisting of millions of nanoprocessors is embedded into the brain. " +
      "The network is meant to mimic the way a biological brain solves a problem, with each " +
      "nanoprocessor acting similar to the way a neuron would in a neural network. However, these " +
      "nanoprocessors are programmed to perform computations much faster than organic neurons, " +
      "allowing the user to solve much more complex problems at a much faster rate.",
    hacking_speed_mult: 1.03,
    hacking_money_mult: 1.15,
    hacking_mult: 1.12,
    factions: [FactionNames.BitRunners, FactionNames.FulcrumSecretTechnologies],
  }),
  new Augmentation({
    name: AugmentationNames.ArtificialSynapticPotentiation,
    repCost: 6.25e3,
    moneyCost: 8e7,
    info:
      "The body is injected with a chemical that artificially induces synaptic potentiation, " +
      "otherwise known as the strengthening of synapses. This results in enhanced cognitive abilities.",
    hacking_speed_mult: 1.02,
    hacking_chance_mult: 1.05,
    hacking_exp_mult: 1.05,
    factions: [FactionNames.TheBlackHand, FactionNames.NiteSec],
  }),
  new Augmentation({
    name: AugmentationNames.EnhancedMyelinSheathing,
    repCost: 1e5,
    moneyCost: 1.375e9,
    info:
      "Electrical signals are used to induce a new, artificial form of myelinogenesis in the human body. " +
      "This process results in the proliferation of new, synthetic myelin sheaths in the nervous " +
      "system. These myelin sheaths can propogate neuro-signals much faster than their organic " +
      "counterparts, leading to greater processing speeds and better brain function.",
    hacking_speed_mult: 1.03,
    hacking_exp_mult: 1.1,
    hacking_mult: 1.08,
    factions: [FactionNames.FulcrumSecretTechnologies, FactionNames.BitRunners, FactionNames.TheBlackHand],
  }),
  new Augmentation({
    name: AugmentationNames.SynapticEnhancement,
    repCost: 2e3,
    moneyCost: 7.5e6,
    info:
      "A small cranial implant that continuously uses weak electrical signals to stimulate the brain and " +
      "induce stronger synaptic activity. This improves the user's cognitive abilities.",
    hacking_speed_mult: 1.03,
    factions: [FactionNames.CyberSec, FactionNames.Aevum],
  }),
  new Augmentation({
    name: AugmentationNames.NeuralRetentionEnhancement,
    repCost: 2e4,
    moneyCost: 2.5e8,
    info:
      "Chemical injections are used to permanently alter and strengthen the brain's neuronal " +
      "circuits, strengthening the ability to retain information.",
    hacking_exp_mult: 1.25,
    factions: [FactionNames.NiteSec],
  }),
  new Augmentation({
    name: AugmentationNames.DataJack,
    repCost: 1.125e5,
    moneyCost: 4.5e8,
    info:
      "A brain implant that provides an interface for direct, wireless communication between a computer's main " +
      "memory and the mind. This implant allows the user to not only access a computer's memory, but also alter " +
      "and delete it.",
    hacking_money_mult: 1.25,
    factions: [
      FactionNames.BitRunners,
      FactionNames.TheBlackHand,
      FactionNames.NiteSec,
      FactionNames.Chongqing,
      FactionNames.NewTokyo,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.ENM,
    repCost: 1.5e4,
    moneyCost: 2.5e8,
    info:
      "A thin device embedded inside the arm containing a wireless module capable of connecting " +
      "to nearby networks. Once connected, the Netburner Module is capable of capturing and " +
      "processing all of the traffic on that network. By itself, the Embedded Netburner Module does " +
      "not do much, but a variety of very powerful upgrades can be installed that allow you to fully " +
      "control the traffic on a network.",
    hacking_mult: 1.08,
    factions: [
      FactionNames.BitRunners,
      FactionNames.TheBlackHand,
      FactionNames.NiteSec,
      FactionNames.ECorp,
      FactionNames.MegaCorp,
      FactionNames.FulcrumSecretTechnologies,
      FactionNames.NWO,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.ENMCore,
    repCost: 175e3,
    moneyCost: 2.5e9,
    info:
      "The Core library is an implant that upgrades the firmware of the Embedded Netburner Module. " +
      "This upgrade allows the Embedded Netburner Module to generate its own data on a network.",
    prereqs: [AugmentationNames.ENM],
    hacking_speed_mult: 1.03,
    hacking_money_mult: 1.1,
    hacking_chance_mult: 1.03,
    hacking_exp_mult: 1.07,
    hacking_mult: 1.07,
    factions: [
      FactionNames.BitRunners,
      FactionNames.TheBlackHand,
      FactionNames.ECorp,
      FactionNames.MegaCorp,
      FactionNames.FulcrumSecretTechnologies,
      FactionNames.NWO,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.ENMCoreV2,
    repCost: 1e6,
    moneyCost: 4.5e9,
    info:
      "The Core V2 library is an implant that upgrades the firmware of the Embedded Netburner Module. " +
      "This upgraded firmware allows the Embedded Netburner Module to control information on " +
      "a network by re-routing traffic, spoofing IP addresses, and altering the data inside network " +
      "packets.",
    prereqs: [AugmentationNames.ENMCore],
    hacking_speed_mult: 1.05,
    hacking_money_mult: 1.3,
    hacking_chance_mult: 1.05,
    hacking_exp_mult: 1.15,
    hacking_mult: 1.08,
    factions: [
      FactionNames.BitRunners,
      FactionNames.ECorp,
      FactionNames.MegaCorp,
      FactionNames.FulcrumSecretTechnologies,
      FactionNames.NWO,
      FactionNames.BladeIndustries,
      FactionNames.OmniTekIncorporated,
      FactionNames.KuaiGongInternational,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.ENMCoreV3,
    repCost: 1.75e6,
    moneyCost: 7.5e9,
    info:
      "The Core V3 library is an implant that upgrades the firmware of the Embedded Netburner Module. " +
      "This upgraded firmware allows the Embedded Netburner Module to seamlessly inject code into " +
      "any device on a network.",
    prereqs: [AugmentationNames.ENMCoreV2],
    hacking_speed_mult: 1.05,
    hacking_money_mult: 1.4,
    hacking_chance_mult: 1.1,
    hacking_exp_mult: 1.25,
    hacking_mult: 1.1,
    factions: [
      FactionNames.ECorp,
      FactionNames.MegaCorp,
      FactionNames.FulcrumSecretTechnologies,
      FactionNames.NWO,
      FactionNames.Daedalus,
      FactionNames.TheCovenant,
      FactionNames.Illuminati,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.ENMAnalyzeEngine,
    repCost: 6.25e5,
    moneyCost: 6e9,
    info:
      "Installs the Analyze Engine for the Embedded Netburner Module, which is a CPU cluster " +
      "that vastly outperforms the Netburner Module's native single-core processor.",
    prereqs: [AugmentationNames.ENM],
    hacking_speed_mult: 1.1,
    factions: [
      FactionNames.ECorp,
      FactionNames.MegaCorp,
      FactionNames.FulcrumSecretTechnologies,
      FactionNames.NWO,
      FactionNames.Daedalus,
      FactionNames.TheCovenant,
      FactionNames.Illuminati,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.ENMDMA,
    repCost: 1e6,
    moneyCost: 7e9,
    info:
      "This implant installs a Direct Memory Access (DMA) controller into the " +
      "Embedded Netburner Module. This allows the Module to send and receive data " +
      "directly to and from the main memory of devices on a network.",
    prereqs: [AugmentationNames.ENM],
    hacking_money_mult: 1.4,
    hacking_chance_mult: 1.2,
    factions: [
      FactionNames.ECorp,
      FactionNames.MegaCorp,
      FactionNames.FulcrumSecretTechnologies,
      FactionNames.NWO,
      FactionNames.Daedalus,
      FactionNames.TheCovenant,
      FactionNames.Illuminati,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.Neuralstimulator,
    repCost: 5e4,
    moneyCost: 3e9,
    info:
      "A cranial implant that intelligently stimulates certain areas of the brain " +
      "in order to improve cognitive functions.",
    hacking_speed_mult: 1.02,
    hacking_chance_mult: 1.1,
    hacking_exp_mult: 1.12,
    factions: [
      FactionNames.TheBlackHand,
      FactionNames.Chongqing,
      FactionNames.Sector12,
      FactionNames.NewTokyo,
      FactionNames.Aevum,
      FactionNames.Ishima,
      FactionNames.Volhaven,
      FactionNames.BachmanAssociates,
      FactionNames.ClarkeIncorporated,
      FactionNames.FourSigma,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.NeuralAccelerator,
    repCost: 2e5,
    moneyCost: 1.75e9,
    info:
      "A microprocessor that accelerates the processing " +
      "speed of biological neural networks. This is a cranial implant that is embedded inside the brain.",
    hacking_mult: 1.1,
    hacking_exp_mult: 1.15,
    hacking_money_mult: 1.2,
    factions: [FactionNames.BitRunners],
  }),
  new Augmentation({
    name: AugmentationNames.CranialSignalProcessorsG1,
    repCost: 1e4,
    moneyCost: 7e7,
    info:
      "The first generation of Cranial Signal Processors. Cranial Signal Processors " +
      "are a set of specialized microprocessors that are attached to " +
      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
      "so that the brain doesn't have to.",
    hacking_speed_mult: 1.01,
    hacking_mult: 1.05,
    factions: [FactionNames.CyberSec],
  }),
  new Augmentation({
    name: AugmentationNames.CranialSignalProcessorsG2,
    repCost: 1.875e4,
    moneyCost: 1.25e8,
    info:
      "The second generation of Cranial Signal Processors. Cranial Signal Processors " +
      "are a set of specialized microprocessors that are attached to " +
      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
      "so that the brain doesn't have to.",
    prereqs: [AugmentationNames.CranialSignalProcessorsG1],
    hacking_speed_mult: 1.02,
    hacking_chance_mult: 1.05,
    hacking_mult: 1.07,
    factions: [FactionNames.CyberSec, FactionNames.NiteSec],
  }),
  new Augmentation({
    name: AugmentationNames.CranialSignalProcessorsG3,
    repCost: 5e4,
    moneyCost: 5.5e8,
    info:
      "The third generation of Cranial Signal Processors. Cranial Signal Processors " +
      "are a set of specialized microprocessors that are attached to " +
      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
      "so that the brain doesn't have to.",
    prereqs: [AugmentationNames.CranialSignalProcessorsG2],
    hacking_speed_mult: 1.02,
    hacking_money_mult: 1.15,
    hacking_mult: 1.09,
    factions: [FactionNames.NiteSec, FactionNames.TheBlackHand, FactionNames.BitRunners],
  }),
  new Augmentation({
    name: AugmentationNames.CranialSignalProcessorsG4,
    repCost: 1.25e5,
    moneyCost: 1.1e9,
    info:
      "The fourth generation of Cranial Signal Processors. Cranial Signal Processors " +
      "are a set of specialized microprocessors that are attached to " +
      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
      "so that the brain doesn't have to.",
    prereqs: [AugmentationNames.CranialSignalProcessorsG3],
    hacking_speed_mult: 1.02,
    hacking_money_mult: 1.2,
    hacking_grow_mult: 1.25,
    factions: [FactionNames.TheBlackHand, FactionNames.BitRunners],
  }),
  new Augmentation({
    name: AugmentationNames.CranialSignalProcessorsG5,
    repCost: 2.5e5,
    moneyCost: 2.25e9,
    info:
      "The fifth generation of Cranial Signal Processors. Cranial Signal Processors " +
      "are a set of specialized microprocessors that are attached to " +
      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
      "so that the brain doesn't have to.",
    prereqs: [AugmentationNames.CranialSignalProcessorsG4],
    hacking_mult: 1.3,
    hacking_money_mult: 1.25,
    hacking_grow_mult: 1.75,
    factions: [FactionNames.BitRunners],
  }),
  new Augmentation({
    name: AugmentationNames.NeuronalDensification,
    repCost: 1.875e5,
    moneyCost: 1.375e9,
    info:
      "The brain is surgically re-engineered to have increased neuronal density " +
      "by decreasing the neuron gap junction. Then, the body is genetically modified " +
      "to enhance the production and capabilities of its neural stem cells.",
    hacking_mult: 1.15,
    hacking_exp_mult: 1.1,
    hacking_speed_mult: 1.03,
    factions: [FactionNames.ClarkeIncorporated],
  }),
  new Augmentation({
    name: AugmentationNames.NuoptimalInjectorImplant,
    repCost: 5e3,
    moneyCost: 2e7,
    info:
      "This torso implant automatically injects nootropic supplements into " +
      "the bloodstream to improve memory, increase focus, and provide other " +
      "cognitive enhancements.",
    company_rep_mult: 1.2,
    factions: [
      FactionNames.TianDiHui,
      FactionNames.Volhaven,
      FactionNames.NewTokyo,
      FactionNames.Chongqing,
      FactionNames.ClarkeIncorporated,
      FactionNames.FourSigma,
      FactionNames.BachmanAssociates,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.SpeechEnhancement,
    repCost: 2.5e3,
    moneyCost: 1.25e7,
    info:
      "An advanced neural implant that improves your speaking abilities, making " +
      "you more convincing and likable in conversations and overall improving your " +
      "social interactions.",
    company_rep_mult: 1.1,
    charisma_mult: 1.1,
    factions: [
      FactionNames.TianDiHui,
      FactionNames.SpeakersForTheDead,
      FactionNames.FourSigma,
      FactionNames.KuaiGongInternational,
      FactionNames.ClarkeIncorporated,
      FactionNames.BachmanAssociates,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.FocusWire,
    repCost: 7.5e4,
    moneyCost: 9e8,
    info: "A cranial implant that stops procrastination by blocking specific neural pathways in the brain.",
    hacking_exp_mult: 1.05,
    strength_exp_mult: 1.05,
    defense_exp_mult: 1.05,
    dexterity_exp_mult: 1.05,
    agility_exp_mult: 1.05,
    charisma_exp_mult: 1.05,
    company_rep_mult: 1.1,
    work_money_mult: 1.2,
    factions: [
      FactionNames.BachmanAssociates,
      FactionNames.ClarkeIncorporated,
      FactionNames.FourSigma,
      FactionNames.KuaiGongInternational,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.PCDNI,
    repCost: 3.75e5,
    moneyCost: 3.75e9,
    info:
      "Installs a Direct-Neural Interface jack into your arm that is compatible with most " +
      "computers. Connecting to a computer through this jack allows you to interface with " +
      "it using the brain's electrochemical signals.",
    company_rep_mult: 1.3,
    hacking_mult: 1.08,
    factions: [
      FactionNames.FourSigma,
      FactionNames.OmniTekIncorporated,
      FactionNames.ECorp,
      FactionNames.BladeIndustries,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.PCDNIOptimizer,
    repCost: 5e5,
    moneyCost: 4.5e9,
    info:
      "This is a submodule upgrade to the PC Direct-Neural Interface augmentation. It " +
      "improves the performance of the interface and gives the user more control options " +
      "to a connected computer.",
    prereqs: [AugmentationNames.PCDNI],
    company_rep_mult: 1.75,
    hacking_mult: 1.1,
    factions: [FactionNames.FulcrumSecretTechnologies, FactionNames.ECorp, FactionNames.BladeIndustries],
  }),
  new Augmentation({
    name: AugmentationNames.PCDNINeuralNetwork,
    repCost: 1.5e6,
    moneyCost: 7.5e9,
    info:
      "This is an additional installation that upgrades the functionality of the " +
      "PC Direct-Neural Interface augmentation. When connected to a computer, " +
      "The Neural Network upgrade allows the user to use their own brain's " +
      "processing power to aid the computer in computational tasks.",
    prereqs: [AugmentationNames.PCDNI],
    company_rep_mult: 2,
    hacking_mult: 1.1,
    hacking_speed_mult: 1.05,
    factions: [FactionNames.FulcrumSecretTechnologies],
  }),
  new Augmentation({
    name: AugmentationNames.ADRPheromone1,
    repCost: 3.75e3,
    moneyCost: 1.75e7,
    info:
      "The body is genetically re-engineered so that it produces the ADR-V1 pheromone, " +
      "an artificial pheromone discovered by scientists. The ADR-V1 pheromone, when excreted, " +
      "triggers feelings of admiration and approval in other people.",
    company_rep_mult: 1.1,
    faction_rep_mult: 1.1,
    factions: [
      FactionNames.TianDiHui,
      FactionNames.TheSyndicate,
      FactionNames.NWO,
      FactionNames.MegaCorp,
      FactionNames.FourSigma,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.ADRPheromone2,
    repCost: 6.25e4,
    moneyCost: 5.5e8,
    info:
      "The body is genetically re-engineered so that it produces the ADR-V2 pheromone, " +
      "which is similar to but more potent than ADR-V1. This pheromone, when excreted, " +
      "triggers feelings of admiration, approval, and respect in others.",
    company_rep_mult: 1.2,
    faction_rep_mult: 1.2,
    factions: [
      FactionNames.Silhouette,
      FactionNames.FourSigma,
      FactionNames.BachmanAssociates,
      FactionNames.ClarkeIncorporated,
    ],
  }),
  new Augmentation({
    name: AugmentationNames.ShadowsSimulacrum,
    repCost: 3.75e4,
    moneyCost: 4e8,
    info:
      "A crude but functional matter phase-shifter module that is embedded " +
      "in the brainstem and cerebellum. This augmentation was developed by " +
      "criminal organizations and allows the user to project and control holographic " +
      "simulacrums within a large radius. These simulacrums are commonly used for " +
      "espionage and surveillance work.",
    company_rep_mult: 1.15,
    faction_rep_mult: 1.15,
    factions: [FactionNames.TheSyndicate, FactionNames.TheDarkArmy, FactionNames.SpeakersForTheDead],
  }),
  new Augmentation({
    name: AugmentationNames.HacknetNodeCPUUpload,
    repCost: 3.75e3,
    moneyCost: 1.1e7,
    info:
      "Uploads the architecture and design details of a Hacknet Node's CPU into " +
      "the brain. This allows the user to engineer custom hardware and software  " +
      "for the Hacknet Node that provides better performance.",
    hacknet_node_money_mult: 1.15,
    hacknet_node_purchase_cost_mult: 0.85,
    factions: [FactionNames.Netburners],
  }),
  new Augmentation({
    name: AugmentationNames.HacknetNodeCacheUpload,
    repCost: 2.5e3,
    moneyCost: 5.5e6,
    info:
      "Uploads the architecture and design details of a Hacknet Node's main-memory cache " +
      "into the brain. This allows the user to engineer custom cache hardware for the  " +
      "Hacknet Node that offers better performance.",
    hacknet_node_money_mult: 1.1,
    hacknet_node_level_cost_mult: 0.85,
    factions: [FactionNames.Netburners],
  }),
  new Augmentation({
    name: AugmentationNames.HacknetNodeNICUpload,
    repCost: 1.875e3,
    moneyCost: 4.5e6,
    info:
      "Uploads the architecture and design details of a Hacknet Node's Network Interface Card (NIC) " +
      "into the brain. This allows the user to engineer a custom NIC for the Hacknet Node that " +
      "offers better performance.",
    hacknet_node_money_mult: 1.1,
    hacknet_node_purchase_cost_mult: 0.9,
    factions: [FactionNames.Netburners],
  }),
  new Augmentation({
    name: AugmentationNames.HacknetNodeKernelDNI,
    repCost: 7.5e3,
    moneyCost: 4e7,
    info:
      "Installs a Direct-Neural Interface jack into the arm that is capable of connecting to a " +
      "Hacknet Node. This lets the user access and manipulate the Node's kernel using " +
      "electrochemical signals.",
    hacknet_node_money_mult: 1.25,
    factions: [FactionNames.Netburners],
  }),
  new Augmentation({
    name: AugmentationNames.HacknetNodeCoreDNI,
    repCost: 1.25e4,
    moneyCost: 6e7,
    info:
      "Installs a Direct-Neural Interface jack into the arm that is capable of connecting " +
      "to a Hacknet Node. This lets the user access and manipulate the Node's processing logic using " +
      "electrochemical signals.",
    hacknet_node_money_mult: 1.45,
    factions: [FactionNames.Netburners],
  }),
  new Augmentation({
    name: AugmentationNames.Neurotrainer1,
    repCost: 1e3,
    moneyCost: 4e6,
    info:
      "A decentralized cranial implant that improves the brain's ability to learn. It is " +
      "installed by releasing millions of nanobots into the human brain, each of which " +
      "attaches to a different neural pathway to enhance the brain's ability to retain " +
      "and retrieve information.",
    hacking_exp_mult: 1.1,
    strength_exp_mult: 1.1,
    defense_exp_mult: 1.1,
    dexterity_exp_mult: 1.1,
    agility_exp_mult: 1.1,
    charisma_exp_mult: 1.1,
    factions: [FactionNames.CyberSec, FactionNames.Aevum],
  }),
  new Augmentation({
    name: AugmentationNames.Neurotrainer2,
    repCost: 1e4,
    moneyCost: 4.5e7,
    info:
      "A decentralized cranial implant that improves the brain's ability to learn. This " +
      "is a more powerful version of the Neurotrainer I augmentation, but it does not " +
      "require Neurotrainer I to be installed as a prerequisite.",
    hacking_exp_mult: 1.15,
    strength_exp_mult: 1.15,
    defense_exp_mult: 1.15,
    dexterity_exp_mult: 1.15,
    agility_exp_mult: 1.15,
    charisma_exp_mult: 1.15,
    factions: [FactionNames.BitRunners, FactionNames.NiteSec],
  }),
  new Augmentation({
    name: AugmentationNames.Neurotrainer3,
    repCost: 2.5e4,
    moneyCost: 1.3e8,
    info:
      "A decentralized cranial implant that improves the brain's ability to learn. This " +
      "is a more powerful version of the Neurotrainer I and Neurotrainer II augmentation, " +
      "but it does not require either of them to be installed as a prerequisite.",
    hacking_exp_mult: 1.2,
    strength_exp_mult: 1.2,
    defense_exp_mult: 1.2,
    dexterity_exp_mult: 1.2,
    agility_exp_mult: 1.2,
    charisma_exp_mult: 1.2,
    factions: [FactionNames.NWO, FactionNames.FourSigma],
  }),
  new Augmentation({
    name: AugmentationNames.Hypersight,
    repCost: 1.5e5,
    moneyCost: 2.75e9,
    info:
      "A bionic eye implant that grants sight capabilities far beyond those of a natural human. " +
      "Embedded circuitry within the implant provides the ability to detect heat and movement " +
      "through solid objects such as walls, thus providing 'x-ray vision'-like capabilities.",
    dexterity_mult: 1.4,
    hacking_speed_mult: 1.03,
    hacking_money_mult: 1.1,
    factions: [FactionNames.BladeIndustries, FactionNames.KuaiGongInternational],
  }),
  new Augmentation({
    name: AugmentationNames.LuminCloaking1,
    repCost: 1.5e3,
    moneyCost: 5e6,
    info:
      "A skin implant that reinforces the skin with highly-advanced synthetic cells. These " +
      "cells, when powered, have a negative refractive index. As a result, they bend light " +
      "around the skin, making the user much harder to see to the naked eye.",
    agility_mult: 1.05,
    crime_money_mult: 1.1,
    factions: [FactionNames.SlumSnakes, FactionNames.Tetrads],
  }),
  new Augmentation({
    name: AugmentationNames.LuminCloaking2,
    repCost: 5e3,
    moneyCost: 3e7,
    info:
      "This is a more advanced version of the LuminCloaking-V1 augmentation. This skin implant " +
      "reinforces the skin with highly-advanced synthetic cells. These " +
      "cells, when powered, are capable of not only bending light but also of bending heat, " +
      "making the user more resilient as well as stealthy.",
    prereqs: [AugmentationNames.LuminCloaking1],
    agility_mult: 1.1,
    defense_mult: 1.1,
    crime_money_mult: 1.25,
    factions: [FactionNames.SlumSnakes, FactionNames.Tetrads],
  }),
  new Augmentation({
    name: AugmentationNames.SmartSonar,
    repCost: 2.25e4,
    moneyCost: 7.5e7,
    info: "A cochlear implant that helps the player detect and locate enemies using sound propagation.",
    dexterity_mult: 1.1,
    dexterity_exp_mult: 1.15,
    crime_money_mult: 1.25,
    factions: [FactionNames.SlumSnakes],
  }),
  new Augmentation({
    name: AugmentationNames.PowerRecirculator,
    repCost: 2.5e4,
    moneyCost: 1.8e8,
    info:
      "The body's nerves are attached with polypyrrole nanocircuits that " +
      "are capable of capturing wasted energy, in the form of heat, " +
      "and converting it back into usable power.",
    hacking_mult: 1.05,
    strength_mult: 1.05,
    defense_mult: 1.05,
    dexterity_mult: 1.05,
    agility_mult: 1.05,
    charisma_mult: 1.05,
    hacking_exp_mult: 1.1,
    strength_exp_mult: 1.1,
    defense_exp_mult: 1.1,
    dexterity_exp_mult: 1.1,
    agility_exp_mult: 1.1,
    charisma_exp_mult: 1.1,
    factions: [FactionNames.Tetrads, FactionNames.TheDarkArmy, FactionNames.TheSyndicate, FactionNames.NWO],
  }),
  new Augmentation({
    name: AugmentationNames.QLink,
    repCost: 1.875e6,
    moneyCost: 2.5e13,
    info:
      `A brain implant that wirelessly connects you to the ${FactionNames.Illuminati}'s ` +
      "quantum supercomputer, allowing you to access and use its incredible " +
      "computing power.",
    hacking_mult: 1.75,
    hacking_speed_mult: 2,
    hacking_chance_mult: 2.5,
    hacking_money_mult: 4,
    factions: [FactionNames.Illuminati],
  }),
  new Augmentation({
    name: AugmentationNames.SPTN97,
    repCost: 1.25e6,
    moneyCost: 4.875e9,
    info:
      "The SPTN-97 gene is injected into the genome. The SPTN-97 gene is an " +
      "artificially-synthesized gene that was developed by DARPA to create " +
      "super-soldiers through genetic modification. The gene was outlawed in " +
      "2056.",
    strength_mult: 1.75,
    defense_mult: 1.75,
    dexterity_mult: 1.75,
    agility_mult: 1.75,
    hacking_mult: 1.15,
    factions: [FactionNames.TheCovenant],
  }),
  new Augmentation({
    name: AugmentationNames.HiveMind,
    repCost: 1.5e6,
    moneyCost: 5.5e9,
    info:
      `A brain implant developed by ${FactionNames.ECorp}. They do not reveal what ` +
      "exactly the implant does, but they promise that it will greatly " +
      "enhance your abilities.",
    hacking_grow_mult: 3,
    stats: null,
    factions: [FactionNames.ECorp],
  }),
  new Augmentation({
    name: AugmentationNames.TheRedPill,
    repCost: 2.5e6,
    moneyCost: 0,
    info: "It's time to leave the cave.",
    stats: null,
    factions: [FactionNames.Daedalus],
  }),
  new Augmentation({
    name: AugmentationNames.CordiARCReactor,
    repCost: 1.125e6,
    moneyCost: 5e9,
    info:
      "The thoracic cavity is equipped with a small chamber designed " +
      "to hold and sustain hydrogen plasma. The plasma is used to generate " +
      "fusion power through nuclear fusion, providing limitless amounts of clean " +
      "energy for the body.",
    strength_mult: 1.35,
    defense_mult: 1.35,
    dexterity_mult: 1.35,
    agility_mult: 1.35,
    strength_exp_mult: 1.35,
    defense_exp_mult: 1.35,
    dexterity_exp_mult: 1.35,
    agility_exp_mult: 1.35,
    factions: [FactionNames.MegaCorp],
  }),
  new Augmentation({
    name: AugmentationNames.SmartJaw,
    repCost: 3.75e5,
    moneyCost: 2.75e9,
    info:
      "A bionic jaw that contains advanced hardware and software " +
      "capable of psychoanalyzing and profiling the personality of " +
      "others using optical imaging software.",
    charisma_mult: 1.5,
    charisma_exp_mult: 1.5,
    company_rep_mult: 1.25,
    faction_rep_mult: 1.25,
    factions: [FactionNames.BachmanAssociates],
  }),
  new Augmentation({
    name: AugmentationNames.Neotra,
    repCost: 5.625e5,
    moneyCost: 2.875e9,
    info:
      "A highly-advanced techno-organic drug that is injected into the skeletal " +
      "and integumentary system. The drug permanently modifies the DNA of the " +
      "body's skin and bone cells, granting them the ability to repair " +
      "and restructure themselves.",
    strength_mult: 1.55,
    defense_mult: 1.55,
    factions: [FactionNames.BladeIndustries],
  }),
  new Augmentation({
    name: AugmentationNames.Xanipher,
    repCost: 8.75e5,
    moneyCost: 4.25e9,
    info:
      "A concoction of advanced nanobots that is orally ingested into the " +
      "body. These nanobots induce physiological changes and significantly " +
      "improve the body's functioning in all aspects.",
    hacking_mult: 1.2,
    strength_mult: 1.2,
    defense_mult: 1.2,
    dexterity_mult: 1.2,
    agility_mult: 1.2,
    charisma_mult: 1.2,
    hacking_exp_mult: 1.15,
    strength_exp_mult: 1.15,
    defense_exp_mult: 1.15,
    dexterity_exp_mult: 1.15,
    agility_exp_mult: 1.15,
    charisma_exp_mult: 1.15,
    factions: [FactionNames.NWO],
  }),
  new Augmentation({
    name: AugmentationNames.HydroflameLeftArm,
    repCost: 1.25e6,
    moneyCost: 2.5e12,
    info:
      "The left arm of a legendary BitRunner who ascended beyond this world. " +
      "It projects a light blue energy shield that protects the exposed inner parts. " +
      "Even though it contains no weapons, the advanced tungsten titanium " +
      "alloy increases the user's strength to unbelievable levels. The augmentation " +
      "gets more powerful over time for seemingly no reason.",
    strength_mult: 2.7,
    factions: [FactionNames.NWO],
  }),
  new Augmentation({
    name: AugmentationNames.nextSENS,
    repCost: 4.375e5,
    moneyCost: 1.925e9,
    info:
      "The body is genetically re-engineered to maintain a state " +
      "of negligible senescence, preventing the body from " +
      "deteriorating with age.",
    hacking_mult: 1.2,
    strength_mult: 1.2,
    defense_mult: 1.2,
    dexterity_mult: 1.2,
    agility_mult: 1.2,
    charisma_mult: 1.2,
    factions: [FactionNames.ClarkeIncorporated],
  }),
  new Augmentation({
    name: AugmentationNames.OmniTekInfoLoad,
    repCost: 6.25e5,
    moneyCost: 2.875e9,
    info:
      "OmniTek's data and information repository is uploaded " +
      "into your brain, enhancing your programming and " +
      "hacking abilities.",
    hacking_mult: 1.2,
    hacking_exp_mult: 1.25,
    factions: [FactionNames.OmniTekIncorporated],
  }),
  new Augmentation({
    name: AugmentationNames.PhotosyntheticCells,
    repCost: 5.625e5,
    moneyCost: 2.75e9,
    info:
      "Chloroplasts are added to epidermal stem cells and are applied " +
      "to the body using a skin graft. The result is photosynthetic " +
      "skin cells, allowing users to generate their own energy " +
      "and nutrition using solar power.",
    strength_mult: 1.4,
    defense_mult: 1.4,
    agility_mult: 1.4,
    factions: [FactionNames.KuaiGongInternational],
  }),
  new Augmentation({
    name: AugmentationNames.Neurolink,
    repCost: 8.75e5,
    moneyCost: 4.375e9,
    info:
      "A brain implant that provides a high-bandwidth, direct neural link between your " +
      `mind and the ${FactionNames.BitRunners}' data servers, which reportedly contain ` +
      "the largest database of hacking tools and information in the world.",
    hacking_mult: 1.15,
    hacking_exp_mult: 1.2,
    hacking_chance_mult: 1.1,
    hacking_speed_mult: 1.05,
    programs: [Programs.FTPCrackProgram.name, Programs.RelaySMTPProgram.name],
    factions: [FactionNames.BitRunners],
  }),
  new Augmentation({
    name: AugmentationNames.TheBlackHand,
    repCost: 1e5,
    moneyCost: 5.5e8,
    info:
      "A highly advanced bionic hand. This prosthetic not only " +
      "enhances strength and dexterity but it is also embedded " +
      "with hardware and firmware that lets the user connect to, access, and hack " +
      "devices and machines by just touching them.",
    strength_mult: 1.15,
    dexterity_mult: 1.15,
    hacking_mult: 1.1,
    hacking_speed_mult: 1.02,
    hacking_money_mult: 1.1,
    factions: [FactionNames.TheBlackHand],
  }),
  new Augmentation({
    name: AugmentationNames.CRTX42AA,
    repCost: 4.5e4,
    moneyCost: 2.25e8,
    info:
      "The CRTX42-AA gene is injected into the genome. " +
      "The CRTX42-AA is an artificially-synthesized gene that targets the visual and prefrontal " +
      "cortex and improves cognitive abilities.",
    hacking_mult: 1.08,
    hacking_exp_mult: 1.15,
    factions: [FactionNames.NiteSec],
  }),
  new Augmentation({
    name: AugmentationNames.Neuregen,
    repCost: 3.75e4,
    moneyCost: 3.75e8,
    info:
      "A drug that genetically modifies the neurons in the brain " +
      "resulting in neurons that never die, continuously " +
      "regenerate, and strengthen themselves.",
    hacking_exp_mult: 1.4,
    factions: [FactionNames.Chongqing],
  }),
  new Augmentation({
    name: AugmentationNames.CashRoot,
    repCost: 1.25e4,
    moneyCost: 1.25e8,
    info: (
      <>
        A collection of digital assets saved on a small chip. The chip is implanted into your wrist. A small jack in the
        chip allows you to connect it to a computer and upload the assets.
      </>
    ),
    startingMoney: 1e6,
    programs: [Programs.BruteSSHProgram.name],
    factions: [FactionNames.Sector12],
  }),
  new Augmentation({
    name: AugmentationNames.NutriGen,
    repCost: 6.25e3,
    moneyCost: 2.5e6,
    info:
      "A thermo-powered artificial nutrition generator. Endogenously " +
      "synthesizes glucose, amino acids, and vitamins and redistributes them " +
      "across the body. The device is powered by the body's naturally wasted " +
      "energy in the form of heat.",
    strength_exp_mult: 1.2,
    defense_exp_mult: 1.2,
    dexterity_exp_mult: 1.2,
    agility_exp_mult: 1.2,
    factions: [FactionNames.NewTokyo],
  }),
  new Augmentation({
    name: AugmentationNames.PCMatrix,
    repCost: 100e3,
    moneyCost: 2e9,
    info:
      "A 'Probability Computation Matrix' is installed in the frontal cortex. This implant " +
      "uses advanced mathematical algorithims to rapidly identify and compute statistical " +
      "outcomes of nearly every situation.",
    charisma_mult: 1.0777,
    charisma_exp_mult: 1.0777,
    work_money_mult: 1.777,
    faction_rep_mult: 1.0777,
    company_rep_mult: 1.0777,
    crime_success_mult: 1.0777,
    crime_money_mult: 1.0777,
    programs: [Programs.DeepscanV1.name, Programs.AutoLink.name],
    factions: [FactionNames.Aevum],
  }),
  new Augmentation({
    name: AugmentationNames.INFRARet,
    repCost: 7.5e3,
    moneyCost: 3e7,
    info: "A tiny chip that sits behind the retinae. This implant lets the user visually detect infrared radiation.",
    crime_success_mult: 1.25,
    crime_money_mult: 1.1,
    dexterity_mult: 1.1,
    factions: [FactionNames.Ishima],
  }),
  new Augmentation({
    name: AugmentationNames.DermaForce,
    repCost: 1.5e4,
    moneyCost: 5e7,
    info:
      "Synthetic skin that is grafted onto the body. This skin consists of " +
      "millions of nanobots capable of projecting high-density muon beams, " +
      "creating an energy barrier around the user.",
    defense_mult: 1.4,
    factions: [FactionNames.Volhaven],
  }),
  new Augmentation({
    name: AugmentationNames.GrapheneBrachiBlades,
    repCost: 2.25e5,
    moneyCost: 2.5e9,
    info:
      "An upgrade to the BrachiBlades augmentation. It infuses " +
      "the retractable blades with an advanced graphene material " +
      "making them stronger and lighter.",
    prereqs: [AugmentationNames.BrachiBlades],
    strength_mult: 1.4,
    defense_mult: 1.4,
    crime_success_mult: 1.1,
    crime_money_mult: 1.3,
    factions: [FactionNames.SpeakersForTheDead],
  }),
  new Augmentation({
    name: AugmentationNames.GrapheneBionicArms,
    repCost: 5e5,
    moneyCost: 3.75e9,
    info:
      "An upgrade to the Bionic Arms augmentation. It infuses the " +
      "prosthetic arms with an advanced graphene material " +
      "to make them stronger and lighter.",
    prereqs: [AugmentationNames.BionicArms],
    strength_mult: 1.85,
    dexterity_mult: 1.85,
    factions: [FactionNames.TheDarkArmy],
  }),
  new Augmentation({
    name: AugmentationNames.BrachiBlades,
    repCost: 1.25e4,
    moneyCost: 9e7,
    info: "A set of retractable plasteel blades that are implanted in the arm, underneath the skin.",
    strength_mult: 1.15,
    defense_mult: 1.15,
    crime_success_mult: 1.1,
    crime_money_mult: 1.15,
    factions: [FactionNames.TheSyndicate],
  }),
  new Augmentation({
    name: AugmentationNames.BionicArms,
    repCost: 6.25e4,
    moneyCost: 2.75e8,
    info: "Cybernetic arms created from plasteel and carbon fibers that completely replace the user's organic arms.",
    strength_mult: 1.3,
    dexterity_mult: 1.3,
    factions: [FactionNames.Tetrads],
  }),
  new Augmentation({
    name: AugmentationNames.SNA,
    repCost: 6.25e3,
    moneyCost: 3e7,
    info:
      "A cranial implant that affects the user's personality, making them better " +
      "at negotiation in social situations.",
    work_money_mult: 1.1,
    company_rep_mult: 1.15,
    faction_rep_mult: 1.15,
    factions: [FactionNames.TianDiHui],
  }),
  new Augmentation({
    name: AugmentationNames.NeuroreceptorManager,
    repCost: 0.75e5,
    moneyCost: 5.5e8,
    info:
      "A brain implant carefully assembled around the synapses, which " +
      "micromanages the activity and levels of various neuroreceptor " +
      "chemicals and modulates electrical activity to optimize concentration, " +
      "allowing the user to multitask much more effectively.",
    stats: (
      <>
        This augmentation removes the penalty for not focusing on actions such as working in a job or working for a
        faction.
      </>
    ),
    factions: [FactionNames.TianDiHui],
  }),
];

export const bladeburnerAugmentations = [
  new Augmentation({
    name: AugmentationNames.EsperEyewear,
    repCost: 1.25e3,
    moneyCost: 1.65e8,
    info:
      "Ballistic-grade protective and retractable eyewear that was designed specifically " +
      "for Bladeburner units. This " +
      "is implanted by installing a mechanical frame in the skull's orbit. " +
      "This frame interfaces with the brain and allows the user to " +
      "automatically extrude and extract the eyewear. The eyewear protects " +
      "against debris, shrapnel, lasers, blinding flashes, and gas. It is also " +
      "embedded with a data processing chip that can be programmed to display an " +
      "AR HUD to assist the user in field missions.",
    bladeburner_success_chance_mult: 1.03,
    dexterity_mult: 1.05,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.EMS4Recombination,
    repCost: 2.5e3,
    moneyCost: 2.75e8,
    info:
      "A DNA recombination of the EMS-4 Gene. This genetic engineering " +
      "technique was originally used on Bladeburners during the Synthoid uprising " +
      "to induce wakefulness and concentration, suppress fear, reduce empathy, " +
      "improve reflexes, and improve memory among other things.",
    bladeburner_success_chance_mult: 1.03,
    bladeburner_analysis_mult: 1.05,
    bladeburner_stamina_gain_mult: 1.02,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.OrionShoulder,
    repCost: 6.25e3,
    moneyCost: 5.5e8,
    info:
      "A bionic shoulder augmentation for the right shoulder. Using cybernetics, " +
      "the ORION-MKIV shoulder enhances the strength and dexterity " +
      "of the user's right arm. It also provides protection due to its " +
      "crystallized graphene plating.",
    defense_mult: 1.05,
    strength_mult: 1.05,
    dexterity_mult: 1.05,
    bladeburner_success_chance_mult: 1.04,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.HyperionV1,
    repCost: 1.25e4,
    moneyCost: 2.75e9,
    info:
      "A pair of mini plasma cannons embedded into the hands. The Hyperion is capable " +
      "of rapidly firing bolts of high-density plasma. The weapon is meant to " +
      "be used against augmented enemies as the ionized " +
      "nature of the plasma disrupts the electrical systems of Augmentations. However, " +
      "it can also be effective against non-augmented enemies due to its high temperature " +
      "and concussive force.",
    bladeburner_success_chance_mult: 1.06,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.HyperionV2,
    repCost: 2.5e4,
    moneyCost: 5.5e9,
    info:
      "A pair of mini plasma cannons embedded into the hands. This augmentation " +
      "is more advanced and powerful than the original V1 model. This V2 model is " +
      "more power-efficient, more accurate, and can fire plasma bolts at a much " +
      "higher velocity than the V1 model.",
    prereqs: [AugmentationNames.HyperionV1],
    bladeburner_success_chance_mult: 1.08,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.GolemSerum,
    repCost: 3.125e4,
    moneyCost: 1.1e10,
    info:
      "A serum that permanently enhances many aspects of human capabilities, " +
      "including strength, speed, immune system enhancements, and mitochondrial efficiency. The " +
      "serum was originally developed by the Chinese military in an attempt to " +
      "create super soldiers.",
    strength_mult: 1.07,
    defense_mult: 1.07,
    dexterity_mult: 1.07,
    agility_mult: 1.07,
    bladeburner_stamina_gain_mult: 1.05,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.VangelisVirus,
    repCost: 1.875e4,
    moneyCost: 2.75e9,
    info:
      "A synthetic symbiotic virus that is injected into human brain tissue. The Vangelis virus " +
      "heightens the senses and focus of its host, and also enhances its intuition.",
    dexterity_exp_mult: 1.1,
    bladeburner_analysis_mult: 1.1,
    bladeburner_success_chance_mult: 1.04,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.VangelisVirus3,
    repCost: 3.75e4,
    moneyCost: 1.1e10,
    info:
      "An improved version of Vangelis, a synthetic symbiotic virus that is " +
      "injected into human brain tissue. On top of the benefits of the original " +
      "virus, this also grants an accelerated healing factor and enhanced " +
      "reflexes.",
    prereqs: [AugmentationNames.VangelisVirus],
    defense_exp_mult: 1.1,
    dexterity_exp_mult: 1.1,
    bladeburner_analysis_mult: 1.15,
    bladeburner_success_chance_mult: 1.05,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.INTERLINKED,
    repCost: 2.5e4,
    moneyCost: 5.5e9,
    info:
      "The DNA is genetically modified to enhance the human's body " +
      "extracellular matrix (ECM). This improves the ECM's ability to " +
      "structurally support the body and grants heightened strength and " +
      "durability.",
    strength_exp_mult: 1.05,
    defense_exp_mult: 1.05,
    dexterity_exp_mult: 1.05,
    agility_exp_mult: 1.05,
    bladeburner_max_stamina_mult: 1.1,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.BladeRunner,
    repCost: 2e4,
    moneyCost: 8.25e9,
    info:
      `A cybernetic foot augmentation that was specifically created for ${FactionNames.Bladeburners} ` +
      "during the Synthoid Uprising. The organic musculature of the human foot " +
      "is enhanced with flexible carbon nanotube matrices that are controlled by " +
      "intelligent servo-motors.",
    agility_mult: 1.05,
    bladeburner_max_stamina_mult: 1.05,
    bladeburner_stamina_gain_mult: 1.05,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.BladeArmor,
    repCost: 1.25e4,
    moneyCost: 1.375e9,
    info:
      `A powered exoskeleton suit designed as armor for ${FactionNames.Bladeburners} units. This ` +
      "exoskeleton is incredibly adaptable and can protect the wearer from blunt, piercing, " +
      "concussive, thermal, chemical, and electric trauma. It also enhances the user's " +
      "physical abilities.",
    strength_mult: 1.04,
    defense_mult: 1.04,
    dexterity_mult: 1.04,
    agility_mult: 1.04,
    bladeburner_stamina_gain_mult: 1.02,
    bladeburner_success_chance_mult: 1.03,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.BladeArmorPowerCells,
    repCost: 1.875e4,
    moneyCost: 2.75e9,
    info:
      "Upgrades the BLADE-51b Tesla Armor with Ion Power Cells, which are capable of " +
      "more efficiently storing and using power.",
    prereqs: [AugmentationNames.BladeArmor],
    bladeburner_success_chance_mult: 1.05,
    bladeburner_stamina_gain_mult: 1.02,
    bladeburner_max_stamina_mult: 1.05,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.BladeArmorEnergyShielding,
    repCost: 2.125e4,
    moneyCost: 5.5e9,
    info:
      "Upgrades the BLADE-51b Tesla Armor with a plasma energy propulsion system " +
      "that is capable of projecting an energy shielding force field.",
    prereqs: [AugmentationNames.BladeArmor],
    defense_mult: 1.05,
    bladeburner_success_chance_mult: 1.06,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.BladeArmorUnibeam,
    repCost: 3.125e4,
    moneyCost: 1.65e10,
    info:
      "Upgrades the BLADE-51b Tesla Armor with a concentrated deuterium-fluoride laser " +
      "weapon. It's precision and accuracy makes it useful for quickly neutralizing " +
      "threats while keeping casualties to a minimum.",
    prereqs: [AugmentationNames.BladeArmor],
    bladeburner_success_chance_mult: 1.08,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.BladeArmorOmnibeam,
    repCost: 6.25e4,
    moneyCost: 2.75e10,
    info:
      "Upgrades the BLADE-51b Tesla Armor Unibeam augmentation to use a " +
      "multiple-fiber system. This upgraded weapon uses multiple fiber laser " +
      "modules that combine together to form a single, more powerful beam of up to " +
      "2000MW.",
    prereqs: [AugmentationNames.BladeArmorUnibeam],
    bladeburner_success_chance_mult: 1.1,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.BladeArmorIPU,
    repCost: 1.5e4,
    moneyCost: 1.1e9,
    info:
      "Upgrades the BLADE-51b Tesla Armor with an AI Information Processing " +
      "Unit that was specially designed to analyze Synthoid related data and " +
      "information.",
    prereqs: [AugmentationNames.BladeArmor],
    bladeburner_analysis_mult: 1.15,
    bladeburner_success_chance_mult: 1.02,
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
  new Augmentation({
    name: AugmentationNames.BladesSimulacrum,
    repCost: 1.25e3,
    moneyCost: 1.5e11,
    info:
      "A highly-advanced matter phase-shifter module that is embedded " +
      "in the brainstem and cerebellum. This augmentation allows " +
      "the user to project and control a holographic simulacrum within an " +
      "extremely large radius. These specially-modified holograms were specifically " +
      "weaponized by Bladeburner units to be used against Synthoids.",
    stats: (
      <>
        This augmentation allows you to perform Bladeburner actions and other actions (such as working, commiting
        crimes, etc.) at the same time.
      </>
    ),
    isSpecial: true,
    factions: [FactionNames.Bladeburners],
  }),
];

export const churchOfTheMachineGodAugmentations = [
  new Augmentation({
    name: AugmentationNames.StaneksGift1,
    repCost: 0,
    moneyCost: 0,
    info:
      'Allison "Mother" Stanek imparts you with her gift. An ' +
      "experimental Augmentation implanted at the base of the neck. " +
      "It allows you to overclock your entire system by carefully " +
      "changing the configuration.",
    isSpecial: true,
    hacking_chance_mult: 0.9,
    hacking_speed_mult: 0.9,
    hacking_money_mult: 0.9,
    hacking_grow_mult: 0.9,
    hacking_mult: 0.9,
    strength_mult: 0.9,
    defense_mult: 0.9,
    dexterity_mult: 0.9,
    agility_mult: 0.9,
    charisma_mult: 0.9,
    hacking_exp_mult: 0.9,
    strength_exp_mult: 0.9,
    defense_exp_mult: 0.9,
    dexterity_exp_mult: 0.9,
    agility_exp_mult: 0.9,
    charisma_exp_mult: 0.9,
    company_rep_mult: 0.9,
    faction_rep_mult: 0.9,
    crime_money_mult: 0.9,
    crime_success_mult: 0.9,
    hacknet_node_money_mult: 0.9,
    hacknet_node_purchase_cost_mult: 1.1,
    hacknet_node_ram_cost_mult: 1.1,
    hacknet_node_core_cost_mult: 1.1,
    hacknet_node_level_cost_mult: 1.1,
    work_money_mult: 0.9,
    stats: <>Its unstable nature decreases all your stats by 10%</>,
    factions: [FactionNames.ChurchOfTheMachineGod],
  }),
  new Augmentation({
    name: AugmentationNames.StaneksGift2,
    repCost: 1e6,
    moneyCost: 0,
    info:
      "The next evolution is near, a coming together of man and machine. A synthesis greater than the birth of the human " +
      "organism. Time spent with the gift has allowed for acclimatization of the invasive augment and the toll it takes upon " +
      "your frame granting lesser penalty of 5% to all stats.",
    prereqs: [AugmentationNames.StaneksGift1],
    isSpecial: true,
    hacking_chance_mult: 0.95 / 0.9,
    hacking_speed_mult: 0.95 / 0.9,
    hacking_money_mult: 0.95 / 0.9,
    hacking_grow_mult: 0.95 / 0.9,
    hacking_mult: 0.95 / 0.9,
    strength_mult: 0.95 / 0.9,
    defense_mult: 0.95 / 0.9,
    dexterity_mult: 0.95 / 0.9,
    agility_mult: 0.95 / 0.9,
    charisma_mult: 0.95 / 0.9,
    hacking_exp_mult: 0.95 / 0.9,
    strength_exp_mult: 0.95 / 0.9,
    defense_exp_mult: 0.95 / 0.9,
    dexterity_exp_mult: 0.95 / 0.9,
    agility_exp_mult: 0.95 / 0.9,
    charisma_exp_mult: 0.95 / 0.9,
    company_rep_mult: 0.95 / 0.9,
    faction_rep_mult: 0.95 / 0.9,
    crime_money_mult: 0.95 / 0.9,
    crime_success_mult: 0.95 / 0.9,
    hacknet_node_money_mult: 0.95 / 0.9,
    hacknet_node_purchase_cost_mult: 1.05 / 1.1,
    hacknet_node_ram_cost_mult: 1.05 / 1.1,
    hacknet_node_core_cost_mult: 1.05 / 1.1,
    hacknet_node_level_cost_mult: 1.05 / 1.1,
    work_money_mult: 0.95 / 0.9,
    stats: <>The penalty for the gift is reduced to 5%</>,
    factions: [FactionNames.ChurchOfTheMachineGod],
  }),
  new Augmentation({
    name: AugmentationNames.StaneksGift3,
    repCost: 1e8,
    moneyCost: 0,
    info:
      "The synthesis of human and machine is nothing to fear. It is our destiny. " +
      "You will become greater than the sum of our parts. As One. Embrace your gift " +
      "fully and wholly free of it's accursed toll. Serenity brings tranquility the form " +
      "of no longer suffering a stat penalty. ",
    prereqs: [AugmentationNames.StaneksGift2],
    isSpecial: true,
    hacking_chance_mult: 1 / 0.95,
    hacking_speed_mult: 1 / 0.95,
    hacking_money_mult: 1 / 0.95,
    hacking_grow_mult: 1 / 0.95,
    hacking_mult: 1 / 0.95,
    strength_mult: 1 / 0.95,
    defense_mult: 1 / 0.95,
    dexterity_mult: 1 / 0.95,
    agility_mult: 1 / 0.95,
    charisma_mult: 1 / 0.95,
    hacking_exp_mult: 1 / 0.95,
    strength_exp_mult: 1 / 0.95,
    defense_exp_mult: 1 / 0.95,
    dexterity_exp_mult: 1 / 0.95,
    agility_exp_mult: 1 / 0.95,
    charisma_exp_mult: 1 / 0.95,
    company_rep_mult: 1 / 0.95,
    faction_rep_mult: 1 / 0.95,
    crime_money_mult: 1 / 0.95,
    crime_success_mult: 1 / 0.95,
    hacknet_node_money_mult: 1 / 0.95,
    hacknet_node_purchase_cost_mult: 1 / 1.05,
    hacknet_node_ram_cost_mult: 1 / 1.05,
    hacknet_node_core_cost_mult: 1 / 1.05,
    hacknet_node_level_cost_mult: 1 / 1.05,
    work_money_mult: 1 / 0.95,
    stats: <>Staneks Gift has no penalty.</>,
    factions: [FactionNames.ChurchOfTheMachineGod],
  }),
];

export function getNextNeuroFluxLevel(): number {
  // Get current Neuroflux level based on Player's augmentations
  let currLevel = 0;
  for (let i = 0; i < Player.augmentations.length; ++i) {
    if (Player.augmentations[i].name === AugmentationNames.NeuroFluxGovernor) {
      currLevel = Player.augmentations[i].level;
    }
  }

  // Account for purchased but uninstalled Augmentations
  for (let i = 0; i < Player.queuedAugmentations.length; ++i) {
    if (Player.queuedAugmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
      ++currLevel;
    }
  }
  return currLevel + 1;
}

export function initNeuroFluxGovernor(): Augmentation {
  return new Augmentation({
    name: AugmentationNames.NeuroFluxGovernor,
    repCost: 500,
    moneyCost: 750e3,
    info:
      "A device that is embedded in the back of the neck. The NeuroFlux Governor " +
      "monitors and regulates nervous impulses coming to and from the spinal column, " +
      "essentially 'governing' the body. By doing so, it improves the functionality of the " +
      "body's nervous system.",
    stats: (
      <>
        This special augmentation can be leveled up infinitely. Each level of this augmentation increases MOST
        multipliers by 1%, stacking multiplicatively.
      </>
    ),
    hacking_chance_mult: 1.01,
    hacking_speed_mult: 1.01,
    hacking_money_mult: 1.01,
    hacking_grow_mult: 1.01,
    hacking_mult: 1.01,
    strength_mult: 1.01,
    defense_mult: 1.01,
    dexterity_mult: 1.01,
    agility_mult: 1.01,
    charisma_mult: 1.01,
    hacking_exp_mult: 1.01,
    strength_exp_mult: 1.01,
    defense_exp_mult: 1.01,
    dexterity_exp_mult: 1.01,
    agility_exp_mult: 1.01,
    charisma_exp_mult: 1.01,
    company_rep_mult: 1.01,
    faction_rep_mult: 1.01,
    crime_money_mult: 1.01,
    crime_success_mult: 1.01,
    hacknet_node_money_mult: 1.01,
    hacknet_node_purchase_cost_mult: 0.99,
    hacknet_node_ram_cost_mult: 0.99,
    hacknet_node_core_cost_mult: 0.99,
    hacknet_node_level_cost_mult: 0.99,
    work_money_mult: 1.01,
    factions: Object.values(FactionNames),
  });
}

export function initUnstableCircadianModulator(): Augmentation {
  //Time-Based Augment Test
  const randomBonuses = getRandomBonus();

  const UnstableCircadianModulatorParams: IConstructorParams = {
    name: AugmentationNames.UnstableCircadianModulator,
    moneyCost: 5e9,
    repCost: 3.625e5,
    info:
      "An experimental nanobot injection. Its unstable nature leads to " +
      "unpredictable results based on your circadian rhythm.",
    factions: [FactionNames.SpeakersForTheDead],
  };
  Object.keys(randomBonuses.bonuses).forEach(
    (key) => ((UnstableCircadianModulatorParams as any)[key] = randomBonuses.bonuses[key]),
  );

  return new Augmentation(UnstableCircadianModulatorParams);
}
