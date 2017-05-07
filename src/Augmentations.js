//Augmentations
function Augmentation(name) {
    this.name = name;
    this.info = "";
    this.owned = false;                 //Whether the player has it (you can only have each augmentation once)
    this.factionInstalledBy = "";       //Which faction the Player got this from

    //Price and reputation base requirements (can change based on faction multipliers)
    this.baseRepRequirement = 0;        
    this.baseCost = 0;
    
    //Level - Only applicable for some augmentations
    //      NeuroFlux Governor
    this.level = 0;
}

Augmentation.prototype.setInfo = function(inf) {
    this.info = inf;
}

Augmentation.prototype.setRequirements = function(rep, cost) {
    this.baseRepRequirement = rep;
    this.baseCost = cost;
}

//Takes in an array of faction names and adds this augmentation to all of those factions
Augmentation.prototype.addToFactions = function(factionList) {
    for (var i = 0; i < factionList.length; ++i) {
        var faction = Factions[factionList[i]];
        if (faction == null) {
            console.log("Error: Could not find faction with this name:" + factionList[i]);
            continue;
        }
        faction.augmentations.push(this.name);
    }
}

Augmentation.prototype.addToAllFactions = function() {
    for (var fac in Factions) {
        if (Factions.hasOwnProperty(fac)) {
            var facObj = Factions[fac];
            if (facObj == null) {
                console.log("ERROR: Invalid faction object");
                continue;
            }
            facObj.augmentations.push(this.name);
        }
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

AugmentationNames = {
    Targeting1:                         "Augmented Targeting I",
    Targeting2:                         "Augmented Targeting II",
    Targeting3:                         "Augmented Targeting III",
    SyntheticHeart:                     "Synthetic Heart",
    SynfibrilMuscle:                    "Synfibril Muscle",
    CombatRib1:                         "Combat Rib I",
    CombatRib2:                         "Combat Rib II",
    CombatRib3:                         "Combat Rib III",
    NanofiberWeave:                     "Nanofiber Weave",
    SubdermalArmor:                     "NEMEAN Subdermal Weave",
    WiredReflexes:                      "Wired Reflexes",
    GrapheneBoneLacings:                "Graphene Bone Lacings",
    BionicSpine:                        "Bionic Spine",
    GrapheneBionicSpine:                "Graphene Bionic Spine Upgrade",
    BionicLegs:                         "Bionic Legs",
    GrapheneBionicLegs:                 "Graphene Bionic Legs Upgrade",
    SpeechProcessor:                    "Speech Processor Implant",
    TITN41Injection:                    "TITN-41 Gene-Modification Injection",
    EnhancedSocialInteractionImplant:   "Enhanced Social Interaction Implant",
    BitWire:                            "BitWire",
    ArtificialBioNeuralNetwork:         "Artificial Bio-neural Network Implant",
    ArtificialSynapticPotentiation:     "Artificial Synaptic Potentiation",
    EnhancedMyelinSheathing:            "Enhanced Myelin Sheathing",
    SynapticEnhancement:                "Synaptic Enhancement Implant",
    NeuralRetentionEnhancement:         "Neural-Retention Enhancement",
    DataJack:                           "DataJack",
    ENM:                                "Embedded Netburner Module",
    ENMCore:                            "Embedded Netburner Module Core Implant",
    ENMCoreV2:                          "Embedded Netburner Module Core V2 Upgrade",
    ENMCoreV3:                          "Embedded Netburner Module Core V3 Upgrade",
    ENMAnalyzeEngine:                   "Embedded Netburner Module Analyze Engine",
    ENMDMA:                             "Embedded Netburner Module Direct Memory Access Upgrade",
    Neuralstimulator:                   "Neuralstimulator",
    NuoptimalInjectorImplant:           "Nuoptimal Nootropic Injector Implant",
    SpeechEnhancement:                  "Speech Enhancement",
    FocusWire:                          "FocusWire",
    PCDNI:                              "PC Direct-Neural Interface",
    PCDNIOptimizer:                     "PC Direct-Neural Interface Optimization Submodule",
    PCDNINeuralNetwork:                 "PC Direct-Neural Interface NeuroNet Injector",
    ADRPheromone1:                      "ADR-V1 Pheromone Gene",
    HacknetNodeCPUUpload:               "Hacknet Node CPU Architecture Neural-Upload",
    HacknetNodeCacheUpload:             "Hacknet Node Cache Architecture Neural-Upload",
    HacknetNodeNICUpload:               "HacknetNode NIC Architecture Neural-Upload",
    HacknetNodeKernelDNI:               "Hacknet Node Kernel Direct-Neural Interface",
    HacknetNodeCoreDNI:                 "Hacknet Node Core Direct-Neural Interface",
    NeuroFluxGovernor:                  "NeuroFlux Governor",
    Neurotrainer1:                      "Neurotrainer I",
    Neurotrainer2:                      "Neurotrainer II",
    Neurotrainer3:                      "Neurotrainer III",
    Hypersight:                         "HyperSight Corneal Implant",
}

//TODO Something that decreases RAM usage of scripts
initAugmentations = function() {
    //Combat stat augmentations
    var Targeting1 = new Augmentation(AugmentationNames.Targeting1);
    Targeting1.setRequirements(4000, 6000000);
    Targeting1.setInfo("This cranial implant is embedded within the player's inner ear structure and optic nerves. It regulates and enhances the user's " + 
                       "balance and hand-eye coordination. It is also capable of augmenting reality by projecting digital information " + 
                       "directly onto the retina. These enhancements allow the player to better lock-on and keep track of enemies. <br><br>" +
                       "This augmentation increases the player's dexterity by 10%.");
    Targeting1.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                            "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.Targeting1)) {
        Targeting1.owned = Augmentations[AugmentationNames.Targeting1].owned;
        delete Augmentations[AugmentationNames.Targeting1];
    }
    AddToAugmentations(Targeting1);

    var Targeting2 = new Augmentation(AugmentationNames.Targeting2);
    Targeting2.setRequirements(10000, 15000000);
    Targeting2.setInfo("This is an upgrade of the Augmented Targeting I cranial implant, which is capable of augmenting reality " + 
                       "and enhances the user's balance and hand-eye coordination. <br><br>This upgrade increases the player's dexterity " + 
                       "by an additional 20%.");
    Targeting2.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.Targeting2)) {
        Targeting2.owned = Augmentations[AugmentationNames.Targeting2].owned;
        delete Augmentations[AugmentationNames.Targeting2];
    } 
    AddToAugmentations(Targeting2);
    
    var Targeting3 = new Augmentation(AugmentationNames.Targeting3);
    Targeting3.setRequirements(40000, 50000000);
    Targeting3.setInfo("This is an upgrade of the Augmented Targeting II cranial implant, which is capable of augmenting reality " + 
                       "and enhances the user's balance and hand-eye coordination. <br><br>This upgrade increases the player's dexterity " +
                       "by an additional 50%.");
    Targeting3.addToFactions(["The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant"]);
    if (augmentationExists(AugmentationNames.Targeting3)) {
        Targeting3.owned = Augmentations[AugmentationNames.Targeting3].owned;
        delete Augmentations[AugmentationNames.Targeting3];
    }
    AddToAugmentations(Targeting3);
    
    var SyntheticHeart = new Augmentation(AugmentationNames.SyntheticHeart);
    SyntheticHeart.setRequirements(400000, 500000000);
    SyntheticHeart.setInfo("This advanced artificial heart, created from plasteel and graphene, is capable of pumping more blood " + 
                           "at much higher efficiencies than a normal human heart.<br><br> This augmentation increases the player's agility " +
                           "and strength by 100%");
    SyntheticHeart.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                 "NWO", "The Covenant", "Daedalus", "Illuminati"]);
    if (augmentationExists(AugmentationNames.SyntheticHeart)) {
        SyntheticHeart.owned = Augmentations[AugmentationNames.SyntheticHeart].owned;
        delete Augmentations[AugmentationNames.SyntheticHeart];
    }
    AddToAugmentations(SyntheticHeart);
    
    var SynfibrilMuscle = new Augmentation(AugmentationNames.SynfibrilMuscle);
    SynfibrilMuscle.setRequirements(300000, 400000000);
    SynfibrilMuscle.setInfo("The myofibrils in human muscles are injected with special chemicals that react with the proteins inside " + 
                            "the myofibrils, altering their underlying structure. The end result is muscles that are stronger and more elastic. " + 
                            "Scientists have named these artificially enhanced units 'synfibrils'.<br><br> This augmentation increases the player's " +
                            "strength and defense by 50%.");
    SynfibrilMuscle.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                  "NWO", "The Covenant", "Daedalus", "Illuminati", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.SynfibrilMuscle)) {
        SynfibrilMuscle.owned = Augmentations[AugmentationNames.SynfibrilMuscle].owned;
        delete Augmentations[AugmentationNames.SynfibrilMuscle];
    }
    AddToAugmentations(SynfibrilMuscle)
    
    var CombatRib1 = new Augmentation(AugmentationNames.CombatRib1);
    CombatRib1.setRequirements(8000, 12000000);
    CombatRib1.setInfo("The human body's ribs are replaced with artificial ribs that automatically and continuously release cognitive " + 
                       "and performance-enhancing drugs into the bloodstream, improving the user's abilities in combat.<br><br>" + 
                       "This augmentation increases the player's strength and defense by 10%.");
    CombatRib1.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.CombatRib1)) {
        CombatRib1.owned = Augmentations[AugmentationNames.CombatRib1].owned;
        delete Augmentations[AugmentationNames.CombatRib1];
    }
    AddToAugmentations(CombatRib1);
    
    var CombatRib2 = new Augmentation(AugmentationNames.CombatRib2);
    CombatRib2.setRequirements(20000, 30000000);
    CombatRib2.setInfo("This is an upgrade to the Combat Rib I augmentation, and is capable of releasing even more potent combat-enhancing " + 
                       "drugs into the bloodstream<br><br>. This upgrade increases the player's strength and defense by an additional 20%.")
    CombatRib2.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.CombatRib2)) {
        CombatRib2.owned = Augmentations[AugmentationNames.CombatRib2].owned;
        delete Augmentations[AugmentationNames.CombatRib2];
    }
    AddToAugmentations(CombatRib2);
    
    var CombatRib3 = new Augmentation(AugmentationNames.CombatRib3);
    CombatRib3.setRequirements(40000, 90000000);
    CombatRib3.setInfo("This is an upgrade to the Combat Rib II augmentation, and is capable of releasing even more potent combat-enhancing " + 
                       "drugs into the bloodstream<br><br>. This upgrade increases the player's strength and defense by an additional 30%.");
    CombatRib3.addToFactions(["The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant"]);
    if (augmentationExists(AugmentationNames.CombatRib3)) {
        CombatRib3.owned = Augmentations[AugmentationNames.CombatRib3].owned;
        delete Augmentations[AugmentationNames.CombatRib3];
    }
    AddToAugmentations(CombatRib3);
    
    var NanofiberWeave = new Augmentation(AugmentationNames.NanofiberWeave);
    NanofiberWeave.setRequirements(110000, 250000000);
    NanofiberWeave.setInfo("Synthetic nanofibers are woven into the skin's extracellular matrix using electrospinning. " + 
                           "This improves the skin's ability to regenerate itself and protect the body from external stresses and forces.<br><br>" + 
                           "This augmentation increases the player's strength and defense by 30%.");
    NanofiberWeave.addToFactions(["Tian Di Hui", "The Syndicate", "The Dark Army", "Speakers for the Dead",
                                 "Blade Industries", "Fulcrum Secret Technologies", "OmniTek Incorporated"]);
    if (augmentationExists(AugmentationNames.NanofiberWeave)) {
        NanofiberWeave.owned = Augmentations[AugmentationNames.NanofiberWeave].owned;
        delete Augmentations[AugmentationNames.NanofiberWeave];
    } 
    AddToAugmentations(NanofiberWeave);
    
    var SubdermalArmor = new Augmentation(AugmentationNames.SubdermalArmor);
    SubdermalArmor.setRequirements(600000, 750000000);
    SubdermalArmor.setInfo("The NEMEAN Subdermal Weave is a thin, light-weight, graphene plating that houses a dilatant fluid. " +
                           "The material is implanted underneath the skin, and is the most advanced form of defensive enhancement " +
                           "that has ever been created. The dilatant fluid, despite being thin and light, is extremely effective " + 
                           "at stopping piercing blows and reducing blunt trauma. The properties of graphene allow the plating to " +
                           "mitigate damage from any fire-related or electrical traumas.<br><br>" + 
                           "This augmentation increases the player's defense by 150%.");
    SubdermalArmor.addToFactions(["The Syndicate", "Fulcrum Secret Technologies", "Illuminati", "Daedalus",
                                 "The Covenant"]);
    if (augmentationExists(AugmentationNames.SubdermalArmor)) {
        SubdermalArmor.owned = Augmentations[AugmentationNames.SubdermalArmor].owned;
        delete Augmentations[AugmentationNames.SubdermalArmor];
    }
    AddToAugmentations(SubdermalArmor);
    
    var WiredReflexes = new Augmentation(AugmentationNames.WiredReflexes);
    WiredReflexes.setRequirements(1500, 500000);
    WiredReflexes.setInfo("Synthetic nerve-enhancements are injected into all major parts of the somatic nervous system, " + 
                          "supercharging the body's ability to send signals through neurons. This results in increased reflex speed.<br><br>" + 
                          "This augmentation increases the player's agility by 5%.");
    WiredReflexes.addToFactions(["Tian Di Hui", "Sector-12", "Volhaven", "Aevum", "Ishima", 
                                "The Syndicate", "The Dark Army", "Speakers for the Dead"]);
    if (augmentationExists(AugmentationNames.WiredReflexes)) {
        WiredReflexes.owned = Augmentations[AugmentationNames.WiredReflexes].owned;
        delete Augmentations[AugmentationNames.WiredReflexes];
    }
    AddToAugmentations(WiredReflexes);
    
    var GrapheneBoneLacings = new Augmentation(AugmentationNames.GrapheneBoneLacings);
    GrapheneBoneLacings.setRequirements(750000, 1000000000);
    GrapheneBoneLacings.setInfo("A graphene-based material is grafted and fused into the user's bones, significantly increasing " +
                                "their density and tensile strength.<br><br>" + 
                                "This augmentation increases the player's strength and defense by 100%.");
    GrapheneBoneLacings.addToFactions(["Fulcrum Secret Technologies", "The Covenant"]);
    if (augmentationExists(AugmentationNames.GrapheneBoneLacings)) {
        GrapheneBoneLacings.owned = Augmentations[AugmentationNames.GrapheneBoneLacings].owned;
        delete Augmentations[AugmentationNames.GrapheneBoneLacings];
    }
    AddToAugmentations(GrapheneBoneLacings);
    
    var BionicSpine = new Augmentation(AugmentationNames.BionicSpine);
    BionicSpine.setRequirements(120000, 75000000);
    BionicSpine.setInfo("An artificial spine created from plasteel and carbon fibers that completely replaces the organic spine. " + 
                        "Not only is the Bionic Spine physically stronger than a human spine, but it is also capable of digitally " + 
                        "stimulating and regulating the neural signals that are sent and received by the spinal cord. This results in " + 
                        "greatly improved senses and reaction speeds.<br><br>" + 
                        "This augmentation increases all of the player's combat stats by 20%.");
    BionicSpine.addToFactions(["Speakers for the Dead", "The Syndicate", "KuaiGong International",
                              "OmniTek Incorporated", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.BionicSpine)) {
        BionicSpine.owned = Augmentations[AugmentationNames.BionicSpine].owned;
        delete Augmentations[AugmentationNames.BionicSpine];
    }
    AddToAugmentations(BionicSpine);
    
    var GrapheneBionicSpine = new Augmentation(AugmentationNames.GrapheneBionicSpine);
    GrapheneBionicSpine.setRequirements(650000, 1000000000);
    GrapheneBionicSpine.setInfo("An upgrade to the Bionic Spine augmentation. It fuses the implant with an advanced graphene " + 
                                "material to make it much stronger and lighter.<br><br>" + 
                                "This augmentation increases all of the player's combat stats by 100%.");
    GrapheneBionicSpine.addToFactions(["Fulcrum Secret Technologies", "ECorp"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicSpine)) {
        GrapheneBionicSpine.owned = Augmentations[AugmentationNames.GrapheneBionicSpine].owned;
        delete Augmentations[AugmentationNames.GrapheneBionicSpine];
    }
    AddToAugmentations(GrapheneBionicSpine);
    
    var BionicLegs = new Augmentation(AugmentationNames.BionicLegs);
    BionicLegs.setRequirements(100000, 60000000);
    BionicLegs.setInfo("Cybernetic legs created from plasteel and carbon fibers that completely replace the user's organic legs. <br><br>" + 
                       "This augmentation increases the player's agility by 50%.");
    BionicLegs.addToFactions(["Speakers for the Dead", "The Syndicate", "KuaiGong International",
                             "OmniTek Incorporated", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.BionicLegs)) {
        BionicLegs.owned = Augmentations[AugmentationNames.BionicLegs].owned;
        delete Augmentations[AugmentationNames.BionicLegs];
    }
    AddToAugmentations(BionicLegs);
    
    var GrapheneBionicLegs = new Augmentation(AugmentationNames.GrapheneBionicLegs);
    GrapheneBionicLegs.setRequirements(400000, 900000000);
    GrapheneBionicLegs.setInfo("An upgrade to the Bionic Legs augmentation. It fuses the implant with an advanced graphene " + 
                               "material to make it much stronger and lighter.<br><br>" + 
                               "This augmentation increases the player's agility by an additional 150%.");
    GrapheneBionicLegs.addToFactions(["MegaCorp", "ECorp", "Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicLegs)) {
        GrapheneBionicLegs.owned = Augmentations[AugmentationNames.GrapheneBionicLegs].owned;
        delete Augmentations[AugmentationNames.GrapheneBionicLegs];
    }
    AddToAugmentations(GrapheneBionicLegs);
    
    //Labor stat augmentations
    var SpeechProcessor = new Augmentation(AugmentationNames.SpeechProcessor); //Cochlear imlant?
    SpeechProcessor.setRequirements(9000, 40000000);
    SpeechProcessor.setInfo("A cochlear implant with an embedded computer that analyzes incoming speech. " +
                            "The embedded computer processes characteristics of incoming speech, such as tone " +
                            "and inflection, to pick up on subtle cues and aid in social interaction.<br><br>" + 
                            "This augmentation increases the player's charisma by 20%.");
    SpeechProcessor.addToFactions(["Tian Di Hui", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                  "Ishima", "Volhaven", "Silhouette"]);
    if (augmentationExists(AugmentationNames.SpeechProcessor)) {
        SpeechProcessor.owned = Augmentations[AugmentationNames.SpeechProcessor].owned;
        delete Augmentations[AugmentationNames.SpeechProcessor];
    }
    AddToAugmentations(SpeechProcessor);
    
    TITN41Injection = new Augmentation(AugmentationNames.TITN41Injection);
    TITN41Injection.setRequirements(15000, 75000000);
    TITN41Injection.setInfo("TITN is a series of viruses that targets and alters the sequences of human DNA in genes that " + 
                            "control personality. The TITN-41 strain alters these genes so that the subject becomes more " + 
                            "outgoing and socialable. <br><br>" + 
                            "This augmentation increases the player's charisma and charisma experience gain rate by 15%");
    TITN41Injection.addToFactions(["Silhouette"]);            
    if (augmentationExists(AugmentationNames.TITN41Injection)) {
        TITN41Injection.owned = Augmentations[AugmentationNames.TITN41Injection].owned;
        delete Augmentations[AugmentationNames.TITN41Injection];
    }
    AddToAugmentations(TITN41Injection);
    
    var EnhancedSocialInteractionImplant = new Augmentation(AugmentationNames.EnhancedSocialInteractionImplant);
    EnhancedSocialInteractionImplant.setRequirements(500000, 500000000);
    EnhancedSocialInteractionImplant.setInfo("A cranial implant that greatly assists in the user's ability to analyze social situations " + 
                                             "and interactions. The system uses a wide variety of factors such as facial expression, body " + 
                                             "language, and the voice's tone/inflection to determine the best course of action during social" + 
                                             "situations. The implant also uses deep learning software to continuously learn new behavior" + 
                                             "patterns and how to best respond.<br><br>" + 
                                             "This augmentation increases the player's charisma and charisma experience gain rate by 50%.");
    EnhancedSocialInteractionImplant.addToFactions(["Bachman & Associates", "NWO", "Clarke Incorporated",
                                                   "OmniTek Incorporated", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.EnhancedSocialInteractionImplant)) {
        EnhancedSocialInteractionImplant.owned = Augmentations[AugmentationNames.EnhancedSocialInteractionImplant].owned;
        delete Augmentations[AugmentationNames.EnhancedSocialInteractionImplant];
    }
    AddToAugmentations(EnhancedSocialInteractionImplant);
    
    //Hacking augmentations
    var BitWire = new Augmentation(AugmentationNames.BitWire);
    BitWire.setRequirements(3000, 3000000);
    BitWire.setInfo("A small brain implant embedded in the cerebrum. This regulates and improves the brain's computing " + 
                    "capabilities. <br><br> This augmentation increases the player's hacking skill by 5%");
    BitWire.addToFactions(["CyberSec", "BitRunners", "NiteSec"]);
    if (augmentationExists(AugmentationNames.BitWire)) {
        BitWire.owned = Augmentations[AugmentationNames.BitWire].owned;
        delete Augmentations[AugmentationNames.BitWire];
    }
    AddToAugmentations(BitWire);
    
    var ArtificialBioNeuralNetwork = new Augmentation(AugmentationNames.ArtificialBioNeuralNetwork);
    ArtificialBioNeuralNetwork.setRequirements(150000, 600000000);
    ArtificialBioNeuralNetwork.setInfo("A network consisting of millions of nanoprocessors is embedded into the brain. " +
                                       "The network is meant to mimick the way a biological brain solves a problem, which each " + 
                                       "nanoprocessor acting similar to the way a neuron would in a neural network. However, these " + 
                                       "nanoprocessors are programmed to perform computations much faster than organic neurons, " + 
                                       "allowing its user to solve much more complex problems at a much faster rate.<br><br>" + 
                                       "This augmentation:<br>" + 
                                       "Increases the player's hacking speed by 2%<br>" + 
                                       "Increases the amount of money the player's gains from hacking by 10%<br>" + 
                                       "Inreases the player's hacking skill by 10%");
    ArtificialBioNeuralNetwork.addToFactions(["BitRunners", "Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.ArtificialBioNeuralNetwork)) {
        ArtificialBioNeuralNetwork.owned = Augmentations[AugmentationNames.ArtificialBioNeuralNetwork].owned;
        delete Augmentations[AugmentationNames.ArtificialBioNeuralNetwork];
    }
    AddToAugmentations(ArtificialBioNeuralNetwork);
    
    var ArtificialSynapticPotentiation = new Augmentation(AugmentationNames.ArtificialSynapticPotentiation);
    ArtificialSynapticPotentiation.setRequirements(5000, 25000000);
    ArtificialSynapticPotentiation.setInfo("The body is injected with a chemical that artificially induces synaptic potentiation, " + 
                                           "otherwise known as the strengthening of synapses. This results in a enhanced cognitive abilities.<br><br>" + 
                                           "This augmentation increases the player's hacking speed and hacking chance by 2%.");
    ArtificialSynapticPotentiation.addToFactions(["The Black Hand", "NiteSec"]);
    if (augmentationExists(AugmentationNames.ArtificialSynapticPotentiation)) {
        ArtificialSynapticPotentiation.owned = Augmentations[AugmentationNames.ArtificialSynapticPotentiation].owned;
        delete Augmentations[AugmentationNames.ArtificialSynapticPotentiation];
    }
    AddToAugmentations(ArtificialSynapticPotentiation);
    
    var EnhancedMyelinSheathing = new Augmentation(AugmentationNames.EnhancedMyelinSheathing);
    EnhancedMyelinSheathing.setRequirements(250000, 850000000);
    EnhancedMyelinSheathing.setInfo("Electrical signals are used to induce a new, artificial form of myelinogensis in the human body. " + 
                                    "This process results in the proliferation of new, synthetic myelin sheaths in the nervous " + 
                                    "system. These myelin sheaths can propogate neuro-signals much faster than their organic " + 
                                    "counterparts, leading to greater processing speeds and better brain function.<br><br>" + 
                                    "This augmentation:<br>" + 
                                    "Increases the player's hacking speed by 1%<br>" + 
                                    "Increases the player's hacking skill by 5%<br>" + 
                                    "Increases the player's hacking experience gain rate by 5%");
    EnhancedMyelinSheathing.addToFactions(["Fulcrum Secret Technologies", "BitRunners", "The Black Hand"]);
    if (augmentationExists(AugmentationNames.EnhancedMyelinSheathing)) {
        EnhancedMyelinSheathing.owned = Augmentations[AugmentationNames.EnhancedMyelinSheathing].owned;
        delete Augmentations[AugmentationNames.EnhancedMyelinSheathing];
    }
    AddToAugmentations(EnhancedMyelinSheathing);
    
    var SynapticEnhancement = new Augmentation(AugmentationNames.SynapticEnhancement);
    SynapticEnhancement.setRequirements(1500, 1200000);
    SynapticEnhancement.setInfo("A small cranial implant that continuously uses weak electric signals to stimulate the brain and " +
                                "induce stronger synaptic activity. This improves the the user's cognitive abilities.<br><br>" + 
                                "This augmentation increases the player's hacking speed by 1%.");
    SynapticEnhancement.addToFactions(["CyberSec"]);
    if (augmentationExists(AugmentationNames.SynapticEnhancement)) {
        SynapticEnhancement.owned = Augmentations[AugmentationNames.SynapticEnhancement].owned;
        delete Augmentations[AugmentationNames.SynapticEnhancement];
    }
    AddToAugmentations(SynapticEnhancement);
    
    var NeuralRetentionEnhancement = new Augmentation(AugmentationNames.NeuralRetentionEnhancement);
    NeuralRetentionEnhancement.setRequirements(20000, 100000000);
    NeuralRetentionEnhancement.setInfo("Chemical injections are used to permanently alter and strengthen the brain's neuronal " +
                                       "circuits, strengthening its ability to retain information.<br><br>" + 
                                       "This augmentation increases the player's hacking experience gain rate by 40%.");
    NeuralRetentionEnhancement.addToFactions(["CyberSec", "NiteSec"]);
    if (augmentationExists(AugmentationNames.NeuralRetentionEnhancement)) {
        NeuralRetentionEnhancement.owned = Augmentations[AugmentationNames.NeuralRetentionEnhancement].owned;
        delete Augmentations[AugmentationNames.NeuralRetentionEnhancement];
    }
    AddToAugmentations(NeuralRetentionEnhancement);
    
    var DataJack = new Augmentation(AugmentationNames.DataJack);
    DataJack.setRequirements(200000, 75000000);
    DataJack.setInfo("A brain implant that provides an interface for direct, wireless communication between a computer's main " + 
                     "memory and the mind. This implant allows the user to not only access a computer's memory, but also alter " + 
                     "and delete it.<br><br>" + 
                     "This augmentation increases the amount of money the player gains from hacking by 20%");
    DataJack.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "Chongqing", "New Tokyo"]);
    if (augmentationExists(AugmentationNames.DataJack)) {
        DataJack.owned = Augmentations[AugmentationNames.DataJack].owned;
        delete Augmentations[AugmentationNames.DataJack];
    }
    AddToAugmentations(DataJack);
    
    var ENM = new Augmentation(AugmentationNames.ENM);
    ENM.setRequirements(8000, 100000000);
    ENM.setInfo("A thin device embedded inside the arm containing a wireless module capable of connecting " + 
                "to nearby networks. Once connected, the Netburner Module is capable of capturing and " + 
                "processing all of the traffic on that network. By itself, the Embedded Netburner Module does " + 
                "not do much, but a variety of very powerful upgrades can be installed that allow you to fully " +
                "control the traffic on a network.<br><br>" + 
                "This augmentation increases the player's hacking skill by 2%");
    ENM.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp", 
                      "Fulcrum Secret Technologies", "NWO", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.ENM)) {
        ENM.owned = Augmentations[AugmentationNames.ENM].owned;
        delete Augmentations[AugmentationNames.ENM];
    }
    AddToAugmentations(ENM);
    
    var ENMCore = new Augmentation(AugmentationNames.ENMCore);
    ENMCore.setRequirements(250000, 500000000);
    ENMCore.setInfo("The Core library is an implant that upgrades the firmware of the Embedded Netburner Module. " + 
                    "This upgrade allows the Embedded Netburner Module to generate its own data on a network.<br><br>" +
                    "This augmentation:<br>" + 
                    "Increases the player's hacking speed by 2%<br>" + 
                    "Increases the amount of money the player gains from hacking by 10%<br>" + 
                    "Increases the player's chance of successfully performing a hack by 2%<br>" + 
                    "Increases the player's hacking experience gain rate by 10%<br>" + 
                    "Increases the player's hacking skill by 1%");
    ENMCore.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp", 
                          "Fulcrum Secret Technologies", "NWO", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.ENMCore)) {
        ENMCore.owned = Augmentations[AugmentationNames.ENMCore].owned;
        delete Augmentations[AugmentationNames.ENMCore];
    }
    AddToAugmentations(ENMCore);
    
    var ENMCoreV2 = new Augmentation(AugmentationNames.ENMCoreV2);
    ENMCoreV2.setRequirements(500000, 1000000000);
    ENMCoreV2.setInfo("The Core V2 library is an implant that upgrades the firmware of the Embedded Netburner Module. " + 
                      "This upgraded firmware allows the Embedded Netburner Module to control the information on " + 
                      "a network by re-routing traffic, spoofing IP addresses, or altering the data inside network " + 
                      "packets.<br><br>" + 
                      "This augmentation: <br>" + 
                      "Increases the player's hacking speed by 5%<br>" + 
                      "Increases the amount of money the player gains from hacking by 50%<br>" + 
                      "Increases the player's chance of successfully performing a hack by 5%<br>" + 
                      "Increases the player's hacking experience gain rate by 50%<br>" + 
                      "Increases the player's hacking skill by 5%");
    ENMCoreV2.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                            "Blade Industries", "OmniTek Incorporated", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.ENMCoreV2)) {
        ENMCoreV2.owned = Augmentations[AugmentationNames.ENMCoreV2].owned;
        delete Augmentations[AugmentationNames.ENMCoreV2];
    }
    AddToAugmentations(ENMCoreV2);
    
    var ENMCoreV3 = new Augmentation(AugmentationNames.ENMCoreV3);
    ENMCoreV3.setRequirements(750000, 1250000000);
    ENMCoreV3.setInfo("The Core V3 library is an implant that upgrades the firmware of the Embedded Netburner Module. " + 
                      "This upgraded firmware allows the Embedded Netburner Module to seamlessly inject code into " + 
                      "any device on a network.<br><br>" + 
                      "This augmentation:<br>" + 
                      "Increases the player's hacking speed by 5%<br>" + 
                      "Increases the amount of money the player gains from hacking by 50%<br>" + 
                      "Increases the player's chance of successfully performing a hack by 10%<br>" + 
                      "Increases the player's hacking experience gain rate by 100%<br>" + 
                      "Increases the player's hacking skill by 10%");
    ENMCoreV3.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                            "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMCoreV3)) {
        ENMCoreV3.owned = Augmentations[AugmentationNames.ENMCoreV3].owned;
        delete Augmentations[AugmentationNames.ENMCoreV3];
    }
    AddToAugmentations(ENMCoreV3);
    
    var ENMAnalyzeEngine = new Augmentation(AugmentationNames.ENMAnalyzeEngine);
    ENMAnalyzeEngine.setRequirements(700000, 1000000000);
    ENMAnalyzeEngine.setInfo("Installs the Analyze Engine for the Embedded Netburner Module, which is a CPU cluster " + 
                             "that vastly outperforms the Netburner Module's native single-core processor.<br><br>" + 
                             "This augmentation increases the player's hacking speed by 10%.");
    ENMAnalyzeEngine.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                                   "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMAnalyzeEngine)) {
        ENMAnalyzeEngine.owned = Augmentations[AugmentationNames.ENMAnalyzeEngine].owned;
        delete Augmentations[AugmentationNames.ENMAnalyzeEngine];
    }
    AddToAugmentations(ENMAnalyzeEngine);
    
    var ENMDMA = new Augmentation(AugmentationNames.ENMDMA);
    ENMDMA.setRequirements(750000, 1100000000);
    ENMDMA.setInfo("This implant installs a Direct Memory Access (DMA) controller into the " + 
                   "Embedded Netburner Module. This allows the Module to send and receive data " + 
                   "directly to and from the main memory of devices on a network.<br><br>" + 
                   "This augmentation: <br>" + 
                   "Increases the amount of money the player gains from hacking by 50%<br>"  +
                   "Increases the player's chance of successfully performing a hack by 20%");            
    ENMDMA.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                         "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMDMA)) {
        ENMDMA.owned = Augmentations[AugmentationNames.ENMDMA].owned;
        delete Augmentations[AugmentationNames.ENMDMA];
    }
    AddToAugmentations(ENMDMA);
    
    var Neuralstimulator = new Augmentation(AugmentationNames.Neuralstimulator);
    Neuralstimulator.setRequirements(60000, 500000000);
    Neuralstimulator.setInfo("A cranial implant that intelligently stimulates certain areas of the brain " + 
                             "in order to improve cognitive functions<br><br>" + 
                             "This augmentation:<br>" + 
                             "Increases the player's hacking speed by 1%<br>" + 
                             "Increases the player's chance of successfully performing a hack by 10%<br>" + 
                             "Increases the player's hacking experience gain rate by 20%");
    Neuralstimulator.addToFactions(["The Black Hand", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                   "Ishima", "Volhaven", "Bachman & Associates", "Clarke Incorporated", 
                                   "Four Sigma"]);
    if (augmentationExists(AugmentationNames.Neuralstimulator)) {
        Neuralstimulator.owned = Augmentations[AugmentationNames.Neuralstimulator].owned;
        delete Augmentations[AugmentationNames.Neuralstimulator];
    }
    AddToAugmentations(Neuralstimulator);
    
    //Work Augmentations
    var NuoptimalInjectorImplant = new Augmentation(AugmentationNames.NuoptimalInjectorImplant);
    NuoptimalInjectorImplant.setRequirements(5000, 12000000);
    NuoptimalInjectorImplant.setInfo("This torso implant automatically injects nootropic supplements into " + 
                                     "the bloodstream to improve memory, increase focus, and provide other " + 
                                     "cognitive enhancements.<br><br>" + 
                                     "This augmentation increases the amount of reputation the player gains " + 
                                     "when working for a company by 15%.");
    NuoptimalInjectorImplant.addToFactions(["Tian Di Hui", "Volhaven", "New Tokyo", "Chongqing", "Ishima",
                                           "Clarke Incorporated", "Four Sigma", "Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.NuoptimalInjectorImplant)) {
        NuoptimalInjectorImplant.owned = Augmentations[AugmentationNames.NuoptimalInjectorImplant].owned;
        delete Augmentations[AugmentationNames.NuoptimalInjectorImplant];
    }
    AddToAugmentations(NuoptimalInjectorImplant);
    
    var SpeechEnhancement = new Augmentation(AugmentationNames.SpeechEnhancement);
    SpeechEnhancement.setRequirements(2000, 3000000);
    SpeechEnhancement.setInfo("An advanced neural implant that improves your speaking abilities, making " + 
                              "you more convincing and likable in conversations and overall improving your " +
                              "social interactions.<br><br>" + 
                              "This augmentation:<br>" +
                              "Increases the player's charisma by 5%<br>" +
                              "Increases the amount of reputation the player gains when working for a company by 5%");
    SpeechEnhancement.addToFactions(["Tian Di Hui", "Speakers for the Dead", "Four Sigma", "KuaiGong International",
                                    "Clarke Incorporated", "Four Sigma", "Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.SpeechEnhancement)) {
        SpeechEnhancement.owned = Augmentations[AugmentationNames.SpeechEnhancement].owned;
        delete Augmentations[AugmentationNames.SpeechEnhancement];
    }
    AddToAugmentations(SpeechEnhancement);
    
    var FocusWire = new Augmentation(AugmentationNames.FocusWire); //Stops procrastination
    FocusWire.setRequirements(80000, 200000000);
    FocusWire.setInfo("A cranial implant that stops procrastination by blocking specific neural pathways " + 
                      "in the brain.<br><br>" + 
                      "This augmentation: <br>" + 
                      "Increases all experience gains by 10%<br>" +
                      "Increases the amount of money the player gains from working by 5%<br>" + 
                      "Increases the amount of reputation the player gains when working for a company by 5%");
    FocusWire.addToFactions(["Bachman & Associates", "Clarke Incorporated", "Four Sigma", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.FocusWire)) {
        FocusWire.owned = Augmentations[AugmentationNames.FocusWire].owned;
        delete Augmentations[AugmentationNames.FocusWire];
    }
    AddToAugmentations(FocusWire)
    
    var PCDNI = new Augmentation(AugmentationNames.PCDNI);
    PCDNI.setRequirements(400000, 650000000);
    PCDNI.setInfo("Installs a Direct-Neural Interface jack into your arm that is compatible with most " + 
                  "computers. Connecting to a computer through this jack allows you to interface with " +
                  "it using the brain's electrochemical signals.<br><br>" + 
                  "This augmentation:<br>" +
                  "Increases the amount of reputation the player gains when working for a company by 10%<br>" + 
                  "Increases the player's hacking skill by 10%");
    PCDNI.addToFactions(["Four Sigma", "OmniTek Incorporated", "ECorp", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.PCDNI)) {
        PCDNI.owned = Augmentations[AugmentationNames.PCDNI].owned;
        delete Augmentations[AugmentationNames.PCDNI];
    }
    AddToAugmentations(PCDNI);
    
    var PCDNIOptimizer = new Augmentation(AugmentationNames.PCDNIOptimizer);
    PCDNIOptimizer.setRequirements(500000, 875000000);
    PCDNIOptimizer.setInfo("This is a submodule upgrade to the PC Direct-Neural Interface augmentation. It " + 
                           "improves the performance of the interface and gives the user more control options " +
                           "to the connected computer.<br><br>" + 
                           "This augmentation:<br>" + 
                           "Increases the amount of reputation the player gains when working for a company by 20%<br>" + 
                           "Increases the player's hacking skill by 20%");
    PCDNIOptimizer.addToFactions(["Fulcrum Secret Technologies", "ECorp", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.PCDNIOptimizer)) {
        PCDNIOptimizer.owned = Augmentations[AugmentationNames.PCDNIOptimizer].owned;
        delete Augmentations[AugmentationNames.PCDNIOptimizer];
    }
    AddToAugmentations(PCDNIOptimizer);
    
    var PCDNINeuralNetwork = new Augmentation(AugmentationNames.PCDNINeuralNetwork);
    PCDNINeuralNetwork.setRequirements(600000, 1100000000);
    PCDNINeuralNetwork.setInfo("This is an additional installation that upgrades the functionality of the " + 
                               "PC Direct-Neural Interface augmentation. When connected to a computer, " + 
                               "The NeuroNet Injector upgrade allows the user to use his/her own brain's " + 
                               "processing power to aid the computer in computational tasks.<br><br>" + 
                               "This augmentation:<br>" + 
                               "Increases the amount of reputation the player gains when working for a company by 10%<br>" + 
                               "Increases the player's hacking skill by 10%<br>" + 
                               "Increases the player's hacking speed by 2%");
    PCDNINeuralNetwork.addToFactions(["Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.PCDNINeuralNetwork)) {
        PCDNINeuralNetwork.owned = Augmentations[AugmentationNames.PCDNINeuralNetwork].owned;
        delete Augmentations[AugmentationNames.PCDNINeuralNetwork];
    }
    AddToAugmentations(PCDNINeuralNetwork);
    
    var ADRPheromone1 = new Augmentation(AugmentationNames.ADRPheromone1);
    ADRPheromone1.setRequirements(2000, 2000000);
    ADRPheromone1.setInfo("The body is genetically re-engineered so that it produces the ADR-V1 pheromone, " +
                          "an artificial pheromone discovered by scientists. The ADR-V1 pheromone, when excreted " + 
                          "triggers feelings of admiration and approval in other people. <br><br>" + 
                          "This augmentation: <br>" + 
                          "Increases the amount of reputation the player gains when working for a company by 10% <br>" + 
                          "Increases the amount of reputation the player gains for a faction by 10%");
    ADRPheromone1.addToFactions(["Tian Di Hui", "The Syndicate", "NWO", "MegaCorp", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.ADRPheromone1)) {
        ADRPheromone1.owned = Augmentations[AugmentationNames.ADRPheromone1].owned;
        delete Augmentations[AugmentationNames.ADRPheromone1];
    }
    AddToAugmentations(ADRPheromone1);
    
    //HacknetNode Augmentations
    var HacknetNodeCPUUpload = new Augmentation(AugmentationNames.HacknetNodeCPUUpload);
    HacknetNodeCPUUpload.setRequirements(4000, 5000000);
    HacknetNodeCPUUpload.setInfo("Uploads the architecture and design details of a Hacknet Node's CPU into " + 
                                 "the brain. This allows the user to engineer custom hardware and software  " +
                                 "for the Hacknet Node that provides better performance.<br><br>" + 
                                 "This augmentation:<br>" + 
                                 "Increases the amount of money produced by Hacknet Nodes by 15%<br>" + 
                                 "Decreases the cost of purchasing a Hacknet Node Core by 10%");
    HacknetNodeCPUUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCPUUpload)) {
        HacknetNodeCPUUpload.owned = Augmentations[AugmentationNames.HacknetNodeCPUUpload].owned;
        delete Augmentations[AugmentationNames.HacknetNodeCPUUpload];
    }
    AddToAugmentations(HacknetNodeCPUUpload);
    
    var HacknetNodeCacheUpload = new Augmentation(AugmentationNames.HacknetNodeCacheUpload);
    HacknetNodeCacheUpload.setRequirements(2000, 2500000);
    HacknetNodeCacheUpload.setInfo("Uploads the architecture and design details of a Hacknet Node's main-memory cache " + 
                                   "into the brain. This allows the user to engineer custom cache hardware for the  " + 
                                   "Hacknet Node that offers better performance.<br><br>" + 
                                   "This augmentation:<br> " + 
                                   "Increases the amount of money produced by Hacknet Nodes by 10%<br>" + 
                                   "Decreases the cost of leveling up a Hacknet Node by 10%");
    HacknetNodeCacheUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCacheUpload)) {
        HacknetNodeCacheUpload.owned = Augmentations[AugmentationNames.HacknetNodeCacheUpload].owned;
        delete Augmentations[AugmentationNames.HacknetNodeCacheUpload];
    }
    AddToAugmentations(HacknetNodeCacheUpload);
    
    var HacknetNodeNICUpload = new Augmentation(AugmentationNames.HacknetNodeNICUpload);
    HacknetNodeNICUpload.setRequirements(1000, 1000000);
    HacknetNodeNICUpload.setInfo("Uploads the architecture and design details of a Hacknet Node's Network Interface Card (NIC) " + 
                                 "into the brain. This allows the user to engineer a custom NIC for the Hacknet Node that " + 
                                 "offers better performance.<br><br>" + 
                                 "This augmentation:<br>" + 
                                 "Increases the amount of money produced by Hacknet Nodes by 5%<br>" + 
                                 "Decreases the cost of purchasing a Hacknet Node by 5%");
    HacknetNodeNICUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeNICUpload)) {
        HacknetNodeNICUpload.owned = Augmentations[AugmentationNames.HacknetNodeNICUpload].owned;
        delete Augmentations[AugmentationNames.HacknetNodeNICUpload];
    }
    AddToAugmentations(HacknetNodeNICUpload);
    
    var HacknetNodeKernelDNI = new Augmentation(AugmentationNames.HacknetNodeKernelDNI);
    HacknetNodeKernelDNI.setRequirements(12000, 30000000);
    HacknetNodeKernelDNI.setInfo("Installs a Direct-Neural Interface jack into the arm that is capable of connecting to a " + 
                                 "Hacknet Node. This lets the user access and manipulate the Node's kernel using the mind's " + 
                                 "electrochemical signals.<br><br>" + 
                                 "This augmentation increases the amount of money produced by Hacknet Nodes by 50%.");
    HacknetNodeKernelDNI.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeKernelDNI)) {
        HacknetNodeKernelDNI.owned = Augmentations[AugmentationNames.HacknetNodeKernelDNI].owned;
        delete Augmentations[AugmentationNames.HacknetNodeKernelDNI];
    }
    AddToAugmentations(HacknetNodeKernelDNI);
    
    var HacknetNodeCoreDNI = new Augmentation(AugmentationNames.HacknetNodeCoreDNI);
    HacknetNodeCoreDNI.setRequirements(20000, 50000000);
    HacknetNodeCoreDNI.setInfo("Installs a Direct-Neural Interface jack into the arm that is capable of connecting " +
                               "to a Hacknet Node. This lets the user access and manipulate the Node's processing logic using " + 
                               "the mind's electrochemical signals.<br><br>" + 
                               "This augmentation increases the amount of money produced by Hacknet Nodes by 75%.");
    HacknetNodeCoreDNI.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCoreDNI)) {
        HacknetNodeCoreDNI.owned = Augmentations[AugmentationNames.HacknetNodeCoreDNI].owned;
        delete Augmentations[AugmentationNames.HacknetNodeCoreDNI];
    }
    AddToAugmentations(HacknetNodeCoreDNI);
    
    //Misc augmentations
    var NeuroFluxGovernor = new Augmentation(AugmentationNames.NeuroFluxGovernor);
    if (augmentationExists(AugmentationNames.NeuroFluxGovernor)) {
        var oldAug = Augmentations[AugmentationNames.NeuroFluxGovernor];
        NeuroFluxGovernor.owned = oldAug.owned;
        NeuroFluxGovernor.level = oldAug.level;
        var mult = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, NeuroFluxGovernor.level-1);
        NeuroFluxGovernor.setRequirements(1500 * mult, 1500000 * mult);
        delete Augmentations[AugmentationNames.NeuroFluxGovernor];
    }
    NeuroFluxGovernor.setInfo("A device that is embedded in the back of the neck. The NeuroFlux Governor " + 
                              "monitors and regulates nervous impulses coming to and from the spinal column, " +
                              "essentially 'governing' the body. By doing so, it improves the functionality of the " +
                              "body's nervous system. <br><br> " + 
                              "This is a special augmentation because it can be leveled up. Each level of this augmentation " +
                              "increases all of the player's stats by 0.5%.")
    NeuroFluxGovernor.addToAllFactions();
    AddToAugmentations(NeuroFluxGovernor);
        
    var Neurotrainer1 = new Augmentation(AugmentationNames.Neurotrainer1);
    Neurotrainer1.setRequirements(1000, 1000000);
    Neurotrainer1.setInfo("A decentralized cranial implant that improves the brain's ability to learn. It is " + 
                          "installed by releasing millions of nanobots into the human brain, each of which " + 
                          "attaches to a different neural pathway to enhance the brain's ability to retain " + 
                          "and retrieve information.<br><br>" + 
                          "This augmentation increases the player's experience gain rate for all stats by 5%");
    Neurotrainer1.addToFactions(["CyberSec"]);
    if (augmentationExists(AugmentationNames.Neurotrainer1)) {
        Neurotrainer1.owned = Augmentations[AugmentationNames.Neurotrainer1].owned;
        delete Augmentations[AugmentationNames.Neurotrainer1];
    }
    AddToAugmentations(Neurotrainer1);
    
    var Neurotrainer2 = new Augmentation(AugmentationNames.Neurotrainer2);
    Neurotrainer2.setRequirements(5000, 10000000);
    Neurotrainer2.setInfo("A decentralized cranial implant that improves the brain's ability to learn. This " + 
                          "is a more powerful version of the Neurotrainer I augmentation, but it does not " + 
                          "require Neurotrainer I to be installed as a prerequisite.<br><br>" + 
                          "This augmentation increases the player's experience gain rate for all stats by 10%");
    Neurotrainer2.addToFactions(["BitRunners", "NiteSec"]);
    if (augmentationExists(AugmentationNames.Neurotrainer2)) {
        Neurotrainer2.owned = Augmentations[AugmentationNames.Neurotrainer2].owned;
        delete Augmentations[AugmentationNames.Neurotrainer2];
    }
    AddToAugmentations(Neurotrainer2);
    
    var Neurotrainer3 = new Augmentation(AugmentationNames.Neurotrainer3);
    Neurotrainer3.setRequirements(12000, 50000000);
    Neurotrainer3.setInfo("A decentralized cranial implant that improves the brain's ability to learn. This " +
                          "is a more powerful version of the Neurotrainer I and Neurotrainer II augmentation, " + 
                          "but it does not require either of them to be installed as a prerequisite.<br><br>" + 
                          "This augmentation increases the player's experience gain rate for all stats by 20%");
    Neurotrainer3.addToFactions(["NWO", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.Neurotrainer3)) {
        Neurotrainer3.owned = Augmentations[AugmentationNames.Neurotrainer3].owned;
        delete Augmentations[AugmentationNames.Neurotrainer3];
    }
    AddToAugmentations(Neurotrainer3);
    
    var Hypersight = new Augmentation(AugmentationNames.Hypersight);
    Hypersight.setInfo("A bionic eye implant that grants sight capabilities far beyond those of a natural human. " +
                       "Embedded circuitry within the implant provides the ability to detect heat and movement " +
                       "through solid objects such as wells, thus providing 'x-ray vision'-like capabilities.<br><br>" + 
                       "This augmentation: <br>" + 
                       "Increases the player's dexterity by 50%<br>" + 
                       "Increases the player's hacking speed by 1%<br>" + 
                       "Increases the amount of money the player gains from hacking by 10%");
    Hypersight.setRequirements(120000, 650000000);
    Hypersight.addToFactions(["Blade Industries", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.Hypersight)) {
        Hypersight.owned = Augmentations[AugmentationNames.Hypersight].owned;
        delete Augmentations[AugmentationNames.Hypersight];
    }
    AddToAugmentations(Hypersight);
}

