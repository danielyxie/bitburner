import { Augmentation } from "./Augmentation";
import { Augmentations } from "./Augmentations";
import { PlayerOwnedAugmentation } from "./PlayerOwnedAugmentation";
import { AugmentationNames } from "./data/AugmentationNames";

import { AugmentationsRoot } from "./ui/Root";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";
import { Factions, factionExists } from "../Faction/Factions";
import { Player } from "../Player";
import { prestigeAugmentation } from "../Prestige";
import { saveObject } from "../SaveObject";
import { Page, routing } from "../ui/navigationTracking";
import { onExport } from "../ExportBonus";

import { dialogBoxCreate } from "../../utils/DialogBox";
import { clearObject } from "../../utils/helpers/clearObject";
import { Money } from "../ui/React/Money";

import { WHRNG } from "../Casino/RNG";

import React from "react";
import ReactDOM from "react-dom";

function AddToAugmentations(aug) {
    var name = aug.name;
    Augmentations[name] = aug;
}

function getRandomBonus() {
    var bonuses = 
    [
        {
            bonuses: {
                hacking_chance_mult: 1.25,
                hacking_speed_mult: 1.10,
                hacking_money_mult: 1.25,
                hacking_grow_mult: 1.1,
            },
            description: "Increases hacking chance by 25%.<br>" +
                         "Increases hacking speed by 10%.<br>" +
                         "Increases money gained from hacking by 25%.<br>" +
                         "Increases the amount of money that can be injected into servers using grow() by 10%.",
        },
        {
            bonuses: {
                hacking_mult: 1.15,
                hacking_exp_mult: 2,
            },
            description: "Increases hacking skill by 15%.<br>" +
                         "Increases hacking experience gain by 100%.",
        },
        {
            bonuses: {
                strength_mult: 1.25,
                strength_exp_mult: 1.5,
                defense_mult: 1.25,
                defense_exp_mult: 1.5,
                dexterity_mult: 1.25,
                dexterity_exp_mult: 1.5,
                agility_mult: 1.25,
                agility_exp_mult: 1.5,
            },
            description: "Increases all combat stats by 25%.<br>" +
                         "Increases all combat stat experience gain by 100%.",
        },
        {
            bonuses: {
                charisma_mult: 1.5,
                charisma_exp_mult: 2,
            },
            description: "This augmentation increases charisma by 50%.<br>" +
                         "Increases charisma experience gain by 100%.",
        },
        {
            bonuses: {
                hacknet_node_money_mult: 1.2,
                hacknet_node_purchase_cost_mult: 0.85,
                hacknet_node_ram_cost_mult: 0.85,
                hacknet_node_core_cost_mult: 0.85,
                hacknet_node_level_cost_mult: 0.85,
            },
            description: "Increases money produced by Hacknet Nodes by 20%.<br>" +
                         "Decreases all costs related to Hacknet Nodes by 15%.",
        },
        {
            bonuses: {
                company_rep_mult: 1.25,
                faction_rep_mult: 1.15,
                work_money_mult: 1.7,
            },
            description: "Increases money gained from working by 70%.<br>" +
                         "Increases reputation gain from companies by 25%.<br>" +
                         "Increases reputation gain from factions by 15%.",
        },
        {
            bonuses: {
                crime_success_mult: 2,
                crime_money_mult: 2,
            },
            description: "Increases crime success rate by 100%.<br>" +
                         "Increases money gained from committing crimes by 100%.",
        },
    ]
    
    const randomNumber = (new WHRNG(Math.floor(Player.lastUpdate/3600000)));
    for(let i = 0; i < 5; i++) randomNumber.step();

    return (bonuses[Math.floor(bonuses.length * randomNumber.random())]);
}

