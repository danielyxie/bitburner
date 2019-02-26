import { Augmentation }                     from "./Augmentation";
import { Augmentations }                    from "./Augmentations";
import { PlayerOwnedAugmentation }          from "./PlayerOwnedAugmentation";
import { AugmentationNames }                from "./data/AugmentationNames";

import { BitNodeMultipliers }               from "../BitNode/BitNodeMultipliers";
import { CONSTANTS }                        from "../Constants";
import { Factions,
         factionExists }                    from "../Faction/Factions";
import { hasBladeburnerSF }                 from "../NetscriptFunctions";
import { addWorkerScript }                  from "../NetscriptWorker";
import { Player }                           from "../Player";
import { prestigeAugmentation }             from "../Prestige";
import { saveObject }                       from "../SaveObject";
import { Script,
         RunningScript}                     from "../Script";
import { Server }                           from "../Server";
import { OwnedAugmentationsOrderSetting }   from "../Settings/SettingEnums";
import { Settings }                         from "../Settings/Settings";

import { SourceFiles }                      from "../SourceFile";
import { dialogBoxCreate }                  from "../../utils/DialogBox";
import { createAccordionElement }           from "../../utils/uiHelpers/createAccordionElement";
import { Reviver, Generic_toJSON,
         Generic_fromJSON }                 from "../../utils/JSONReviver";
import { formatNumber }                     from "../../utils/StringHelperFunctions";
import { clearObject }                      from "../../utils/helpers/clearObject";
import { createElement }                    from "../../utils/uiHelpers/createElement";
import { isString }                         from "../../utils/helpers/isString";
import { removeChildrenFromElement }        from "../../utils/uiHelpers/removeChildrenFromElement";


function AddToAugmentations(aug) {
    var name = aug.name;
    Augmentations[name] = aug;
}