applyAugmentation = function(aug, faction) {
    if (aug.name != AugmentationNames.NeuroFluxGovernor && aug.owned) {
        throw new Error("This Augmentation is already owned/applied...somethings wrong");
        return;
    }
    
    switch(aug.name) {
        //Combat stat augmentations
        case AugmentationNames.Targeting1:
            Player.dexterity_mult *= 1.1;
            break;
        case AugmentationNames.Targeting2:
            Player.dexterity_mult *= 1.2;
            break;
        case AugmentationNames.Targeting3:
            Player.dexterity_mult *= 1.5;
            break;
        case AugmentationNames.SyntheticHeart:         //High level
            Player.agility_mult *= 2.0;
            Player.strength_mult *= 2.0;
            break;
        case AugmentationNames.SynfibrilMuscle:        //Medium-high level
            Player.strength_mult    *= 1.5;
            Player.defense_mult     *= 1.5;
            break;
        case AugmentationNames.CombatRib1:
            //Str and Defense 5%
            Player.strength_mult    *= 1.1;
            Player.defense_mult     *= 1.1;
            break;
        case AugmentationNames.CombatRib2:
            Player.strength_mult    *= 1.2;
            Player.defense_mult     *= 1.2;
            break;
        case AugmentationNames.CombatRib3:
            Player.strength_mult    *= 1.3;
            Player.defense_mult     *= 1.3;
            break;
        case AugmentationNames.NanofiberWeave:         //Med level
            Player.strength_mult    *= 1.3;
            Player.defense_mult     *= 1.3;
            break;
        case AugmentationNames.SubdermalArmor:  //High level
            Player.defense_mult     *= 2.5;
            break;
        case AugmentationNames.WiredReflexes:          //Low level
            Player.agility_mult     *= 1.05;
            break;
        case AugmentationNames.GrapheneBoneLacings:   //High level
            Player.strength_mult    *= 2;
            Player.defense_mult     *= 2;
            break;
        case AugmentationNames.BionicSpine:            //Med level
            Player.strength_mult    *= 1.2;
            Player.defense_mult     *= 1.2;
            Player.agility_mult     *= 1.2;
            Player.dexterity_mult   *= 1.2;
            break;
        case AugmentationNames.GrapheneBionicSpine:   //High level
            Player.strength_mult    *= 2;
            Player.defense_mult     *= 2;
            Player.agility_mult     *= 2;
            Player.dexterity_mult   *= 2;
            break;
        case AugmentationNames.BionicLegs:             //Med level
            Player.agility_mult     *= 1.5;
            break;
        case AugmentationNames.GrapheneBionicLegs:    //High level
            player.agility_mult     *= 3.0;
            break;
            
        //Labor stats augmentations
        case AugmentationNames.EnhancedSocialInteractionImplant: //Med-high level
            Player.charisma_mult        *= 1.5;
            Player.charisma_exp_mult    *= 1.5;
            break;
        case AugmentationNames.TITN41Injection:
            Player.charisma_mult        *= 1.15;
            Player.charisma_exp_mult    *= 1.15;
            break;
        case AugmentationNames.SpeechProcessor:    //Med level
            Player.charisma_mult    *= 1.2;
            break;

        //Hacking augmentations
        case AugmentationNames.BitWire:
            Player.hacking_mult   *= 1.05;
            break;
        case AugmentationNames.ArtificialBioNeuralNetwork:   //Med level
            Player.hacking_speed_mult *= .98;
            Player.hacking_money_mult *= 1.1;
            Player.hacking_mult       *= 1.1;
            break;
        case AugmentationNames.ArtificialSynapticPotentiation:    //Med level
            Player.hacking_speed_mult *= .98;
            Player.hacking_chance_mult *= 1.02;
            break;
        case AugmentationNames.EnhancedMyelinSheathing:       //Med level
            Player.hacking_speed_mult *= .99;
            Player.hacking_exp_mult   *= 1.05;
            Player.hacking_mult       *= 1.05;
            break;
        case AugmentationNames.SynapticEnhancement:    //Low Level
            Player.hacking_speed_mult *= .99;
            break;
        case AugmentationNames.NeuralRetentionEnhancement:    //Med level
            Player.hacking_exp_mult   *= 1.4;
            break;
        case AugmentationNames.DataJack:                        //Med low level
            Player.hacking_money_mult *= 1.2;
            break;
        case AugmentationNames.ENM:       //Medium level
            Player.hacking_mult           *= 1.01;
            break;
        case AugmentationNames.ENMCore:      //Medium level
            Player.hacking_speed_mult     *= .98;
            Player.hacking_money_mult     *= 1.1;
            Player.hacking_chance_mult    *= 1.02;
            Player.hacking_exp_mult       *= 1.1;
            Player.hacking_mult           *= 1.01;
            break;
        case AugmentationNames.ENMCoreV2:   //Medium high level
            Player.hacking_speed_mult     *= .95;
            Player.hacking_money_mult     *= 1.5;
            Player.hacking_chance_mult    *= 1.05;
            Player.hacking_exp_mult       *= 1.5;
            Player.hacking_mult           *= 1.05;
            break;
        case AugmentationNames.ENMCoreV3:   //High level
            Player.hacking_speed_mult     *= .95;
            Player.hacking_money_mult     *= 1.5;
            Player.hacking_chance_mult    *= 1.1;
            Player.hacking_exp_mult       *= 2.0;
            Player.hacking_mult           *= 1.1;
            break;
        case AugmentationNames.ENMAnalyzeEngine:    //High level
            //Hacking speed 20%  - High level
            Player.hacking_speed_mult     *= 0.9;
            break;
        case AugmentationNames.ENMDMA:  //High level
            //Money hacked 20%  - High level
            Player.hacking_money_mult     *= 1.5;
            Player.hacking_chance_mult    *= 1.2;
            break;
        case AugmentationNames.Neuralstimulator:    //Medium Level
            Player.hacking_speed_mult     *= .99;
            Player.hacking_chance_mult    *= 1.1;
            Player.hacking_exp_mult       *= 1.2;
            break;

        //Work augmentations
        case AugmentationNames.NuoptimalInjectorImplant:    //Low medium level
            Player.company_rep_mult   *= 1.15;
            break;
        case AugmentationNames.SpeechEnhancement:  //Low level
            Player.company_rep_mult   *= 1.05;
            Player.charisma_mult      *= 1.05;
            break;
        case AugmentationNames.FocusWire:   //Med level
            Player.hacking_exp_mult   *= 1.1;
            Player.strength_exp_mult  *= 1.1;
            Player.defense_exp_mult   *= 1.1;
            Player.dexterity_exp_mult *= 1.1;
            Player.agility_exp_mult   *= 1.1;
            Player.charisma_exp_mult  *= 1.1;
            Player.company_rep_mult   *= 1.05;
            Player.work_money_mult  *= 1.05;
            break;
        case AugmentationNames.PCDNI:  //Med level
            Player.company_rep_mult   *= 1.1;
            Player.hacking_mult       *= 1.1;
            break;
        case AugmentationNames.PCDNIOptimizer:   //High level
            //Allows u to better optimize code/pc when connecting with PC DNI..helps with software/IT jobs
            Player.company_rep_mult   *= 1.2;
            Player.hacking_mult       *= 1.2;
            break;    
        case AugmentationNames.PCDNINeuralNetwork:        //High level
            Player.company_rep_mult   *= 1.1;
            Player.hacking_mult       *= 1.1;
            Player.hacking_speed_mult *= .98;
            break;
        case AugmentationNames.ADRPheromone1:
            Player.company_rep_mult     *= 1.1;
            Player.faction_rep_mult     *= 1.1;
            break;
        
        //Hacknet Node Augmentations
        case AugmentationNames.HacknetNodeCPUUpload:
            Player.hacknet_node_money_mult            *= 1.15;
            Player.hacknet_node_purchase_cost_mult    *= 0.90;
            break;
        case AugmentationNames.HacknetNodeCacheUpload:
            Player.hacknet_node_money_mult            *= 1.10;
            Player.hacknet_node_level_cost_mult       *= 0.90;
            break;
        case AugmentationNames.HacknetNodeNICUpload:
            Player.hacknet_node_money_mult            *= 1.05;
            Player.hacknet_node_purchase_cost_mult    *= 0.95;
            break;
        case AugmentationNames.HacknetNodeKernelDNI:
            Player.hacknet_node_money_mult            *= 1.50;
            break;
        case AugmentationNames.HacknetNodeCoreDNI:
            Player.hacknet_node_money_mult            *= 1.75;
            break;
        
        //Misc augmentations
        case AugmentationNames.NeuroFluxGovernor:
            Player.hacking_mult       *= 1.005;
            Player.strength_mult      *= 1.005;
            Player.defense_mult       *= 1.005;
            Player.dexterity_mult     *= 1.005;
            Player.agility_mult       *= 1.005;
            Player.charisma_mult      *= 1.005;
            ++aug.level;
            break;    
        case AugmentationNames.Neurotrainer1:      //Low Level
            Player.hacking_exp_mult   *= 1.05;
            Player.strength_exp_mult  *= 1.05;
            Player.defense_exp_mult   *= 1.05;
            Player.dexterity_exp_mult *= 1.05;
            Player.agility_exp_mult   *= 1.05;
            Player.charisma_exp_mult  *= 1.05;
            break;
        case AugmentationNames.Neurotrainer2:     //Medium level
            Player.hacking_exp_mult   *= 1.1;
            Player.strength_exp_mult  *= 1.1;
            Player.defense_exp_mult   *= 1.1;
            Player.dexterity_exp_mult *= 1.1;
            Player.agility_exp_mult   *= 1.1;
            Player.charisma_exp_mult  *= 1.1;
            break;
        case AugmentationNames.Neurotrainer3:    //High Level
            Player.hacking_exp_mult   *= 1.2;
            Player.strength_exp_mult  *= 1.2;
            Player.defense_exp_mult   *= 1.2;
            Player.dexterity_exp_mult *= 1.2;
            Player.agility_exp_mult   *= 1.2;
            Player.charisma_exp_mult  *= 1.2;
            break;
        case AugmentationNames.Hypersight:  //Medium high level
            Player.dexterity_mult     *= 1.5;
            Player.hacking_speed_mult *= .99;
            Player.hacking_money_mult *= 1.1;
            break;
        
        default:
            throw new Error("ERROR: No such augmentation!");
            return;
    }

    aug.owned = true;
    aug.factionInstalledBy = faction.name;
    Player.augmentations.push(aug.name);
    ++Player.numAugmentations;
}

function augmentationExists(name) {
    return Augmentations.hasOwnProperty(name);
}