//Augmentations
function Augmentation(name) {
    this.name = name;
    this.info = "";
    this.owned = false;                 //Whether the player has it (you can only have each augmentation once)
    this.factionInstalledBy = "";       //Which faction the Player got this from

    //Price and reputation base requirements (can change based on faction multipliers)
    this.baseRepRequirement = 0;        
    this.baseCost = 0;
}

Augmentation.prototype.setInfo(inf) {
    this.info = inf;
}

Augmentation.prototype.setRequirements(rep, cost) {
    this.baseRepRequirement = rep;
    this.baseCost = cost;
}

//Takes in an array of faction names and adds this augmentation to all of those factions
Augmentation.prototype.addToFactions(factionList) {
    for (var i = 0; i < factionList.length; ++i) {
        var faction = Factions[factionList[i]];
        if (faction = null) {
            console.log("Error: Could not find faction with this name");
        }
        faction.augmentations.push(this.name);
    }
}

Augmentation.prototype.toJSON = function() {
    return Generic_toJSON("Augmentation", this);
}

Augmentation.fromJSON = function(value) {
    return Generic_fromJSON(Augmentation, value.data);
}

Reviver.constructors.Augmentation = Augmentation;

Augmentations = {}

AddToAugmentations = function(aug) {
    var name = aug.name;
    Augmentations[name] = aug;
}

//TODO Set descriptions for all 