function initAugmentations() {
    for (var name in Factions) {
        if (Factions.hasOwnProperty(name)) {
            Factions[name].augmentations = [];
        }
    }

    //Reset Augmentations
    clearObject(Augmentations);

    //Time-Based Augment Test
    const randomBonuses = getRandomBonus();

    const UnstableCircadianModulator = new Augmentation({
        name:AugmentationNames.UnstableCircadianModulator, moneyCost:5e9, repCost:3.625e5,
        info:"An experimental nanobot injection. Its unstable nature leads to unpredictable results based on your circadian rhythm.<br><br>" +
             "This augmentation:<br>" + randomBonuses.description + "<br><br>For now ...",
    });

    Object.keys(randomBonuses.bonuses).forEach(key => UnstableCircadianModulator.mults[key] = randomBonuses.bonuses[key]);



    UnstableCircadianModulator.addToFactions(["Speakers for the Dead"]);
    if (augmentationExists(AugmentationNames.UnstableCircadianModulator)) {
        delete Augmentations[AugmentationNames.UnstableCircadianModulator];
    }
    AddToAugmentations(UnstableCircadianModulator);

    //Combat stat augmentations
    const HemoRecirculator = new Augmentation({
        name:AugmentationNames.HemoRecirculator, moneyCost:4.5e7, repCost:1e4,
        info:"A heart implant that greatly increases the body's ability to effectively use and pump " +
             "blood.<br><br>" +
             "This augmentation increases all combat stats by 8%.",
        strength_mult: 1.08,
        defense_mult: 1.08,
        agility_mult: 1.08,
        dexterity_mult: 1.08,
    });
    HemoRecirculator.addToFactions(["Tetrads", "The Dark Army", "The Syndicate"]);
    if (augmentationExists(AugmentationNames.HemoRecirculator)) {
        delete Augmentations[AugmentationNames.HemoRecirculator];
    }
    AddToAugmentations(HemoRecirculator);

    const Targeting1 = new Augmentation({
        name:AugmentationNames.Targeting1, moneyCost:1.5e7, repCost:5e3,
        info:"A cranial implant that is embedded within the inner ear structures and optic nerves. It regulates " +
             "and enhances balance and hand-eye coordination.<br><br>" +
             "This augmentation increases dexterity by 10%.",
        dexterity_mult: 1.1,
    });
    Targeting1.addToFactions(["Slum Snakes", "The Dark Army", "The Syndicate", "Sector-12", "Ishima",
                            "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.Targeting1)) {
        delete Augmentations[AugmentationNames.Targeting1];
    }
    AddToAugmentations(Targeting1);

    const Targeting2 = new Augmentation({
        name:AugmentationNames.Targeting2, moneyCost:4.25e7, repCost:8.75e3,
        info:"This upgraded version of the 'Augmented Targeting' implant is capable of augmenting " +
             "reality by digitally displaying weaknesses and vital signs of threats.<br><br>" +
             "This augmentation increases dexterity by 20%.",
        prereqs:[AugmentationNames.Targeting1],
        dexterity_mult: 1.2,
    });
    Targeting2.addToFactions(["The Dark Army", "The Syndicate", "Sector-12",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.Targeting2)) {
        delete Augmentations[AugmentationNames.Targeting2];
    }
    AddToAugmentations(Targeting2);

    const Targeting3 = new Augmentation({
        name:AugmentationNames.Targeting3, moneyCost:1.15e8, repCost:2.75e4,
        info:"The latest version of the 'Augmented Targeting' implant adds the ability to " +
             "lock-on and track threats.<br><br>" +
             "This augmentation increases dexterity by 30%.",
        prereqs:[AugmentationNames.Targeting2],
        dexterity_mult: 1.3,
    });
    Targeting3.addToFactions(["The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant"]);
    if (augmentationExists(AugmentationNames.Targeting3)) {
        delete Augmentations[AugmentationNames.Targeting3];
    }
    AddToAugmentations(Targeting3);

    const SyntheticHeart = new Augmentation({
        name:AugmentationNames.SyntheticHeart, moneyCost:2.875e9, repCost:7.5e5,
        info:"This advanced artificial heart, created from plasteel and graphene, is capable of pumping blood " +
             "more efficiently than an organic heart.<br><br>" +
             "This augmentation increases agility and strength by 50%.",
        agility_mult: 1.5,
        strength_mult: 1.5,
    });
    SyntheticHeart.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                 "NWO", "The Covenant", "Daedalus", "Illuminati"]);
    if (augmentationExists(AugmentationNames.SyntheticHeart)) {
        delete Augmentations[AugmentationNames.SyntheticHeart];
    }
    AddToAugmentations(SyntheticHeart);

    const SynfibrilMuscle = new Augmentation({
        name:AugmentationNames.SynfibrilMuscle, repCost:4.375e5, moneyCost:1.125e9,
        info:"The myofibrils in human muscles are injected with special chemicals that react with the proteins inside " +
             "the myofibrils, altering their underlying structure. The end result is muscles that are stronger and more elastic. " +
             "Scientists have named these artificially enhanced units 'synfibrils'.<br><br>" +
             "This augmentation increases strength and defense by 30%.",
        strength_mult: 1.3,
        defense_mult: 1.3,
    });
    SynfibrilMuscle.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                  "NWO", "The Covenant", "Daedalus", "Illuminati", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.SynfibrilMuscle)) {
        delete Augmentations[AugmentationNames.SynfibrilMuscle];
    }
    AddToAugmentations(SynfibrilMuscle)

    const CombatRib1 = new Augmentation({
        name:AugmentationNames.CombatRib1, repCost:7.5e3, moneyCost:2.375e7,
        info:"The rib cage is augmented to continuously release boosters into the bloodstream " +
             "which increase the oxygen-carrying capacity of blood.<br><br>" +
             "This augmentation increases strength and defense by 10%.",
        strength_mult: 1.1,
        defense_mult: 1.1,
    });
    CombatRib1.addToFactions(["Slum Snakes", "The Dark Army", "The Syndicate", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.CombatRib1)) {
        delete Augmentations[AugmentationNames.CombatRib1];
    }
    AddToAugmentations(CombatRib1);

    const CombatRib2 = new Augmentation({
        name:AugmentationNames.CombatRib2, repCost:1.875e4, moneyCost:6.5e7,
        info:"An upgraded version of the 'Combat Rib' augmentation that adds potent stimulants which " +
             "improve focus and endurance while decreasing reaction time and fatigue.<br><br>" +
             "This augmentation increases strength and defense by 14%.",
        prereqs:[AugmentationNames.CombatRib1],
        strength_mult: 1.14,
        defense_mult: 1.14,
    });
    CombatRib2.addToFactions(["The Dark Army", "The Syndicate", "Volhaven",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.CombatRib2)) {
        delete Augmentations[AugmentationNames.CombatRib2];
    }
    AddToAugmentations(CombatRib2);

    const CombatRib3 = new Augmentation({
        name:AugmentationNames.CombatRib3, repCost:3.5e4, moneyCost:1.2e8,
        info:"The latest version of the 'Combat Rib' augmentation releases advanced anabolic steroids that " +
             "improve muscle mass and physical performance while being safe and free of side effects.<br><br>" +
             "This augmentation increases strength and defense by 18%.",
        prereqs:[AugmentationNames.CombatRib2],
        strength_mult: 1.18,
        defense_mult: 1.18,
    });
    CombatRib3.addToFactions(["The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant"]);
    if (augmentationExists(AugmentationNames.CombatRib3)) {
        delete Augmentations[AugmentationNames.CombatRib3];
    }
    AddToAugmentations(CombatRib3);

    const NanofiberWeave = new Augmentation({
        name:AugmentationNames.NanofiberWeave, repCost:3.75e4, moneyCost:1.25e8,
        info:"Synthetic nanofibers are woven into the skin's extracellular matrix using electrospinning " +
             "which improves its ability to regenerate and protect the body from external stresses and forces.<br><br>" +
             "This augmentation increases strength and defense by 20%.",
        strength_mult: 1.2,
        defense_mult: 1.2,
    });
    NanofiberWeave.addToFactions(["Tian Di Hui", "The Syndicate", "The Dark Army", "Speakers for the Dead",
                                 "Blade Industries", "Fulcrum Secret Technologies", "OmniTek Incorporated"]);
    if (augmentationExists(AugmentationNames.NanofiberWeave)) {
        delete Augmentations[AugmentationNames.NanofiberWeave];
    }
    AddToAugmentations(NanofiberWeave);

    const SubdermalArmor = new Augmentation({
        name:AugmentationNames.SubdermalArmor, repCost:8.75e5, moneyCost:3.25e9,
        info:"The NEMEAN Subdermal Weave is a thin, light-weight, graphene plating that houses a dilatant fluid. " +
             "The material is implanted underneath the skin, and is the most advanced form of defensive enhancement " +
             "that has ever been created. The dilatant fluid, despite being thin and light, is extremely effective " +
             "at stopping piercing blows and reducing blunt trauma. The properties of graphene allow the plating to " +
             "mitigate damage from any fire or electrical traumas.<br><br>" +
             "This augmentation increases defense by 120%.",
        defense_mult: 2.2,
    });
    SubdermalArmor.addToFactions(["The Syndicate", "Fulcrum Secret Technologies", "Illuminati", "Daedalus",
                                 "The Covenant"]);
    if (augmentationExists(AugmentationNames.SubdermalArmor)) {
        delete Augmentations[AugmentationNames.SubdermalArmor];
    }
    AddToAugmentations(SubdermalArmor);

    const WiredReflexes = new Augmentation({
        name:AugmentationNames.WiredReflexes, repCost:1.25e3, moneyCost:2.5e6,
        info:"Synthetic nerve-enhancements are injected into all major parts of the somatic nervous system, " +
             "supercharging the spread of neural signals, increasing reflex speed.<br><br>" +
             "This augmentation increases agility and dexterity by 5%.",
        agility_mult: 1.05,
        dexterity_mult: 1.05,
    });
    WiredReflexes.addToFactions(["Tian Di Hui", "Slum Snakes", "Sector-12", "Volhaven", "Aevum", "Ishima",
                                "The Syndicate", "The Dark Army", "Speakers for the Dead"]);
    if (augmentationExists(AugmentationNames.WiredReflexes)) {
        delete Augmentations[AugmentationNames.WiredReflexes];
    }
    AddToAugmentations(WiredReflexes);

    const GrapheneBoneLacings = new Augmentation({
        name:AugmentationNames.GrapheneBoneLacings, repCost:1.125e6, moneyCost:4.25e9,
         info:"Graphene is grafted and fused into the skeletal structure, significantly increasing " +
             "bone density and tensile strength.<br><br>" +
             "This augmentation increases strength and defense by 70%.",
        strength_mult: 1.7,
        defense_mult: 1.7,
    });
    GrapheneBoneLacings.addToFactions(["Fulcrum Secret Technologies", "The Covenant"]);
    if (augmentationExists(AugmentationNames.GrapheneBoneLacings)) {
        delete Augmentations[AugmentationNames.GrapheneBoneLacings];
    }
    AddToAugmentations(GrapheneBoneLacings);

    const BionicSpine = new Augmentation({
        name:AugmentationNames.BionicSpine, repCost:4.5e4, moneyCost:1.25e8,
        info:"Plasteel and carbon fibers completely replace the organic spine. " +
             "This highly advanced spine is capable of stimulating and regulating " +
             "neural signals passing through the spinal cord, improving senses and reaction speed. " +
             "The 'Bionic Spine' also interfaces with all other 'Bionic' implants.<br><br>" +
             "This augmentation increases all combat stats by 15%.",
        strength_mult: 1.15,
        defense_mult: 1.15,
        agility_mult: 1.15,
        dexterity_mult: 1.15,
    });
    BionicSpine.addToFactions(["Speakers for the Dead", "The Syndicate", "KuaiGong International",
                              "OmniTek Incorporated", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.BionicSpine)) {
        delete Augmentations[AugmentationNames.BionicSpine];
    }
    AddToAugmentations(BionicSpine);

    const GrapheneBionicSpine = new Augmentation({
        name:AugmentationNames.GrapheneBionicSpine, repCost:1.625e6, moneyCost:6e9,
        info:"An upgrade to the 'Bionic Spine' augmentation. The spine is now fused with graphene " +
             "to enhance durability while supercharging all body functions.<br><br>" +
             "This augmentation increases all combat stats by 60%.",
        prereqs:[AugmentationNames.BionicSpine],
        strength_mult: 1.6,
        defense_mult: 1.6,
        agility_mult: 1.6,
        dexterity_mult: 1.6,
    });
    GrapheneBionicSpine.addToFactions(["Fulcrum Secret Technologies", "ECorp"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicSpine)) {
        delete Augmentations[AugmentationNames.GrapheneBionicSpine];
    }
    AddToAugmentations(GrapheneBionicSpine);

    const BionicLegs = new Augmentation({
        name:AugmentationNames.BionicLegs, repCost:1.5e5, moneyCost:3.75e8,
        info:"These cybernetic legs, created from plasteel and carbon fibers, enhance running ability.<br><br>" +
             "This augmentation increases agility by 60%.",
        agility_mult: 1.6,
    });
    BionicLegs.addToFactions(["Speakers for the Dead", "The Syndicate", "KuaiGong International",
                             "OmniTek Incorporated", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.BionicLegs)) {
        delete Augmentations[AugmentationNames.BionicLegs];
    }
    AddToAugmentations(BionicLegs);

    const GrapheneBionicLegs = new Augmentation({
        name:AugmentationNames.GrapheneBionicLegs, repCost:7.5e5, moneyCost:4.5e9,
        info:"An upgrade to the 'Bionic Legs' augmentation. It fuses the implant with an advanced graphene " +
             "material that greatly enhances jumping ability.<br><br>" +
             "This augmentation increases agility by 150%.",
        prereqs: [AugmentationNames.BionicLegs],
        agility_mult: 2.5,
    });
    GrapheneBionicLegs.addToFactions(["MegaCorp", "ECorp", "Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicLegs)) {
        delete Augmentations[AugmentationNames.GrapheneBionicLegs];
    }
    AddToAugmentations(GrapheneBionicLegs);

    // Work stat augmentations
    const SpeechProcessor = new Augmentation({
        name:AugmentationNames.SpeechProcessor, repCost:7.5e3, moneyCost:5e7,
        info:"A cochlear implant with an embedded computer that analyzes incoming speech. " +
             "The embedded computer processes characteristics of incoming speech, such as tone " +
             "and inflection, to pick up on subtle cues and aid in social interactions.<br><br>" +
             "This augmentation increases charisma by 20%.",
        charisma_mult: 1.2,
    });
    SpeechProcessor.addToFactions(["Tian Di Hui", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                  "Ishima", "Volhaven", "Silhouette"]);
    if (augmentationExists(AugmentationNames.SpeechProcessor)) {
        delete Augmentations[AugmentationNames.SpeechProcessor];
    }
    AddToAugmentations(SpeechProcessor);

    const TITN41Injection = new Augmentation({
        name:AugmentationNames.TITN41Injection, repCost:2.5e4, moneyCost:1.9e8,
        info:"TITN is a series of viruses that target and alter genes in human DNA that " +
             "control personality. The TITN-41 strain alters these genes so that the subject becomes more " +
             "outgoing and socialable.<br><br>" +
             "This augmentation increases charisma and charisma experience gain by 15%.",
        charisma_mult: 1.15,
        charisma_exp_mult: 1.15,
    });
    TITN41Injection.addToFactions(["Silhouette"]);
    if (augmentationExists(AugmentationNames.TITN41Injection)) {
        delete Augmentations[AugmentationNames.TITN41Injection];
    }
    AddToAugmentations(TITN41Injection);

    const EnhancedSocialInteractionImplant = new Augmentation({
        name:AugmentationNames.EnhancedSocialInteractionImplant, repCost:3.75e5, moneyCost:1.375e9,
        info:"A cranial implant that greatly assists with the ability to analyze social situations " +
             "and interactions. The system uses a wide variety of factors such as facial expressions, body " +
             "language, voice tone, and inflection to determine the best course of action during social" +
             "situations. The implant also uses deep learning software to continuously learn new behavior" +
             "patterns and how to best respond.<br><br>" +
             "This augmentation increases charisma and charisma experience gain by 60%.",
        charisma_mult: 1.6,
        charisma_exp_mult: 1.6,
    });
    EnhancedSocialInteractionImplant.addToFactions(["Bachman & Associates", "NWO", "Clarke Incorporated",
                                                   "OmniTek Incorporated", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.EnhancedSocialInteractionImplant)) {
        delete Augmentations[AugmentationNames.EnhancedSocialInteractionImplant];
    }
    AddToAugmentations(EnhancedSocialInteractionImplant);

    // Hacking augmentations
    const BitWire = new Augmentation({
        name:AugmentationNames.BitWire, repCost:3.75e3, moneyCost:1e7,
        info: "A small brain implant embedded in the cerebrum. This regulates and improves the brain's computing " +
              "capabilities.<br><br>" +
              "This augmentation increases hacking skill by 5%.",
        hacking_mult: 1.05,
    });
    BitWire.addToFactions(["CyberSec", "NiteSec"]);
    if (augmentationExists(AugmentationNames.BitWire)) {
        delete Augmentations[AugmentationNames.BitWire];
    }
    AddToAugmentations(BitWire);

    const ArtificialBioNeuralNetwork = new Augmentation({
        name:AugmentationNames.ArtificialBioNeuralNetwork, repCost:2.75e5, moneyCost:3e9,
        info:"A network consisting of millions of nanoprocessors is embedded into the brain. " +
             "The network is meant to mimic the way a biological brain solves a problem, with each " +
             "nanoprocessor acting similar to the way a neuron would in a neural network. However, these " +
             "nanoprocessors are programmed to perform computations much faster than organic neurons, " +
             "allowing the user to solve much more complex problems at a much faster rate.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 3%.<br>" +
             "Increases money gained from hacking by 15%.<br>" +
             "Increases hacking skill by 12%.",
        hacking_speed_mult: 1.03,
        hacking_money_mult: 1.15,
        hacking_mult: 1.12,
    });
    ArtificialBioNeuralNetwork.addToFactions(["BitRunners", "Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.ArtificialBioNeuralNetwork)) {
        delete Augmentations[AugmentationNames.ArtificialBioNeuralNetwork];
    }
    AddToAugmentations(ArtificialBioNeuralNetwork);

    const ArtificialSynapticPotentiation = new Augmentation({
        name:AugmentationNames.ArtificialSynapticPotentiation, repCost:6.25e3, moneyCost:8e7,
        info:"The body is injected with a chemical that artificially induces synaptic potentiation, " +
             "otherwise known as the strengthening of synapses. This results in enhanced cognitive abilities.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 2%.<br>" +
             "Increases hacking chance by 5%.<br>" +
             "Increases hacking experience gain by 5%.",
        hacking_speed_mult: 1.02,
        hacking_chance_mult: 1.05,
        hacking_exp_mult: 1.05,
    });
    ArtificialSynapticPotentiation.addToFactions(["The Black Hand", "NiteSec"]);
    if (augmentationExists(AugmentationNames.ArtificialSynapticPotentiation)) {
        delete Augmentations[AugmentationNames.ArtificialSynapticPotentiation];
    }
    AddToAugmentations(ArtificialSynapticPotentiation);

    const EnhancedMyelinSheathing = new Augmentation({
        name:AugmentationNames.EnhancedMyelinSheathing, repCost:1e5, moneyCost:1.375e9,
        info:"Electrical signals are used to induce a new, artificial form of myelinogenesis in the human body. " +
             "This process results in the proliferation of new, synthetic myelin sheaths in the nervous " +
             "system. These myelin sheaths can propogate neuro-signals much faster than their organic " +
             "counterparts, leading to greater processing speeds and better brain function.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 3%.<br>" +
             "Increases hacking skill by 8%.<br>" +
             "Increases hacking experience gain by 10%.",
        hacking_speed_mult: 1.03,
        hacking_exp_mult: 1.1,
        hacking_mult: 1.08,
    });
    EnhancedMyelinSheathing.addToFactions(["Fulcrum Secret Technologies", "BitRunners", "The Black Hand"]);
    if (augmentationExists(AugmentationNames.EnhancedMyelinSheathing)) {
        delete Augmentations[AugmentationNames.EnhancedMyelinSheathing];
    }
    AddToAugmentations(EnhancedMyelinSheathing);

    const SynapticEnhancement = new Augmentation({
        name:AugmentationNames.SynapticEnhancement, repCost:2e3, moneyCost:7.5e6,
        info:"A small cranial implant that continuously uses weak electrical signals to stimulate the brain and " +
             "induce stronger synaptic activity. This improves the user's cognitive abilities.<br><br>" +
             "This augmentation increases hacking speed by 3%.",
        hacking_speed_mult: 1.03,
    });
    SynapticEnhancement.addToFactions(["CyberSec", "Aevum"]);
    if (augmentationExists(AugmentationNames.SynapticEnhancement)) {
        delete Augmentations[AugmentationNames.SynapticEnhancement];
    }
    AddToAugmentations(SynapticEnhancement);

    const NeuralRetentionEnhancement = new Augmentation({
        name:AugmentationNames.NeuralRetentionEnhancement, repCost:2e4, moneyCost:2.5e8,
        info:"Chemical injections are used to permanently alter and strengthen the brain's neuronal " +
             "circuits, strengthening the ability to retain information.<br><br>" +
             "This augmentation increases hacking experience gain by 25%.",
        hacking_exp_mult: 1.25,
    });
    NeuralRetentionEnhancement.addToFactions(["NiteSec"]);
    if (augmentationExists(AugmentationNames.NeuralRetentionEnhancement)) {
        delete Augmentations[AugmentationNames.NeuralRetentionEnhancement];
    }
    AddToAugmentations(NeuralRetentionEnhancement);

    const DataJack = new Augmentation({
        name:AugmentationNames.DataJack, repCost:1.125e5, moneyCost:4.5e8,
        info:"A brain implant that provides an interface for direct, wireless communication between a computer's main " +
             "memory and the mind. This implant allows the user to not only access a computer's memory, but also alter " +
             "and delete it.<br><br>" +
             "This augmentation increases money gained from hacking by 25%.",
        hacking_money_mult: 1.25,
    });
    DataJack.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "Chongqing", "New Tokyo"]);
    if (augmentationExists(AugmentationNames.DataJack)) {
        delete Augmentations[AugmentationNames.DataJack];
    }
    AddToAugmentations(DataJack);

    const ENM = new Augmentation({
        name:AugmentationNames.ENM, repCost:1.5e4, moneyCost:2.5e8,
        info:"A thin device embedded inside the arm containing a wireless module capable of connecting, " +
             "capturing, and processing all traffic on any network it connects with. " +
             "By itself, the Embedded Netburner Module does not do much, but a variety of powerful upgrades" +
             "can be installed that enhance its ability to control traffic on the network.<br><br>" +
             "This augmentation increases hacking skill by 8%.",
        hacking_mult: 1.08,
    });
    ENM.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp",
                      "Fulcrum Secret Technologies", "NWO", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.ENM)) {
        delete Augmentations[AugmentationNames.ENM];
    }
    AddToAugmentations(ENM);

    const ENMCore = new Augmentation({
        name:AugmentationNames.ENMCore, repCost:2.5e5, moneyCost:2.5e9,
        info:"The Core library is an implant that upgrades the firmware of the Embedded Netburner Module. " +
             "This upgrade allows the Embedded Netburner Module to generate its own data on a network.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 3%.<br>" +
             "Increases money gained from hacking by 10%.<br>" +
             "Increases hacking success chance by 3%.<br>" +
             "Increases hacking experience gain by 7%.<br>" +
             "Increases hacking skill by 7%.",
        prereqs:[AugmentationNames.ENM],
        hacking_speed_mult: 1.03,
        hacking_money_mult: 1.1,
        hacking_chance_mult: 1.03,
        hacking_exp_mult: 1.07,
        hacking_mult: 1.07,
    });
    ENMCore.addToFactions(["BitRunners", "The Black Hand", "ECorp", "MegaCorp",
                          "Fulcrum Secret Technologies", "NWO", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.ENMCore)) {
        delete Augmentations[AugmentationNames.ENMCore];
    }
    AddToAugmentations(ENMCore);

    const ENMCoreV2 = new Augmentation({
        name:AugmentationNames.ENMCoreV2, repCost:1e6, moneyCost:4.5e9,
        info:"The Core V2 library is an implant that upgrades the firmware of the Embedded Netburner Module. " +
             "This upgraded firmware allows the Embedded Netburner Module to control information on " +
             "a network by re-routing traffic, spoofing IP addresses, and altering the data inside network " +
             "packets.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 5%.<br>" +
             "Increases money gained from hacking by 30%.<br>" +
             "Increases hacking success chance by 5%.<br>" +
             "Increases hacking experience gain by 15%.<br>" +
             "Increases hacking skill by 8%.",
        prereqs:[AugmentationNames.ENMCore],
        hacking_speed_mult: 1.05,
        hacking_money_mult: 1.3,
        hacking_chance_mult: 1.05,
        hacking_exp_mult: 1.15,
        hacking_mult: 1.08,
    });
    ENMCoreV2.addToFactions(["BitRunners", "ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                            "Blade Industries", "OmniTek Incorporated", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.ENMCoreV2)) {
        delete Augmentations[AugmentationNames.ENMCoreV2];
    }
    AddToAugmentations(ENMCoreV2);

    const ENMCoreV3 = new Augmentation({
        name:AugmentationNames.ENMCoreV3, repCost:1.75e6, moneyCost:7.5e9,
        info:"The Core V3 library is an implant that upgrades the firmware of the Embedded Netburner Module. " +
             "This upgraded firmware allows the Embedded Netburner Module to seamlessly inject code into " +
             "any device on a network.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 5%.<br>" +
             "Increases money gained from hacking by 40%.<br>" +
             "Increases hacking success chance by 10%.<br>" +
             "Increases hacking experience gain by 25%.<br>" +
             "Increases hacking skill by 10%.",
        prereqs:[AugmentationNames.ENMCoreV2],
        hacking_speed_mult: 1.05,
        hacking_money_mult: 1.4,
        hacking_chance_mult: 1.1,
        hacking_exp_mult: 1.25,
        hacking_mult: 1.1,
    });
    ENMCoreV3.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                            "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMCoreV3)) {
        delete Augmentations[AugmentationNames.ENMCoreV3];
    }
    AddToAugmentations(ENMCoreV3);

    const ENMAnalyzeEngine = new Augmentation({
        name:AugmentationNames.ENMAnalyzeEngine, repCost:6.25e5, moneyCost:6e9,
        info:"Installs the Analyze Engine for the Embedded Netburner Module, which is a CPU cluster " +
             "that vastly outperforms the Netburner Module's native single-core processor.<br><br>" +
             "This augmentation increases hacking speed by 10%.",
        prereqs:[AugmentationNames.ENM],
        hacking_speed_mult: 1.1,
    });
    ENMAnalyzeEngine.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                                   "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMAnalyzeEngine)) {
        delete Augmentations[AugmentationNames.ENMAnalyzeEngine];
    }
    AddToAugmentations(ENMAnalyzeEngine);

    const ENMDMA = new Augmentation({
        name:AugmentationNames.ENMDMA, repCost:1e6, moneyCost:7e9,
        info:"This implant installs a Direct Memory Access (DMA) controller into the " +
             "Embedded Netburner Module. This allows the Module to send and receive data " +
             "directly to and from the main memory of devices on a network.<br><br>" +
             "This augmentation:<br>" +
             "Increases money gained from hacking by 40%.<br>"  +
             "Increases hacking success chance by 20%.",
        prereqs:[AugmentationNames.ENM],
        hacking_money_mult: 1.4,
        hacking_chance_mult: 1.2,
    });
    ENMDMA.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                         "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMDMA)) {
        delete Augmentations[AugmentationNames.ENMDMA];
    }
    AddToAugmentations(ENMDMA);

    const Neuralstimulator = new Augmentation({
        name:AugmentationNames.Neuralstimulator, repCost:5e4, moneyCost:3e9,
        info:"A cranial implant that intelligently stimulates certain areas of the brain " +
             "in order to improve cognitive functions.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 2%.<br>" +
             "Increases hacking success chance by 10%.<br>" +
             "Increases hacking experience gain by 12%.",
        hacking_speed_mult: 1.02,
        hacking_chance_mult: 1.1,
        hacking_exp_mult: 1.12,
    });
    Neuralstimulator.addToFactions(["The Black Hand", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                   "Ishima", "Volhaven", "Bachman & Associates", "Clarke Incorporated",
                                   "Four Sigma"]);
    if (augmentationExists(AugmentationNames.Neuralstimulator)) {
        delete Augmentations[AugmentationNames.Neuralstimulator];
    }
    AddToAugmentations(Neuralstimulator);

    const NeuralAccelerator = new Augmentation({
        name:AugmentationNames.NeuralAccelerator, repCost:2e5, moneyCost:1.75e9,
        info:"A microprocessor that accelerates the processing " +
             "speed of biological neural networks. This is a cranial implant that is embedded inside the brain.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking skill by 10%.<br>" +
             "Increases hacking experience gain by 15%.<br>" +
             "Increases money gained from hacking by 20%.",
        hacking_mult: 1.1,
        hacking_exp_mult: 1.15,
        hacking_money_mult: 1.2,
    });
    NeuralAccelerator.addToFactions(["BitRunners"]);
    if (augmentationExists(AugmentationNames.NeuralAccelerator)) {
        delete Augmentations[AugmentationNames.NeuralAccelerator];
    }
    AddToAugmentations(NeuralAccelerator);

    const CranialSignalProcessorsG1 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG1, repCost:1e4, moneyCost:7e7,
        info:"The first generation of Cranial Signal Processors. Cranial Signal Processors " +
             "are a set of specialized microprocessors that are attached to " +
             "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
             "so that the brain doesn't have to.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 1%.<br>" +
             "Increases hacking skill by 5%.",
        hacking_speed_mult: 1.01,
        hacking_mult: 1.05,
    });
    CranialSignalProcessorsG1.addToFactions(["CyberSec"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG1)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG1];
    }
    AddToAugmentations(CranialSignalProcessorsG1);

    const CranialSignalProcessorsG2 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG2, repCost:1.875e4, moneyCost:1.25e8,
        info:"The second generation of Cranial Signal Processors. Cranial Signal Processors " +
            "are a set of specialized microprocessors that are attached to " +
            "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
            "so that the brain doesn't have to.<br><br>" +
            "This augmentation:<br>" +
            "Increases hacking speed by 2%.<br>" +
            "Increases hacking success chance by 5%.<br>" +
            "Increases hacking skill by 7%.",
	    prereqs:[AugmentationNames.CranialSignalProcessorsG1],
        hacking_speed_mult: 1.02,
        hacking_chance_mult: 1.05,
        hacking_mult: 1.07,
    });
    CranialSignalProcessorsG2.addToFactions(["CyberSec", "NiteSec"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG2)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG2];
    }
    AddToAugmentations(CranialSignalProcessorsG2);

    const CranialSignalProcessorsG3 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG3, repCost:5e4, moneyCost:5.5e8,
        info:"The third generation of Cranial Signal Processors. Cranial Signal Processors " +
             "are a set of specialized microprocessors that are attached to " +
             "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
             "so that the brain doesn't have to.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 2%.<br>" +
             "Increases money gained from hacking by 15%.<br>" +
             "Increases hacking skill by 9%.",
	    prereqs:[AugmentationNames.CranialSignalProcessorsG2],
        hacking_speed_mult: 1.02,
        hacking_money_mult: 1.15,
        hacking_mult: 1.09,
    });
    CranialSignalProcessorsG3.addToFactions(["NiteSec", "The Black Hand", "BitRunners"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG3)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG3];
    }
    AddToAugmentations(CranialSignalProcessorsG3);

    const CranialSignalProcessorsG4 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG4, repCost:1.25e5, moneyCost:1.1e9,
        info:"The fourth generation of Cranial Signal Processors. Cranial Signal Processors " +
             "are a set of specialized microprocessors that are attached to " +
             "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
             "so that the brain doesn't have to.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking speed by 2%.<br>" +
             "Increases money gained from hacking by 20%.<br>" +
             "Increases the amount of money that can be injected into servers using grow() by 25%.",
	    prereqs:[AugmentationNames.CranialSignalProcessorsG3],
        hacking_speed_mult: 1.02,
        hacking_money_mult: 1.2,
        hacking_grow_mult: 1.25,
    });
    CranialSignalProcessorsG4.addToFactions(["The Black Hand", "BitRunners"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG4)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG4];
    }
    AddToAugmentations(CranialSignalProcessorsG4);

    const CranialSignalProcessorsG5 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG5, repCost:2.5e5, moneyCost:2.25e9,
        info:"The fifth generation of Cranial Signal Processors. Cranial Signal Processors " +
             "are a set of specialized microprocessors that are attached to " +
             "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
             "so that the brain doesn't have to.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking skill by 30%.<br>" +
             "Increases money gained from hacking by 25%.<br>" +
             "Increases the amount of money that can be injected into servers using grow() by 75%.",
	    prereqs:[AugmentationNames.CranialSignalProcessorsG4],
        hacking_mult: 1.3,
        hacking_money_mult: 1.25,
        hacking_grow_mult: 1.75,
    });
    CranialSignalProcessorsG5.addToFactions(["BitRunners"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG5)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG5];
    }
    AddToAugmentations(CranialSignalProcessorsG5);

    const NeuronalDensification = new Augmentation({
        name:AugmentationNames.NeuronalDensification, repCost:1.875e5, moneyCost:1.375e9,
        info:"The brain is surgically re-engineered to have increased neuronal density " +
             "by decreasing the neuron gap junction. Then, the body is genetically modified " +
             "to enhance the production and capabilities of its neural stem cells.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking skill by 15%.<br>" +
             "Increases hacking experience gain by 10%.<br>"+
             "Increases hacking speed by 3%.",
        hacking_mult: 1.15,
        hacking_exp_mult: 1.1,
        hacking_speed_mult: 1.03,
    });
    NeuronalDensification.addToFactions(["Clarke Incorporated"]);
    if (augmentationExists(AugmentationNames.NeuronalDensification)) {
        delete Augmentations[AugmentationNames.NeuronalDensification];
    }
    AddToAugmentations(NeuronalDensification);

    // Work Augmentations
    const NuoptimalInjectorImplant = new Augmentation({
        name:AugmentationNames.NuoptimalInjectorImplant, repCost:5e3, moneyCost:2e7,
        info:"This torso implant automatically injects nootropic supplements into " +
             "the bloodstream to improve memory, increase focus, and provide other " +
             "cognitive enhancements.<br><br>" +
             "This augmentation increases reputation gain from companies by 20%.",
        company_rep_mult: 1.2,
    });
    NuoptimalInjectorImplant.addToFactions(["Tian Di Hui", "Volhaven", "New Tokyo", "Chongqing",
                                           "Clarke Incorporated", "Four Sigma", "Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.NuoptimalInjectorImplant)) {
        delete Augmentations[AugmentationNames.NuoptimalInjectorImplant];
    }
    AddToAugmentations(NuoptimalInjectorImplant);

    const SpeechEnhancement = new Augmentation({
        name:AugmentationNames.SpeechEnhancement, repCost:2.5e3, moneyCost:1.25e7,
        info:"An advanced neural implant that improves speaking ability, convincibility, " +
             "and likability in social interactions.<br><br> " +
             "This augmentation:<br>" +
             "Increases charisma by 10%.<br>" +
             "Increases reputation gain from companies by 10%.",
        company_rep_mult: 1.1,
        charisma_mult: 1.1,
    });
    SpeechEnhancement.addToFactions(["Tian Di Hui", "Speakers for the Dead", "Four Sigma", "KuaiGong International",
                                    "Clarke Incorporated", "Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.SpeechEnhancement)) {
        delete Augmentations[AugmentationNames.SpeechEnhancement];
    }
    AddToAugmentations(SpeechEnhancement);

    const FocusWire = new Augmentation({
        name:AugmentationNames.FocusWire, repCost:7.5e4, moneyCost:9e8,
        info:"A cranial implant that stops procrastination by blocking specific neural pathways " +
             "in the brain.<br><br>" +
             "This augmentation:<br>" +
             "Increases all experience gained by 5%.<br>" +
             "Increases money gained from working by 20%.<br>" +
             "Increases reputation gain from companies by 10%.",
        hacking_exp_mult: 1.05,
        strength_exp_mult: 1.05,
        defense_exp_mult: 1.05,
        dexterity_exp_mult: 1.05,
        agility_exp_mult: 1.05,
        charisma_exp_mult: 1.05,
        company_rep_mult: 1.1,
        work_money_mult: 1.2,
    });
    FocusWire.addToFactions(["Bachman & Associates", "Clarke Incorporated", "Four Sigma", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.FocusWire)) {
        delete Augmentations[AugmentationNames.FocusWire];
    }
    AddToAugmentations(FocusWire)

    const PCDNI = new Augmentation({
        name:AugmentationNames.PCDNI, repCost:3.75e5, moneyCost:3.75e9,
        info:"Installs a Direct-Neural Interface jack into the arm that is compatible with most " +
             "computers. Connecting to a computer through this jack allows you to interface with " +
             "it using the brain's electrochemical signals.<br><br>" +
             "This augmentation:<br>" +
             "Increases reputation gain from companies by 30%.<br>" +
             "Increases hacking skill by 8%.",
        company_rep_mult: 1.3,
        hacking_mult: 1.08,
    });
    PCDNI.addToFactions(["Four Sigma", "OmniTek Incorporated", "ECorp", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.PCDNI)) {
        delete Augmentations[AugmentationNames.PCDNI];
    }
    AddToAugmentations(PCDNI);

    const PCDNIOptimizer = new Augmentation({
        name:AugmentationNames.PCDNIOptimizer, repCost:5e5, moneyCost:4.5e9,
        info:"This is a submodule upgrade to the PC Direct-Neural Interface augmentation. It " +
             "improves the performance of the interface and gives the user more control options " +
             "to a connected computer.<br><br>" +
             "This augmentation:<br>" +
             "Increases reputation gain from companies by 75%.<br>" +
             "Increases hacking skill by 10%.",
        prereqs:[AugmentationNames.PCDNI],
        company_rep_mult: 1.75,
        hacking_mult: 1.1,
    });
    PCDNIOptimizer.addToFactions(["Fulcrum Secret Technologies", "ECorp", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.PCDNIOptimizer)) {
        delete Augmentations[AugmentationNames.PCDNIOptimizer];
    }
    AddToAugmentations(PCDNIOptimizer);

    const PCDNINeuralNetwork = new Augmentation({
        name:AugmentationNames.PCDNINeuralNetwork, repCost:1.5e6, moneyCost:7.5e9,
        info:"This is an additional installation that upgrades the functionality of the " +
             "PC Direct-Neural Interface augmentation. When connected to a computer, " +
             "The Neural Network upgrade allows the user to use their own brain's " +
             "processing power to aid the computer in computational tasks.<br><br>" +
             "This augmentation:<br>" +
             "Increases reputation gain from companies by 100%.<br>" +
             "Increases hacking skill by 10%.<br>" +
             "Increases hacking speed by 5%.",
        prereqs:[AugmentationNames.PCDNI],
        company_rep_mult: 2,
        hacking_mult: 1.1,
        hacking_speed_mult: 1.05,
    });
    PCDNINeuralNetwork.addToFactions(["Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.PCDNINeuralNetwork)) {
        delete Augmentations[AugmentationNames.PCDNINeuralNetwork];
    }
    AddToAugmentations(PCDNINeuralNetwork);

    const ADRPheromone1 = new Augmentation({
        name:AugmentationNames.ADRPheromone1, repCost:3.75e3, moneyCost:1.75e7,
        info:"The body is genetically re-engineered so that it produces the ADR-V1 pheromone, " +
             "an artificial pheromone discovered by scientists. The ADR-V1 pheromone, when excreted, " +
             "triggers feelings of admiration and approval in other people.<br><br>" +
             "This augmentation increases reputation gain from factions and companies by 10%.",
        company_rep_mult: 1.1,
        faction_rep_mult: 1.1,
    });
    ADRPheromone1.addToFactions(["Tian Di Hui", "The Syndicate", "NWO", "MegaCorp", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.ADRPheromone1)) {
        delete Augmentations[AugmentationNames.ADRPheromone1];
    }
    AddToAugmentations(ADRPheromone1);

    const ADRPheromone2 = new Augmentation({
        name:AugmentationNames.ADRPheromone2, repCost:6.25e4, moneyCost:5.5e8,
        info:"The body is genetically re-engineered so that it produces the ADR-V2 pheromone, " +
             "which is similar to but more potent than ADR-V1. This pheromone, when excreted, " +
             "triggers feelings of admiration, approval, and respect in others.<br><br>" +
             "This augmentation increases reputation gain from factions and companies by 20%.",
        company_rep_mult: 1.2,
        faction_rep_mult: 1.2,
    });
    ADRPheromone2.addToFactions(["Silhouette", "Four Sigma", "Bachman & Associates", "Clarke Incorporated"]);
    if (augmentationExists(AugmentationNames.ADRPheromone2)) {
        delete Augmentations[AugmentationNames.ADRPheromone2];
    }
    AddToAugmentations(ADRPheromone2);

    const ShadowsSimulacrum = new Augmentation({
        name: AugmentationNames.ShadowsSimulacrum, repCost:3.75e4, moneyCost:4e8,
        info: "A crude but functional matter phase-shifter module that is embedded " +
              "in the brainstem and cerebellum. This augmentation was developed by " +
              "criminal organizations and allows the user to project and control holographic " +
              "simulacrums within a large radius. These simulacrums are commonly used for " +
              "espionage and surveillance work.<br><br>" +
              "This augmentation increases reputation gain from factions and companies by 15%.",
        company_rep_mult: 1.15,
        faction_rep_mult: 1.15,
    });
    ShadowsSimulacrum.addToFactions(["The Syndicate", "The Dark Army", "Speakers for the Dead"]);
    if (augmentationExists(AugmentationNames.ShadowsSimulacrum)) {
        delete Augmentations[AugmentationNames.ShadowsSimulacrum];
    }
    AddToAugmentations(ShadowsSimulacrum);

    // HacknetNode Augmentations
    const HacknetNodeCPUUpload = new Augmentation({
        name:AugmentationNames.HacknetNodeCPUUpload, repCost:3.75e3, moneyCost:1.1e7,
        info:"Uploads the architecture and design details of a Hacknet Node's CPU into " +
             "the brain. This allows the user to engineer custom hardware and software  " +
             "for the Hacknet Node that provides better performance.<br><br>" +
             "This augmentation:<br>" +
             "Increases money produced by Hacknet Nodes by 15%.<br>" +
             "Decreases the cost of purchasing a Hacknet Node by 15%.",
         hacknet_node_money_mult: 1.15,
         hacknet_node_purchase_cost_mult: 0.85,
    });
    HacknetNodeCPUUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCPUUpload)) {
        delete Augmentations[AugmentationNames.HacknetNodeCPUUpload];
    }
    AddToAugmentations(HacknetNodeCPUUpload);

    const HacknetNodeCacheUpload = new Augmentation({
        name:AugmentationNames.HacknetNodeCacheUpload, repCost:2.5e3, moneyCost:5.5e6,
        info:"Uploads the architecture and design details of a Hacknet Node's main-memory cache " +
             "into the brain. This allows the user to engineer custom cache hardware for the  " +
             "Hacknet Node that offers better performance.<br><br>" +
             "This augmentation:<br> " +
             "Increases money produced by Hacknet Nodes by 10%.<br>" +
             "Decreases the cost of leveling up a Hacknet Node by 15%.",
        hacknet_node_money_mult: 1.10,
        hacknet_node_level_cost_mult: 0.85,
    });
    HacknetNodeCacheUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCacheUpload)) {
        delete Augmentations[AugmentationNames.HacknetNodeCacheUpload];
    }
    AddToAugmentations(HacknetNodeCacheUpload);

    const HacknetNodeNICUpload = new Augmentation({
        name:AugmentationNames.HacknetNodeNICUpload, repCost:1.875e3, moneyCost:4.5e6,
        info:"Uploads the architecture and design details of a Hacknet Node's Network Interface Card (NIC) " +
             "into the brain. This allows the user to engineer a custom NIC for the Hacknet Node that " +
             "offers better performance.<br><br>" +
             "This augmentation:<br>" +
             "Increases money produced by Hacknet Nodes by 10%.<br>" +
             "Decreases the cost of purchasing a Hacknet Node by 10%.",
        hacknet_node_money_mult: 1.1,
        hacknet_node_purchase_cost_mult: 0.9,
    });
    HacknetNodeNICUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeNICUpload)) {
        delete Augmentations[AugmentationNames.HacknetNodeNICUpload];
    }
    AddToAugmentations(HacknetNodeNICUpload);

    const HacknetNodeKernelDNI = new Augmentation({
        name:AugmentationNames.HacknetNodeKernelDNI, repCost:7.5e3, moneyCost:4e7,
        info:"Installs a Direct-Neural Interface jack into the arm that is capable of connecting to a " +
             "Hacknet Node. This lets the user access and manipulate the Node's kernel using " +
             "electrochemical signals.<br><br>" +
             "This augmentation increases money produced by Hacknet Nodes by 25%.",
        hacknet_node_money_mult: 1.25,
    });
    HacknetNodeKernelDNI.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeKernelDNI)) {
        delete Augmentations[AugmentationNames.HacknetNodeKernelDNI];
    }
    AddToAugmentations(HacknetNodeKernelDNI);

    const HacknetNodeCoreDNI = new Augmentation({
        name:AugmentationNames.HacknetNodeCoreDNI, repCost:1.25e4, moneyCost:6e7,
        info:"Installs a Direct-Neural Interface jack into the arm that is capable of connecting " +
             "to a Hacknet Node. This lets the user access and manipulate the Node's processing logic using " +
             "electrochemical signals.<br><br>" +
             "This augmentation increases money produced by Hacknet Nodes by 45%.",
        hacknet_node_money_mult: 1.45,
    });
    HacknetNodeCoreDNI.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCoreDNI)) {
        delete Augmentations[AugmentationNames.HacknetNodeCoreDNI];
    }
    AddToAugmentations(HacknetNodeCoreDNI);

    //Misc/Hybrid augmentations
    const NeuroFluxGovernor = new Augmentation({
        name:AugmentationNames.NeuroFluxGovernor, repCost:1.25e3, moneyCost:3.75e6,
        info:"A device that is embedded in the back of the neck. The NeuroFlux Governor " +
             "monitors and regulates nervous impulses coming to and from the spinal column, " +
             "essentially 'governing' the body. By doing so, it improves the functionality of the " +
             "body's nervous system.<br><br>" +
             "This is a special augmentation that can be leveled up infinitely. Each level of this augmentation " +
             "increases all multipliers by 1%.",
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
    });

    // Set the Augmentation's level to the currently-installed level
    let currLevel = 0;
    for (let i = 0; i < Player.augmentations.length; ++i) {
        if (Player.augmentations[i].name === AugmentationNames.NeuroFluxGovernor) {
            currLevel = Player.augmentations[i].level;
        }
    }
    NeuroFluxGovernor.level = currLevel;

    // To set the price/rep req of the NeuroFlux, we have to take into account NeuroFlux
    // levels that are purchased but not yet installed
    let nextLevel = currLevel;
    for (let i = 0; i < Player.queuedAugmentations.length; ++i) {
        if (Player.queuedAugmentations[i].name === AugmentationNames.NeuroFluxGovernor) {
            ++nextLevel;
        }
    }
    let mult = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, nextLevel);
    NeuroFluxGovernor.baseRepRequirement = 500 * mult * BitNodeMultipliers.AugmentationRepCost;
    NeuroFluxGovernor.baseCost = 750e3 * mult * BitNodeMultipliers.AugmentationMoneyCost;
    if (augmentationExists(AugmentationNames.NeuroFluxGovernor)) {
        delete Augmentations[AugmentationNames.NeuroFluxGovernor];
    }
    NeuroFluxGovernor.addToAllFactions();
    AddToAugmentations(NeuroFluxGovernor);

    const Neurotrainer1 = new Augmentation({
        name:AugmentationNames.Neurotrainer1, repCost:1e3, moneyCost:4e6,
        info:"A decentralized cranial implant that improves the brain's ability to learn. It is " +
             "installed by releasing millions of nanobots into the human brain, each of which " +
             "attaches to a different neural pathway to enhance the brain's ability to retain " +
             "and retrieve information.<br><br>" +
             "This augmentation increases experience gain for all stats by 10%.",
        hacking_exp_mult: 1.1,
        strength_exp_mult: 1.1,
        defense_exp_mult: 1.1,
        dexterity_exp_mult: 1.1,
        agility_exp_mult: 1.1,
        charisma_exp_mult: 1.1,
    });
    Neurotrainer1.addToFactions(["CyberSec", "Aevum"]);
    if (augmentationExists(AugmentationNames.Neurotrainer1)) {
        delete Augmentations[AugmentationNames.Neurotrainer1];
    }
    AddToAugmentations(Neurotrainer1);

    const Neurotrainer2 = new Augmentation({
        name:AugmentationNames.Neurotrainer2, repCost:1e4, moneyCost:4.5e7,
        info:"A decentralized cranial implant that improves the brain's ability to learn. This " +
             "is a more powerful version of the Neurotrainer I augmentation, but it does not " +
             "require Neurotrainer I to be installed as a prerequisite.<br><br>" +
             "This augmentation increases experience gain for all stats by 15%.",
        hacking_exp_mult: 1.15,
        strength_exp_mult: 1.15,
        defense_exp_mult: 1.15,
        dexterity_exp_mult: 1.15,
        agility_exp_mult: 1.15,
        charisma_exp_mult: 1.15,
    });
    Neurotrainer2.addToFactions(["BitRunners", "NiteSec"]);
    if (augmentationExists(AugmentationNames.Neurotrainer2)) {
        delete Augmentations[AugmentationNames.Neurotrainer2];
    }
    AddToAugmentations(Neurotrainer2);

    const Neurotrainer3 = new Augmentation({
        name:AugmentationNames.Neurotrainer3, repCost:2.5e4, moneyCost:1.3e8,
        info:"A decentralized cranial implant that improves the brain's ability to learn. This " +
             "is a more powerful version of the Neurotrainer I and Neurotrainer II augmentation, " +
             "but it does not require either of them to be installed as a prerequisite.<br><br>" +
             "This augmentation increases experience gain for all stats by 20%.",
        hacking_exp_mult: 1.2,
        strength_exp_mult: 1.2,
        defense_exp_mult: 1.2,
        dexterity_exp_mult: 1.2,
        agility_exp_mult: 1.2,
        charisma_exp_mult: 1.2,
    });
    Neurotrainer3.addToFactions(["NWO", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.Neurotrainer3)) {
        delete Augmentations[AugmentationNames.Neurotrainer3];
    }
    AddToAugmentations(Neurotrainer3);

    const Hypersight = new Augmentation({
        name:AugmentationNames.Hypersight, repCost:1.5e5, moneyCost:2.75e9,
        info:"A bionic eye implant that grants sight capabilities far beyond those of a natural human. " +
             "Embedded circuitry within the implant provides the ability to detect heat and movement " +
             "through solid objects such as walls, thus providing 'x-ray vision'-like capabilities.<br><br>" +
             "This augmentation:<br>" +
             "Increases dexterity by 40%.<br>" +
             "Increases hacking speed by 3%.<br>" +
             "Increases money gained from hacking by 10%.",
        dexterity_mult: 1.4,
        hacking_speed_mult: 1.03,
        hacking_money_mult: 1.1,
    });
    Hypersight.addToFactions(["Blade Industries", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.Hypersight)) {
        delete Augmentations[AugmentationNames.Hypersight];
    }
    AddToAugmentations(Hypersight);

    const LuminCloaking1 = new Augmentation({
        name:AugmentationNames.LuminCloaking1, repCost:1.5e3, moneyCost:5e6,
        info:"A skin implant that reinforces the skin with highly-advanced synthetic cells. These " +
             "cells, when powered, have a negative refractive index. As a result, they bend light " +
             "around the skin, making the user much harder to see to the naked eye.<br><br>" +
             "This augmentation:<br>" +
             "Increases agility by 5%.<br>" +
             "Increases money gained from committing crimes by 10%.",
        agility_mult: 1.05,
        crime_money_mult: 1.1,
    });
    LuminCloaking1.addToFactions(["Slum Snakes", "Tetrads"]);
    if (augmentationExists(AugmentationNames.LuminCloaking1)) {
        delete Augmentations[AugmentationNames.LuminCloaking1];
    }
    AddToAugmentations(LuminCloaking1);

    const LuminCloaking2 = new Augmentation({
        name:AugmentationNames.LuminCloaking2, repCost:5e3, moneyCost:3e7,
        info:"This is a more advanced version of the LuminCloaking-V2 augmentation. This skin implant " +
             "reinforces the skin with highly-advanced synthetic cells. These " +
             "cells, when powered, are capable of not only bending light but also of bending heat, " +
             "making the user more resilient as well as stealthy.<br><br>" +
             "This augmentation:<br>" +
             "Increases agility by 10%.<br>" +
             "Increases defense by 10%.<br>" +
             "Increases money gained from committing crimes by 25%.",
	    prereqs:[AugmentationNames.LuminCloaking1],
        agility_mult: 1.1,
        defense_mult: 1.1,
        crime_money_mult: 1.25,
    });
    LuminCloaking2.addToFactions(["Slum Snakes", "Tetrads"]);
    if (augmentationExists(AugmentationNames.LuminCloaking2)) {
        delete Augmentations[AugmentationNames.LuminCloaking2];
    }
    AddToAugmentations(LuminCloaking2);

    const SmartSonar = new Augmentation({
        name:AugmentationNames.SmartSonar, repCost:2.25e4, moneyCost:7.5e7,
        info:"A cochlear implant that helps the player detect and locate enemies " +
             "using sound propagation.<br><br>" +
             "This augmentation:<br>" +
             "Increases dexterity by 10%.<br>" +
             "Increases dexterity experience gain by 15%.<br>" +
             "Increases money gained from committing crimes by 25%.",
        dexterity_mult: 1.1,
        dexterity_exp_mult: 1.15,
        crime_money_mult: 1.25,
    });
    SmartSonar.addToFactions(["Slum Snakes"]);
    if (augmentationExists(AugmentationNames.SmartSonar)) {
        delete Augmentations[AugmentationNames.SmartSonar];
    }
    AddToAugmentations(SmartSonar);

    const PowerRecirculator = new Augmentation({
        name:AugmentationNames.PowerRecirculator, repCost:2.5e4, moneyCost:1.8e8,
        info:"The body's nerves are attached with polypyrrole nanocircuits that " +
             "are capable of capturing wasted energy, in the form of heat, " +
             "and converting it back into usable power.<br><br>" +
             "This augmentation:<br>" +
             "Increases all stats by 5%.<br>" +
             "Increases experience gain for all stats by 10%.",
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
    });
    PowerRecirculator.addToFactions(["Tetrads", "The Dark Army", "The Syndicate", "NWO"]);
    if (augmentationExists(AugmentationNames.PowerRecirculator)) {
        delete Augmentations[AugmentationNames.PowerRecirculator];
    }
    AddToAugmentations(PowerRecirculator);

    // Unique AUGS (Each Faction gets one unique augmentation)
    // Factions that already have unique augs up to this point:
    //   Slum Snakes, CyberSec, Netburners, Fulcrum Secret Technologies,
    //   Silhouette

	// Illuminati
    const QLink = new Augmentation({
        name:AugmentationNames.QLink, repCost:1.875e6, moneyCost:2.5e13,
        info:"A brain implant that wirelessly connects you to the Illuminati's " +
             "quantum supercomputer, allowing you to access and use its incredible " +
             "computing power.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking skill by 75%.<br>" +
             "Increases hacking speed by 100%.<br>" +
             "Increases hacking success chance by 150%.<br>" +
             "Increases money gained from hacking by 300%.",
        hacking_mult: 1.75,
        hacking_speed_mult: 2,
        hacking_chance_mult: 2.5,
        hacking_money_mult: 4,
    });
    QLink.addToFactions(["Illuminati"]);
    if (augmentationExists(AugmentationNames.QLink)) {
        delete Augmentations[AugmentationNames.QLink];
    }
    AddToAugmentations(QLink);

	// Daedalus
    const RedPill = new Augmentation({
        name:AugmentationNames.TheRedPill, repCost:2.5e6, moneyCost:0e0,
        info:"It's time to leave the cave.",
    });
    RedPill.addToFactions(["Daedalus"]);
    if (augmentationExists(AugmentationNames.TheRedPill)) {
        delete Augmentations[AugmentationNames.TheRedPill];
    }
    AddToAugmentations(RedPill);

	// Covenant
    const SPTN97 = new Augmentation({
        name:AugmentationNames.SPTN97, repCost:1.25e6, moneyCost:4.875e9,
        info:"The SPTN-97 gene is injected into the genome. The SPTN-97 gene is an " +
             "artificially-synthesized gene that was developed by DARPA to create " +
             "super-soldiers through genetic modification. The gene was outlawed in " +
             "2056.<br><br>" +
             "This augmentation:<br>" +
             "Increases all combat stats by 75%.<br>" +
             "Increases hacking skill by 15%.",
        strength_mult: 1.75,
        defense_mult: 1.75,
        dexterity_mult: 1.75,
        agility_mult: 1.75,
        hacking_mult: 1.15,
    });
    SPTN97.addToFactions(["The Covenant"]);
    if (augmentationExists(AugmentationNames.SPTN97)) {
        delete Augmentations[AugmentationNames.SPTN97];
    }
    AddToAugmentations(SPTN97);

	// ECorp
    const HiveMind = new Augmentation({
        name:AugmentationNames.HiveMind, repCost:1.5e6, moneyCost:5.5e9,
        info:"A brain implant developed by ECorp. They do not reveal what " +
             "exactly the implant does, but they promise that it will greatly " +
             "enhance your abilities.",
        hacking_grow_mult: 3,
    });
    HiveMind.addToFactions(["ECorp"]);
    if (augmentationExists(AugmentationNames.HiveMind)) {
        delete Augmentations[AugmentationNames.HiveMind];
    }
    AddToAugmentations(HiveMind);

	// MegaCorp
    const CordiARCReactor = new Augmentation({
        name:AugmentationNames.CordiARCReactor, repCost:1.125e6, moneyCost:5e9,
        info:"The thoracic cavity is equipped with a small chamber designed " +
             "to hold and sustain hydrogen plasma. The plasma is used to generate " +
             "fusion power through nuclear fusion, providing limitless amounts of clean " +
             "energy for the body.<br><br>" +
             "This augmentation:<br>" +
             "Increases all combat stats by 35%.<br>" +
             "Increases all combat stat experience gain by 35%.",
        strength_mult: 1.35,
        defense_mult: 1.35,
        dexterity_mult: 1.35,
        agility_mult: 1.35,
        strength_exp_mult: 1.35,
        defense_exp_mult: 1.35,
        dexterity_exp_mult: 1.35,
        agility_exp_mult: 1.35,
    });
    CordiARCReactor.addToFactions(["MegaCorp"]);
    if (augmentationExists(AugmentationNames.CordiARCReactor)) {
        delete Augmentations[AugmentationNames.CordiARCReactor];
    }
    AddToAugmentations(CordiARCReactor);

	// BachmanAndAssociates
    const SmartJaw = new Augmentation({
        name:AugmentationNames.SmartJaw, repCost:3.75e5, moneyCost:2.75e9,
        info:"A bionic jaw that contains advanced hardware and software " +
             "capable of psychoanalyzing and profiling the personality of " +
             "others using optical imaging software.<br><br>" +
             "This augmentation:<br>" +
             "Increases charisma by 50%.<br>" +
             "Increases charisma experience gain by 50%.<br>" +
             "Increases reputation gain from companies by 25%.<br>" +
             "Increases reputation gain from factions by 25%.",
        charisma_mult: 1.5,
        charisma_exp_mult: 1.5,
        company_rep_mult: 1.25,
        faction_rep_mult: 1.25,
    });
    SmartJaw.addToFactions(["Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.SmartJaw)) {
        delete Augmentations[AugmentationNames.SmartJaw];
    }
    AddToAugmentations(SmartJaw);

	// BladeIndustries
    const Neotra = new Augmentation({
        name:AugmentationNames.Neotra, repCost:5.625e5, moneyCost:2.875e9,
        info:"A highly-advanced techno-organic drug that is injected into the skeletal " +
             "and integumentary system. The drug permanently modifies the DNA of the " +
             "body's skin and bone cells, granting them the ability to repair " +
             "and restructure themselves.<br><br>" +
             "This augmentation increases strength and defense by 55%.",
        strength_mult: 1.55,
        defense_mult: 1.55,
    });
    Neotra.addToFactions(["Blade Industries"]);
    if (augmentationExists(AugmentationNames.Neotra)) {
        delete Augmentations[AugmentationNames.Neotra];
    }
    AddToAugmentations(Neotra);

	// NWO
    const Xanipher = new Augmentation({
        name:AugmentationNames.Xanipher, repCost:8.75e5, moneyCost:4.25e9,
        info:"A concoction of advanced nanobots that is orally ingested into the " +
             "body. These nanobots induce physiological changes and significantly " +
             "improve the body's functioning in all aspects.<br><br>" +
             "This augmentation:<br>" +
             "Increases all stats by 20%.<br>" +
             "Increases experience gain for all stats by 15%.",
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
    });
    Xanipher.addToFactions(["NWO"]);
    if (augmentationExists(AugmentationNames.Xanipher)) {
        delete Augmentations[AugmentationNames.Xanipher];
    }
    AddToAugmentations(Xanipher);

    const HydroflameLeftArm = new Augmentation({
        name:AugmentationNames.HydroflameLeftArm, repCost:1.25e6, moneyCost:2.5e12,
        info:"The left arm of a legendary BitRunner who ascended beyond this world. " +
             "It projects a light blue energy shield that protects the exposed inner parts. " +
             "Even though it contains no weapons, the advanced tungsten titanium " +
             "alloy increases the users strength to unbelievable levels. The augmentation " +
             "gets more powerful over time for seemingly no reason.<br><br>" +
             "This augmentation increases strength by 270%.",
        strength_mult: 2.70,
    });
    HydroflameLeftArm.addToFactions(["NWO"]);
    if (augmentationExists(AugmentationNames.HydroflameLeftArm)) {
        delete Augmentations[AugmentationNames.HydroflameLeftArm];
    }
    AddToAugmentations(HydroflameLeftArm);



    // ClarkeIncorporated
    const nextSENS = new Augmentation({
        name:AugmentationNames.nextSENS, repCost:4.375e5, moneyCost:1.925e9,
        info:"The body is genetically re-engineered to maintain a state " +
             "of negligible senescence, preventing the body from " +
             "deteriorating with age.<br><br>" +
             "This augmentation increases all stats by 20%.",
        hacking_mult: 1.2,
        strength_mult: 1.2,
        defense_mult: 1.2,
        dexterity_mult: 1.2,
        agility_mult: 1.2,
        charisma_mult: 1.2,
    });
    nextSENS.addToFactions(["Clarke Incorporated"]);
    if (augmentationExists(AugmentationNames.nextSENS)) {
        delete Augmentations[AugmentationNames.nextSENS];
    }
    AddToAugmentations(nextSENS);

	// OmniTekIncorporated
    const OmniTekInfoLoad = new Augmentation({
        name:AugmentationNames.OmniTekInfoLoad, repCost:6.25e5, moneyCost:2.875e9,
        info:"OmniTek's data and information repository is uploaded " +
             "into your brain, enhancing your programming and " +
             "hacking abilities.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking skill by 20%.<br>" +
             "Increases hacking experience gain by 25%.",
        hacking_mult: 1.2,
        hacking_exp_mult: 1.25,
    });
    OmniTekInfoLoad.addToFactions(["OmniTek Incorporated"]);
    if (augmentationExists(AugmentationNames.OmniTekInfoLoad)) {
        delete Augmentations[AugmentationNames.OmniTekInfoLoad];
    }
    AddToAugmentations(OmniTekInfoLoad);

	// FourSigma
    // TODO Later when Intelligence is added in . Some aug that greatly increases int

	// KuaiGongInternational
    const PhotosyntheticCells = new Augmentation({
        name:AugmentationNames.PhotosyntheticCells, repCost:5.625e5, moneyCost:2.75e9,
        info:"Chloroplasts are added to epidermal stem cells and are applied " +
             "to the body using a skin graft. The result is photosynthetic " +
             "skin cells, allowing users to generate their own energy " +
             "and nutrition using solar power.<br><br>" +
             "This augmentation increases strength, defense, and agility by 40%.",
            strength_mult: 1.4,
            defense_mult: 1.4,
            agility_mult: 1.4,
    });
    PhotosyntheticCells.addToFactions(["KuaiGong International"]);
    if (augmentationExists(AugmentationNames.PhotosyntheticCells)) {
        delete Augmentations[AugmentationNames.PhotosyntheticCells];
    }
    AddToAugmentations(PhotosyntheticCells);

	// BitRunners
    const Neurolink = new Augmentation({
        name:AugmentationNames.Neurolink, repCost:8.75e5, moneyCost:4.375e9,
        info:"A brain implant that provides a high-bandwidth, direct neural link between your " +
             "mind and the BitRunners' data servers, which reportedly contain " +
             "the largest database of hacking tools and information in the world.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking skill by 15%.<br>" +
             "Increases hacking experience gain by 20%.<br>" +
             "Increases hacking success chance by 10%.<br>" +
             "Increases hacking speed by 5%.<br>" +
             "Provides FTPCrack.exe and relaySMTP.exe after a reset.",
        hacking_mult: 1.15,
        hacking_exp_mult: 1.2,
        hacking_chance_mult: 1.1,
        hacking_speed_mult: 1.05,
    });
    Neurolink.addToFactions(["BitRunners"]);
    if (augmentationExists(AugmentationNames.Neurolink)) {
        delete Augmentations[AugmentationNames.Neurolink];
    }
    AddToAugmentations(Neurolink);

	// BlackHand
    const TheBlackHand = new Augmentation({
        name:AugmentationNames.TheBlackHand, repCost:1e5, moneyCost:5.5e8,
        info:"A highly advanced bionic hand. This prosthetic not only " +
             "enhances strength and dexterity but it is also embedded " +
             "with hardware and firmware that lets the user connect to, access, and hack " +
             "devices and machines by just touching them.<br><br>" +
             "This augmentation:<br>" +
             "Increases strength and dexterity by 15%.<br>" +
             "Increases hacking skill by 10%.<br>" +
             "Increases hacking speed by 2%.<br>" +
             "Increases money gained from hacking by 10%.",
        strength_mult: 1.15,
        dexterity_mult: 1.15,
        hacking_mult: 1.1,
        hacking_speed_mult: 1.02,
        hacking_money_mult: 1.1,
    });
    TheBlackHand.addToFactions(["The Black Hand"]);
    if (augmentationExists(AugmentationNames.TheBlackHand)) {
        delete Augmentations[AugmentationNames.TheBlackHand];
    }
    AddToAugmentations(TheBlackHand);

	// NiteSec
    const CRTX42AA = new Augmentation({
        name:AugmentationNames.CRTX42AA, repCost:4.5e4, moneyCost:2.25e8,
        info:"The CRTX42-AA gene is injected into the genome. " +
             "The CRTX42-AA is an artificially-synthesized gene that targets the visual and prefrontal " +
             "cortex and improves cognitive abilities.<br><br>" +
             "This augmentation:<br>" +
             "Increases hacking skill by 8%.<br>" +
             "Increases hacking experience gain by 15%.",
        hacking_mult: 1.08,
        hacking_exp_mult: 1.15,
    });
    CRTX42AA.addToFactions(["NiteSec"]);
    if (augmentationExists(AugmentationNames.CRTX42AA)) {
        delete Augmentations[AugmentationNames.CRTX42AA];
    }
    AddToAugmentations(CRTX42AA);

	// Chongqing
    const Neuregen = new Augmentation({
        name:AugmentationNames.Neuregen, repCost:3.75e4, moneyCost:3.75e8,
        info:"A drug that genetically modifies the neurons in the brain " +
             "resulting in neurons never die, continuously " +
             "regenerate, and strengthen themselves.<br><br>" +
             "This augmentation increases hacking experience gain by 40%.",
        hacking_exp_mult: 1.4,
    });
    Neuregen.addToFactions(["Chongqing"]);
    if (augmentationExists(AugmentationNames.Neuregen)) {
        delete Augmentations[AugmentationNames.Neuregen];
    }
    AddToAugmentations(Neuregen);

	// Sector12
    const CashRoot = new Augmentation({
        name:AugmentationNames.CashRoot, repCost:1.25e4, moneyCost:1.25e8,
        info:"A collection of digital assets saved on a small chip implanted into the wrist." +
             "A small jack in the chip automatically uploads the assets when " +
             "connected to a computer.<br><br>
             "This augmentation:<br>" +
             "Provides {Money(1e6)} after a reset.<br>" +
             "Provides BruteSSH.exe after a reset.",
    });
    CashRoot.addToFactions(["Sector-12"]);
    if (augmentationExists(AugmentationNames.CashRoot)) {
        delete Augmentations[AugmentationNames.CashRoot];
    }
    AddToAugmentations(CashRoot);

	// NewTokyo
    const NutriGen = new Augmentation({
        name:AugmentationNames.NutriGen, repCost:6.25e3, moneyCost:2.5e6,
        info:"A thermo-powered artificial nutrition generator. Endogenously " +
             "synthesizes glucose, amino acids, and vitamins and redistributes them " +
             "across the body. The device is powered by the body's naturally wasted " +
             "energy in the form of heat.<br><br>" +
             "This augmentation increases experience gain for all combat stats by 20%.",
        strength_exp_mult: 1.2,
        defense_exp_mult: 1.2,
        dexterity_exp_mult: 1.2,
        agility_exp_mult: 1.2,
    });
    NutriGen.addToFactions(["New Tokyo"]);
    if (augmentationExists(AugmentationNames.NutriGen)) {
        delete Augmentations[AugmentationNames.NutriGen];
    }
    AddToAugmentations(NutriGen);

	// Aevum
    // TODO Later Something that lets you learn advanced math...this increases int
    // and profits as a trader/from trading

    // Ishima
    const INFRARet = new Augmentation({
        name:AugmentationNames.INFRARet, repCost:7.5e3, moneyCost:3e7,
        info:"A tiny chip that sits behind the retinae. This implant lets the" +
             "user visually detect infrared radiation.<br><br>" +
             "This augmentation:<br>" +
             "Increases crime success rate by 25%.<br>" +
             "Increases money gained from committing crimes by 10%.<br>" +
             "Increases dexterity by 10%.",
        crime_success_mult: 1.25,
        crime_money_mult: 1.1,
        dexterity_mult: 1.1,
    });
    INFRARet.addToFactions(["Ishima"]);
    if (augmentationExists(AugmentationNames.INFRARet)) {
        delete Augmentations[AugmentationNames.INFRARet];
    }
    AddToAugmentations(INFRARet);

	// Volhaven
    const DermaForce = new Augmentation({
        name:AugmentationNames.DermaForce, repCost:1.5e4, moneyCost:5e7,
        info:"Synthetic skin that is grafted onto the body. This skin consists of " +
             "millions of nanobots capable of projecting high-density muon beams, " +
             "creating an energy barrier around the user.<br><br>" +
             "This augmentation increases defense by 40%.",
        defense_mult: 1.4,
    });
    DermaForce.addToFactions(["Volhaven"]);
    if (augmentationExists(AugmentationNames.DermaForce)) {
        delete Augmentations[AugmentationNames.DermaForce];
    }
    AddToAugmentations(DermaForce);

	// SpeakersForTheDead
    const GrapheneBrachiBlades = new Augmentation({
        name:AugmentationNames.GrapheneBrachiBlades, repCost:2.25e5, moneyCost:2.5e9,
        info:"An upgrade to the BrachiBlades augmentation. It infuses " +
             "the retractable blades with an advanced graphene material " +
             "making them stronger and lighter.<br><br>" +
             "This augmentation:<br>" +
             "Increases strength and defense by 40%.<br>" +
             "Increases crime success rate by 10%.<br>" +
             "Increases money gained from committing crimes by 30%.",
        prereqs:[AugmentationNames.BrachiBlades],
        strength_mult: 1.4,
        defense_mult: 1.4,
        crime_success_mult: 1.1,
        crime_money_mult: 1.3,
    });
    GrapheneBrachiBlades.addToFactions(["Speakers for the Dead"]);
    if (augmentationExists(AugmentationNames.GrapheneBrachiBlades)) {
        delete Augmentations[AugmentationNames.GrapheneBrachiBlades];
    }
    AddToAugmentations(GrapheneBrachiBlades);

	// DarkArmy
    const GrapheneBionicArms = new Augmentation({
        name:AugmentationNames.GrapheneBionicArms, repCost:5e5, moneyCost:3.75e9,
        info:"An upgrade to the Bionic Arms augmentation. It infuses the " +
             "prosthetic arms with an advanced graphene material " +
             "to make them stronger and lighter.<br><br>" +
             "This augmentation increases strength and dexterity by 85%.",
        prereqs:[AugmentationNames.BionicArms],
        strength_mult: 1.85,
        dexterity_mult: 1.85,
    });
    GrapheneBionicArms.addToFactions(["The Dark Army"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicArms)) {
        delete Augmentations[AugmentationNames.GrapheneBionicArms];
    }
    AddToAugmentations(GrapheneBionicArms);

	// TheSyndicate
    const BrachiBlades = new Augmentation({
        name:AugmentationNames.BrachiBlades, repCost:1.25e4, moneyCost:9e7,
        info:"A set of retractable plasteel blades that are implanted in the arm, underneath the skin.<br><br>" +
             "This augmentation:<br>" +
             "Increases strength and defense by 15%.<br>" +
             "Increases crime success rate by 10%.<br>" +
             "Increases money gained from committing crimes by 15%.",
        strength_mult: 1.15,
        defense_mult: 1.15,
        crime_success_mult: 1.1,
        crime_money_mult: 1.15,
    });
    BrachiBlades.addToFactions(["The Syndicate"]);
    if (augmentationExists(AugmentationNames.BrachiBlades)) {
        delete Augmentations[AugmentationNames.BrachiBlades];
    }
    AddToAugmentations(BrachiBlades);

    // Tetrads
    const BionicArms = new Augmentation({
        name:AugmentationNames.BionicArms, repCost:6.25e4, moneyCost:2.75e8,
        info:"Cybernetic arms created from plasteel and carbon fibers that completely replace " +
             "the user's organic arms.<br><br>" +
             "This augmentation increases the user's strength and dexterity by 30%.",
        strength_mult: 1.3,
        dexterity_mult: 1.3,
    });
    BionicArms.addToFactions(["Tetrads"]);
    if (augmentationExists(AugmentationNames.BionicArms)) {
        delete Augmentations[AugmentationNames.BionicArms];
    }
    AddToAugmentations(BionicArms);

	// TianDiHui
    const SNA = new Augmentation({
        name:AugmentationNames.SNA, repCost:6.25e3, moneyCost:3e7,
        info:"A cranial implant that affects the user's personality, making them better " +
             "at negotiation in social situations.<br><br>" +
             "This augmentation:<br>" +
             "Increases money gained from working by 10%.<br>" +
             "Increases reputation gain from factions and companies by 15%.",
        work_money_mult: 1.1,
        company_rep_mult: 1.15,
        faction_rep_mult: 1.15,
    });
    SNA.addToFactions(["Tian Di Hui"]);
    if (augmentationExists(AugmentationNames.SNA)) {
        delete Augmentations[AugmentationNames.SNA];
    }
    AddToAugmentations(SNA);

    // Special Bladeburner Augmentations
    const BladeburnersFactionName = "Bladeburners";
    if (factionExists(BladeburnersFactionName)) {
        const EsperEyewear = new Augmentation({
            name:AugmentationNames.EsperEyewear, repCost:1.25e3, moneyCost:1.65e8,
            info:"Ballistic-grade protective and retractable eyewear that was designed specifically " +
                 "for Bladeburner units. This " +
                 "is implanted by installing a mechanical frame in the skull's orbit. " +
                 "This frame interfaces with the brain and allows the user to " +
                 "automatically extrude and extract the eyewear. The eyewear protects " +
                 "against debris, shrapnel, lasers, blinding flashes, and gas. It is also " +
                 "embedded with a data processing chip that can be programmed to display an " +
                 "AR HUD to assist the user in field missions.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases success chance in Bladeburner contracts and operations by 3%.<br>" +
                 "Increases dexterity by 5%.",
            bladeburner_success_chance_mult: 1.03,
            dexterity_mult: 1.05,
            isSpecial: true,
        });
        EsperEyewear.addToFactions([BladeburnersFactionName]);
        resetAugmentation(EsperEyewear);

        const EMS4Recombination = new Augmentation({
            name:AugmentationNames.EMS4Recombination, repCost:2.5e3, moneyCost:2.75e8,
            info:"A DNA recombination of the EMS-4 Gene. This genetic engineering " +
                 "technique was originally used on Bladeburners during the Synthoid uprising " +
                 "to induce wakefulness and concentration, suppress fear, reduce empathy, " +
                 "improve reflexes, and improve memory among other things.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases success chance in Bladeburner contracts and operations by 3%.<br>" +
                 "Increases effectiveness in Bladeburner Field Analysis by 5%.<br>" +
                 "Increases Bladeburner stamina gain by 2%.",
            bladeburner_success_chance_mult: 1.03,
            bladeburner_analysis_mult: 1.05,
            bladeburner_stamina_gain_mult: 1.02,
            isSpecial: true,
        });
        EMS4Recombination.addToFactions([BladeburnersFactionName]);
        resetAugmentation(EMS4Recombination);

        const OrionShoulder = new Augmentation({
            name:AugmentationNames.OrionShoulder, repCost:6.25e3, moneyCost:5.5e8,
            info:"A bionic shoulder augmentation for the right shoulder. Using cybernetics, " +
                 "the ORION-MKIV shoulder enhances the strength and dexterity " +
                 "of the user's right arm. It also provides protection due to its " +
                 "crystallized graphene plating.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases defense by 5%.<br>" +
                 "Increases strength and dexterity by 5%.<br>" +
                 "Increases success chance in Bladeburner contracts and operations by 4%.",
            defense_mult: 1.05,
            strength_mult: 1.05,
            dexterity_mult: 1.05,
            bladeburner_success_chance_mult: 1.04,
            isSpecial: true,
        });
        OrionShoulder.addToFactions([BladeburnersFactionName]);
        resetAugmentation(OrionShoulder);

        const HyperionV1 = new Augmentation({
            name:AugmentationNames.HyperionV1, repCost:1.25e4, moneyCost:2.75e9,
            info:"A pair of mini plasma cannons embedded into the hands. The Hyperion is capable " +
                 "of rapidly firing bolts of high-density plasma. The weapon is meant to " +
                 "be used against augmented enemies as the ionized " +
                 "nature of the plasma disrupts the electrical systems of Augmentations. However, " +
                 "it can also be effective against non-augmented enemies due to its high temperature " +
                 "and concussive force.<br><br>" +
                 "This augmentation increases success chance in Bladeburner contracts and operations by 6%.",
            bladeburner_success_chance_mult: 1.06,
            isSpecial: true,
        });
        HyperionV1.addToFactions([BladeburnersFactionName]);
        resetAugmentation(HyperionV1);

        const HyperionV2 = new Augmentation({
            name:AugmentationNames.HyperionV2, repCost:2.5e4, moneyCost:5.5e9,
            info:"A pair of mini plasma cannons embedded into the hands. This augmentation " +
                 "is more advanced and powerful than the original V1 model. This V2 model is " +
                 "more power-efficient, more accurate, and can fire plasma bolts at a much " +
                 "higher velocity than the V1 model.<br><br>" +
                 "This augmentation increases success chance in Bladeburner contracts and operations by 8%.",
            prereqs:[AugmentationNames.HyperionV1],
            bladeburner_success_chance_mult: 1.08,
            isSpecial: true,
        });
        HyperionV2.addToFactions([BladeburnersFactionName]);
        resetAugmentation(HyperionV2);

        const GolemSerum = new Augmentation({
            name:AugmentationNames.GolemSerum, repCost:3.125e4, moneyCost:1.1e10,
            info:"A serum that permanently enhances many aspects of human capabilities, " +
                 "including strength, speed, immune system enhancements, and mitochondrial efficiency. The " +
                 "serum was originally developed by the Chinese military in an attempt to " +
                 "create super soldiers.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases all combat stats by 7%.<br>" +
                 "Increases Bladeburner stamina gain by 5%.<br>",
            strength_mult: 1.07,
            defense_mult: 1.07,
            dexterity_mult: 1.07,
            agility_mult: 1.07,
            bladeburner_stamina_gain_mult: 1.05,
            isSpecial: true,
        });
        GolemSerum.addToFactions([BladeburnersFactionName]);
        resetAugmentation(GolemSerum);

        const VangelisVirus = new Augmentation({
            name:AugmentationNames.VangelisVirus, repCost:1.875e4, moneyCost:2.75e9,
            info:"A synthetic symbiotic virus that is injected into human brain tissue. The Vangelis virus " +
                 "heightens the senses and focus of its host, and also enhances its intuition.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases effectiveness in Bladeburner Field Analysis by 10%.<br>" +
                 "Increases success chance in Bladeburner contracts and operations by 4%.<br>" +
                 "Increases dexterity experience gain by 10%.",
            dexterity_exp_mult: 1.1,
            bladeburner_analysis_mult: 1.1,
            bladeburner_success_chance_mult: 1.04,
            isSpecial: true,
        });
        VangelisVirus.addToFactions([BladeburnersFactionName]);
        resetAugmentation(VangelisVirus);

        const VangelisVirus3 = new Augmentation({
            name:AugmentationNames.VangelisVirus3, repCost:3.75e4, moneyCost:1.1e10,
            info:"An improved version of Vangelis, a synthetic symbiotic virus that is " +
                 "injected into human brain tissue. On top of the benefits of the original " +
                 "virus, this also grants an accelerated healing factor and enhanced " +
                 "reflexes.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases effectiveness in Bladeburner Field Analysis by 15%.<br>" +
                 "Increases defense and dexterity experience gain by 10%.<br>" +
                 "Increases success chance in Bladeburner contracts and operations by 5%.",
            prereqs:[AugmentationNames.VangelisVirus],
            defense_exp_mult: 1.1,
            dexterity_exp_mult: 1.1,
            bladeburner_analysis_mult: 1.15,
            bladeburner_success_chance_mult: 1.05,
            isSpecial: true,
        });
        VangelisVirus3.addToFactions([BladeburnersFactionName]);
        resetAugmentation(VangelisVirus3);

        const INTERLINKED = new Augmentation({
            name:AugmentationNames.INTERLINKED, repCost:2.5e4, moneyCost:5.5e9,
            info:"The DNA is genetically modified to enhance the human's body " +
                 "extracellular matrix (ECM). This improves the ECM's ability to " +
                 "structurally support the body and grants heightened strength and " +
                 "durability.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases experience gain for all combat stats by 5%.<br>" +
                 "Increases Bladeburner max stamina by 10%.",
            strength_exp_mult: 1.05,
            defense_exp_mult: 1.05,
            dexterity_exp_mult: 1.05,
            agility_exp_mult: 1.05,
            bladeburner_max_stamina_mult: 1.1,
            isSpecial: true,
        });
        INTERLINKED.addToFactions([BladeburnersFactionName]);
        resetAugmentation(INTERLINKED);

        const BladeRunner = new Augmentation({
            name:AugmentationNames.BladeRunner, repCost:2e4, moneyCost:8.25e9,
            info:"A cybernetic foot augmentation that was specifically created for Bladeburners " +
                 "during the Synthoid Uprising. The organic musculature of the human foot " +
                 "is enhanced with flexible carbon nanotube matrices that are controlled by " +
                 "intelligent servo-motors.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases agility by 5%.<br>" +
                 "Increases Bladeburner max stamina by 5%.<br>" +
                 "Increases Bladeburner stamina gain by 5%.<br>",
            agility_mult: 1.05,
            bladeburner_max_stamina_mult: 1.05,
            bladeburner_stamina_gain_mult: 1.05,
            isSpecial: true,
        });
        BladeRunner.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeRunner);

        const BladeArmor = new Augmentation({
            name:AugmentationNames.BladeArmor, repCost:1.25e4, moneyCost:1.375e9,
            info:"A powered exoskeleton suit designed as armor for Bladeburner units. This " +
                 "exoskeleton is incredibly adaptable and can protect the wearer from blunt, piercing, " +
                 "concussive, thermal, chemical, and electric trauma. It also enhances the user's " +
                 "physical abilities.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases all combat stats by 4%.<br>" +
                 "Increases Bladeburner stamina gain by 2%.<br>" +
                 "Increases success chance in Bladeburner contracts and operations by 3%.",
            strength_mult: 1.04,
            defense_mult: 1.04,
            dexterity_mult: 1.04,
            agility_mult: 1.04,
            bladeburner_stamina_gain_mult: 1.02,
            bladeburner_success_chance_mult: 1.03,
            isSpecial: true,
        });
        BladeArmor.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmor);

        const BladeArmorPowerCells = new Augmentation({
            name:AugmentationNames.BladeArmorPowerCells, repCost:1.875e4, moneyCost:2.75e9,
            info:"Upgrades the BLADE-51b Tesla Armor with Ion Power Cells, which are capable of " +
                 "more efficiently storing and using power.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases success chance in Bladeburner contracts and operations by 5%.<br>" +
                 "Increases Bladeburner stamina gain by 2%.<br>" +
                 "Increases Bladeburner max stamina by 5%.",
            prereqs:[AugmentationNames.BladeArmor],
            bladeburner_success_chance_mult: 1.05,
            bladeburner_stamina_gain_mult: 1.02,
            bladeburner_max_stamina_mult: 1.05,
            isSpecial: true,
        });
        BladeArmorPowerCells.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorPowerCells);

        const BladeArmorEnergyShielding = new Augmentation({
            name:AugmentationNames.BladeArmorEnergyShielding, repCost:2.125e4, moneyCost:5.5e9,
            info:"Upgrades the BLADE-51b Tesla Armor with a plasma energy propulsion system " +
                 "that is capable of projecting an energy shielding force field.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases defense by 5%.<br>" +
                 "Increases success chance in Bladeburner contracts and operations by 6%.",
            prereqs:[AugmentationNames.BladeArmor],
            defense_mult: 1.05,
            bladeburner_success_chance_mult: 1.06,
            isSpecial: true,
        });
        BladeArmorEnergyShielding.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorEnergyShielding);

        const BladeArmorUnibeam = new Augmentation({
            name:AugmentationNames.BladeArmorUnibeam, repCost:3.125e4, moneyCost:1.65e10,
            info:"Upgrades the BLADE-51b Tesla Armor with a concentrated deuterium-fluoride laser " +
                 "weapon. It's precision and accuracy make it useful for neutralizing " +
                 "threats while keeping casualties to a minimum.<br><br>" +
                 "This augmentation increases success chance in Bladeburner contracts and operations by 8%.",
            prereqs:[AugmentationNames.BladeArmor],
            bladeburner_success_chance_mult: 1.08,
            isSpecial: true,
        });
        BladeArmorUnibeam.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorUnibeam);

        const BladeArmorOmnibeam = new Augmentation({
            name:AugmentationNames.BladeArmorOmnibeam, repCost:6.25e4, moneyCost:2.75e10,
            info:"Upgrades the BLADE-51b Tesla Armor Unibeam augmentation to use a " +
                 "multiple-fiber system. This upgraded weapon uses multiple fiber laser " +
                 "modules that combine together to form a single, more powerful beam of up to " +
                 "2000MW.<br><br>" +
                 "This augmentation increases success chance in Bladeburner contracts and operations by 10%.",
            prereqs:[AugmentationNames.BladeArmorUnibeam],
            bladeburner_success_chance_mult: 1.1,
            isSpecial: true,
        });
        BladeArmorOmnibeam.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorOmnibeam);

        const BladeArmorIPU = new Augmentation({
            name:AugmentationNames.BladeArmorIPU, repCost:1.5e4, moneyCost:1.1e9,
            info:"Upgrades the BLADE-51b Tesla Armor with an AI Information Processing " +
                 "Unit that was specially designed to analyze Synthoid related data and " +
                 "information.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases effectiveness in Bladeburner Field Analysis by 15%.<br>" +
                 "Increases success chance in Bladeburner contracts and operations by 2%.",
            prereqs:[AugmentationNames.BladeArmor],
            bladeburner_analysis_mult: 1.15,
            bladeburner_success_chance_mult: 1.02,
            isSpecial: true,
        });
        BladeArmorIPU.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorIPU);

        const BladesSimulacrum = new Augmentation({
            name:AugmentationNames.BladesSimulacrum, repCost:1.25e3, moneyCost:1.5e11,
            info:"A highly-advanced matter phase-shifter module that is embedded "  +
                 "in the brainstem and cerebellum. This augmentation allows " +
                 "the user to project and control a holographic simulacrum within an " +
                 "extremely large radius. These specially-modified holograms were specifically " +
                 "weaponized by Bladeburner units to be used against Synthoids.<br><br>"  +
                 "This augmentation allows you to perform Bladeburner actions and other " +
                 "actions (such as working, committing crimes, etc.) at the same time.",
            isSpecial: true,
        });
        BladesSimulacrum.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladesSimulacrum);
    }

    // Update costs based on how many have been purchased
    mult = Math.pow(CONSTANTS.MultipleAugMultiplier, Player.queuedAugmentations.length);
    for (var name in Augmentations) {
        if (Augmentations.hasOwnProperty(name)) {
            Augmentations[name].baseCost *= mult;
        }
    }

    Player.reapplyAllAugmentations();
}