function initAugmentations() {
    for (var name in Factions) {
        if (Factions.hasOwnProperty(name)) {
            Factions[name].augmentations = [];
        }
    }

    //Reset Augmentations
    clearObject(Augmentations);

    //Combat stat augmentations
    var HemoRecirculator = new Augmentation({
        name:AugmentationNames.HemoRecirculator, moneyCost: 9e6, repCost:4e3,
        info:"A heart implant that greatly increases the body's ability to effectively use and pump " +
             "blood.<br><br>" +
             "This augmentation increases all of the player's combat stats by 8%.",
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

    var Targeting1 = new Augmentation({
        name:AugmentationNames.Targeting1, moneyCost:3e6, repCost:2e3,
        info:"This cranial implant is embedded within the player's inner ear structure and optic nerves. It regulates and enhances the user's " +
             "balance and hand-eye coordination. It is also capable of augmenting reality by projecting digital information " +
             "directly onto the retina. These enhancements allow the player to better lock-on and keep track of enemies.<br><br>" +
             "This augmentation increases the player's dexterity by 10%.",
        dexterity_mult: 1.1,
    });
    Targeting1.addToFactions(["Slum Snakes", "The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                            "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.Targeting1)) {
        delete Augmentations[AugmentationNames.Targeting1];
    }
    AddToAugmentations(Targeting1);

    var Targeting2 = new Augmentation({
        name:AugmentationNames.Targeting2, moneyCost:8.5e6, repCost:3.5e3,
        info:"This is an upgrade of the Augmented Targeting I cranial implant, which is capable of augmenting reality " +
             "and enhances the user's balance and hand-eye coordination.<br><br>" +
             "This augmentation increases the player's dexterity by 20%.",
        prereqs:[AugmentationNames.Targeting1],
        dexterity_mult: 1.2,
    });
    Targeting2.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.Targeting2)) {
        delete Augmentations[AugmentationNames.Targeting2];
    }
    AddToAugmentations(Targeting2);

    var Targeting3 = new Augmentation({
        name:AugmentationNames.Targeting3, moneyCost:23e6, repCost:11e3,
        info:"This is an upgrade of the Augmented Targeting II cranial implant, which is capable of augmenting reality " +
             "and enhances the user's balance and hand-eye coordination.<br><br>" +
             "This augmentation increases the player's dexterity by 30%.",
        prereqs:[AugmentationNames.Targeting2],
        dexterity_mult: 1.3,
    });
    Targeting3.addToFactions(["The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant"]);
    if (augmentationExists(AugmentationNames.Targeting3)) {
        delete Augmentations[AugmentationNames.Targeting3];
    }
    AddToAugmentations(Targeting3);

    var SyntheticHeart = new Augmentation({
        name:AugmentationNames.SyntheticHeart, moneyCost:575e6, repCost:300e3,
        info:"This advanced artificial heart, created from plasteel and graphene, is capable of pumping more blood " +
             "at much higher efficiencies than a normal human heart.<br><br>" +
             "This augmentation increases the player's agility and strength by 50%.",
        agility_mult: 1.5,
        strength_mult: 1.5,
    });
    SyntheticHeart.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                 "NWO", "The Covenant", "Daedalus", "Illuminati"]);
    if (augmentationExists(AugmentationNames.SyntheticHeart)) {
        delete Augmentations[AugmentationNames.SyntheticHeart];
    }
    AddToAugmentations(SyntheticHeart);

    var SynfibrilMuscle = new Augmentation({
        name:AugmentationNames.SynfibrilMuscle, repCost:175e3, moneyCost:225e6,
        info:"The myofibrils in human muscles are injected with special chemicals that react with the proteins inside " +
             "the myofibrils, altering their underlying structure. The end result is muscles that are stronger and more elastic. " +
             "Scientists have named these artificially enhanced units 'synfibrils'.<br><br>" +
             "This augmentation increases the player's strength and defense by 30%.",
        strength_mult: 1.3,
        defense_mult: 1.3,
    });
    SynfibrilMuscle.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                  "NWO", "The Covenant", "Daedalus", "Illuminati", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.SynfibrilMuscle)) {
        delete Augmentations[AugmentationNames.SynfibrilMuscle];
    }
    AddToAugmentations(SynfibrilMuscle)

    var CombatRib1 = new Augmentation({
        name:AugmentationNames.CombatRib1, repCost:3e3, moneyCost:4750000,
        info:"The human body's ribs are replaced with artificial ribs that automatically and continuously release cognitive " +
             "and performance-enhancing drugs into the bloodstream, improving the user's abilities in combat.<br><br>" +
             "This augmentation increases the player's strength and defense by 10%.",
        strength_mult: 1.1,
        defense_mult: 1.1,
    });
    CombatRib1.addToFactions(["Slum Snakes", "The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.CombatRib1)) {
        delete Augmentations[AugmentationNames.CombatRib1];
    }
    AddToAugmentations(CombatRib1);

    var CombatRib2 = new Augmentation({
        name:AugmentationNames.CombatRib2, repCost:7.5e3, moneyCost:13e6,
        info:"This is an upgrade to the Combat Rib I augmentation, and is capable of releasing even more potent combat-enhancing " +
             "drugs into the bloodstream.<br><br>" +
             "This augmentation increases the player's strength and defense by 14%.",
        prereqs:[AugmentationNames.CombatRib1],
        strength_mult: 1.14,
        defense_mult: 1.14,
    });
    CombatRib2.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.CombatRib2)) {
        delete Augmentations[AugmentationNames.CombatRib2];
    }
    AddToAugmentations(CombatRib2);

    var CombatRib3 = new Augmentation({
        name:AugmentationNames.CombatRib3, repCost:14e3, moneyCost:24e6,
        info:"This is an upgrade to the Combat Rib II augmentation, and is capable of releasing even more potent combat-enhancing " +
             "drugs into the bloodstream<br><br>." +
             "This augmentation increases the player's strength and defense by 18%.",
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

    var NanofiberWeave = new Augmentation({
        name:AugmentationNames.NanofiberWeave, repCost:15e3, moneyCost:25e6,
        info:"Synthetic nanofibers are woven into the skin's extracellular matrix using electrospinning. " +
             "This improves the skin's ability to regenerate itself and protect the body from external stresses and forces.<br><br>" +
             "This augmentation increases the player's strength and defense by 20%.",
        strength_mult: 1.2,
        defense_mult: 1.2,
    });
    NanofiberWeave.addToFactions(["Tian Di Hui", "The Syndicate", "The Dark Army", "Speakers for the Dead",
                                 "Blade Industries", "Fulcrum Secret Technologies", "OmniTek Incorporated"]);
    if (augmentationExists(AugmentationNames.NanofiberWeave)) {
        delete Augmentations[AugmentationNames.NanofiberWeave];
    }
    AddToAugmentations(NanofiberWeave);

    var SubdermalArmor = new Augmentation({
        name:AugmentationNames.SubdermalArmor, repCost:350e3, moneyCost:650e6,
        info:"The NEMEAN Subdermal Weave is a thin, light-weight, graphene plating that houses a dilatant fluid. " +
             "The material is implanted underneath the skin, and is the most advanced form of defensive enhancement " +
             "that has ever been created. The dilatant fluid, despite being thin and light, is extremely effective " +
             "at stopping piercing blows and reducing blunt trauma. The properties of graphene allow the plating to " +
             "mitigate damage from any fire-related or electrical traumas.<br><br>" +
             "This augmentation increases the player's defense by 120%.",
        defense_mult: 2.2,
    });
    SubdermalArmor.addToFactions(["The Syndicate", "Fulcrum Secret Technologies", "Illuminati", "Daedalus",
                                 "The Covenant"]);
    if (augmentationExists(AugmentationNames.SubdermalArmor)) {
        delete Augmentations[AugmentationNames.SubdermalArmor];
    }
    AddToAugmentations(SubdermalArmor);

    var WiredReflexes = new Augmentation({
        name:AugmentationNames.WiredReflexes, repCost:500, moneyCost:500e3,
        info:"Synthetic nerve-enhancements are injected into all major parts of the somatic nervous system, " +
             "supercharging the body's ability to send signals through neurons. This results in increased reflex speed.<br><br>" +
             "This augmentation increases the player's agility and dexterity by 5%.",
        agility_mult: 1.05,
        dexterity_mult: 1.05,
    });
    WiredReflexes.addToFactions(["Tian Di Hui", "Slum Snakes", "Sector-12", "Volhaven", "Aevum", "Ishima",
                                "The Syndicate", "The Dark Army", "Speakers for the Dead"]);
    if (augmentationExists(AugmentationNames.WiredReflexes)) {
        delete Augmentations[AugmentationNames.WiredReflexes];
    }
    AddToAugmentations(WiredReflexes);

    var GrapheneBoneLacings = new Augmentation({
        name:AugmentationNames.GrapheneBoneLacings, repCost:450e3, moneyCost:850e6,
        info:"A graphene-based material is grafted and fused into the user's bones, significantly increasing " +
             "their density and tensile strength.<br><br>" +
             "This augmentation increases the player's strength and defense by 70%.",
        strength_mult: 1.7,
        defense_mult: 1.7,
    });
    GrapheneBoneLacings.addToFactions(["Fulcrum Secret Technologies", "The Covenant"]);
    if (augmentationExists(AugmentationNames.GrapheneBoneLacings)) {
        delete Augmentations[AugmentationNames.GrapheneBoneLacings];
    }
    AddToAugmentations(GrapheneBoneLacings);

    var BionicSpine = new Augmentation({
        name:AugmentationNames.BionicSpine, repCost:18e3, moneyCost:25e6,
        info:"An artificial spine created from plasteel and carbon fibers that completely replaces the organic spine. " +
             "Not only is the Bionic Spine physically stronger than a human spine, but it is also capable of digitally " +
             "stimulating and regulating the neural signals that are sent and received by the spinal cord. This results in " +
             "greatly improved senses and reaction speeds.<br><br>" +
             "This augmentation increases all of the player's combat stats by 15%.",
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

    var GrapheneBionicSpine = new Augmentation({
        name:AugmentationNames.GrapheneBionicSpine, repCost:650e3, moneyCost:1200e6,
        info:"An upgrade to the Bionic Spine augmentation. It fuses the implant with an advanced graphene " +
             "material to make it much stronger and lighter.<br><br>" +
             "This augmentation increases all of the player's combat stats by 60%.",
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

    var BionicLegs = new Augmentation({
        name:AugmentationNames.BionicLegs, repCost:60e3, moneyCost:75e6,
        info:"Cybernetic legs created from plasteel and carbon fibers that completely replace the user's organic legs.<br><br>" +
             "This augmentation increases the player's agility by 60%.",
        agility_mult: 1.6,
    });
    BionicLegs.addToFactions(["Speakers for the Dead", "The Syndicate", "KuaiGong International",
                             "OmniTek Incorporated", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.BionicLegs)) {
        delete Augmentations[AugmentationNames.BionicLegs];
    }
    AddToAugmentations(BionicLegs);

    var GrapheneBionicLegs = new Augmentation({
        name:AugmentationNames.GrapheneBionicLegs, repCost:300e3, moneyCost:900e6,
        info:"An upgrade to the Bionic Legs augmentation. It fuses the implant with an advanced graphene " +
             "material to make it much stronger and lighter.<br><br>" +
             "This augmentation increases the player's agility by 150%.",
        prereqs: [AugmentationNames.BionicLegs],
        agility_mult: 2.5,
    });
    GrapheneBionicLegs.addToFactions(["MegaCorp", "ECorp", "Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicLegs)) {
        delete Augmentations[AugmentationNames.GrapheneBionicLegs];
    }
    AddToAugmentations(GrapheneBionicLegs);

    //Labor stat augmentations
    var SpeechProcessor = new Augmentation({
        name:AugmentationNames.SpeechProcessor, repCost:3e3, moneyCost:10e6,
        info:"A cochlear implant with an embedded computer that analyzes incoming speech. " +
             "The embedded computer processes characteristics of incoming speech, such as tone " +
             "and inflection, to pick up on subtle cues and aid in social interactions.<br><br>" +
             "This augmentation increases the player's charisma by 20%.",
        charisma_mult: 1.2,
    });
    SpeechProcessor.addToFactions(["Tian Di Hui", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                  "Ishima", "Volhaven", "Silhouette"]);
    if (augmentationExists(AugmentationNames.SpeechProcessor)) {
        delete Augmentations[AugmentationNames.SpeechProcessor];
    }
    AddToAugmentations(SpeechProcessor);

    let TITN41Injection = new Augmentation({
        name:AugmentationNames.TITN41Injection, repCost:10e3, moneyCost:38e6,
        info:"TITN is a series of viruses that targets and alters the sequences of human DNA in genes that " +
             "control personality. The TITN-41 strain alters these genes so that the subject becomes more " +
             "outgoing and socialable.<br><br>" +
             "This augmentation increases the player's charisma and charisma experience gain rate by 15%.",
        charisma_mult: 1.15,
        charisma_exp_mult: 1.15,
    });
    TITN41Injection.addToFactions(["Silhouette"]);
    if (augmentationExists(AugmentationNames.TITN41Injection)) {
        delete Augmentations[AugmentationNames.TITN41Injection];
    }
    AddToAugmentations(TITN41Injection);

    var EnhancedSocialInteractionImplant = new Augmentation({
        name:AugmentationNames.EnhancedSocialInteractionImplant, repCost:150e3, moneyCost:275e6,
        info:"A cranial implant that greatly assists in the user's ability to analyze social situations " +
             "and interactions. The system uses a wide variety of factors such as facial expression, body " +
             "language, and the voice's tone/inflection to determine the best course of action during social" +
             "situations. The implant also uses deep learning software to continuously learn new behavior" +
             "patterns and how to best respond.<br><br>" +
             "This augmentation increases the player's charisma and charisma experience gain rate by 60%.",
        charisma_mult: 1.6,
        charisma_exp_mult: 1.6,
    });
    EnhancedSocialInteractionImplant.addToFactions(["Bachman & Associates", "NWO", "Clarke Incorporated",
                                                   "OmniTek Incorporated", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.EnhancedSocialInteractionImplant)) {
        delete Augmentations[AugmentationNames.EnhancedSocialInteractionImplant];
    }
    AddToAugmentations(EnhancedSocialInteractionImplant);

    //Hacking augmentations
    var BitWire = new Augmentation({
        name:AugmentationNames.BitWire, repCost:1500, moneyCost:2e6,
        info: "A small brain implant embedded in the cerebrum. This regulates and improves the brain's computing " +
              "capabilities.<br><br>" +
              "This augmentation increases the player's hacking skill by 5%.",
        hacking_mult: 1.05,
    });
    BitWire.addToFactions(["CyberSec", "NiteSec"]);
    if (augmentationExists(AugmentationNames.BitWire)) {
        delete Augmentations[AugmentationNames.BitWire];
    }
    AddToAugmentations(BitWire);

    var ArtificialBioNeuralNetwork = new Augmentation({
        name:AugmentationNames.ArtificialBioNeuralNetwork, repCost:110e3, moneyCost:600e6,
        info:"A network consisting of millions of nanoprocessors is embedded into the brain. " +
             "The network is meant to mimick the way a biological brain solves a problem, which each " +
             "nanoprocessor acting similar to the way a neuron would in a neural network. However, these " +
             "nanoprocessors are programmed to perform computations much faster than organic neurons, " +
             "allowing its user to solve much more complex problems at a much faster rate.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 3%.<br>" +
             "Increases the amount of money the player's gains from hacking by 15%.<br>" +
             "Increases the player's hacking skill by 12%.",
        hacking_speed_mult: 1.03,
        hacking_money_mult: 1.15,
        hacking_mult: 1.12,
    });
    ArtificialBioNeuralNetwork.addToFactions(["BitRunners", "Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.ArtificialBioNeuralNetwork)) {
        delete Augmentations[AugmentationNames.ArtificialBioNeuralNetwork];
    }
    AddToAugmentations(ArtificialBioNeuralNetwork);

    var ArtificialSynapticPotentiation = new Augmentation({
        name:AugmentationNames.ArtificialSynapticPotentiation, repCost:2500, moneyCost:16e6,
        info:"The body is injected with a chemical that artificially induces synaptic potentiation, " +
             "otherwise known as the strengthening of synapses. This results in a enhanced cognitive abilities.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 2% <br>" +
             "Increases the player's hacking chance by 5%.<br>" +
             "Increases the player's hacking experience gain rate by 5%.",
        hacking_speed_mult: 1.02,
        hacking_chance_mult: 1.05,
        hacking_exp_mult: 1.05,
    });
    ArtificialSynapticPotentiation.addToFactions(["The Black Hand", "NiteSec"]);
    if (augmentationExists(AugmentationNames.ArtificialSynapticPotentiation)) {
        delete Augmentations[AugmentationNames.ArtificialSynapticPotentiation];
    }
    AddToAugmentations(ArtificialSynapticPotentiation);

    var EnhancedMyelinSheathing = new Augmentation({
        name:AugmentationNames.EnhancedMyelinSheathing, repCost:40e3, moneyCost:275e6,
        info:"Electrical signals are used to induce a new, artificial form of myelinogensis in the human body. " +
             "This process results in the proliferation of new, synthetic myelin sheaths in the nervous " +
             "system. These myelin sheaths can propogate neuro-signals much faster than their organic " +
             "counterparts, leading to greater processing speeds and better brain function.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 3%.<br>" +
             "Increases the player's hacking skill by 8%.<br>" +
             "Increases the player's hacking experience gain rate by 10%.",
        hacking_speed_mult: 1.03,
        hacking_exp_mult: 1.1,
        hacking_mult: 1.08,
    });
    EnhancedMyelinSheathing.addToFactions(["Fulcrum Secret Technologies", "BitRunners", "The Black Hand"]);
    if (augmentationExists(AugmentationNames.EnhancedMyelinSheathing)) {
        delete Augmentations[AugmentationNames.EnhancedMyelinSheathing];
    }
    AddToAugmentations(EnhancedMyelinSheathing);

    var SynapticEnhancement = new Augmentation({
        name:AugmentationNames.SynapticEnhancement, repCost:800, moneyCost:1.5e6,
        info:"A small cranial implant that continuously uses weak electric signals to stimulate the brain and " +
             "induce stronger synaptic activity. This improves the user's cognitive abilities.<br><br>" +
             "This augmentation increases the player's hacking speed by 3%.",
        hacking_speed_mult: 1.03,
    });
    SynapticEnhancement.addToFactions(["CyberSec"]);
    if (augmentationExists(AugmentationNames.SynapticEnhancement)) {
        delete Augmentations[AugmentationNames.SynapticEnhancement];
    }
    AddToAugmentations(SynapticEnhancement);

    var NeuralRetentionEnhancement = new Augmentation({
        name:AugmentationNames.NeuralRetentionEnhancement, repCost:8e3, moneyCost:50e6,
        info:"Chemical injections are used to permanently alter and strengthen the brain's neuronal " +
             "circuits, strengthening its ability to retain information.<br><br>" +
             "This augmentation increases the player's hacking experience gain rate by 25%.",
        hacking_exp_mult: 1.25,
    });
    NeuralRetentionEnhancement.addToFactions(["NiteSec"]);
    if (augmentationExists(AugmentationNames.NeuralRetentionEnhancement)) {
        delete Augmentations[AugmentationNames.NeuralRetentionEnhancement];
    }
    AddToAugmentations(NeuralRetentionEnhancement);

    var DataJack = new Augmentation({
        name:AugmentationNames.DataJack, repCost:45e3, moneyCost:90e6,
        info:"A brain implant that provides an interface for direct, wireless communication between a computer's main " +
             "memory and the mind. This implant allows the user to not only access a computer's memory, but also alter " +
             "and delete it.<br><br>" +
             "This augmentation increases the amount of money the player gains from hacking by 25%.",
        hacking_money_mult: 1.25,
    });
    DataJack.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "Chongqing", "New Tokyo"]);
    if (augmentationExists(AugmentationNames.DataJack)) {
        delete Augmentations[AugmentationNames.DataJack];
    }
    AddToAugmentations(DataJack);

    var ENM = new Augmentation({
        name:AugmentationNames.ENM, repCost:6e3, moneyCost:50e6,
        info:"A thin device embedded inside the arm containing a wireless module capable of connecting " +
             "to nearby networks. Once connected, the Netburner Module is capable of capturing and " +
             "processing all of the traffic on that network. By itself, the Embedded Netburner Module does " +
             "not do much, but a variety of very powerful upgrades can be installed that allow you to fully " +
             "control the traffic on a network.<br><br>" +
             "This augmentation increases the player's hacking skill by 8%.",
        hacking_mult: 1.08,
    });
    ENM.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp",
                      "Fulcrum Secret Technologies", "NWO", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.ENM)) {
        delete Augmentations[AugmentationNames.ENM];
    }
    AddToAugmentations(ENM);

    var ENMCore = new Augmentation({
        name:AugmentationNames.ENMCore, repCost:100e3, moneyCost:500e6,
        info:"The Core library is an implant that upgrades the firmware of the Embedded Netburner Module. " +
             "This upgrade allows the Embedded Netburner Module to generate its own data on a network.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 3%.<br>" +
             "Increases the amount of money the player gains from hacking by 10%.<br>" +
             "Increases the player's chance of successfully performing a hack by 3%.<br>" +
             "Increases the player's hacking experience gain rate by 7%.<br>" +
             "Increases the player's hacking skill by 7%.",
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

    var ENMCoreV2 = new Augmentation({
        name:AugmentationNames.ENMCoreV2, repCost:400e3, moneyCost:900e6,
        info:"The Core V2 library is an implant that upgrades the firmware of the Embedded Netburner Module. " +
             "This upgraded firmware allows the Embedded Netburner Module to control the information on " +
             "a network by re-routing traffic, spoofing IP addresses, or altering the data inside network " +
             "packets.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 5%.<br>" +
             "Increases the amount of money the player gains from hacking by 30%.<br>" +
             "Increases the player's chance of successfully performing a hack by 5%.<br>" +
             "Increases the player's hacking experience gain rate by 15%.<br>" +
             "Increases the player's hacking skill by 8%.",
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

    var ENMCoreV3 = new Augmentation({
        name:AugmentationNames.ENMCoreV3, repCost:700e3, moneyCost:1500e6,
        info:"The Core V3 library is an implant that upgrades the firmware of the Embedded Netburner Module. " +
             "This upgraded firmware allows the Embedded Netburner Module to seamlessly inject code into " +
             "any device on a network.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 5%.<br>" +
             "Increases the amount of money the player gains from hacking by 40%.<br>" +
             "Increases the player's chance of successfully performing a hack by 10%.<br>" +
             "Increases the player's hacking experience gain rate by 25%.<br>" +
             "Increases the player's hacking skill by 10%.",
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

    var ENMAnalyzeEngine = new Augmentation({
        name:AugmentationNames.ENMAnalyzeEngine, repCost:250e3, moneyCost:1200e6,
        info:"Installs the Analyze Engine for the Embedded Netburner Module, which is a CPU cluster " +
             "that vastly outperforms the Netburner Module's native single-core processor.<br><br>" +
             "This augmentation increases the player's hacking speed by 10%.",
        prereqs:[AugmentationNames.ENM],
        hacking_speed_mult: 1.1,
    });
    ENMAnalyzeEngine.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                                   "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMAnalyzeEngine)) {
        delete Augmentations[AugmentationNames.ENMAnalyzeEngine];
    }
    AddToAugmentations(ENMAnalyzeEngine);

    var ENMDMA = new Augmentation({
        name:AugmentationNames.ENMDMA, repCost:400e3, moneyCost:1400e6,
        info:"This implant installs a Direct Memory Access (DMA) controller into the " +
             "Embedded Netburner Module. This allows the Module to send and receive data " +
             "directly to and from the main memory of devices on a network.<br><br>" +
             "This augmentation:<br>" +
             "Increases the amount of money the player gains from hacking by 40%.<br>"  +
             "Increases the player's chance of successfully performing a hack by 20%.",
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

    var Neuralstimulator = new Augmentation({
        name:AugmentationNames.Neuralstimulator, repCost:20e3, moneyCost:600e6,
        info:"A cranial implant that intelligently stimulates certain areas of the brain " +
             "in order to improve cognitive functions.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 2%.<br>" +
             "Increases the player's chance of successfully performing a hack by 10%.<br>" +
             "Increases the player's hacking experience gain rate by 12%.",
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

    var NeuralAccelerator = new Augmentation({
        name:AugmentationNames.NeuralAccelerator, repCost:80e3, moneyCost:350e6,
        info:"A microprocessor that accelerates the processing " +
             "speed of biological neural networks. This is a cranial implant that is embedded inside the brain.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking skill by 10%.<br>" +
             "Increases the player's hacking experience gain rate by 15%.<br>" +
             "Increases the amount of money the player gains from hacking by 20%.",
        hacking_mult: 1.1,
        hacking_exp_mult: 1.15,
        hacking_money_mult: 1.2,
    });
    NeuralAccelerator.addToFactions(["BitRunners"]);
    if (augmentationExists(AugmentationNames.NeuralAccelerator)) {
        delete Augmentations[AugmentationNames.NeuralAccelerator];
    }
    AddToAugmentations(NeuralAccelerator);

    var CranialSignalProcessorsG1 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG1, repCost:4e3, moneyCost:14e6,
        info:"The first generation of Cranial Signal Processors. Cranial Signal Processors " +
             "are a set of specialized microprocessors that are attached to " +
             "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
             "so that the brain doesn't have to.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 1%.<br>" +
             "Increases the player's hacking skill by 5%.",
        hacking_speed_mult: 1.01,
        hacking_mult: 1.05,
    });
    CranialSignalProcessorsG1.addToFactions(["CyberSec"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG1)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG1];
    }
    AddToAugmentations(CranialSignalProcessorsG1);

    var CranialSignalProcessorsG2 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG2, repCost:7500, moneyCost:25e6,
        info:"The second generation of Cranial Signal Processors. Cranial Signal Processors " +
            "are a set of specialized microprocessors that are attached to " +
            "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
            "so that the brain doesn't have to.<br><br>" +
            "This augmentation:<br>" +
            "Increases the player's hacking speed by 2%.<br>" +
            "Increases the player's chance of successfully performing a hack by 5%.<br>" +
            "Increases the player's hacking skill by 7%.",
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

    var CranialSignalProcessorsG3 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG3, repCost:20e3, moneyCost:110e6,
        info:"The third generation of Cranial Signal Processors. Cranial Signal Processors " +
             "are a set of specialized microprocessors that are attached to " +
             "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
             "so that the brain doesn't have to.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 2%.<br>" +
             "Increases the amount of money the player gains from hacking by 15%.<br>" +
             "Increases the player's hacking skill by 9%.",
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

    var CranialSignalProcessorsG4 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG4, repCost:50e3, moneyCost:220e6,
        info:"The fourth generation of Cranial Signal Processors. Cranial Signal Processors " +
             "are a set of specialized microprocessors that are attached to " +
             "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
             "so that the brain doesn't have to.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 2%.<br>" +
             "Increases the amount of money the player gains from hacking by 20%.<br>" +
             "Increases the amount of money the player can inject into servers using grow() by 25%.",
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

    var CranialSignalProcessorsG5 = new Augmentation({
        name:AugmentationNames.CranialSignalProcessorsG5, repCost:100e3, moneyCost:450e6,
        info:"The fifth generation of Cranial Signal Processors. Cranial Signal Processors " +
             "are a set of specialized microprocessors that are attached to " +
             "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
             "so that the brain doesn't have to.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking skill by 30%.<br>" +
             "Increases the amount of money the player gains from hacking by 25%.<br>" +
             "Increases the amount of money the player can inject into servers using grow() by 75%.",
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

    var NeuronalDensification = new Augmentation({
        name:AugmentationNames.NeuronalDensification, repCost:75e3, moneyCost:275e6,
        info:"The brain is surgically re-engineered to have increased neuronal density " +
             "by decreasing the neuron gap junction. Then, the body is genetically modified " +
             "to enhance the production and capabilities of its neural stem cells.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking skill by 15%.<br>" +
             "Increases the player's hacking experience gain rate by 10%.<br>"+
             "Increases the player's hacking speed by 3%.",
        hacking_mult: 1.15,
        hacking_exp_mult: 1.1,
        hacking_speed_mult: 1.03,
    });
    NeuronalDensification.addToFactions(["Clarke Incorporated"]);
    if (augmentationExists(AugmentationNames.NeuronalDensification)) {
        delete Augmentations[AugmentationNames.NeuronalDensification];
    }
    AddToAugmentations(NeuronalDensification);

    //Work Augmentations
    var NuoptimalInjectorImplant = new Augmentation({
        name:AugmentationNames.NuoptimalInjectorImplant, repCost:2e3, moneyCost:4e6,
        info:"This torso implant automatically injects nootropic supplements into " +
             "the bloodstream to improve memory, increase focus, and provide other " +
             "cognitive enhancements.<br><br>" +
             "This augmentation increases the amount of reputation the player gains " +
             "when working for a company by 20%.",
        company_rep_mult: 1.2,
    });
    NuoptimalInjectorImplant.addToFactions(["Tian Di Hui", "Volhaven", "New Tokyo", "Chongqing", "Ishima",
                                           "Clarke Incorporated", "Four Sigma", "Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.NuoptimalInjectorImplant)) {
        delete Augmentations[AugmentationNames.NuoptimalInjectorImplant];
    }
    AddToAugmentations(NuoptimalInjectorImplant);

    var SpeechEnhancement = new Augmentation({
        name:AugmentationNames.SpeechEnhancement, repCost:1e3, moneyCost:2.5e6,
        info:"An advanced neural implant that improves your speaking abilities, making " +
             "you more convincing and likable in conversations and overall improving your " +
             "social interactions.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's charisma by 10%.<br>" +
             "Increases the amount of reputation the player gains when working for a company by 10%.",
        company_rep_mult: 1.1,
        charisma_mult: 1.1,
    });
    SpeechEnhancement.addToFactions(["Tian Di Hui", "Speakers for the Dead", "Four Sigma", "KuaiGong International",
                                    "Clarke Incorporated", "Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.SpeechEnhancement)) {
        delete Augmentations[AugmentationNames.SpeechEnhancement];
    }
    AddToAugmentations(SpeechEnhancement);

    var FocusWire = new Augmentation({
        name:AugmentationNames.FocusWire, repCost:30e3, moneyCost:180e6,
        info:"A cranial implant that stops procrastination by blocking specific neural pathways " +
             "in the brain.<br><br>" +
             "This augmentation:<br>" +
             "Increases all experience gains by 5%.<br>" +
             "Increases the amount of money the player gains from working by 20%.<br>" +
             "Increases the amount of reputation the player gains when working for a company by 10%.",
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

    var PCDNI = new Augmentation({
        name:AugmentationNames.PCDNI, repCost:150e3, moneyCost:750e6,
        info:"Installs a Direct-Neural Interface jack into your arm that is compatible with most " +
             "computers. Connecting to a computer through this jack allows you to interface with " +
             "it using the brain's electrochemical signals.<br><br>" +
             "This augmentation:<br>" +
             "Increases the amount of reputation the player gains when working for a company by 30%.<br>" +
             "Increases the player's hacking skill by 8%.",
        company_rep_mult: 1.3,
        hacking_mult: 1.08,
    });
    PCDNI.addToFactions(["Four Sigma", "OmniTek Incorporated", "ECorp", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.PCDNI)) {
        delete Augmentations[AugmentationNames.PCDNI];
    }
    AddToAugmentations(PCDNI);

    var PCDNIOptimizer = new Augmentation({
        name:AugmentationNames.PCDNIOptimizer, repCost:200e3, moneyCost:900e6,
        info:"This is a submodule upgrade to the PC Direct-Neural Interface augmentation. It " +
             "improves the performance of the interface and gives the user more control options " +
             "to the connected computer.<br><br>" +
             "This augmentation:<br>" +
             "Increases the amount of reputation the player gains when working for a company by 75%.<br>" +
             "Increases the player's hacking skill by 10%.",
        prereqs:[AugmentationNames.PCDNI],
        company_rep_mult: 1.75,
        hacking_mult: 1.1,
    });
    PCDNIOptimizer.addToFactions(["Fulcrum Secret Technologies", "ECorp", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.PCDNIOptimizer)) {
        delete Augmentations[AugmentationNames.PCDNIOptimizer];
    }
    AddToAugmentations(PCDNIOptimizer);

    var PCDNINeuralNetwork = new Augmentation({
        name:AugmentationNames.PCDNINeuralNetwork, repCost:600e3, moneyCost:1500e6,
        info:"This is an additional installation that upgrades the functionality of the " +
             "PC Direct-Neural Interface augmentation. When connected to a computer, " +
             "The NeuroNet Injector upgrade allows the user to use his/her own brain's " +
             "processing power to aid the computer in computational tasks.<br><br>" +
             "This augmentation:<br>" +
             "Increases the amount of reputation the player gains when working for a company by 100%.<br>" +
             "Increases the player's hacking skill by 10%.<br>" +
             "Increases the player's hacking speed by 5%.",
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

    var ADRPheromone1 = new Augmentation({
        name:AugmentationNames.ADRPheromone1, repCost:1500, moneyCost:3.5e6,
        info:"The body is genetically re-engineered so that it produces the ADR-V1 pheromone, " +
             "an artificial pheromone discovered by scientists. The ADR-V1 pheromone, when excreted, " +
             "triggers feelings of admiration and approval in other people.<br><br>" +
             "This augmentation:<br>" +
             "Increases the amount of reputation the player gains when working for a company by 10% <br>" +
             "Increases the amount of reputation the player gains for a faction by 10%.",
        company_rep_mult: 1.1,
        faction_rep_mult: 1.1,
    });
    ADRPheromone1.addToFactions(["Tian Di Hui", "The Syndicate", "NWO", "MegaCorp", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.ADRPheromone1)) {
        delete Augmentations[AugmentationNames.ADRPheromone1];
    }
    AddToAugmentations(ADRPheromone1);

    var ADRPheromone2 = new Augmentation({
        name:AugmentationNames.ADRPheromone2, repCost:25e3, moneyCost:110e6,
        info:"The body is genetically re-engineered so that it produces the ADR-V2 pheromone, " +
             "which is similar to but more potent than ADR-V1. This pheromone, when excreted, " +
             "triggers feelings of admiration, approval, and respect in others.<br><br>" +
             "This augmentation:<br>" +
             "Increases the amount of reputation the player gains for a faction and company by 20%.",
        company_rep_mult: 1.2,
        faction_rep_mult: 1.2,
    });
    ADRPheromone2.addToFactions(["Silhouette", "Four Sigma", "Bachman & Associates", "Clarke Incorporated"]);
    if (augmentationExists(AugmentationNames.ADRPheromone2)) {
        delete Augmentations[AugmentationNames.ADRPheromone2];
    }
    AddToAugmentations(ADRPheromone2);

    //HacknetNode Augmentations
    var HacknetNodeCPUUpload = new Augmentation({
        name:AugmentationNames.HacknetNodeCPUUpload, repCost:1500, moneyCost:2.2e6,
        info:"Uploads the architecture and design details of a Hacknet Node's CPU into " +
             "the brain. This allows the user to engineer custom hardware and software  " +
             "for the Hacknet Node that provides better performance.<br><br>" +
             "This augmentation:<br>" +
             "Increases the amount of money produced by Hacknet Nodes by 15%.<br>" +
             "Decreases the cost of purchasing a Hacknet Node by 15%.",
         hacknet_node_money_mult: 1.15,
         hacknet_node_purchase_cost_mult: 0.85,
    });
    HacknetNodeCPUUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCPUUpload)) {
        delete Augmentations[AugmentationNames.HacknetNodeCPUUpload];
    }
    AddToAugmentations(HacknetNodeCPUUpload);

    var HacknetNodeCacheUpload = new Augmentation({
        name:AugmentationNames.HacknetNodeCacheUpload, repCost:1e3, moneyCost:1.1e6,
        info:"Uploads the architecture and design details of a Hacknet Node's main-memory cache " +
             "into the brain. This allows the user to engineer custom cache hardware for the  " +
             "Hacknet Node that offers better performance.<br><br>" +
             "This augmentation:<br> " +
             "Increases the amount of money produced by Hacknet Nodes by 10%.<br>" +
             "Decreases the cost of leveling up a Hacknet Node by 15%.",
        hacknet_node_money_mult: 1.10,
        hacknet_node_level_cost_mult: 0.85,
    });
    HacknetNodeCacheUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCacheUpload)) {
        delete Augmentations[AugmentationNames.HacknetNodeCacheUpload];
    }
    AddToAugmentations(HacknetNodeCacheUpload);

    var HacknetNodeNICUpload = new Augmentation({
        name:AugmentationNames.HacknetNodeNICUpload, repCost:750, moneyCost:900e3,
        info:"Uploads the architecture and design details of a Hacknet Node's Network Interface Card (NIC) " +
             "into the brain. This allows the user to engineer a custom NIC for the Hacknet Node that " +
             "offers better performance.<br><br>" +
             "This augmentation:<br>" +
             "Increases the amount of money produced by Hacknet Nodes by 10%.<br>" +
             "Decreases the cost of purchasing a Hacknet Node by 10%.",
        hacknet_node_money_mult: 1.1,
        hacknet_node_purchase_cost_mult: 0.9,
    });
    HacknetNodeNICUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeNICUpload)) {
        delete Augmentations[AugmentationNames.HacknetNodeNICUpload];
    }
    AddToAugmentations(HacknetNodeNICUpload);

    var HacknetNodeKernelDNI = new Augmentation({
        name:AugmentationNames.HacknetNodeKernelDNI, repCost:3e3, moneyCost:8e6,
        info:"Installs a Direct-Neural Interface jack into the arm that is capable of connecting to a " +
             "Hacknet Node. This lets the user access and manipulate the Node's kernel using the mind's " +
             "electrochemical signals.<br><br>" +
             "This augmentation increases the amount of money produced by Hacknet Nodes by 25%.",
        hacknet_node_money_mult: 1.25,
    });
    HacknetNodeKernelDNI.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeKernelDNI)) {
        delete Augmentations[AugmentationNames.HacknetNodeKernelDNI];
    }
    AddToAugmentations(HacknetNodeKernelDNI);

    var HacknetNodeCoreDNI = new Augmentation({
        name:AugmentationNames.HacknetNodeCoreDNI, repCost:5e3, moneyCost:12e6,
        info:"Installs a Direct-Neural Interface jack into the arm that is capable of connecting " +
             "to a Hacknet Node. This lets the user access and manipulate the Node's processing logic using " +
             "the mind's electrochemical signals.<br><br>" +
             "This augmentation increases the amount of money produced by Hacknet Nodes by 45%.",
        hacknet_node_money_mult: 1.45,
    });
    HacknetNodeCoreDNI.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCoreDNI)) {
        delete Augmentations[AugmentationNames.HacknetNodeCoreDNI];
    }
    AddToAugmentations(HacknetNodeCoreDNI);

    //Misc/Hybrid augmentations
    var NeuroFluxGovernor = new Augmentation({
        name:AugmentationNames.NeuroFluxGovernor, repCost:500, moneyCost: 750e3,
        info:"A device that is embedded in the back of the neck. The NeuroFlux Governor " +
             "monitors and regulates nervous impulses coming to and from the spinal column, " +
             "essentially 'governing' the body. By doing so, it improves the functionality of the " +
             "body's nervous system.<br><br>" +
             "This is a special augmentation because it can be leveled up infinitely. Each level of this augmentation " +
             "increases ALL of the player's multipliers by 1%.",
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
    mult = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, nextLevel);
    NeuroFluxGovernor.baseRepRequirement = 500 * mult * CONSTANTS.AugmentationRepMultiplier * BitNodeMultipliers.AugmentationRepCost;
    NeuroFluxGovernor.baseCost = 750e3 * mult * CONSTANTS.AugmentationCostMultiplier * BitNodeMultipliers.AugmentationMoneyCost;
    if (augmentationExists(AugmentationNames.NeuroFluxGovernor)) {
        delete Augmentations[AugmentationNames.NeuroFluxGovernor];
    }
    NeuroFluxGovernor.addToAllFactions();
    AddToAugmentations(NeuroFluxGovernor);

    var Neurotrainer1 = new Augmentation({
        name:AugmentationNames.Neurotrainer1, repCost:400, moneyCost:800e3,
        info:"A decentralized cranial implant that improves the brain's ability to learn. It is " +
             "installed by releasing millions of nanobots into the human brain, each of which " +
             "attaches to a different neural pathway to enhance the brain's ability to retain " +
             "and retrieve information.<br><br>" +
             "This augmentation increases the player's experience gain rate for all stats by 10%.",
        hacking_exp_mult: 1.1,
        strength_exp_mult: 1.1,
        defense_exp_mult: 1.1,
        dexterity_exp_mult: 1.1,
        agility_exp_mult: 1.1,
        charisma_exp_mult: 1.1,
    });
    Neurotrainer1.addToFactions(["CyberSec"]);
    if (augmentationExists(AugmentationNames.Neurotrainer1)) {
        delete Augmentations[AugmentationNames.Neurotrainer1];
    }
    AddToAugmentations(Neurotrainer1);

    var Neurotrainer2 = new Augmentation({
        name:AugmentationNames.Neurotrainer2, repCost:4e3, moneyCost:9e6,
        info:"A decentralized cranial implant that improves the brain's ability to learn. This " +
             "is a more powerful version of the Neurotrainer I augmentation, but it does not " +
             "require Neurotrainer I to be installed as a prerequisite.<br><br>" +
             "This augmentation increases the player's experience gain rate for all stats by 15%.",
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

    var Neurotrainer3 = new Augmentation({
        name:AugmentationNames.Neurotrainer3, repCost:10e3, moneyCost:26e6,
        info:"A decentralized cranial implant that improves the brain's ability to learn. This " +
             "is a more powerful version of the Neurotrainer I and Neurotrainer II augmentation, " +
             "but it does not require either of them to be installed as a prerequisite.<br><br>" +
             "This augmentation increases the player's experience gain rate for all stats by 20%.",
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

    var Hypersight = new Augmentation({
        name:AugmentationNames.Hypersight, repCost:60e3, moneyCost:550e6,
        info:"A bionic eye implant that grants sight capabilities far beyond those of a natural human. " +
             "Embedded circuitry within the implant provides the ability to detect heat and movement " +
             "through solid objects such as wells, thus providing 'x-ray vision'-like capabilities.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's dexterity by 40%.<br>" +
             "Increases the player's hacking speed by 3%.<br>" +
             "Increases the amount of money the player gains from hacking by 10%.",
        dexterity_mult: 1.4,
        hacking_speed_mult: 1.03,
        hacking_money_mult: 1.1,
    });
    Hypersight.addToFactions(["Blade Industries", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.Hypersight)) {
        delete Augmentations[AugmentationNames.Hypersight];
    }
    AddToAugmentations(Hypersight);

    var LuminCloaking1 = new Augmentation({
        name:AugmentationNames.LuminCloaking1, repCost:600, moneyCost:1e6,
        info:"A skin implant that reinforces the skin with highly-advanced synthetic cells. These " +
             "cells, when powered, have a negative refractive index. As a result, they bend light " +
             "around the skin, making the user much harder to see from the naked eye.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's agility by 5% <br>" +
             "Increases the amount of money the player gains from crimes by 10%.",
        agility_mult: 1.05,
        crime_money_mult: 1.1,
    });
    LuminCloaking1.addToFactions(["Slum Snakes", "Tetrads"]);
    if (augmentationExists(AugmentationNames.LuminCloaking1)) {
        delete Augmentations[AugmentationNames.LuminCloaking1];
    }
    AddToAugmentations(LuminCloaking1);

    var LuminCloaking2 = new Augmentation({
        name:AugmentationNames.LuminCloaking2, repCost:2e3, moneyCost:6e6,
        info:"This is a more advanced version of the LuminCloaking-V2 augmentation. This skin implant " +
             "reinforces the skin with highly-advanced synthetic cells. These " +
             "cells, when powered, are capable of not only bending light but also of bending heat, " +
             "making the user more resilient as well as stealthy.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's agility by 10% <br>" +
             "Increases the player's defense by 10% <br>" +
             "Increases the amount of money the player gains from crimes by 25%.",
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

    var SmartSonar = new Augmentation({
        name:AugmentationNames.SmartSonar, repCost:9e3, moneyCost:15e6,
        info:"A cochlear implant that helps the player detect and locate enemies " +
             "using sound propagation.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's dexterity by 10%.<br>" +
             "Increases the player's dexterity experience gain rate by 15%.<br>" +
             "Increases the amount of money the player gains from crimes by 25%.",
        dexterity_mult: 1.1,
        dexterity_exp_mult: 1.15,
        crime_money_mult: 1.25,
    });
    SmartSonar.addToFactions(["Slum Snakes"]);
    if (augmentationExists(AugmentationNames.SmartSonar)) {
        delete Augmentations[AugmentationNames.SmartSonar];
    }
    AddToAugmentations(SmartSonar);

    var PowerRecirculator = new Augmentation({
        name:AugmentationNames.PowerRecirculator, repCost:10e3, moneyCost:36e6,
        info:"The body's nerves are attached with polypyrrole nanocircuits that " +
             "are capable of capturing wasted energy (in the form of heat) " +
             "and converting it back into usable power.<br><br>" +
             "This augmentation:<br>" +
             "Increases all of the player's stats by 5%.<br>" +
             "Increases the player's experience gain rate for all stats by 10%.",
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

    //Unique AUGS (Each Faction gets one unique augmentation)
    //Factions that already have unique augs up to this point:
    //  Slum Snakes, CyberSec, Netburners, Fulcrum Secret Technologies,
    //  Silhouette

	//Illuminati
    var QLink = new Augmentation({
        name:AugmentationNames.QLink, repCost:750e3, moneyCost:1300e6,
        info:"A brain implant that wirelessly connects you to the Illuminati's " +
             "quantum supercomputer, allowing you to access and use its incredible " +
             "computing power.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking speed by 10%.<br>" +
             "Increases the player's chance of successfully performing a hack by 30%.<br>" +
             "Increases the amount of money the player gains from hacking by 100%.",
        hacking_speed_mult: 1.1,
        hacking_chance_mult: 1.3,
        hacking_money_mult: 2,
    });
    QLink.addToFactions(["Illuminati"]);
    if (augmentationExists(AugmentationNames.QLink)) {
        delete Augmentations[AugmentationNames.QLink];
    }
    AddToAugmentations(QLink);

	//Daedalus
    var RedPill = new Augmentation({
        name:AugmentationNames.TheRedPill, repCost:1e6, moneyCost:0,
        info:"It's time to leave the cave."
    });
    RedPill.addToFactions(["Daedalus"]);
    if (augmentationExists(AugmentationNames.TheRedPill)) {
        delete Augmentations[AugmentationNames.TheRedPill];
    }
    AddToAugmentations(RedPill);

	//Covenant
    var SPTN97 = new Augmentation({
        name:AugmentationNames.SPTN97, repCost:500e3, moneyCost:975e6,
        info:"The SPTN-97 gene is injected into the genome. The SPTN-97 gene is an " +
             "artificially-synthesized gene that was developed by DARPA to create " +
             "super-soldiers through genetic modification. The gene was outlawed in " +
             "2056.<br><br>" +
             "This augmentation:<br>" +
             "Increases all of the player's combat stats by 75%.<br>" +
             "Increases the player's hacking skill by 15%.",
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

	//ECorp
    var HiveMind = new Augmentation({
        name:AugmentationNames.HiveMind, repCost:600e3, moneyCost:1100e6,
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

	//MegaCorp
    var CordiARCReactor = new Augmentation({
        name:AugmentationNames.CordiARCReactor, repCost:450e3, moneyCost:1000e6,
        info:"The thoracic cavity is equipped with a small chamber designed " +
             "to hold and sustain hydrogen plasma. The plasma is used to generate " +
             "fusion power through nuclear fusion, providing limitless amount of clean " +
             "energy for the body.<br><br>" +
             "This augmentation:<br>" +
             "Increases all of the player's combat stats by 35%.<br>" +
             "Increases all of the player's combat stat experience gain rate by 35%.",
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

	//BachmanAndAssociates
    var SmartJaw = new Augmentation({
        name:AugmentationNames.SmartJaw, repCost:150e3, moneyCost:550e6,
        info:"A bionic jaw that contains advanced hardware and software " +
             "capable of psychoanalyzing and profiling the personality of " +
             "others using optical imaging software.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's charisma by 50%. <br>" +
             "Increases the player's charisma experience gain rate by 50%.<br>" +
             "Increases the amount of reputation the player gains for a company by 25%.<br>" +
             "Increases the amount of reputation the player gains for a faction by 25%.",
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

	//BladeIndustries
    var Neotra = new Augmentation({
        name:AugmentationNames.Neotra, repCost:225e3, moneyCost:575e6,
        info:"A highly-advanced techno-organic drug that is injected into the skeletal " +
             "and integumentary system. The drug permanently modifies the DNA of the " +
             "body's skin and bone cells, granting them the ability to repair " +
             "and restructure themselves.<br><br>" +
             "This augmentation increases the player's strength and defense by 55%.",
        strength_mult: 1.55,
        defense_mult: 1.55,
    });
    Neotra.addToFactions(["Blade Industries"]);
    if (augmentationExists(AugmentationNames.Neotra)) {
        delete Augmentations[AugmentationNames.Neotra];
    }
    AddToAugmentations(Neotra);

	//NWO
    var Xanipher = new Augmentation({
        name:AugmentationNames.Xanipher, repCost:350e3, moneyCost:850e6,
        info:"A concoction of advanced nanobots that is orally ingested into the " +
             "body. These nanobots induce physiological change and significantly " +
             "improve the body's functionining in all aspects.<br><br>" +
             "This augmentation:<br>" +
             "Increases all of the player's stats by 20%.<br>" +
             "Increases the player's experience gain rate for all stats by 15%.",
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

    //ClarkeIncorporated
    var nextSENS = new Augmentation({
        name:AugmentationNames.nextSENS, repCost:175e3, moneyCost:385e6,
        info:"The body is genetically re-engineered to maintain a state " +
             "of negligible senescence, preventing the body from " +
             "deteriorating with age.<br><br>" +
             "This augmentation increases all of the player's stats by 20%.",
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

	//OmniTekIncorporated
    var OmniTekInfoLoad = new Augmentation({
        name:AugmentationNames.OmniTekInfoLoad, repCost:250e3, moneyCost:575e6,
        info:"OmniTek's data and information repository is uploaded " +
             "into your brain, enhancing your programming and " +
             "hacking abilities.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking skill by 20%.<br>" +
             "Increases the player's hacking experience gain rate by 25%.",
        hacking_mult: 1.2,
        hacking_exp_mult: 1.25,
    });
    OmniTekInfoLoad.addToFactions(["OmniTek Incorporated"]);
    if (augmentationExists(AugmentationNames.OmniTekInfoLoad)) {
        delete Augmentations[AugmentationNames.OmniTekInfoLoad];
    }
    AddToAugmentations(OmniTekInfoLoad);

	//FourSigma
    //TODO Later when Intelligence is added in . Some aug that greatly increases int

	//KuaiGongInternational
    var PhotosyntheticCells = new Augmentation({
        name:AugmentationNames.PhotosyntheticCells, repCost:225e3, moneyCost:550e6,
        info:"Chloroplasts are added to epidermal stem cells and are applied " +
             "to the body using a skin graft. The result is photosynthetic " +
             "skin cells, allowing users to generate their own energy " +
             "and nutrition using solar power.<br><br>" +
             "This augmentation increases the player's strength, defense, and agility by 40%.",
            strength_mult: 1.4,
            defense_mult: 1.4,
            agility_mult: 1.4,
    });
    PhotosyntheticCells.addToFactions(["KuaiGong International"]);
    if (augmentationExists(AugmentationNames.PhotosyntheticCells)) {
        delete Augmentations[AugmentationNames.PhotosyntheticCells];
    }
    AddToAugmentations(PhotosyntheticCells);

	//BitRunners
    var Neurolink = new Augmentation({
        name:AugmentationNames.Neurolink, repCost:350e3, moneyCost:875e6,
        info:"A brain implant that provides a high-bandwidth, direct neural link between your " +
             "mind and BitRunners' data servers, which reportedly contain " +
             "the largest database of hacking tools and information in the world.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's hacking skill by 15%.<br>" +
             "Increases the player's hacking experience gain rate by 20%.<br>" +
             "Increases the player's chance of successfully performing a hack by 10%.<br>" +
             "Increases the player's hacking speed by 5%.<br>" +
             "Lets the player start with the FTPCrack.exe and relaySMTP.exe programs after a reset.",
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

	//BlackHand
    var TheBlackHand = new Augmentation({
        name:AugmentationNames.TheBlackHand, repCost:40e3, moneyCost:110e6,
        info:"A highly advanced bionic hand. This prosthetic not only " +
             "enhances strength and dexterity but it is also embedded " +
             "with hardware and firmware that lets the user connect to, access and hack " +
             "devices and machines just by touching them.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's strength and dexterity by 15%.<br>" +
             "Increases the player's hacking skill by 10%.<br>" +
             "Increases the player's hacking speed by 2%.<br>" +
             "Increases the amount of money the player gains from hacking by 10%.",
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

	//NiteSec
    var CRTX42AA = new Augmentation({
        name:AugmentationNames.CRTX42AA, repCost:18e3, moneyCost:45e6,
        info:"The CRTX42-AA gene is injected into the genome. " +
             "The CRTX42-AA is an artificially-synthesized gene that targets the visual and prefrontal " +
             "cortex and improves cognitive abilities.<br><br>" +
             "This augmentation:<br>" +
             "Improves the player's hacking skill by 8%.<br>" +
             "Improves the player's hacking experience gain rate by 15%.",
        hacking_mult: 1.08,
        hacking_exp_mult: 1.15,
    });
    CRTX42AA.addToFactions(["NiteSec"]);
    if (augmentationExists(AugmentationNames.CRTX42AA)) {
        delete Augmentations[AugmentationNames.CRTX42AA];
    }
    AddToAugmentations(CRTX42AA);

	//Chongqing
    var Neuregen = new Augmentation({
        name:AugmentationNames.Neuregen, repCost:15e3, moneyCost:75e6,
        info:"A drug that genetically modifies the neurons in the brain. " +
             "The result is that these neurons never die and continuously " +
             "regenerate and strengthen themselves.<br><br>" +
             "This augmentation increases the player's hacking experience gain rate by 40%.",
        hacking_exp_mult: 1.4,
    });
    Neuregen.addToFactions(["Chongqing"]);
    if (augmentationExists(AugmentationNames.Neuregen)) {
        delete Augmentations[AugmentationNames.Neuregen];
    }
    AddToAugmentations(Neuregen);

	//Sector12
    var CashRoot = new Augmentation({
        name:AugmentationNames.CashRoot, repCost:5e3, moneyCost:25e6,
        info:"A collection of digital assets saved on a small chip. The chip is implanted " +
             "into your wrist. A small jack in the chip allows you to connect it to a computer " +
             "and upload the assets.<br><br>" +
             "This augmentation:<br>" +
             "Lets the player start with $1,000,000 after a reset.<br>" +
             "Lets the player start with the BruteSSH.exe program after a reset."
    });
    CashRoot.addToFactions(["Sector-12"]);
    if (augmentationExists(AugmentationNames.CashRoot)) {
        delete Augmentations[AugmentationNames.CashRoot];
    }
    AddToAugmentations(CashRoot);

	//NewTokyo
    var NutriGen = new Augmentation({
        name:AugmentationNames.NutriGen, repCost:2500, moneyCost:500e3,
        info:"A thermo-powered artificial nutrition generator. Endogenously " +
             "synthesizes glucose, amino acids, and vitamins and redistributes them " +
             "across the body. The device is powered by the body's naturally wasted " +
             "energy in the form of heat.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's experience gain rate for all combat stats by 20%.",
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

	//Aevum
    //TODO Later Something that lets you learn advanced math...this increases int
           //and profits as a trader/from trading

    //Ishima
    var INFRARet = new Augmentation({
        name:AugmentationNames.INFRARet, repCost:3e3, moneyCost:6e6,
        info:"A retina implant consisting of a tiny chip that sits behind the " +
             "retina. This implant lets people visually detect infrared radiation.<br><br>"  +
             "This augmentation:<br>" +
             "Increases the player's crime success rate by 25%.<br>" +
             "Increases the amount of money the player gains from crimes by 10%.<br>" +
             "Increases the player's dexterity by 10%.",
        crime_success_mult: 1.25,
        crime_money_mult: 1.1,
        dexterity_mult: 1.1,
    });
    INFRARet.addToFactions(["Ishima"]);
    if (augmentationExists(AugmentationNames.INFRARet)) {
        delete Augmentations[AugmentationNames.INFRARet];
    }
    AddToAugmentations(INFRARet);

	//Volhaven
    var DermaForce = new Augmentation({
        name:AugmentationNames.DermaForce, repCost:6e3, moneyCost:10e6,
        info:"A synthetic skin is grafted onto the body. The skin consists of " +
             "millions of nanobots capable of projecting high-density muon beams, " +
             "creating an energy barrier around the user.<br><br>" +
             "This augmentation increases the player's defense by 40%.",
        defense_mult: 1.4,
    });
    DermaForce.addToFactions(["Volhaven"]);
    if (augmentationExists(AugmentationNames.DermaForce)) {
        delete Augmentations[AugmentationNames.DermaForce];
    }
    AddToAugmentations(DermaForce);

	//SpeakersForTheDead
    var GrapheneBrachiBlades = new Augmentation({
        name:AugmentationNames.GrapheneBrachiBlades, repCost:90e3, moneyCost:500e6,
        info:"An upgrade to the BrachiBlades augmentation. It infuses " +
             "the retractable blades with an advanced graphene material " +
             "to make them much stronger and lighter.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's strength and defense by 40%.<br>" +
             "Increases the player's crime success rate by 10%.<br>" +
             "Increases the amount of money the player gains from crimes by 30%.",
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

	//DarkArmy
    var GrapheneBionicArms = new Augmentation({
        name:AugmentationNames.GrapheneBionicArms, repCost:200e3, moneyCost:750e6,
        info:"An upgrade to the Bionic Arms augmentation. It infuses the " +
             "prosthetic arms with an advanced graphene material " +
             "to make them much stronger and lighter.<br><br>" +
             "This augmentation increases the player's strength and dexterity by 85%.",
        prereqs:[AugmentationNames.BionicArms],
        strength_mult: 1.85,
        dexterity_mult: 1.85,
    });
    GrapheneBionicArms.addToFactions(["The Dark Army"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicArms)) {
        delete Augmentations[AugmentationNames.GrapheneBionicArms];
    }
    AddToAugmentations(GrapheneBionicArms);

	//TheSyndicate
    var BrachiBlades = new Augmentation({
        name:AugmentationNames.BrachiBlades, repCost:5e3, moneyCost:18e6,
        info:"A set of retractable plasteel blades are implanted in the arm, underneath the skin.<br><br>" +
             "This augmentation:<br>" +
             "Increases the player's strength and defense by 15%.<br>" +
             "Increases the player's crime success rate by 10%.<br>" +
             "Increases the amount of money the player gains from crimes by 15%.",
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

    //Tetrads
    var BionicArms = new Augmentation({
        name:AugmentationNames.BionicArms, repCost:25e3, moneyCost:55e6,
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

	//TianDiHui
    var SNA = new Augmentation({
        name:AugmentationNames.SNA, repCost:2500, moneyCost:6e6,
        info:"A cranial implant that affects the user's personality, making them better " +
             "at negotiation in social situations.<br><br>" +
             "This augmentation:<br>" +
             "Increases the amount of money the player earns at a company by 10%.<br>" +
             "Increases the amount of reputation the player gains when working for a " +
             "company or faction by 15%.",
        work_money_mult: 1.1,
        company_rep_mult: 1.15,
        faction_rep_mult: 1.15,
    });
    SNA.addToFactions(["Tian Di Hui"]);
    if (augmentationExists(AugmentationNames.SNA)) {
        delete Augmentations[AugmentationNames.SNA];
    }
    AddToAugmentations(SNA);

    //For BitNode-2, add all Augmentations to crime/evil factions.
    //Do this before adding special Augmentations that become available in later BitNodes
    if (Player.bitNodeN === 2) {
        console.log("Adding all augmentations to crime factions for Bit node 2");
        Factions["Slum Snakes"].addAllAugmentations(Augmentations);
        Factions["Tetrads"].addAllAugmentations(Augmentations);
        Factions["The Syndicate"].addAllAugmentations(Augmentations);
        Factions["The Dark Army"].addAllAugmentations(Augmentations);
        Factions["Speakers for the Dead"].addAllAugmentations(Augmentations);
        Factions["NiteSec"].addAllAugmentations(Augmentations);
        Factions["The Black Hand"].addAllAugmentations(Augmentations);
    }

    //Special Bladeburner Augmentations
    var BladeburnersFactionName = "Bladeburners";
    if (factionExists(BladeburnersFactionName)) {
        var EsperEyewear = new Augmentation({
            name:AugmentationNames.EsperEyewear, repCost:500, moneyCost:33e6,
            info:"Ballistic-grade protective and retractable eyewear that was designed specially " +
                 "for Bladeburner units. This " +
                 "is implanted by installing a mechanical frame in the skull's orbit. " +
                 "This frame interfaces with the brain and allows the user to " +
                 "automatically extrude and extract the eyewear. The eyewear protects " +
                 "against debris, shrapnel, laser, flash, and gas. It is also " +
                 "embedded with a data processing chip that can be programmed to display an " +
                 "AR HUD and assist the user in field missions.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 3%.<br>" +
                 "Increases the player's dexterity by 5%.",
            bladeburner_success_chance_mult: 1.03,
            dexterity_mult: 1.05,
        });
        EsperEyewear.addToFactions([BladeburnersFactionName]);
        resetAugmentation(EsperEyewear);

        var EMS4Recombination = new Augmentation({
            name:AugmentationNames.EMS4Recombination, repCost: 1e3, moneyCost:55e6,
            info:"A DNA recombination of the EMS-4 Gene. This genetic engineering " +
                 "technique was originally used on Bladeburners during the Synthoid uprising " +
                 "to induce wakefulness and concentration, suppress fear, reduce empathy, and " +
                 "improve reflexes and memory-recall among other things.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's sucess chance in Bladeburner contracts/operations by 3%.<br>" +
                 "Increases the player's effectiveness in Bladeburner Field Analysis by 5%.<br>" +
                 "Increases the player's Bladeburner stamina gain rate by 2%.",
            bladeburner_success_chance_mult: 1.03,
            bladeburner_analysis_mult: 1.05,
            bladeburner_stamina_gain_mult: 1.02,
        });
        EMS4Recombination.addToFactions([BladeburnersFactionName]);
        resetAugmentation(EMS4Recombination);

        var OrionShoulder = new Augmentation({
            name:AugmentationNames.OrionShoulder, repCost:2.5e3, moneyCost:110e6,
            info:"A bionic shoulder augmentation for the right shoulder. Using cybernetics, " +
                 "the ORION-MKIV shoulder enhances the strength and dexterity " +
                 "of the user's right arm. It also provides protection due to its " +
                 "crystallized graphene plating.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's defense by 5%.<br>" +
                 "Increases the player's strength and dexterity by 5%.<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 4%.",
            defense_mult: 1.05,
            strength_mult: 1.05,
            dexterity_mult: 1.05,
            bladeburner_success_chance_mult: 1.04,
        });
        OrionShoulder.addToFactions([BladeburnersFactionName]);
        resetAugmentation(OrionShoulder);

        var HyperionV1 = new Augmentation({
            name:AugmentationNames.HyperionV1, repCost: 5e3, moneyCost:550e6,
            info:"A pair of mini plasma cannons embedded into the hands. The Hyperion is capable " +
                 "of rapidly firing bolts of high-density plasma. The weapon is meant to " +
                 "be used against augmented enemies as the ionized " +
                 "nature of the plasma disrupts the electrical systems of Augmentations. However, " +
                 "it can also be effective against non-augmented enemies due to its high temperature " +
                 "and concussive force.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 6%.",
            bladeburner_success_chance_mult: 1.06,
        });
        HyperionV1.addToFactions([BladeburnersFactionName]);
        resetAugmentation(HyperionV1);

        var HyperionV2 = new Augmentation({
            name:AugmentationNames.HyperionV2, repCost:10e3, moneyCost:1.1e9,
            info:"A pair of mini plasma cannons embedded into the hands. This augmentation " +
                 "is more advanced and powerful than the original V1 model. This V2 model is " +
                 "more power-efficiency, more accurate, and can fire plasma bolts at a much " +
                 "higher velocity than the V1 model.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 8%.",
            prereqs:[AugmentationNames.HyperionV1],
            bladeburner_success_chance_mult: 1.08,
        });
        HyperionV2.addToFactions([BladeburnersFactionName]);
        resetAugmentation(HyperionV2);

        var GolemSerum = new Augmentation({
            name:AugmentationNames.GolemSerum, repCost:12.5e3, moneyCost:2.2e9,
            info:"A serum that permanently enhances many aspects of a human's capabilities, " +
                 "including strength, speed, immune system performance, and mitochondrial efficiency. The " +
                 "serum was originally developed by the Chinese military in an attempt to " +
                 "create super soldiers.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases all of the player's combat stats by 7%.<br>" +
                 "Increases the player's Bladeburner stamina gain rate by 5%.<br>",
            strength_mult: 1.07,
            defense_mult: 1.07,
            dexterity_mult: 1.07,
            agility_mult: 1.07,
            bladeburner_stamina_gain_mult: 1.05,
        });
        GolemSerum.addToFactions([BladeburnersFactionName]);
        resetAugmentation(GolemSerum);

        var VangelisVirus = new Augmentation({
            name:AugmentationNames.VangelisVirus, repCost:7.5e3, moneyCost:550e6,
            info:"A synthetic symbiotic virus that is injected into the human brain tissue. The Vangelis virus " +
                 "heightens the senses and focus of its host, and also enhances its intuition.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's effectiveness in Bladeburner Field Analysis by 10%.<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 4%.<br>" +
                 "Increases the player's dexterity experience gain rate by 10%.",
            dexterity_exp_mult: 1.1,
            bladeburner_analysis_mult: 1.1,
            bladeburner_success_chance_mult: 1.04,
        });
        VangelisVirus.addToFactions([BladeburnersFactionName]);
        resetAugmentation(VangelisVirus);

        var VangelisVirus3 = new Augmentation({
            name:AugmentationNames.VangelisVirus3, repCost:15e3, moneyCost:2.2e9,
            info:"An improved version of Vangelis, a synthetic symbiotic virus that is " +
                 "injected into the human brain tissue. On top of the benefits of the original " +
                 "virus, this also grants an accelerated healing factor and enhanced " +
                 "agility/reflexes.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's effectiveness in Bladeburner Field Analysis by 15%.<br>" +
                 "Increases the player's defense and dexterity experience gain rate by 10%.<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 5%.",
            prereqs:[AugmentationNames.VangelisVirus],
            defense_exp_mult: 1.1,
            dexterity_exp_mult: 1.1,
            bladeburner_analysis_mult: 1.15,
            bladeburner_success_chance_mult: 1.05,
        });
        VangelisVirus3.addToFactions([BladeburnersFactionName]);
        resetAugmentation(VangelisVirus3);

        var INTERLINKED = new Augmentation({
            name:AugmentationNames.INTERLINKED, repCost:10e3, moneyCost:1.1e9,
            info:"The DNA is genetically modified to enhance the human's body " +
                 "extracellular matrix (ECM). This improves the ECM's ability to " +
                 "structurally support the body and grants heightened strength and " +
                 "durability.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's experience gain rate for all combat stats by 5%.<br>" +
                 "Increases the player's Bladeburner max stamina by 10%.",
            strength_exp_mult: 1.05,
            defense_exp_mult: 1.05,
            dexterity_exp_mult: 1.05,
            agility_exp_mult: 1.05,
            bladeburner_max_stamina_mult: 1.1,
        });
        INTERLINKED.addToFactions([BladeburnersFactionName]);
        resetAugmentation(INTERLINKED);

        var BladeRunner = new Augmentation({
            name:AugmentationNames.BladeRunner, repCost:8e3, moneyCost:1.65e9,
            info:"A cybernetic foot augmentation that was specially created for Bladeburners " +
                 "during the Synthoid Uprising. The organic musculature of the human foot " +
                 "is enhanced with flexible carbon nanotube matrices that are controlled by " +
                 "intelligent servo-motors.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's agility by 5%.<br>" +
                 "Increases the player's Bladeburner max stamina by 5%.<br>" +
                 "Increases the player's Bladeburner stamina gain rate by 5%.<br>",
            agility_mult: 1.05,
            bladeburner_max_stamina_mult: 1.05,
            bladeburner_stamina_gain_mult: 1.05,
        });
        BladeRunner.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeRunner);

        var BladeArmor = new Augmentation({
            name:AugmentationNames.BladeArmor, repCost:5e3, moneyCost:275e6,
            info:"A powered exoskeleton suit (exosuit) designed as armor for Bladeburner units. This " +
                 "exoskeleton is incredibly adaptable and can protect the wearer from blunt, piercing, " +
                 "concussive, thermal, chemical, and electric trauma. It also enhances the user's " +
                 "strength and agility.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases all of the player's combat stats by 4%.<br>" +
                 "Increases the player's Bladeburner stamina gain rate by 2%.<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 3%.",
            strength_mult: 1.04,
            defense_mult: 1.04,
            dexterity_mult: 1.04,
            agility_mult: 1.04,
            bladeburner_stamina_gain_mult: 1.02,
            bladeburner_success_chance_mult: 1.03,
        });
        BladeArmor.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmor);

        var BladeArmorPowerCells = new Augmentation({
            name:AugmentationNames.BladeArmorPowerCells, repCost:7.5e3, moneyCost:550e6,
            info:"Upgrades the BLADE-51b Tesla Armor with Ion Power Cells, which are capable of " +
                 "more efficiently storing and using power.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 5%.<br>" +
                 "Increases the player's Bladeburner stamina gain rate by 2%.<br>" +
                 "Increases the player's Bladeburner max stamina by 5%.",
            prereqs:[AugmentationNames.BladeArmor],
            bladeburner_success_chance_mult: 1.05,
            bladeburner_stamina_gain_mult: 1.02,
            bladeburner_max_stamina_mult: 1.05,
        });
        BladeArmorPowerCells.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorPowerCells);

        var BladeArmorEnergyShielding = new Augmentation({
            name:AugmentationNames.BladeArmorEnergyShielding, repCost:8.5e3, moneyCost:1.1e9,
            info:"Upgrades the BLADE-51b Tesla Armor with a plasma energy propulsion system " +
                 "that is capable of projecting an energy shielding force field.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's defense by 5%.<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 6%.",
            prereqs:[AugmentationNames.BladeArmor],
            defense_mult: 1.05,
            bladeburner_success_chance_mult: 1.06,
        });
        BladeArmorEnergyShielding.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorEnergyShielding);

        var BladeArmorUnibeam = new Augmentation({
            name:AugmentationNames.BladeArmorUnibeam, repCost:12.5e3, moneyCost:3.3e9,
            info:"Upgrades the BLADE-51b Tesla Armor with a concentrated deuterium-fluoride laser " +
                 "weapon. It's precision an accuracy makes it useful for quickly neutralizing " +
                 "threats while keeping casualties to a minimum.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 8%.",
            prereqs:[AugmentationNames.BladeArmor],
            bladeburner_success_chance_mult: 1.08,
        });
        BladeArmorUnibeam.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorUnibeam);

        var BladeArmorOmnibeam = new Augmentation({
            name:AugmentationNames.BladeArmorOmnibeam, repCost:25e3, moneyCost:5.5e9,
            info:"Upgrades the BLADE-51b Tesla Armor Unibeam augmentation to use " +
                 "multiple-fiber system. The upgraded weapon uses multiple fiber laser " +
                 "modules that combine together to form a single, more powerful beam of up to " +
                 "2000MW.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 10%.",
            prereqs:[AugmentationNames.BladeArmorUnibeam],
            bladeburner_success_chance_mult: 1.1,
        });
        BladeArmorOmnibeam.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorOmnibeam);

        var BladeArmorIPU = new Augmentation({
            name:AugmentationNames.BladeArmorIPU, repCost: 6e3, moneyCost:220e6,
            info:"Upgrades the BLADE-51b Tesla Armor with an AI Information Processing " +
                 "Unit that was specially designed to analyze Synthoid related data and " +
                 "information.<br><br>" +
                 "This augmentation:<br>" +
                 "Increases the player's effectiveness in Bladeburner Field Analysis by 15%.<br>" +
                 "Increases the player's success chance in Bladeburner contracts/operations by 2%.",
            prereqs:[AugmentationNames.BladeArmor],
            bladeburner_analysis_mult: 1.15,
            bladeburner_success_chance_mult: 1.02,
        });
        BladeArmorIPU.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladeArmorIPU);

        var BladesSimulacrum = new Augmentation({
            name:AugmentationNames.BladesSimulacrum, repCost: 500, moneyCost: 30e9,
            info:"A highly-advanced matter phase-shifter module that is embedded "  +
                 "in the brainstem and cerebellum. This augmentation allows " +
                 "the user to project and control a holographic simulacrum within an " +
                 "extremely large radius. These specially-modified holograms were specially " +
                 "weaponized by Bladeburner units to be used against Synthoids.<br><br>"  +
                 "This augmentation allows you to perform Bladeburner actions and other " +
                 "actions (such as working, commiting crimes, etc.) at the same time."
        });
        BladesSimulacrum.addToFactions([BladeburnersFactionName]);
        resetAugmentation(BladesSimulacrum);
    }

    //Update costs based on how many have been purchased
    var mult = Math.pow(CONSTANTS.MultipleAugMultiplier, Player.queuedAugmentations.length);
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
            for (var i = 0; i < Player.augmentations.length; ++i) {
                if (Player.augmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
                    Player.augmentations[i].level = aug.level;
                    break;
                }
            }
        }
    }

    if (aug.name === AugmentationNames.NeuroFluxGovernor) {
        for (var i = 0; i < Player.augmentations.length; ++i) {
            if (Player.augmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
                //Already have this aug, just upgrade the level
                return;
            }
        }
    }

    // Push onto Player's Augmentation list
    if (!reapply) {
        var ownedAug = new PlayerOwnedAugmentation(aug.name);
        Player.augmentations.push(ownedAug);
    }
}

function installAugmentations(cbScript=null) {
    if (Player.queuedAugmentations.length == 0) {
        dialogBoxCreate("You have not purchased any Augmentations to install!");
        return false;
    }
    var augmentationList = "";
    for (var i = 0; i < Player.queuedAugmentations.length; ++i) {
        var aug = Augmentations[Player.queuedAugmentations[i].name];
        if (aug == null) {
            console.log("ERROR. Invalid augmentation");
            continue;
        }
        applyAugmentation(Player.queuedAugmentations[i]);
        augmentationList += (aug.name + "<br>");
    }
    Player.queuedAugmentations = [];
    dialogBoxCreate("You slowly drift to sleep as scientists put you under in order " +
                    "to install the following Augmentations:<br>" + augmentationList +
                    "<br>You wake up in your home...you feel different...");
    prestigeAugmentation();

    //Run a script after prestiging
    if (cbScript && isString(cbScript)) {
        var home = Player.getHomeComputer();
        for (var i = 0; i < home.scripts.length; ++i) {
            if (home.scripts[i].filename === cbScript) {
                var script = home.scripts[i];
                var ramUsage = script.ramUsage;
                var ramAvailable = home.maxRam - home.ramUsed;
                if (ramUsage > ramAvailable) {
                    return; //Not enough RAM
                }
                var runningScriptObj = new RunningScript(script, []); //No args
                runningScriptObj.threads = 1; //Only 1 thread
                home.runningScripts.push(runningScriptObj);
                addWorkerScript(runningScriptObj, home);
            }
        }
    }
}

function augmentationExists(name) {
    return Augmentations.hasOwnProperty(name);
}

//Used for testing balance
function giveAllAugmentations() {
    for (var name in Augmentations) {
        var aug = Augmentations[name];
        if (aug == null) {continue;}
        var ownedAug = new PlayerOwnedAugmentation(name);
        Player.augmentations.push(ownedAug);
    }
    Player.reapplyAllAugmentations();
}

function displayAugmentationsContent(contentEl) {
    removeChildrenFromElement(contentEl);
    contentEl.appendChild(createElement("h1", {
        innerText:"Purchased Augmentations",
    }));

    //Bladeburner text, once mechanic is unlocked
    var bladeburnerText = "\n";
    if (Player.bitNodeN === 6 || hasBladeburnerSF) {
        bladeburnerText = "Bladeburner Progress\n\n";
    }

    contentEl.appendChild(createElement("pre", {
        width:"70%", whiteSpace:"pre-wrap", display:"block",
        innerText:"Below is a list of all Augmentations you have purchased but not yet installed. Click the button below to install them.\n" +
                  "WARNING: Installing your Augmentations resets most of your progress, including:\n\n" +
                  "Stats/Skill levels and Experience\n" +
                  "Money\n" +
                  "Scripts on every computer but your home computer\n" +
                  "Purchased servers\n" +
                  "Hacknet Nodes\n" +
                  "Faction/Company reputation\n" +
                  "Stocks\n" +
                  bladeburnerText +
                  "Installing Augmentations lets you start over with the perks and benefits granted by all " +
                  "of the Augmentations you have ever installed. Also, you will keep any scripts and RAM/Core upgrades " +
                  "on your home computer (but you will lose all programs besides NUKE.exe)."
    }));

    //Install Augmentations button
    contentEl.appendChild(createElement("a", {
        class:"a-link-button", innerText:"Install Augmentations",
        tooltip:"'I never asked for this'",
        clickListener:()=>{
            installAugmentations();
            return false;
        }
    }));

    //Backup button
    contentEl.appendChild(createElement("a", {
        class:"a-link-button flashing-button", innerText:"Backup Save (Export)",
        tooltip:"It's always a good idea to backup/export your save!",
        clickListener:()=>{
            saveObject.exportGame();
            return false;
        }
    }));

    //Purchased/queued augmentations list
    var queuedAugmentationsList = createElement("ul", {class:"augmentations-list"});

    for (var i = 0; i < Player.queuedAugmentations.length; ++i) {
        var augName = Player.queuedAugmentations[i].name;
        var aug = Augmentations[augName];

        var displayName = augName;
        if (augName === AugmentationNames.NeuroFluxGovernor) {
            displayName += " - Level " + (Player.queuedAugmentations[i].level);
        }

        var accordion = createAccordionElement({hdrText:displayName, panelText:aug.info});
        queuedAugmentationsList.appendChild(accordion[0]);
    }
    contentEl.appendChild(queuedAugmentationsList);

    //Installed augmentations list
    contentEl.appendChild(createElement("h1", {
        innerText:"Installed Augmentations", marginTop:"8px",
    }));
    contentEl.appendChild(createElement("p", {
        width:"70%", whiteSpace:"pre-wrap",
        innerText:"List of all Augmentations (including Source Files) that have been " +
                  "installed. You have gained the effects of these Augmentations."
    }));

    var augmentationsList = createElement("ul", {class:"augmentations-list"});

    //Expand/Collapse All buttons
    contentEl.appendChild(createElement("a", {
        class:"a-link-button", fontSize:"14px", innerText:"Expand All", display:"inline-block",
        clickListener:()=>{
            var allHeaders = augmentationsList.getElementsByClassName("accordion-header");
            for (var i = 0; i < allHeaders.length; ++i) {
                if (!allHeaders[i].classList.contains("active")) {allHeaders[i].click();}
            }
        }
    }));
    contentEl.appendChild(createElement("a", {
        class:"a-link-button", fontSize:"14px", innerText:"Collapse All", display:"inline-block",
        clickListener:()=>{
            var allHeaders = augmentationsList.getElementsByClassName("accordion-header");
            for (var i = 0; i < allHeaders.length; ++i) {
                if (allHeaders[i].classList.contains("active")) {allHeaders[i].click();}
            }
        }
    }));

    //Sort Buttons
    const sortInOrderButton = createElement("a", {
        class:"a-link-button", fontSize:"14px", innerText:"Sort in Order",
        tooltip:"Sorts the Augmentations alphabetically and Source Files in numerical order (1, 2, 3,...)",
        clickListener:()=>{
            removeChildrenFromElement(augmentationsList);

            //Create a copy of Player's Source Files and augs array and sort them
            var sourceFiles = Player.sourceFiles.slice();
            var augs = Player.augmentations.slice();
            sourceFiles.sort((sf1, sf2)=>{
                return sf1.n - sf2.n;
            });
            augs.sort((aug1, aug2)=>{
                return aug1.name <= aug2.name ? -1 : 1;
            });
            displaySourceFiles(augmentationsList, sourceFiles);
            displayAugmentations(augmentationsList, augs);

            Settings.OwnedAugmentationsOrder = OwnedAugmentationsOrderSetting.Alphabetically;
        }
    });
    contentEl.appendChild(sortInOrderButton);

    const sortByAcquirementTimeButton = createElement("a", {
        class:"a-link-button", fontSize:"14px", innerText:"Sort by Acquirement Time",
        tooltip:"Sorts the Augmentations and Source Files based on when you acquired them (same as default)",
        clickListener:()=>{
            removeChildrenFromElement(augmentationsList);
            displaySourceFiles(augmentationsList, Player.sourceFiles);
            displayAugmentations(augmentationsList, Player.augmentations);

            Settings.OwnedAugmentationsOrder = OwnedAugmentationsOrderSetting.AcquirementTime;
        }
    });
    contentEl.appendChild(sortByAcquirementTimeButton);

    if (Settings.OwnedAugmentationsOrder === OwnedAugmentationsOrderSetting.Alphabetically) {
        sortInOrderButton.click();
    } else {
        sortByAcquirementTimeButton.click();
    }
    contentEl.appendChild(augmentationsList);

    // Display multiplier information at the bottom
    contentEl.appendChild(createElement("p", {
        display: "block",
        innerHTML:
            `<br><br><strong><u>Total Multipliers:</u></strong><br>` +
            'Hacking Chance multiplier: ' + formatNumber(Player.hacking_chance_mult * 100, 2) + '%<br>' +
            'Hacking Speed multiplier:  ' + formatNumber(Player.hacking_speed_mult * 100, 2) + '%<br>' +
            'Hacking Money multiplier:  ' + formatNumber(Player.hacking_money_mult * 100, 2) + '%<br>' +
            'Hacking Growth multiplier: ' + formatNumber(Player.hacking_grow_mult * 100, 2) + '%<br><br>' +
            'Hacking Level multiplier:      ' + formatNumber(Player.hacking_mult * 100, 2) + '%<br>' +
            'Hacking Experience multiplier: ' + formatNumber(Player.hacking_exp_mult * 100, 2) + '%<br><br>' +
            'Strength Level multiplier:      ' + formatNumber(Player.strength_mult * 100, 2) + '%<br>' +
            'Strength Experience multiplier: ' + formatNumber(Player.strength_exp_mult * 100, 2) + '%<br><br>' +
            'Defense Level multiplier:      ' + formatNumber(Player.defense_mult * 100, 2) + '%<br>' +
            'Defense Experience multiplier: ' + formatNumber(Player.defense_exp_mult * 100, 2) + '%<br><br>' +
            'Dexterity Level multiplier:      ' + formatNumber(Player.dexterity_mult * 100, 2) + '%<br>' +
            'Dexterity Experience multiplier: ' + formatNumber(Player.dexterity_exp_mult * 100, 2) + '%<br><br>' +
            'Agility Level multiplier:      ' + formatNumber(Player.agility_mult * 100, 2) + '%<br>' +
            'Agility Experience multiplier: ' + formatNumber(Player.agility_exp_mult * 100, 2) + '%<br><br>' +
            'Charisma Level multiplier:      ' + formatNumber(Player.charisma_mult * 100, 2) + '%<br>' +
            'Charisma Experience multiplier: ' + formatNumber(Player.charisma_exp_mult * 100, 2) + '%<br><br>' +
            'Hacknet Node production multiplier:         ' + formatNumber(Player.hacknet_node_money_mult * 100, 2) + '%<br>' +
            'Hacknet Node purchase cost multiplier:      ' + formatNumber(Player.hacknet_node_purchase_cost_mult * 100, 2) + '%<br>' +
            'Hacknet Node RAM upgrade cost multiplier:   ' + formatNumber(Player.hacknet_node_ram_cost_mult * 100, 2) + '%<br>' +
            'Hacknet Node Core purchase cost multiplier: ' + formatNumber(Player.hacknet_node_core_cost_mult * 100, 2) + '%<br>' +
            'Hacknet Node level upgrade cost multiplier: ' + formatNumber(Player.hacknet_node_level_cost_mult * 100, 2) + '%<br><br>' +
            'Company reputation gain multiplier: ' + formatNumber(Player.company_rep_mult * 100, 2) + '%<br>' +
            'Faction reputation gain multiplier: ' + formatNumber(Player.faction_rep_mult * 100, 2) + '%<br>' +
            'Salary multiplier: ' + formatNumber(Player.work_money_mult * 100, 2) + '%<br>' +
            'Crime success multiplier: ' + formatNumber(Player.crime_success_mult * 100, 2) + '%<br>' +
            'Crime money multiplier: ' + formatNumber(Player.crime_money_mult * 100, 2) + '%<br><br><br>',
    }))
}

//Creates the accordion elements to display Augmentations
//  @listElement - List DOM element to append accordion elements to
//  @augs - Array of Augmentation objects
function displayAugmentations(listElement, augs) {
    for (var i = 0; i < augs.length; ++i) {
        var augName = augs[i].name;
        var aug = Augmentations[augName];

        var displayName = augName;
        if (augName === AugmentationNames.NeuroFluxGovernor) {
            displayName += " - Level " + (augs[i].level);
        }
        var accordion = createAccordionElement({hdrText:displayName, panelText:aug.info});
        listElement.appendChild(accordion[0]);
    }
}

//Creates the accordion elements to display Source Files
//  @listElement - List DOM element to append accordion elements to
//  @sourceFiles - Array of Source File objects
function displaySourceFiles(listElement, sourceFiles) {
    for (var i = 0; i < sourceFiles.length; ++i) {
        var srcFileKey = "SourceFile" + sourceFiles[i].n;
        var sourceFileObject = SourceFiles[srcFileKey];
        if (sourceFileObject == null) {
            console.log("ERROR: Invalid source file number: " + sourceFiles[i].n);
            continue;
        }
        const maxLevel = sourceFiles[i].n == 12 ? "∞" : "3";
        var accordion = createAccordionElement({
            hdrText:sourceFileObject.name + "<br>" + "Level " + (sourceFiles[i].lvl) + " / "+maxLevel,
            panelText:sourceFileObject.info
        });

        listElement.appendChild(accordion[0]);
    }
}


export {installAugmentations,
        initAugmentations, applyAugmentation, augmentationExists,
        displayAugmentationsContent};