//TODO Something that decreases RAM usage of scripts
initAugmentations = function() {
    //Combat stat augmentations
    var Targeting1 = new Augmentation("Augmented Targeting I");
    Targeting1.setRequirements(36000, 10000000);
    Targeting1.setInfo("This cranial implant is embedded within the player's inner ear structure and optic nerves. It regulates and enhances the user's" + 
                       "balance and hand-eye coordination. It is also capable of augmenting reality by projecting digital information\n" + 
                       "directly onto the retina. These enhancements allow the player to better lock-on and keep track of enemies. \n\n" +
                       "This augmentation increases the player's dexterity by 10%.");
    Targeting1.addToFactions("The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries");
    AddToAugmentations(Targeting1);
    
    var Targeting2 = new Augmentation("Augmented Targeting II");
    Targeting2.setRequirements(72000, 20000000);
    Targeting2.setInfo("This is an upgrade of the Augmented Targeting I cranial implant, which is capable of augmenting reality\n" + 
                       "and enhances the user's balance and hand-eye coordination. \n\nThis upgrade increases the player's dexterity" + 
                       "by an additional 20%.");
    Targeting2.addToFactions("The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries");
    AddToAugmentations(Targeting2);
    
    var Targeting3 = new Augmentation("Augmented Targeting III");
    Targeting3.setRequirements(144000, 50000000);
    Targeting3.setInfo("This is an upgrade of the Augmented Targeting II cranial implant, which is capable of augmenting reality\n" + 
                       "and enhances the user's balance and hand-eye coordination. \n\nThis upgrade increases the player's dexterity" +
                       "by an additional 50%.");
    Targeting3.addToFactions("The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant");
    AddToAugmentations(Targeting3);
    
    var SyntheticHeart = new Augmentation("Synthetic Heart");
    SyntheticHeart.setRequirements(1000000, 500000000);
    SyntheticHeart.setInfo("This advanced artificial heart, created from plasteel and graphene, is capable of pumping more blood\n" + 
                           "at much higher efficiencies than a normal human heart.\n\n This augmentation increases the player's agility" +
                           "and strength by 100%");
    SyntheticHeart.addToFactions("KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                 "NWO", "The Covenant", "Daedalus", "Illuminati");
    AddToAugmentations(SyntheticHeart);
    
    var SynfibrilMuscle = new Augmentation("Synfibril Muscle");
    SynfibrilMuscle.setRequirements(900000, 400000000);
    SynfibrilMuscle.setInfo("The myofibrils in human muscles are injected with special chemicals that react with the proteins inside\n" + 
                            "the myofibrils, altering their underlying structure. The end result is muscles that are stronger and more elastic.\n" + 
                            "Scientists have named these artificially enhanced units 'synfibrils'.\n\n This augmentation increases the player's" +
                            "strength and defense by 50%.");
    SynfibrilMuscle.addToFactions("KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                  "NWO", "The Covenant", "Daedalus", "Illuminati", "Blade Industries");
    AddToAugmentations(SynfibrilMuscle)
    
    var CombatRib1 = new Augmentation("Combat Rib I");
    CombatRib1.setRequirements(50000, 15000000);
    CombatRib1.setInfo("The human body's ribs are replaced with artificial ribs that automatically and continuously release cognitive" + 
                       "and performance-enhancing drugs into the bloodstream, improving the user's abilities in combat.\n\n" + 
                       "This augmentation increases the player's strength and defense by 10%.");
    CombatRib1.addToFactions("The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries");
    AddToAugmentations(CombatRib1);
    
    var CombatRib2 = new Augmentation("Combat Rib II");
    CombatRib2.setRequirements.setRequirements(100000, 40000000);
    CombatRib2.setInfo("This is an upgrade to the Combat Rib I augmentation, and is capable of releasing even more potent combat-enhancing\n" + 
                       "drugs into the bloodstream\n\n. This upgrade increases the player's strength and defense by an additional 20%.")
    CombatRib2.addToFactions("The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries");
    AddToAugmentations(CombatRib2);
    
    var CombatRib3 = new Augmentation("Combat Rib III");
    CombatRib3.setRequirements(200000, 100000000);
    CombatRib3.setInfo("This is an upgrade to the Combat Rib II augmentation, and is capable of releasing even more potent combat-enhancing\n" + 
                       "drugs into the bloodstream\n\n. This upgrade increases the player's strength and defense by an additional 30%.");
    CombatRib3.addToFactions("The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant");
    AddToAugmentations(CombatRib3);
    
    var NanofiberWeave = new Augmentation("Nanofiber Weave");
    NanofiberWeave.setRequirements(400000, 250000000);
    NanofiberWeave.setInfo("Synthetic nanofibers are woven into the skin's extracellular matrix using electrospinning.\n" + 
                           "This improves the skin's ability to regenerate itself and protect the body from external stresses and forces.\n\n" + 
                           "This augmentation increases the player's strength and defense by 30%.");
    NanofiberWeave.addToFactions("Tian Di Hui", "The Syndicate", "The Dark Army", "Speakers for the Dead",
                                 "Blade Industries", "Fulcrum Secret Technologies", "OmniTek Incorporated");
    AddToAugmentations(NanofiberWeave);
    
    var SubdermalArmor = new Augmentation("NEMEAN Subdermal Weave");
    SubdermalArmor.setRequirements(1000000, 750000000);
    SubdermalArmor.setInfo("The NEMEAN Subdermal Weave is a thin, light-weight, graphene plating that houses a dilatant fluid.\n"
                           "The material is implanted underneath the skin, and is the most advanced form of defensive enhancement\n" +
                           "that has ever been created. The dilatant fluid, despite being thin and light, is extremely effective\n" + 
                           "at stopping piercing blows and reducing blunt trauma. The properties of graphene allow the plating to\n" +
                           "mitigate damage from any fire-related or electrical traumas.\n\n" + 
                           "This augmentation increases the player's defense by 150%.");
    SubdermalArmor.addToFactions("The Syndicate", "Fulcrum Secret Technologies", "Illuminati", "Daedalus",
                                 "The Covenant");
    AddToAugmentations(SubdermalArmor);
    
    var WiredReflexes = new Augmentation("Wired Reflexes");
    WiredReflexes.setRequirements(36000, 10000000);
    WiredReflexes.setInfo("Synthetic nerve-enhancements are injected into all major parts of the somatic nervous system,\n" + 
                          "supercharging the body's ability to send signals through neurons. This results in increased reflex speed.\n\n" + 
                          "This augmentation increases the player's agility by 5%.");
    WiredReflexes.addToFactions("Tian Di Hui", "Sector-12", "Volhaven", "Aevum", "Ishima", 
                                "The Syndicate", "The Dark Army", "Speakers for the Dead");
    AddToAugmentations(WiredReflexes);
    
    var GrapheneBoneLacings = new Augmentation("Graphene Bone Lacings");
    GrapheneBoneLacings.setRequirements(1500000, 1000000000);
    GrapheneBoneLacings.setInfo("A graphene-based material is grafted and fused into the user's bones, significantly increasing\n" +
                                "their density and tensile strength.\n\n" + 
                                "This augmentation increases the player's strength and defense by 100%.");
    GrapheneBoneLacings.addToFactions("Fulcrum Secret Technologies", "The Covenant");
    AddToAugmentations(GrapheneBoneLacings);
    
    var BionicSpine = new Augmentation("Bionic Spine");
    BionicSpine.setRequirements(250000, 75000000);
    BionicSpine.setInfo("An artificial spine created from plasteel and carbon fibers that completely replaces the organic spine.\n" + 
                        "Not only is the Bionic Spine physically stronger than a human spine, but it is also capable of digitally\n" + 
                        "stimulating and regulating the neural signals that are sent and received by the spinal cord. This results in\n" + 
                        "greatly improved senses and reaction speeds.\n\n" + 
                        "This augmentation increases all of the player's combat stats by 20%.");
    BionicSpine.addToFactions("Speakers for the Dead", "The Syndicate", "KuaiGong International",
                              "OmniTek Incorporated", "Blade Industries");
    AddToAugmentations(BionicSpine);
    
    var GrapheneBionicSpine = new Augmentation("Graphene Bionic Spine Upgrade");
    GrapheneBionicSpine.setRequirements(1200000, 1000000000);
    GrapheneBionicSpine.setInfo("An upgrade to the Bionic Spine augmentation. It fuses the implant with an advanced graphene\n" + 
                                "material to make it much stronger and lighter.\n\n" + 
                                "This augmentation increases all of the player's combat stats by 100%.");
    GrapheneBionicSpine.addToFactions("Fulcrum Secret Technologies", "ECorp");
    AddToAugmentations(GrapheneBionicSpine);
    
    var BionicLegs = new Augmentation("Bionic Legs");
    BionicLegs.setRequirements(200000, 60000000);
    BionicLegs.setInfo("Cybernetic legs created from plasteel and carbon fibers that completely replace the user's organic legs. \n\n" + 
                       "This augmentation increases the player's agility by 50%.");
    BionicLegs.addToFactions("Speakers for the Dead", "The Syndicate", "KuaiGong International",
                             "OmniTek Incorporated", "Blade Industries");
    AddToAugmentations(BionicLegs);
    
    var GrapheneBionicLegs = new Augmentation("Graphene Bionic Legs Upgrade");
    GrapheneBionicLegs.setRequirements(1000000, 900000000);
    GrapheneBionicLegs.setInfo("An upgrade to the Bionic Legs augmentation. It fuses the implant with an advanced graphene\n" + 
                               "material to make it much stronger and lighter\n\n" + 
                               "This augmentation increases the player's agility by an additional 150%.");
    GrapheneBionicLegs.addToFactions("MegaCorp", "ECorp", "Fulcrum Secret Technologies");
    AddToAugmentations(GrapheneBionicLegs);
    
    //Labor stat augmentations
    var SpeechProcessor = new Augmentation("Speech Processor Implant"); //Cochlear imlant?
    SpeechProcessor.setRequirements(50000, 15000000);
    SpeechProcessor.setInfo("A cochlear implant with an embedded computer that analyzes incoming speech.\n" +
                            "The embedded computer processes characteristics of incoming speech, such as tone\n" +
                            "and inflection, to pick up on subtle cues and aid in social interaction.\n\n" + 
                            "This augmentation increases the player's charisma by 20%.");
    SpeechProcessor.addToFactions("Tian Di Hui", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                  "Ishima", "Volhaven");
    AddToAugmentations(SpeechProcessor);
    
    var EnhancedSocialInteractionImplant = new Augmentation("Enhanced Social Interaction Implant");
    EnhancedSocialInteractionImplant.setRequirements(750000, 500000000);
    EnhancedSocialInteractionImplant.setInfo("A cranial implant that greatly assists in the user's ability to analyze social situations\n" + 
                                             "and interactions. The system uses a wide variety of factors such as facial expression, body\n" + 
                                             "language, and the voice's tone/inflection to determine the best course of action during social\n" + 
                                             "situations. The implant also uses deep learning software to continuously learn new behavior\n" + 
                                             "patterns and how to best respond.\n\n" + 
                                             "This augmentation increases the player's charisma and charisma experience gain rate by 50%.");
    EnhancedSocialInteractionImplant.addToFactions("Bachman & Associates", "NWO", "Clarke Incorporated",
                                                   "OmniTek Incorporated", "Four Sigma");
    AddToAugmentations(EnhancedSocialInteractionImplant);
    
    //Hacking augmentations
    var ArtificialBioNeuralNetwork = new Augmentation("Artificial Bio-neural Network Implant");
    ArtificialBioNeuralNetwork.setRequirements(750000, 600000000);
    ArtificialBioNeuralNetwork.setInfo("A network consisting of millions of nanoprocessors is embedded into the brain. \n" +
                                       "The network is meant to mimick the way a biological brain solves a problem, which each\n" + 
                                       "nanoprocessor acting similar to the way a neuron would in a neural network. However, these\n" + 
                                       "nanoprocessors are programmed to perform computations much faster than organic neurons,\n" + 
                                       "allowing its user to solve much more complex problems at a much faster rate.\n\n" + 
                                       "This augmentation increases the player's hacking speed by 2%, increases the amount of\n" + 
                                       "money gained while hacking by 10%, and increases the palyer's hacking skill by 10%.");
    ArtificialBioNeuralNetwork.addToFactions("BitRunners", "Fulcrum Secret Technologies");
    AddToAugmentations(ArtificialBioNeuralNetwork);
    
    var ArtificialSynapticPotentiation = new Augmentation("Artificial Synaptic Potentiation");
    ArtificialSynapticPotentiation.setRequirements(600000, 400000000);
    ArtificialSynapticPotentiation.("The body is injected with a chemical that artificially induces synaptic potentiation,\n" + 
                                    "otherwise known as the strengthening of synapses. This results in a enhanced cognitive abilities.\n\n" + 
                                    "This augmentation increases the player's hacking speed and hacking chance by 1%.");
    ArtificialSynapticPotentiation.addToFactions("The Black Hand", "NiteSec");
    AddToAugmentations(ArtificialSynapticPotentiation);
    
    var EnhancedMyelinSheathing = new Augmentation("Enhanced Myelin Sheathing");
    EnhancedMyelinSheathing.setRequirements(900000, 850000000);)
    EnhancedMyelinSheathing.setInfo("Electrical signals are used to induce a new, artificial form of myelinogensis in the human body.\n" + 
                                    "This process results in the proliferation of new, synthetic myelin sheaths in the nervous\n" + 
                                    "system. These myelin sheaths can propogate neuro-signals much faster than their organic\n" + 
                                    "counterparts, leading to greater processing speeds and better brain function.\n\n" + 
                                    "This augmentation increases the player's hacking speed by 1%, increases the player's hacking\n" + 
                                    "skill by 5%, and increases the player's hacking experience gain rate by 5%.");
    EnhancedMyelinSheating.addToFactions("Fulcrum Secret Technologies", "BitRunners", "The Black Hand");
    AddToAugmentations(EnhancedMyelinSheathing);
    
    var SynapticEnhancement = new Augmentation("Synaptic Enhancement Implant");
    SynapticEnhancement.setRequirements(50000, 35000000);
    SynapticEnhancement.setInfo("A small cranial implant that continuously uses weak electric signals to stimulate the brain and \n" +
                                "induce stronger synaptic activity. This improves the the user's cognitive abilities.\n\n" + 
                                "This augmentation increases the player's hacking speed by 1%.");
    SynapticEnhancement.addToFactions("CyberSec");
    AddToAugmentations(SynapticEnhancement);
    
    var NeuralRetentionEnhancement = new Augmentation("Neural-Retention Enhancement");
    NeuralRetentionEnhancement.setRequirements(200000, 250000000);
    NeuralRetentionEnhancement.setInfo("Chemical injections are used to permanently alter and strengthen the brain's neuronal\n" +
                                       "circuits, strengthening its ability to retain information.\n\n" + 
                                       "This augmentation increases the player's hacking experience gain rate by 40%.");
    NeuralRetentionEnhancement.addToFactions("CyberSec", "NiteSec");
    AddToAugmentations(NeuralRetentionEnhancement);
    
    var DataJack = new Augmentation("DataJack");
    DataJack.setRequirements(750000, 75000000);
    DataJack.("A brain implant that provides an interface for direct, wireless communication between a computer and\n" + 
              "your mind. This implant allows the user to easily and effectively access and manipulate a computer's\n" + 
              "memory with his mind.\n\n" + 
              "This augmentation increases the amount of money the player gains from hacking by 20%.");
    DataJack.addToFactions("BitRunners", "The Black Hand", "NiteSec", "Chongqing", "New Tokyo");
    AddToAugmentations(DataJack);
    
    var ENM = new Augmentation("Embedded Netburner Module");
    ENM.setRequirements(500000, 300000000);
    ENM.addToFactions("BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp", 
                      "Fulcrum Secret Technologies", "NWO", "Blade Industries");
    AddToAugmentations(ENM);
    
    var ENMCore = new Augmentation("Embedded Netburner Module Core Implant");
    ENMCore.setRequirements(750000, 500000000);
    ENMCore.addToFactions("BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp", 
                          "Fulcrum Secret Technologies", "NWO", "Blade Industries");
    AddToAugmentations(ENMCore);
    
    var ENMCoreV2 = new Augmentation("Embedded Netburner Module Core V2 Upgrade");
    ENMCoreV2.setRequirements(1000000, 1000000000);
    ENMCoreV2.addToFactions("ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                            "Blade Industries", "OmniTek Incorporated", "KuaiGong International");
    AddToAugmentations(ENMCoreV2);
    
    var ENMCoreV3 = new Augmentation("Embedded Netburner Module Core V3 Upgrade");
    ENMCOREV3.setRequirements(1500000, 1250000000);
    ENMCoreV3.addToFactions("ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                            "Daedalus", "The Covenant", "Illuminati");
    AddToAugmentations(ENMCoreV3);
    
    var ENMAnalyzeEngine = new Augmentation("Embedded Netburner Module Analyze Engine");
    ENMAnalyzeEngine.setReqpRequirement(1250000, 1000000000);
    ENMAnalyzeEngine.addToFactions("ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                                   "Daedalus", "The Covenant", "Illuminati");
    AddToAugmentations(ENMAnalyzeEngine);
    
    var ENMDMA = new Augmentation("Embedded Netburner Module Direct Memory Access Upgrade");
    ENMDMA.setReqpRequirement(1350000, 1100000000);
    ENMDMA.addToFactions("ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                         "Daedalus", "The Covenant", "Illuminati");
    AddToAugmentations(ENMDMA);
    
    var Neuralstimulator = new Augmentation("Neuralstimulator");
    Neuralstimulator.setReqpRequirement(500000, 600000000);
    Neuralstimulator.addToFactions("The Black Hand", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                   "Ishima", "Volhaven", "Bachman & Associates", "Clarke Incorporated", 
                                   "Four Sigma");
    AddToAugmentations(Neuralstimulator);
    
    
    //Work Augmentations
    var NuoptimalInjectorImplant = new Augmentation("Nuoptimal Nootropic Injector Implant");
    NuoptimalInjectorImplant.setReqpRequirement(100000, 90000000);
    NuoptimalInjectorImplant.addToFactions("Tian Di Hui", "Volhaven", "New Tokyo", "Chongqing", "Ishima",
                                           "Clarke Incorporated", "Four Sigma", "Bachman & Associates");
    AddToAugmentations(NuoptimalInjectorImplant);
    
    var SpeechEnhancement = new Augmentation("Speech Enhancement");
    SpeechEnhancement.setReqpRequirement(50000, 45000000);
    SpeechEnhancement.addToFactions("Tian Di Hui", "Speakers for the Dead", "Four Sigma", "KuaiGong International",
                                    "Clarke Incorporated", "Four Sigma", "Bachman & Associates");
    AddToAugmentations(SpeechEnhancement);
    
    var FocusWire = new Augmentation("FocusWire"); //Stops procrastination
    FocusWire.setReqpRequirement(400000, 350000000);
    FocusWire.addToFactions("Bachman & Associates", "Clarke Incorporated", "Four Sigma", "KuaiGong International");
    AddToAugmentations(FocusWire)
    
    var PCDNI = new Augmentation("PC Direct-Neural Interface");
    PCDNI.setReqpRequirement(750000, 650000000);
    PCDNI.addToFactions("Four Sigma", "OmniTek Incorporated", "ECorp", "Blade Industries");
    AddToAugmentations(PCDNI);
    
    var PCDNIOptimizer = new Augmentation("PC Direct-Neural Interface Optimization Submodule");
    PCDNIOptimizer.setReqpRequirement(1000000, 875000000);
    PCDNIOptimizer.addToFactions("Fulcrum Secret Technologies", "ECorp", "Blade Industries");
    AddToAugmentations(PCDNIOptimizer);
    
    var PCDNINeuralNetwork = new Augmentation("PC Direct-Neural Interface NeuroNet Injector");
    PCDNINeuralNetwork.setRequirements(1200000, 1100000000);
    PCDNINeuralNetwork.addToFactions("Fulcrum Secret Technologies");
    AddToAugmentations(PCDNINeuralNetwork);
    
    //Misc augmentations
    var Neurotrainer1 = new Augmentation("Neurotrainer I");
    Neurotrainer1.setRequirements(50000, 35000000);
    Neurotrainer1.addToFactions("CyberSec");
    AddToAugmentations(Neurotrainer1);
    
    var Neurotrainer2 = new Augmentation("Neurotrainer II");
    Neurotrainer2.setRequirements(300000, 150000000);
    Neurotrainer2.addToFactions("BitRunners", "NiteSec");
    AddToAugmentations(Neurotrainer2);
    
    var Neurotrainer3 = new Augmentation("Neurotrainer III");
    Neurotrainer3.setRequirements(900000, 725000000);
    Neurotrainer3.addToFactions("NWO", "Four Sigma");
    AddToAugmentations(Neurotrainer3);
    
    var Hypersight = new Augmentation("HyperSight Corneal Implant");
    Hypersight.setRequirements(800000, 650000000);
    Hypersight.addToFactions("Blade Industries", "KuaiGong International");
    AddToAugmentations(Hypersight);
}

applyAugmentation = function(aug, faction) {
    switch(aug.name) {
        //Combat stat augmentations
        case "Augmented Targeting I":
            Player.dexterity_mult *= 1.1;
            break;
        case "Augmented Targeting II":
            Player.dexterity_mult *= 1.2;
            break;
        case "Augmented Targeting III":
            Player.dexterity_mult *= 1.5;
            break;
        case "Synthetic Heart":         //High level
            Player.agility_mult *= 2.0;
            Player.strength_mult *= 2.0;
            break;
        case "Synfibril Muscle":        //Medium-high level
            Player.strength_mult    *= 1.5;
            Player.defense_mult     *= 1.5;
            break;
        case "Combat Rib I":
            //Str and Defense 5%
            Player.strength_mult    *= 1.1;
            Player.defense_mult     *= 1.1;
            break;
        case "Combat Rib II":
            Player.strength_mult    *= 1.2;
            Player.defense_mult     *= 1.2;
            break;
        case "Combat Rib III":
            Player.strength_mult    *= 1.3;
            Player.defense_mult     *= 1.3;
            break;
        case "Nanofiber Weave":         //Med level
            Player.strength_mult    *= 1.3;
            Player.defense_mult     *= 1.3;
            break;
        case "NEMEAN Subdermal Weave":  //High level
            Player.defense_mult     *= 2.5;
            break;
        case "Wired Reflexes":          //Low level
            Player.agility_mult     *= 1.05;
            break;
        case "Graphene Bone Lacings":   //High level
            Player.strength_mult    *= 2;
            Player.defense_mult     *= 2;
            break;
        case "Bionic Spine":            //Med level
            Player.strength_mult    *= 1.2;
            Player.defense_mult     *= 1.2;
            Player.agility_mult     *= 1.2;
            Player.dexterity_mult   *= 1.2;
            break;
        case "Graphene Bionic Spine Upgrade":   //High level
            Player.strength_mult    *= 2;
            Player.defense_mult     *= 2;
            Player.agility_mult     *= 2;
            Player.dexterity_mult   *= 2;
            break;
        case "Bionic Legs":             //Med level
            Player.agility_mult     *= 1.5;
            break;
        case "Graphene Bionic Legs Upgrade":    //High level
            player.agility_mult     *= 3.0;
            break;
            
        //Labor stats augmentations
        case "Enhanced Social Interaction Implant": //Med-high level
            Player.charisma_mult    *= 1.5;
            Player.charisma_exp_mult *= 1.5;
            break;
        case "Speech Processor Implant":    //Med level
            Player.charisma_mult    *= 1.2;
            break;

        //Hacking augmentations
        case "Artificial Bio-neural Network Implant":   //Med level
            Player.hacking_speed_mult *= .98;
            Player.hacking_money_mult *= 1.1;
            Player.hacking_mult       *= 1.1;
            break;
        case "Artificial Synaptic Potentiation":    //Med level
            Player.hacking_speed_mult *= .99;
            Player.hacking_chance_mult *= 1.01;
            break;
        case "Enhanced Myelin Sheathing":       //Med level
            Player.hacking_speed_mult *= .99;
            Player.hacking_exp_mult   *= 1.05;
            Player.hacking_mult       *= 1.05;
            break;
        case "Synaptic Enhancement Implant":    //Low Level
            Player.hacking_speed_mult *= .99;
            break;
        case "Neural-Retention Enhancement":    //Med level
            Player.hacking_exp_mult   *= 1.4;
            break;
        case "DataJack":                        //Med low level
            Player.hacking_money_mult *= 1.2;
            break;
        case "Embedded Netburner Module":       //Medium level
            Player.hacking_mult           *= 1.01;
            break;
        case "Embedded Netburner Module Core Implant":      //Medium level
            Player.hacking_speed_mult     *= .98;
            Player.hacking_money_mult     *= 1.1;
            Player.hacking_chance_mult    *= 1.02;
            Player.hacking_exp_mult       *= 1.1;
            Player.hacking_mult           *= 1.01;
            break;
        case "Embedded Netburner Module Core V2 Upgrade":   //Medium high level
            Player.hacking_speed_mult     *= .95;
            Player.hacking_money_mult     *= 1.5;
            Player.hacking_chance_mult    *= 1.05;
            Player.hacking_exp_mult       *= 1.5;
            Player.hacking_mult           *= 1.05;
            break;
        case "Embedded Netburner Module Core V3 Upgrade":   //High level
            Player.hacking_speed_mult     *= .95;
            Player.hacking_money_mult     *= 1.5;
            Player.hacking_chance_mult    *= 1.1;
            Player.hacking_exp_mult       *= 2.0;
            Player.hacking_mult           *= 1.1;
            break;
        case "Embedded Netburner Module Analyze Engine":    //High level
            //Hacking speed 20%  - High level
            Player.hacking_speed_mult     *= 0.9;
            break;
        case "Embedded Netburner Module Direct Memory Access Upgrade":  //High level
            //Money hacked 20%  - High level
            Player.hacking_money_mult     *= 1.5;
            Player.hacking_chance_mult    *= 1.2;
            break;
        case "Neuralstimulator":    //Medium Level
            Player.hacking_speed_mult     *= .99;
            Player.hacking_chance_mult    *= 1.1;
            Player.hacking_exp_mult       *= 1.2;
            break;

        //Work augmentations
        case "Nuoptimal Nootropic Injector Implant":    //Low medium level
            Player.company_rep_mult   *= 1.1;
            break;
        case "Speech Enhancement":  //Low level
            Player.company_rep_mult   *= 1.05;
            Player.charisma_mult      *= 1.05;
            break;
        case "FocusWire":   //Med level
            Player.hacking_exp_mult   *= 1.1;
            Player.strength_exp_mult  *= 1.1;
            Player.defense_exp_mult   *= 1.1;
            Player.dexterity_exp_mult *= 1.1;
            Player.agility_exp_mult   *= 1.1;
            Player.charisma_exp_mult  *= 1.1;
            Player.company_rep_mult   *= 1.05;
            Player.work_money_mult  *= 1.05;
            break;
        case "PC Direct-Neural Interface":  //Med level
            Player.company_rep_mult   *= 1.1;
            Player.hacking_mult       *= 1.1;
            break;
        case "PC Direct-Neural Interface Optimization Submodule":   //High level
            //Allows u to better optimize code/pc when connecting with PC DNI..helps with software/IT jobs
            Player.company_rep_mult   *= 1.2;
            Player.hacking_mult       *= 1.2;
            break;    
        case "PC Direct-Neural Interface NeuroNet Injector":        //High level
            Player.company_rep_mult   *= 1.1;
            Player.hacking_mult       *= 1.1;
            Player.hacking_speed_mult *= .98;
            break;
        
        //Misc augmentations
        case "Neurotrainer I":      //Low Level
            Player.hacking_exp_mult   *= 1.05;
            Player.strength_exp_mult  *= 1.05;
            Player.defense_exp_mult   *= 1.05;
            Player.dexterity_exp_mult *= 1.05;
            Player.agility_exp_mult   *= 1.05;
            this.charisma_exp_mult  *= 1.05;
            break;
        case "Neurotrainer II":     //Medium level
            Player.hacking_exp_mult   *= 1.1;
            Player.strength_exp_mult  *= 1.1;
            Player.defense_exp_mult   *= 1.1;
            Player.dexterity_exp_mult *= 1.1;
            Player.agility_exp_mult   *= 1.1;
            Player.charisma_exp_mult  *= 1.1;
            break;
        case "Neurotrainer III":    //High Level
            Player.hacking_exp_mult   *= 1.2;
            Player.strength_exp_mult  *= 1.2;
            Player.defense_exp_mult   *= 1.2;
            Player.dexterity_exp_mult *= 1.2;
            Player.agility_exp_mult   *= 1.2;
            Player.charisma_exp_mult  *= 1.2;
            break;
        case "HyperSight Corneal Implant":  //Medium high level
            Player.dexterity_mult     *= 1.5;
            Player.hacking_speed_mult *= .99;
            Player.hacking_money_mult *= 1.1;
            break;
        
        default:
            console.log("ERROR: No such augmentation!");
            return;
    }

    aug.owned = true;
    aug.factionInstalledBy = faction.name;
    Player.augmentations.push(aug.name);
    ++Player.numAugmentations;
}