//Resets an Augmentation during (re-initizliation)
function resetAugmentation(newAugObject) {
    if (!(newAugObject instanceof Augmentation)) {
        throw new Error("Invalid argument 'newAugObject' passed into resetAugmentation");
    }
    var name = newAugObject.name;
    if (augmentationExists(name)) {
        delete Augmentations[name];
    }
    AddToAugmentations(newAugObject);
}

function applyAugmentation(aug, reapply=false) {
    Augmentations[aug.name].owned = true;

    const augObj = Augmentations[aug.name];

    // Apply multipliers
    for (const mult in augObj.mults) {
        if (Player[mult] == null) {
            console.warn(`Augmentation has unrecognized multiplier property: ${mult}`);
        } else {
            Player[mult] *= augObj.mults[mult];
        }
    }

    // Special logic for NeuroFlux Governor
    if (aug.name === AugmentationNames.NeuroFluxGovernor) {
        if (!reapply) {
            Augmentations[aug.name].level = aug.level;
            for (let i = 0; i < Player.augmentations.length; ++i) {
                if (Player.augmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
                    Player.augmentations[i].level = aug.level;
                    return;
                    // break;
                }
            }
        }
    }

    // Push onto Player's Augmentation list
    if (!reapply) {
        var ownedAug = new PlayerOwnedAugmentation(aug.name);
        Player.augmentations.push(ownedAug);
    }
}

function installAugmentations() {
    if (Player.queuedAugmentations.length == 0) {
        dialogBoxCreate("You have not purchased any Augmentations to install!");
        return false;
    }
    let augmentationList = "";
    let nfgIndex = -1;
    for(let i = Player.queuedAugmentations.length-1; i >= 0; i--) {
        if(Player.queuedAugmentations[i].name === AugmentationNames.NeuroFluxGovernor) {
            nfgIndex = i;
            break;
        }
    }
    for (let i = 0; i < Player.queuedAugmentations.length; ++i) {
        const ownedAug = Player.queuedAugmentations[i];
        const aug = Augmentations[ownedAug.name];
        if (aug == null) {
            console.error(`Invalid augmentation: ${ownedAug.name}`);
            continue;
        }

        applyAugmentation(Player.queuedAugmentations[i]);
        if(ownedAug.name === AugmentationNames.NeuroFluxGovernor
            && i !== nfgIndex) continue;

        let level = "";
        if (ownedAug.name === AugmentationNames.NeuroFluxGovernor) {
            level = ` - ${ownedAug.level}`;
        }
        augmentationList += (aug.name + level + "<br>");
    }
    Player.queuedAugmentations = [];
    dialogBoxCreate("You slowly drift to sleep as scientists put you under in order " +
                    "to install the following Augmentations:<br>" + augmentationList +
                    "<br>You wake up in your home...you feel different...");
    prestigeAugmentation();
}

function augmentationExists(name) {
    return Augmentations.hasOwnProperty(name);
}

export function displayAugmentationsContent(contentEl) {
    if (!routing.isOn(Page.Augmentations)) { return; }
    if (!(contentEl instanceof HTMLElement)) { return; }

    function backup() {
        saveObject.exportGame();
        onExport(Player);
    }

    ReactDOM.render(
        <AugmentationsRoot
            exportGameFn={backup}
            installAugmentationsFn={installAugmentations}
        />,
        contentEl,
    );
}

export function isRepeatableAug(aug) {
    const augName = (aug instanceof Augmentation) ? aug.name : aug;

    if (augName === AugmentationNames.NeuroFluxGovernor) { return true; }

    return false;
}

export {
    installAugmentations,
    initAugmentations,
    applyAugmentation,
    augmentationExists,
};
