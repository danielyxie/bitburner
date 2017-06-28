//Augmentations
function Augmentation(name) {
    this.name = name;
    this.info = "";
    this.owned = false;

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
    this.baseRepRequirement = rep * CONSTANTS.AugmentationRepMultiplier;
    this.baseCost = cost * CONSTANTS.AugmentationCostMultiplier;
}

//Takes in an array of faction names and adds this augmentation to all of those factions
Augmentation.prototype.addToFactions = function(factionList) {
    for (var i = 0; i < factionList.length; ++i) {
        var faction = Factions[factionList[i]];
        if (faction == null) {
            console.log("ERROR: Could not find faction with this name:" + factionList[i]);
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
    NeuralAccelerator:                  "Neural Accelerator",
    CranialSignalProcessorsG1:          "Cranial Signal Processors - Gen I",
    CranialSignalProcessorsG2:          "Cranial Signal Processors - Gen II",
    CranialSignalProcessorsG3:          "Cranial Signal Processors - Gen III",
    CranialSignalProcessorsG4:          "Cranial Signal Processors - Gen IV",
    CranialSignalProcessorsG5:          "Cranial Signal Processors - Gen V",
    NeuronalDensification:              "Neuronal Densification",
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
    LuminCloaking1:                     "LuminCloaking-V1 Skin Implant",
    LuminCloaking2:                     "LuminCloaking-V2 Skin Implant",
    HemoRecirculator:                   "HemoRecirculator",
    SmartSonar:                         "SmartSonar Implant",
    PowerRecirculator:                  "Power Recirculation Core",
    QLink:                              "QLink",
    SPTN97:                             "SPTN-97 Gene Modification",
    HiveMind:                           "ECorp HVMind Implant",
    CordiARCReactor:                    "CordiARC Fusion Reactor",
    SmartJaw:                           "SmartJaw",
    Neotra:                             "Neotra",
    Xanipher:                           "Xanipher",
    nextSENS:                           "nextSENS Gene Modification",
    OmniTekInfoLoad:                    "OmniTek InfoLoad",
    PhotosyntheticCells:                "Photosynthetic Cells",
    Neurolink:                          "BitRunners Neurolink",
    TheBlackHand:                       "The Black Hand",
    CRTX42AA:                           "CRTX42-AA Gene Modification",
    Neuregen:                           "Neuregen Gene Modification",
    CashRoot:                           "CashRoot Starter Kit",
    NutriGen:                           "NutriGen Implant",
    INFRARet:                           "INFRARET Enhancement",
    DermaForce:                         "DermaForce Particle Barrier",
    GrapheneBrachiBlades:               "Graphene BranchiBlades Upgrade",
    GrapheneBionicArms:                 "Graphene Bionic Arms Upgrade",
    BrachiBlades:                       "BrachiBlades",
    BionicArms:                         "Bionic Arms",
    SNA:                                "Social Negotiation Assistant (S.N.A)"
}

initAugmentations = function() {
    for (var name in Factions) {
        if (Factions.hasOwnProperty(name)) {
            Factions[name].augmentations = [];
        }
    }
    //Combat stat augmentations
    var HemoRecirculator = new Augmentation(AugmentationNames.HemoRecirculator);
    HemoRecirculator.setInfo("A heart implant that greatly increases the body's ability to effectively use and pump " + 
                             "blood. <br><br> This augmentation increases all of the player's combat stats by 10%.")
    HemoRecirculator.setRequirements(4000, 9000000);
    HemoRecirculator.addToFactions(["Tetrads", "The Dark Army", "The Syndicate"]);
    if (augmentationExists(AugmentationNames.HemoRecirculator)) {
        delete Augmentations[AugmentationNames.HemoRecirculator];
    }
    AddToAugmentations(HemoRecirculator);
    
    var Targeting1 = new Augmentation(AugmentationNames.Targeting1);
    Targeting1.setRequirements(2000, 3000000);
    Targeting1.setInfo("This cranial implant is embedded within the player's inner ear structure and optic nerves. It regulates and enhances the user's " + 
                       "balance and hand-eye coordination. It is also capable of augmenting reality by projecting digital information " + 
                       "directly onto the retina. These enhancements allow the player to better lock-on and keep track of enemies. <br><br>" +
                       "This augmentation increases the player's dexterity by 15%.");
    Targeting1.addToFactions(["Slum Snakes", "The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                            "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.Targeting1)) {
        delete Augmentations[AugmentationNames.Targeting1];
    }
    AddToAugmentations(Targeting1);

    var Targeting2 = new Augmentation(AugmentationNames.Targeting2);
    Targeting2.setRequirements(3500, 8500000);
    Targeting2.setInfo("This is an upgrade of the Augmented Targeting I cranial implant, which is capable of augmenting reality " + 
                       "and enhances the user's balance and hand-eye coordination. <br><br>This upgrade increases the player's dexterity " + 
                       "by an additional 25%.");
    Targeting2.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.Targeting2)) {
        delete Augmentations[AugmentationNames.Targeting2];
    } 
    AddToAugmentations(Targeting2);
    
    var Targeting3 = new Augmentation(AugmentationNames.Targeting3);
    Targeting3.setRequirements(11000, 23000000);
    Targeting3.setInfo("This is an upgrade of the Augmented Targeting II cranial implant, which is capable of augmenting reality " + 
                       "and enhances the user's balance and hand-eye coordination. <br><br>This upgrade increases the player's dexterity " +
                       "by an additional 40%.");
    Targeting3.addToFactions(["The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant"]);
    if (augmentationExists(AugmentationNames.Targeting3)) {
        delete Augmentations[AugmentationNames.Targeting3];
    }
    AddToAugmentations(Targeting3);
    
    var SyntheticHeart = new Augmentation(AugmentationNames.SyntheticHeart);
    SyntheticHeart.setRequirements(300000, 575000000);
    SyntheticHeart.setInfo("This advanced artificial heart, created from plasteel and graphene, is capable of pumping more blood " + 
                           "at much higher efficiencies than a normal human heart.<br><br> This augmentation increases the player's agility " +
                           "and strength by 50%");
    SyntheticHeart.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                 "NWO", "The Covenant", "Daedalus", "Illuminati"]);
    if (augmentationExists(AugmentationNames.SyntheticHeart)) {
        delete Augmentations[AugmentationNames.SyntheticHeart];
    }
    AddToAugmentations(SyntheticHeart);
    
    var SynfibrilMuscle = new Augmentation(AugmentationNames.SynfibrilMuscle);
    SynfibrilMuscle.setRequirements(175000, 225000000);
    SynfibrilMuscle.setInfo("The myofibrils in human muscles are injected with special chemicals that react with the proteins inside " + 
                            "the myofibrils, altering their underlying structure. The end result is muscles that are stronger and more elastic. " + 
                            "Scientists have named these artificially enhanced units 'synfibrils'.<br><br> This augmentation increases the player's " +
                            "strength and defense by 35%.");
    SynfibrilMuscle.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                  "NWO", "The Covenant", "Daedalus", "Illuminati", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.SynfibrilMuscle)) {
        delete Augmentations[AugmentationNames.SynfibrilMuscle];
    }
    AddToAugmentations(SynfibrilMuscle)
    
    var CombatRib1 = new Augmentation(AugmentationNames.CombatRib1);
    CombatRib1.setRequirements(2500, 4500000);
    CombatRib1.setInfo("The human body's ribs are replaced with artificial ribs that automatically and continuously release cognitive " + 
                       "and performance-enhancing drugs into the bloodstream, improving the user's abilities in combat.<br><br>" + 
                       "This augmentation increases the player's strength and defense by 10%.");
    CombatRib1.addToFactions(["Slum Snakes", "The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.CombatRib1)) {
        delete Augmentations[AugmentationNames.CombatRib1];
    }
    AddToAugmentations(CombatRib1);
    
    var CombatRib2 = new Augmentation(AugmentationNames.CombatRib2);
    CombatRib2.setRequirements(7000, 12000000);
    CombatRib2.setInfo("This is an upgrade to the Combat Rib I augmentation, and is capable of releasing even more potent combat-enhancing " + 
                       "drugs into the bloodstream<br><br>. This upgrade increases the player's strength and defense by an additional 15%.")
    CombatRib2.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.CombatRib2)) {
        delete Augmentations[AugmentationNames.CombatRib2];
    }
    AddToAugmentations(CombatRib2);
    
    var CombatRib3 = new Augmentation(AugmentationNames.CombatRib3);
    CombatRib3.setRequirements(12000, 22000000);
    CombatRib3.setInfo("This is an upgrade to the Combat Rib II augmentation, and is capable of releasing even more potent combat-enhancing " + 
                       "drugs into the bloodstream<br><br>. This upgrade increases the player's strength and defense by an additional 20%.");
    CombatRib3.addToFactions(["The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant"]);
    if (augmentationExists(AugmentationNames.CombatRib3)) {
        delete Augmentations[AugmentationNames.CombatRib3];
    }
    AddToAugmentations(CombatRib3);
    
    var NanofiberWeave = new Augmentation(AugmentationNames.NanofiberWeave);
    NanofiberWeave.setRequirements(14000, 20000000);
    NanofiberWeave.setInfo("Synthetic nanofibers are woven into the skin's extracellular matrix using electrospinning. " + 
                           "This improves the skin's ability to regenerate itself and protect the body from external stresses and forces.<br><br>" + 
                           "This augmentation increases the player's strength and defense by 25%.");
    NanofiberWeave.addToFactions(["Tian Di Hui", "The Syndicate", "The Dark Army", "Speakers for the Dead",
                                 "Blade Industries", "Fulcrum Secret Technologies", "OmniTek Incorporated"]);
    if (augmentationExists(AugmentationNames.NanofiberWeave)) {
        delete Augmentations[AugmentationNames.NanofiberWeave];
    } 
    AddToAugmentations(NanofiberWeave);
    
    var SubdermalArmor = new Augmentation(AugmentationNames.SubdermalArmor);
    SubdermalArmor.setRequirements(350000, 650000000);
    SubdermalArmor.setInfo("The NEMEAN Subdermal Weave is a thin, light-weight, graphene plating that houses a dilatant fluid. " +
                           "The material is implanted underneath the skin, and is the most advanced form of defensive enhancement " +
                           "that has ever been created. The dilatant fluid, despite being thin and light, is extremely effective " + 
                           "at stopping piercing blows and reducing blunt trauma. The properties of graphene allow the plating to " +
                           "mitigate damage from any fire-related or electrical traumas.<br><br>" + 
                           "This augmentation increases the player's defense by 125%.");
    SubdermalArmor.addToFactions(["The Syndicate", "Fulcrum Secret Technologies", "Illuminati", "Daedalus",
                                 "The Covenant"]);
    if (augmentationExists(AugmentationNames.SubdermalArmor)) {
        delete Augmentations[AugmentationNames.SubdermalArmor];
    }
    AddToAugmentations(SubdermalArmor);
    
    var WiredReflexes = new Augmentation(AugmentationNames.WiredReflexes);
    WiredReflexes.setRequirements(500, 500000);
    WiredReflexes.setInfo("Synthetic nerve-enhancements are injected into all major parts of the somatic nervous system, " + 
                          "supercharging the body's ability to send signals through neurons. This results in increased reflex speed.<br><br>" + 
                          "This augmentation increases the player's agility and dexterity by 5%.");
    WiredReflexes.addToFactions(["Tian Di Hui", "Slum Snakes", "Sector-12", "Volhaven", "Aevum", "Ishima", 
                                "The Syndicate", "The Dark Army", "Speakers for the Dead"]);
    if (augmentationExists(AugmentationNames.WiredReflexes)) {
        delete Augmentations[AugmentationNames.WiredReflexes];
    }
    AddToAugmentations(WiredReflexes);
    
    var GrapheneBoneLacings = new Augmentation(AugmentationNames.GrapheneBoneLacings);
    GrapheneBoneLacings.setRequirements(450000, 850000000);
    GrapheneBoneLacings.setInfo("A graphene-based material is grafted and fused into the user's bones, significantly increasing " +
                                "their density and tensile strength.<br><br>" + 
                                "This augmentation increases the player's strength and defense by 75%.");
    GrapheneBoneLacings.addToFactions(["Fulcrum Secret Technologies", "The Covenant"]);
    if (augmentationExists(AugmentationNames.GrapheneBoneLacings)) {
        delete Augmentations[AugmentationNames.GrapheneBoneLacings];
    }
    AddToAugmentations(GrapheneBoneLacings);
    
    var BionicSpine = new Augmentation(AugmentationNames.BionicSpine);
    BionicSpine.setRequirements(18000, 25000000);
    BionicSpine.setInfo("An artificial spine created from plasteel and carbon fibers that completely replaces the organic spine. " + 
                        "Not only is the Bionic Spine physically stronger than a human spine, but it is also capable of digitally " + 
                        "stimulating and regulating the neural signals that are sent and received by the spinal cord. This results in " + 
                        "greatly improved senses and reaction speeds.<br><br>" + 
                        "This augmentation increases all of the player's combat stats by 18%.");
    BionicSpine.addToFactions(["Speakers for the Dead", "The Syndicate", "KuaiGong International",
                              "OmniTek Incorporated", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.BionicSpine)) {
        delete Augmentations[AugmentationNames.BionicSpine];
    }
    AddToAugmentations(BionicSpine);
    
    var GrapheneBionicSpine = new Augmentation(AugmentationNames.GrapheneBionicSpine);
    GrapheneBionicSpine.setRequirements(650000, 1200000000);
    GrapheneBionicSpine.setInfo("An upgrade to the Bionic Spine augmentation. It fuses the implant with an advanced graphene " + 
                                "material to make it much stronger and lighter.<br><br>" + 
                                "This augmentation increases all of the player's combat stats by 65%.");
    GrapheneBionicSpine.addToFactions(["Fulcrum Secret Technologies", "ECorp"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicSpine)) {
        delete Augmentations[AugmentationNames.GrapheneBionicSpine];
    }
    AddToAugmentations(GrapheneBionicSpine);
    
    var BionicLegs = new Augmentation(AugmentationNames.BionicLegs);
    BionicLegs.setRequirements(60000, 75000000);
    BionicLegs.setInfo("Cybernetic legs created from plasteel and carbon fibers that completely replace the user's organic legs. <br><br>" + 
                       "This augmentation increases the player's agility by 60%.");
    BionicLegs.addToFactions(["Speakers for the Dead", "The Syndicate", "KuaiGong International",
                             "OmniTek Incorporated", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.BionicLegs)) {
        delete Augmentations[AugmentationNames.BionicLegs];
    }
    AddToAugmentations(BionicLegs);
    
    var GrapheneBionicLegs = new Augmentation(AugmentationNames.GrapheneBionicLegs);
    GrapheneBionicLegs.setRequirements(300000, 900000000);
    GrapheneBionicLegs.setInfo("An upgrade to the Bionic Legs augmentation. It fuses the implant with an advanced graphene " + 
                               "material to make it much stronger and lighter.<br><br>" + 
                               "This augmentation increases the player's agility by an additional 175%.");
    GrapheneBionicLegs.addToFactions(["MegaCorp", "ECorp", "Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicLegs)) {
        delete Augmentations[AugmentationNames.GrapheneBionicLegs];
    }
    AddToAugmentations(GrapheneBionicLegs);
    
    //Labor stat augmentations
    var SpeechProcessor = new Augmentation(AugmentationNames.SpeechProcessor); //Cochlear imlant?
    SpeechProcessor.setRequirements(3000, 10000000);
    SpeechProcessor.setInfo("A cochlear implant with an embedded computer that analyzes incoming speech. " +
                            "The embedded computer processes characteristics of incoming speech, such as tone " +
                            "and inflection, to pick up on subtle cues and aid in social interactions.<br><br>" + 
                            "This augmentation increases the player's charisma by 20%.");
    SpeechProcessor.addToFactions(["Tian Di Hui", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                  "Ishima", "Volhaven", "Silhouette"]);
    if (augmentationExists(AugmentationNames.SpeechProcessor)) {
        delete Augmentations[AugmentationNames.SpeechProcessor];
    }
    AddToAugmentations(SpeechProcessor);
    
    TITN41Injection = new Augmentation(AugmentationNames.TITN41Injection);
    TITN41Injection.setRequirements(10000, 38000000);
    TITN41Injection.setInfo("TITN is a series of viruses that targets and alters the sequences of human DNA in genes that " + 
                            "control personality. The TITN-41 strain alters these genes so that the subject becomes more " + 
                            "outgoing and socialable. <br><br>" + 
                            "This augmentation increases the player's charisma and charisma experience gain rate by 15%");
    TITN41Injection.addToFactions(["Silhouette"]);            
    if (augmentationExists(AugmentationNames.TITN41Injection)) {
        delete Augmentations[AugmentationNames.TITN41Injection];
    }
    AddToAugmentations(TITN41Injection);
    
    var EnhancedSocialInteractionImplant = new Augmentation(AugmentationNames.EnhancedSocialInteractionImplant);
    EnhancedSocialInteractionImplant.setRequirements(150000, 250000000);
    EnhancedSocialInteractionImplant.setInfo("A cranial implant that greatly assists in the user's ability to analyze social situations " + 
                                             "and interactions. The system uses a wide variety of factors such as facial expression, body " + 
                                             "language, and the voice's tone/inflection to determine the best course of action during social" + 
                                             "situations. The implant also uses deep learning software to continuously learn new behavior" + 
                                             "patterns and how to best respond.<br><br>" + 
                                             "This augmentation increases the player's charisma and charisma experience gain rate by 60%.");
    EnhancedSocialInteractionImplant.addToFactions(["Bachman & Associates", "NWO", "Clarke Incorporated",
                                                   "OmniTek Incorporated", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.EnhancedSocialInteractionImplant)) {
        delete Augmentations[AugmentationNames.EnhancedSocialInteractionImplant];
    }
    AddToAugmentations(EnhancedSocialInteractionImplant);
    
    //Hacking augmentations
    var BitWire = new Augmentation(AugmentationNames.BitWire);
    BitWire.setRequirements(1500, 2000000);
    BitWire.setInfo("A small brain implant embedded in the cerebrum. This regulates and improves the brain's computing " + 
                    "capabilities. <br><br> This augmentation increases the player's hacking skill by 5%");
    BitWire.addToFactions(["CyberSec", "NiteSec"]);
    if (augmentationExists(AugmentationNames.BitWire)) {
        delete Augmentations[AugmentationNames.BitWire];
    }
    AddToAugmentations(BitWire);
    
    var ArtificialBioNeuralNetwork = new Augmentation(AugmentationNames.ArtificialBioNeuralNetwork);
    ArtificialBioNeuralNetwork.setRequirements(110000, 600000000);
    ArtificialBioNeuralNetwork.setInfo("A network consisting of millions of nanoprocessors is embedded into the brain. " +
                                       "The network is meant to mimick the way a biological brain solves a problem, which each " + 
                                       "nanoprocessor acting similar to the way a neuron would in a neural network. However, these " + 
                                       "nanoprocessors are programmed to perform computations much faster than organic neurons, " + 
                                       "allowing its user to solve much more complex problems at a much faster rate.<br><br>" + 
                                       "This augmentation:<br>" + 
                                       "Increases the player's hacking speed by 3%<br>" + 
                                       "Increases the amount of money the player's gains from hacking by 15%<br>" + 
                                       "Inreases the player's hacking skill by 12%");
    ArtificialBioNeuralNetwork.addToFactions(["BitRunners", "Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.ArtificialBioNeuralNetwork)) {
        delete Augmentations[AugmentationNames.ArtificialBioNeuralNetwork];
    }
    AddToAugmentations(ArtificialBioNeuralNetwork);
    
    var ArtificialSynapticPotentiation = new Augmentation(AugmentationNames.ArtificialSynapticPotentiation);
    ArtificialSynapticPotentiation.setRequirements(2500, 16000000);
    ArtificialSynapticPotentiation.setInfo("The body is injected with a chemical that artificially induces synaptic potentiation, " + 
                                           "otherwise known as the strengthening of synapses. This results in a enhanced cognitive abilities.<br><br>" + 
                                           "This augmentation: <br>" + 
                                           "Increases the player's hacking speed by 2% <br> " +
                                           "Increases the player's hacking chance by 5%<br>" + 
                                           "Increases the player's hacking experience gain rate by 5%");
    ArtificialSynapticPotentiation.addToFactions(["The Black Hand", "NiteSec"]);
    if (augmentationExists(AugmentationNames.ArtificialSynapticPotentiation)) {
        delete Augmentations[AugmentationNames.ArtificialSynapticPotentiation];
    }
    AddToAugmentations(ArtificialSynapticPotentiation);
    
    var EnhancedMyelinSheathing = new Augmentation(AugmentationNames.EnhancedMyelinSheathing);
    EnhancedMyelinSheathing.setRequirements(40000, 275000000);
    EnhancedMyelinSheathing.setInfo("Electrical signals are used to induce a new, artificial form of myelinogensis in the human body. " + 
                                    "This process results in the proliferation of new, synthetic myelin sheaths in the nervous " + 
                                    "system. These myelin sheaths can propogate neuro-signals much faster than their organic " + 
                                    "counterparts, leading to greater processing speeds and better brain function.<br><br>" + 
                                    "This augmentation:<br>" + 
                                    "Increases the player's hacking speed by 3%<br>" + 
                                    "Increases the player's hacking skill by 8%<br>" + 
                                    "Increases the player's hacking experience gain rate by 10%");
    EnhancedMyelinSheathing.addToFactions(["Fulcrum Secret Technologies", "BitRunners", "The Black Hand"]);
    if (augmentationExists(AugmentationNames.EnhancedMyelinSheathing)) {
        delete Augmentations[AugmentationNames.EnhancedMyelinSheathing];
    }
    AddToAugmentations(EnhancedMyelinSheathing);
    
    var SynapticEnhancement = new Augmentation(AugmentationNames.SynapticEnhancement);
    SynapticEnhancement.setRequirements(800, 1500000);
    SynapticEnhancement.setInfo("A small cranial implant that continuously uses weak electric signals to stimulate the brain and " +
                                "induce stronger synaptic activity. This improves the user's cognitive abilities.<br><br>" + 
                                "This augmentation increases the player's hacking speed by 3%.");
    SynapticEnhancement.addToFactions(["CyberSec"]);
    if (augmentationExists(AugmentationNames.SynapticEnhancement)) {
        delete Augmentations[AugmentationNames.SynapticEnhancement];
    }
    AddToAugmentations(SynapticEnhancement);
    
    var NeuralRetentionEnhancement = new Augmentation(AugmentationNames.NeuralRetentionEnhancement);
    NeuralRetentionEnhancement.setRequirements(8000, 50000000);
    NeuralRetentionEnhancement.setInfo("Chemical injections are used to permanently alter and strengthen the brain's neuronal " +
                                       "circuits, strengthening its ability to retain information.<br><br>" + 
                                       "This augmentation increases the player's hacking experience gain rate by 25%.");
    NeuralRetentionEnhancement.addToFactions(["NiteSec"]);
    if (augmentationExists(AugmentationNames.NeuralRetentionEnhancement)) {
        delete Augmentations[AugmentationNames.NeuralRetentionEnhancement];
    }
    AddToAugmentations(NeuralRetentionEnhancement);
    
    var DataJack = new Augmentation(AugmentationNames.DataJack);
    DataJack.setRequirements(45000, 90000000);
    DataJack.setInfo("A brain implant that provides an interface for direct, wireless communication between a computer's main " + 
                     "memory and the mind. This implant allows the user to not only access a computer's memory, but also alter " + 
                     "and delete it.<br><br>" + 
                     "This augmentation increases the amount of money the player gains from hacking by 25%");
    DataJack.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "Chongqing", "New Tokyo"]);
    if (augmentationExists(AugmentationNames.DataJack)) {
        delete Augmentations[AugmentationNames.DataJack];
    }
    AddToAugmentations(DataJack);
    
    var ENM = new Augmentation(AugmentationNames.ENM);
    ENM.setRequirements(6000, 50000000);
    ENM.setInfo("A thin device embedded inside the arm containing a wireless module capable of connecting " + 
                "to nearby networks. Once connected, the Netburner Module is capable of capturing and " + 
                "processing all of the traffic on that network. By itself, the Embedded Netburner Module does " + 
                "not do much, but a variety of very powerful upgrades can be installed that allow you to fully " +
                "control the traffic on a network.<br><br>" + 
                "This augmentation increases the player's hacking skill by 8%");
    ENM.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp", 
                      "Fulcrum Secret Technologies", "NWO", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.ENM)) {
        delete Augmentations[AugmentationNames.ENM];
    }
    AddToAugmentations(ENM);
    
    var ENMCore = new Augmentation(AugmentationNames.ENMCore);
    ENMCore.setRequirements(100000, 500000000);
    ENMCore.setInfo("The Core library is an implant that upgrades the firmware of the Embedded Netburner Module. " + 
                    "This upgrade allows the Embedded Netburner Module to generate its own data on a network.<br><br>" +
                    "This augmentation:<br>" + 
                    "Increases the player's hacking speed by 3%<br>" + 
                    "Increases the amount of money the player gains from hacking by 10%<br>" + 
                    "Increases the player's chance of successfully performing a hack by 3%<br>" + 
                    "Increases the player's hacking experience gain rate by 7%<br>" + 
                    "Increases the player's hacking skill by 7%");
    ENMCore.addToFactions(["BitRunners", "The Black Hand", "ECorp", "MegaCorp", 
                          "Fulcrum Secret Technologies", "NWO", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.ENMCore)) {
        delete Augmentations[AugmentationNames.ENMCore];
    }
    AddToAugmentations(ENMCore);
    
    var ENMCoreV2 = new Augmentation(AugmentationNames.ENMCoreV2);
    ENMCoreV2.setRequirements(400000, 900000000);
    ENMCoreV2.setInfo("The Core V2 library is an implant that upgrades the firmware of the Embedded Netburner Module. " + 
                      "This upgraded firmware allows the Embedded Netburner Module to control the information on " + 
                      "a network by re-routing traffic, spoofing IP addresses, or altering the data inside network " + 
                      "packets.<br><br>" + 
                      "This augmentation: <br>" + 
                      "Increases the player's hacking speed by 5%<br>" + 
                      "Increases the amount of money the player gains from hacking by 30%<br>" + 
                      "Increases the player's chance of successfully performing a hack by 5%<br>" + 
                      "Increases the player's hacking experience gain rate by 15%<br>" + 
                      "Increases the player's hacking skill by 8%");
    ENMCoreV2.addToFactions(["BitRunners", "ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                            "Blade Industries", "OmniTek Incorporated", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.ENMCoreV2)) {
        delete Augmentations[AugmentationNames.ENMCoreV2];
    }
    AddToAugmentations(ENMCoreV2);
    
    var ENMCoreV3 = new Augmentation(AugmentationNames.ENMCoreV3);
    ENMCoreV3.setRequirements(700000, 1500000000);
    ENMCoreV3.setInfo("The Core V3 library is an implant that upgrades the firmware of the Embedded Netburner Module. " + 
                      "This upgraded firmware allows the Embedded Netburner Module to seamlessly inject code into " + 
                      "any device on a network.<br><br>" + 
                      "This augmentation:<br>" + 
                      "Increases the player's hacking speed by 5%<br>" + 
                      "Increases the amount of money the player gains from hacking by 40%<br>" + 
                      "Increases the player's chance of successfully performing a hack by 10%<br>" + 
                      "Increases the player's hacking experience gain rate by 25%<br>" + 
                      "Increases the player's hacking skill by 10%");
    ENMCoreV3.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                            "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMCoreV3)) {
        delete Augmentations[AugmentationNames.ENMCoreV3];
    }
    AddToAugmentations(ENMCoreV3);
    
    var ENMAnalyzeEngine = new Augmentation(AugmentationNames.ENMAnalyzeEngine);
    ENMAnalyzeEngine.setRequirements(250000, 1200000000);
    ENMAnalyzeEngine.setInfo("Installs the Analyze Engine for the Embedded Netburner Module, which is a CPU cluster " + 
                             "that vastly outperforms the Netburner Module's native single-core processor.<br><br>" + 
                             "This augmentation increases the player's hacking speed by 10%.");
    ENMAnalyzeEngine.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                                   "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMAnalyzeEngine)) {
        delete Augmentations[AugmentationNames.ENMAnalyzeEngine];
    }
    AddToAugmentations(ENMAnalyzeEngine);
    
    var ENMDMA = new Augmentation(AugmentationNames.ENMDMA);
    ENMDMA.setRequirements(400000, 1400000000);
    ENMDMA.setInfo("This implant installs a Direct Memory Access (DMA) controller into the " + 
                   "Embedded Netburner Module. This allows the Module to send and receive data " + 
                   "directly to and from the main memory of devices on a network.<br><br>" + 
                   "This augmentation: <br>" + 
                   "Increases the amount of money the player gains from hacking by 40%<br>"  +
                   "Increases the player's chance of successfully performing a hack by 20%");            
    ENMDMA.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                         "Daedalus", "The Covenant", "Illuminati"]);
    if (augmentationExists(AugmentationNames.ENMDMA)) {
        delete Augmentations[AugmentationNames.ENMDMA];
    }
    AddToAugmentations(ENMDMA);
    
    var Neuralstimulator = new Augmentation(AugmentationNames.Neuralstimulator);
    Neuralstimulator.setRequirements(20000, 600000000);
    Neuralstimulator.setInfo("A cranial implant that intelligently stimulates certain areas of the brain " + 
                             "in order to improve cognitive functions<br><br>" + 
                             "This augmentation:<br>" + 
                             "Increases the player's hacking speed by 2%<br>" + 
                             "Increases the player's chance of successfully performing a hack by 10%<br>" + 
                             "Increases the player's hacking experience gain rate by 12%");
    Neuralstimulator.addToFactions(["The Black Hand", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                   "Ishima", "Volhaven", "Bachman & Associates", "Clarke Incorporated", 
                                   "Four Sigma"]);
    if (augmentationExists(AugmentationNames.Neuralstimulator)) {
        delete Augmentations[AugmentationNames.Neuralstimulator];
    }
    AddToAugmentations(Neuralstimulator);
    
    var NeuralAccelerator = new Augmentation(AugmentationNames.NeuralAccelerator);
    NeuralAccelerator.setRequirements(80000, 350000000);
    NeuralAccelerator.setInfo("A microprocessor that accelerates the processing " + 
                              "speed of biological neural networks. This is a cranial implant that is embedded inside the brain. <br><br>" + 
                              "This augmentation: <br>" + 
                              "Increases the player's hacking skill by 10%<br>" + 
                              "Increases the player's hacking experience gain rate by 15%<br>" + 
                              "Increases the amount of money the player gains from hacking by 20%");
    NeuralAccelerator.addToFactions(["BitRunners"]);
    if (augmentationExists(AugmentationNames.NeuralAccelerator)) {
        delete Augmentations[AugmentationNames.NeuralAccelerator];
    }
    AddToAugmentations(NeuralAccelerator);
    
    var CranialSignalProcessorsG1 = new Augmentation(AugmentationNames.CranialSignalProcessorsG1);
    CranialSignalProcessorsG1.setRequirements(4000, 14000000);
    CranialSignalProcessorsG1.setInfo("The first generation of Cranial Signal Processors. Cranial Signal Processors " + 
                                      "are a set of specialized microprocessors that are attached to " + 
                                      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
                                      "so that the brain doesn't have to. <br><br>" + 
                                      "This augmentation: <br>" + 
                                      "Increases the player's hacking speed by 1%<br>" + 
                                      "Increases the player's hacking skill by 5%");
    CranialSignalProcessorsG1.addToFactions(["CyberSec"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG1)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG1];
    }
    AddToAugmentations(CranialSignalProcessorsG1);
    
    var CranialSignalProcessorsG2 = new Augmentation(AugmentationNames.CranialSignalProcessorsG2);
    CranialSignalProcessorsG2.setRequirements(7500, 25000000);
    CranialSignalProcessorsG2.setInfo("The second generation of Cranial Signal Processors. Cranial Signal Processors " + 
                                      "are a set of specialized microprocessors that are attached to " + 
                                      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
                                      "so that the brain doesn't have to. <br><br>" + 
                                      "This augmentation: <br>" + 
                                      "Increases the player's hacking speed by 2%<br>" + 
                                      "Increases the player's chance of successfully performing a hack by 5%<br>" + 
                                      "Increases the player's hacking skill by 7%");
    CranialSignalProcessorsG2.addToFactions(["NiteSec"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG2)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG2];
    }
    AddToAugmentations(CranialSignalProcessorsG2);
    
    var CranialSignalProcessorsG3 = new Augmentation(AugmentationNames.CranialSignalProcessorsG3);
    CranialSignalProcessorsG3.setRequirements(20000, 110000000);
    CranialSignalProcessorsG3.setInfo("The third generation of Cranial Signal Processors. Cranial Signal Processors " + 
                                      "are a set of specialized microprocessors that are attached to " + 
                                      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
                                      "so that the brain doesn't have to. <br><br>" + 
                                      "This augmentation:<br>" + 
                                      "Increases the player's hacking speed by 2%<br>" + 
                                      "Increases the amount of money the player gains from hacking by 15%<br>" + 
                                      "Increases the player's hacking skill by 9%");
    CranialSignalProcessorsG3.addToFactions(["NiteSec", "The Black Hand"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG3)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG3];
    }
    AddToAugmentations(CranialSignalProcessorsG3);
    
    var CranialSignalProcessorsG4 = new Augmentation(AugmentationNames.CranialSignalProcessorsG4);
    CranialSignalProcessorsG4.setRequirements(50000, 220000000);
    CranialSignalProcessorsG4.setInfo("The fourth generation of Cranial Signal Processors. Cranial Signal Processors " + 
                                      "are a set of specialized microprocessors that are attached to " + 
                                      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
                                      "so that the brain doesn't have to. <br><br>" + 
                                      "This augmentation: <br>" + 
                                      "Increases the player's hacking speed by 2%<br>" + 
                                      "Increases the amount of money the player gains from hacking by 20%<br>" + 
                                      "Increases the amount of money the player can inject into servers using grow() by 25%");
    CranialSignalProcessorsG4.addToFactions(["The Black Hand"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG4)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG4];
    }
    AddToAugmentations(CranialSignalProcessorsG4);
    
    var CranialSignalProcessorsG5 = new Augmentation(AugmentationNames.CranialSignalProcessorsG5);
    CranialSignalProcessorsG5.setRequirements(100000, 450000000);
    CranialSignalProcessorsG5.setInfo("The fifth generation of Cranial Signal Processors. Cranial Signal Processors " + 
                                      "are a set of specialized microprocessors that are attached to " + 
                                      "neurons in the brain. These chips process neural signals to quickly and automatically perform specific computations " +
                                      "so that the brain doesn't have to. <br><br>" + 
                                      "This augmentation:<br>" + 
                                      "Increases the player's hacking skill by 30%<br>" +
                                      "Increases the amount of money the player gains from hacking by 25%<br>" + 
                                      "Increases the amount of money the player can inject into servers using grow() by 75%");
    CranialSignalProcessorsG5.addToFactions(["BitRunners"]);
    if (augmentationExists(AugmentationNames.CranialSignalProcessorsG5)) {
        delete Augmentations[AugmentationNames.CranialSignalProcessorsG5];
    }
    AddToAugmentations(CranialSignalProcessorsG5);
    
    var NeuronalDensification = new Augmentation(AugmentationNames.NeuronalDensification);
    NeuronalDensification.setRequirements(75000, 275000000);
    NeuronalDensification.setInfo("The brain is surgically re-engineered to have increased neuronal density " +
                                  "by decreasing the neuron gap junction. Then, the body is genetically modified " + 
                                  "to enhance the production and capabilities of its neural stem cells. <br><br>" + 
                                  "This augmentation: <br>" + 
                                  "Increases the player's hacking skill by 15%<br>" + 
                                  "Increases the player's hacking experience gain rate by 10%<br>"+ 
                                  "Increases the player's hacking speed by 3%");
    NeuronalDensification.addToFactions(["Clarke Incorporated"]);
    if (augmentationExists(AugmentationNames.NeuronalDensification)) {
        delete Augmentations[AugmentationNames.NeuronalDensification];
    }
    AddToAugmentations(NeuronalDensification);
    
    //Work Augmentations
    var NuoptimalInjectorImplant = new Augmentation(AugmentationNames.NuoptimalInjectorImplant);
    NuoptimalInjectorImplant.setRequirements(2000, 4000000);
    NuoptimalInjectorImplant.setInfo("This torso implant automatically injects nootropic supplements into " + 
                                     "the bloodstream to improve memory, increase focus, and provide other " + 
                                     "cognitive enhancements.<br><br>" + 
                                     "This augmentation increases the amount of reputation the player gains " + 
                                     "when working for a company by 20%.");
    NuoptimalInjectorImplant.addToFactions(["Tian Di Hui", "Volhaven", "New Tokyo", "Chongqing", "Ishima",
                                           "Clarke Incorporated", "Four Sigma", "Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.NuoptimalInjectorImplant)) {
        delete Augmentations[AugmentationNames.NuoptimalInjectorImplant];
    }
    AddToAugmentations(NuoptimalInjectorImplant);
    
    var SpeechEnhancement = new Augmentation(AugmentationNames.SpeechEnhancement);
    SpeechEnhancement.setRequirements(1000, 2500000);
    SpeechEnhancement.setInfo("An advanced neural implant that improves your speaking abilities, making " + 
                              "you more convincing and likable in conversations and overall improving your " +
                              "social interactions.<br><br>" + 
                              "This augmentation:<br>" +
                              "Increases the player's charisma by 10%<br>" +
                              "Increases the amount of reputation the player gains when working for a company by 10%");
    SpeechEnhancement.addToFactions(["Tian Di Hui", "Speakers for the Dead", "Four Sigma", "KuaiGong International",
                                    "Clarke Incorporated", "Four Sigma", "Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.SpeechEnhancement)) {
        delete Augmentations[AugmentationNames.SpeechEnhancement];
    }
    AddToAugmentations(SpeechEnhancement);
    
    var FocusWire = new Augmentation(AugmentationNames.FocusWire); //Stops procrastination
    FocusWire.setRequirements(30000, 180000000);
    FocusWire.setInfo("A cranial implant that stops procrastination by blocking specific neural pathways " + 
                      "in the brain.<br><br>" + 
                      "This augmentation: <br>" + 
                      "Increases all experience gains by 10%<br>" +
                      "Increases the amount of money the player gains from working by 20%<br>" + 
                      "Increases the amount of reputation the player gains when working for a company by 10%");
    FocusWire.addToFactions(["Bachman & Associates", "Clarke Incorporated", "Four Sigma", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.FocusWire)) {
        delete Augmentations[AugmentationNames.FocusWire];
    }
    AddToAugmentations(FocusWire)
    
    var PCDNI = new Augmentation(AugmentationNames.PCDNI);
    PCDNI.setRequirements(150000, 750000000);
    PCDNI.setInfo("Installs a Direct-Neural Interface jack into your arm that is compatible with most " + 
                  "computers. Connecting to a computer through this jack allows you to interface with " +
                  "it using the brain's electrochemical signals.<br><br>" + 
                  "This augmentation:<br>" +
                  "Increases the amount of reputation the player gains when working for a company by 30%<br>" + 
                  "Increases the player's hacking skill by 8%");
    PCDNI.addToFactions(["Four Sigma", "OmniTek Incorporated", "ECorp", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.PCDNI)) {
        delete Augmentations[AugmentationNames.PCDNI];
    }
    AddToAugmentations(PCDNI);
    
    var PCDNIOptimizer = new Augmentation(AugmentationNames.PCDNIOptimizer);
    PCDNIOptimizer.setRequirements(200000, 875000000);
    PCDNIOptimizer.setInfo("This is a submodule upgrade to the PC Direct-Neural Interface augmentation. It " + 
                           "improves the performance of the interface and gives the user more control options " +
                           "to the connected computer.<br><br>" + 
                           "This augmentation:<br>" + 
                           "Increases the amount of reputation the player gains when working for a company by 75%<br>" + 
                           "Increases the player's hacking skill by 10%");
    PCDNIOptimizer.addToFactions(["Fulcrum Secret Technologies", "ECorp", "Blade Industries"]);
    if (augmentationExists(AugmentationNames.PCDNIOptimizer)) {
        delete Augmentations[AugmentationNames.PCDNIOptimizer];
    }
    AddToAugmentations(PCDNIOptimizer);
    
    var PCDNINeuralNetwork = new Augmentation(AugmentationNames.PCDNINeuralNetwork);
    PCDNINeuralNetwork.setRequirements(600000, 1300000000);
    PCDNINeuralNetwork.setInfo("This is an additional installation that upgrades the functionality of the " + 
                               "PC Direct-Neural Interface augmentation. When connected to a computer, " + 
                               "The NeuroNet Injector upgrade allows the user to use his/her own brain's " + 
                               "processing power to aid the computer in computational tasks.<br><br>" + 
                               "This augmentation:<br>" + 
                               "Increases the amount of reputation the player gains when working for a company by 100%<br>" + 
                               "Increases the player's hacking skill by 10%<br>" + 
                               "Increases the player's hacking speed by 5%");
    PCDNINeuralNetwork.addToFactions(["Fulcrum Secret Technologies"]);
    if (augmentationExists(AugmentationNames.PCDNINeuralNetwork)) {
        delete Augmentations[AugmentationNames.PCDNINeuralNetwork];
    }
    AddToAugmentations(PCDNINeuralNetwork);
    
    var ADRPheromone1 = new Augmentation(AugmentationNames.ADRPheromone1);
    ADRPheromone1.setRequirements(1500, 3500000);
    ADRPheromone1.setInfo("The body is genetically re-engineered so that it produces the ADR-V1 pheromone, " +
                          "an artificial pheromone discovered by scientists. The ADR-V1 pheromone, when excreted, " + 
                          "triggers feelings of admiration and approval in other people. <br><br>" + 
                          "This augmentation: <br>" + 
                          "Increases the amount of reputation the player gains when working for a company by 10% <br>" + 
                          "Increases the amount of reputation the player gains for a faction by 10%");
    ADRPheromone1.addToFactions(["Tian Di Hui", "The Syndicate", "NWO", "MegaCorp", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.ADRPheromone1)) {
        delete Augmentations[AugmentationNames.ADRPheromone1];
    }
    AddToAugmentations(ADRPheromone1);
    
    //HacknetNode Augmentations
    var HacknetNodeCPUUpload = new Augmentation(AugmentationNames.HacknetNodeCPUUpload);
    HacknetNodeCPUUpload.setRequirements(1500, 2200000);
    HacknetNodeCPUUpload.setInfo("Uploads the architecture and design details of a Hacknet Node's CPU into " + 
                                 "the brain. This allows the user to engineer custom hardware and software  " +
                                 "for the Hacknet Node that provides better performance.<br><br>" + 
                                 "This augmentation:<br>" + 
                                 "Increases the amount of money produced by Hacknet Nodes by 15%<br>" + 
                                 "Decreases the cost of purchasing a Hacknet Node by 15%");
    HacknetNodeCPUUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCPUUpload)) {
        delete Augmentations[AugmentationNames.HacknetNodeCPUUpload];
    }
    AddToAugmentations(HacknetNodeCPUUpload);
    
    var HacknetNodeCacheUpload = new Augmentation(AugmentationNames.HacknetNodeCacheUpload);
    HacknetNodeCacheUpload.setRequirements(1000, 1100000);
    HacknetNodeCacheUpload.setInfo("Uploads the architecture and design details of a Hacknet Node's main-memory cache " + 
                                   "into the brain. This allows the user to engineer custom cache hardware for the  " + 
                                   "Hacknet Node that offers better performance.<br><br>" + 
                                   "This augmentation:<br> " + 
                                   "Increases the amount of money produced by Hacknet Nodes by 10%<br>" + 
                                   "Decreases the cost of leveling up a Hacknet Node by 15%");
    HacknetNodeCacheUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCacheUpload)) {
        delete Augmentations[AugmentationNames.HacknetNodeCacheUpload];
    }
    AddToAugmentations(HacknetNodeCacheUpload);
    
    var HacknetNodeNICUpload = new Augmentation(AugmentationNames.HacknetNodeNICUpload);
    HacknetNodeNICUpload.setRequirements(750, 900000);
    HacknetNodeNICUpload.setInfo("Uploads the architecture and design details of a Hacknet Node's Network Interface Card (NIC) " + 
                                 "into the brain. This allows the user to engineer a custom NIC for the Hacknet Node that " + 
                                 "offers better performance.<br><br>" + 
                                 "This augmentation:<br>" + 
                                 "Increases the amount of money produced by Hacknet Nodes by 10%<br>" + 
                                 "Decreases the cost of purchasing a Hacknet Node by 10%");
    HacknetNodeNICUpload.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeNICUpload)) {
        delete Augmentations[AugmentationNames.HacknetNodeNICUpload];
    }
    AddToAugmentations(HacknetNodeNICUpload);
    
    var HacknetNodeKernelDNI = new Augmentation(AugmentationNames.HacknetNodeKernelDNI);
    HacknetNodeKernelDNI.setRequirements(3000, 8000000);
    HacknetNodeKernelDNI.setInfo("Installs a Direct-Neural Interface jack into the arm that is capable of connecting to a " + 
                                 "Hacknet Node. This lets the user access and manipulate the Node's kernel using the mind's " + 
                                 "electrochemical signals.<br><br>" + 
                                 "This augmentation increases the amount of money produced by Hacknet Nodes by 25%.");
    HacknetNodeKernelDNI.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeKernelDNI)) {
        delete Augmentations[AugmentationNames.HacknetNodeKernelDNI];
    }
    AddToAugmentations(HacknetNodeKernelDNI);
    
    var HacknetNodeCoreDNI = new Augmentation(AugmentationNames.HacknetNodeCoreDNI);
    HacknetNodeCoreDNI.setRequirements(5000, 12000000);
    HacknetNodeCoreDNI.setInfo("Installs a Direct-Neural Interface jack into the arm that is capable of connecting " +
                               "to a Hacknet Node. This lets the user access and manipulate the Node's processing logic using " + 
                               "the mind's electrochemical signals.<br><br>" + 
                               "This augmentation increases the amount of money produced by Hacknet Nodes by 45%.");
    HacknetNodeCoreDNI.addToFactions(["Netburners"]);
    if (augmentationExists(AugmentationNames.HacknetNodeCoreDNI)) {
        delete Augmentations[AugmentationNames.HacknetNodeCoreDNI];
    }
    AddToAugmentations(HacknetNodeCoreDNI);
    
    //Misc/Hybrid augmentations
    var NeuroFluxGovernor = new Augmentation(AugmentationNames.NeuroFluxGovernor);
    if (augmentationExists(AugmentationNames.NeuroFluxGovernor)) {
        var nextLevel = getNextNeurofluxLevel();
        NeuroFluxGovernor.level = nextLevel - 1;
        mult = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, NeuroFluxGovernor.level);
        NeuroFluxGovernor.setRequirements(500 * mult, 750000 * mult);
        delete Augmentations[AugmentationNames.NeuroFluxGovernor];
    } else {
        var nextLevel = getNextNeurofluxLevel();
        NeuroFluxGovernor.level = nextLevel - 1;
        mult = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, NeuroFluxGovernor.level);
        NeuroFluxGovernor.setRequirements(500 * mult, 750000 * mult);
    }
    NeuroFluxGovernor.setInfo("A device that is embedded in the back of the neck. The NeuroFlux Governor " + 
                              "monitors and regulates nervous impulses coming to and from the spinal column, " +
                              "essentially 'governing' the body. By doing so, it improves the functionality of the " +
                              "body's nervous system. <br><br> " + 
                              "This is a special augmentation because it can be leveled up infinitely. Each level of this augmentation " + 
                              "increases ALL of the player's multipliers by 1%");
    NeuroFluxGovernor.addToAllFactions();
    AddToAugmentations(NeuroFluxGovernor);
        
    var Neurotrainer1 = new Augmentation(AugmentationNames.Neurotrainer1);
    Neurotrainer1.setRequirements(400, 800000);
    Neurotrainer1.setInfo("A decentralized cranial implant that improves the brain's ability to learn. It is " + 
                          "installed by releasing millions of nanobots into the human brain, each of which " + 
                          "attaches to a different neural pathway to enhance the brain's ability to retain " + 
                          "and retrieve information.<br><br>" + 
                          "This augmentation increases the player's experience gain rate for all stats by 10%");
    Neurotrainer1.addToFactions(["CyberSec"]);
    if (augmentationExists(AugmentationNames.Neurotrainer1)) {
        delete Augmentations[AugmentationNames.Neurotrainer1];
    }
    AddToAugmentations(Neurotrainer1);
    
    var Neurotrainer2 = new Augmentation(AugmentationNames.Neurotrainer2);
    Neurotrainer2.setRequirements(4000, 8500000);
    Neurotrainer2.setInfo("A decentralized cranial implant that improves the brain's ability to learn. This " + 
                          "is a more powerful version of the Neurotrainer I augmentation, but it does not " + 
                          "require Neurotrainer I to be installed as a prerequisite.<br><br>" + 
                          "This augmentation increases the player's experience gain rate for all stats by 15%");
    Neurotrainer2.addToFactions(["BitRunners", "NiteSec"]);
    if (augmentationExists(AugmentationNames.Neurotrainer2)) {
        delete Augmentations[AugmentationNames.Neurotrainer2];
    }
    AddToAugmentations(Neurotrainer2);
    
    var Neurotrainer3 = new Augmentation(AugmentationNames.Neurotrainer3);
    Neurotrainer3.setRequirements(10000, 25000000);
    Neurotrainer3.setInfo("A decentralized cranial implant that improves the brain's ability to learn. This " +
                          "is a more powerful version of the Neurotrainer I and Neurotrainer II augmentation, " + 
                          "but it does not require either of them to be installed as a prerequisite.<br><br>" + 
                          "This augmentation increases the player's experience gain rate for all stats by 20%");
    Neurotrainer3.addToFactions(["NWO", "Four Sigma"]);
    if (augmentationExists(AugmentationNames.Neurotrainer3)) {
        delete Augmentations[AugmentationNames.Neurotrainer3];
    }
    AddToAugmentations(Neurotrainer3);
    
    var Hypersight = new Augmentation(AugmentationNames.Hypersight);
    Hypersight.setInfo("A bionic eye implant that grants sight capabilities far beyond those of a natural human. " +
                       "Embedded circuitry within the implant provides the ability to detect heat and movement " +
                       "through solid objects such as wells, thus providing 'x-ray vision'-like capabilities.<br><br>" + 
                       "This augmentation: <br>" + 
                       "Increases the player's dexterity by 40%<br>" + 
                       "Increases the player's hacking speed by 3%<br>" + 
                       "Increases the amount of money the player gains from hacking by 10%");
    Hypersight.setRequirements(60000, 550000000);
    Hypersight.addToFactions(["Blade Industries", "KuaiGong International"]);
    if (augmentationExists(AugmentationNames.Hypersight)) {
        delete Augmentations[AugmentationNames.Hypersight];
    }
    AddToAugmentations(Hypersight);
    
    var LuminCloaking1 = new Augmentation(AugmentationNames.LuminCloaking1);
    LuminCloaking1.setInfo("A skin implant that reinforces the skin with highly-advanced synthetic cells. These " + 
                          "cells, when powered, have a negative refractive index. As a result, they bend light " + 
                          "around the skin, making the user much harder to see from the naked eye. <br><br>" + 
                          "This augmentation: <br>" + 
                          "Increases the player's agility by 5% <br>" + 
                          "Increases the amount of money the player gains from crimes by 10%");
    LuminCloaking1.setRequirements(600, 1000000);
    LuminCloaking1.addToFactions(["Slum Snakes", "Tetrads"]);
    if (augmentationExists(AugmentationNames.LuminCloaking1)) {
        delete Augmentations[AugmentationNames.LuminCloaking1];
    }
    AddToAugmentations(LuminCloaking1);
                          
    var LuminCloaking2 = new Augmentation(AugmentationNames.LuminCloaking2);
    LuminCloaking2.setInfo("This is a more advanced version of the LuminCloaking-V2 augmentation. This skin implant " + 
                          "reinforces the skin with highly-advanced synthetic cells. These " + 
                          "cells, when powered, are capable of not only bending light but also of bending heat, " + 
                          "making the user more resilient as well as stealthy. <br><br>" + 
                          "This augmentation: <br>" + 
                          "Increases the player's agility by 10% <br>" + 
                          "Increases the player's defense by 10% <br>" + 
                          "Increases the amount of money the player gains from crimes by 25%");
    LuminCloaking2.setRequirements(2000, 5000000);
    LuminCloaking2.addToFactions(["Slum Snakes", "Tetrads"]);
    if (augmentationExists(AugmentationNames.LuminCloaking2)) {
        delete Augmentations[AugmentationNames.LuminCloaking2];
    }
    AddToAugmentations(LuminCloaking2);
    
    var SmartSonar = new Augmentation(AugmentationNames.SmartSonar);
    SmartSonar.setInfo("A cochlear implant that helps the player detect and locate enemies " + 
                       "using sound propagation. <br><br>" + 
                       "This augmentation: <br>" + 
                       "Increases the player's dexterity by 10%<br>" + 
                       "Increases the player's dexterity experience gain rate by 15%<br>" + 
                       "Increases the amount of money the player gains from crimes by 25%");
    SmartSonar.setRequirements(9000, 12000000);
    SmartSonar.addToFactions(["Slum Snakes"]);
    if (augmentationExists(AugmentationNames.SmartSonar)) {
        delete Augmentations[AugmentationNames.SmartSonar];
    }
    AddToAugmentations(SmartSonar);
    
    var PowerRecirculator = new Augmentation(AugmentationNames.PowerRecirculator);
    PowerRecirculator.setInfo("The body's nerves are attached with polypyrrole nanocircuits that " + 
                              "are capable of capturing wasted energy (in the form of heat) " + 
                              "and converting it back into usable power. <br><br>" + 
                              "This augmentation: <br>" + 
                              "Increases all of the player's stats by 5%<br>" + 
                              "Increases the player's experience gain rate for all stats by 10%");
    PowerRecirculator.setRequirements(10000, 33000000);
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
    var QLink = new Augmentation(AugmentationNames.QLink);
    QLink.setInfo("A brain implant that wirelessly connects you to the Illuminati's " +
                  "quantum supercomputer, allowing you to access and use its incredible " +
                  "computing power. <br><br>" + 
                  "This augmentation: <br>" + 
                  "Increases the player's hacking speed by 10%<br>" + 
                  "Increases the player's chance of successfully performing a hack by 30%<br>" + 
                  "Increases the amount of money the player gains from hacking by 100%");
    QLink.setRequirements(750000, 1200000000);
    QLink.addToFactions(["Illuminati"]);
    if (augmentationExists(AugmentationNames.QLink)) {
        delete Augmentations[AugmentationNames.QLink];
    }
    AddToAugmentations(QLink);
    
	//Daedalus
    //TODO The Red Pill - Second prestige
    
	//Covenant
    var SPTN97 = new Augmentation(AugmentationNames.SPTN97);
    SPTN97.setInfo("The SPTN-97 gene is injected into the genome. The SPTN-97 gene is an " + 
                   "artificially-synthesized gene that was developed by DARPA to create " + 
                   "super-soldiers through genetic modification. The gene was outlawed in " +
                   "2056.<br><br>" + 
                   "This augmentation: <br>" + 
                   "Increases all of the player's combat stats by 75%<br>" + 
                   "Increases the player's hacking skill by 15%");
    SPTN97.setRequirements(500000, 950000000);
    SPTN97.addToFactions(["The Covenant"]);
    if (augmentationExists(AugmentationNames.SPTN97)) {
        delete Augmentations[AugmentationNames.SPTN97];
    }
    AddToAugmentations(SPTN97);
    
	//ECorp
    var HiveMind = new Augmentation(AugmentationNames.HiveMind);
    HiveMind.setInfo("A brain implant developed by ECorp. They do not reveal what " + 
                     "exactly the implant does, but they promise that it will greatly " + 
                     "enhance your abilities.");
    HiveMind.setRequirements(600000, 1000000000);
    HiveMind.addToFactions(["ECorp"]);
    if (augmentationExists(AugmentationNames.HiveMind)) {
        delete Augmentations[AugmentationNames.HiveMind];
    }
    AddToAugmentations(HiveMind);
    
	//MegaCorp
    var CordiARCReactor = new Augmentation(AugmentationNames.CordiARCReactor);
    CordiARCReactor.setInfo("The thoracic cavity is equipped with a small chamber designed " +
                            "to hold and sustain hydrogen plasma. The plasma is used to generate " + 
                            "fusion power through nuclear fusion, providing limitless amount of clean " +
                            "energy for the body. <br><br>" + 
                            "This augmentation:<br>" +
                            "Increases all of the player's combat stats by 35%<br>" + 
                            "Increases all of the player's combat stat experience gain rate by 35%");
    CordiARCReactor.setRequirements(450000, 975000000);
    CordiARCReactor.addToFactions(["MegaCorp"]);
    if (augmentationExists(AugmentationNames.CordiARCReactor)) {
        delete Augmentations[AugmentationNames.CordiARCReactor];
    }
    AddToAugmentations(CordiARCReactor);
    
	//BachmanAndAssociates
    var SmartJaw = new Augmentation(AugmentationNames.SmartJaw);
    SmartJaw.setInfo("A bionic jaw that contains advanced hardware and software " + 
                     "capable of psychoanalyzing and profiling the personality of " +
                     "others using optical imaging software. <br><br>" + 
                     "This augmentation: <br>" + 
                     "Increases the player's charisma by 50%. <br>" + 
                     "Increases the player's charisma experience gain rate by 50%<br>" + 
                     "Increases the amount of reputation the player gains for a company by 25%<br>" + 
                     "Increases the amount of reputation the player gains for a faction by 25%");
    SmartJaw.setRequirements(150000, 500000000);
    SmartJaw.addToFactions(["Bachman & Associates"]);
    if (augmentationExists(AugmentationNames.SmartJaw)) {
        delete Augmentations[AugmentationNames.SmartJaw];
    }
    AddToAugmentations(SmartJaw);
    
	//BladeIndustries
    var Neotra = new Augmentation(AugmentationNames.Neotra);
    Neotra.setInfo("A highly-advanced techno-organic drug that is injected into the skeletal " + 
                   "and integumentary system. The drug permanently modifies the DNA of the " + 
                   "body's skin and bone cells, granting them the ability to repair " +
                   "and restructure themselves. <br><br>" + 
                   "This augmentation increases the player's strength and defense by 55%");
    Neotra.setRequirements(225000, 550000000);
    Neotra.addToFactions(["Blade Industries"]);
    if (augmentationExists(AugmentationNames.Neotra)) {
        delete Augmentations[AugmentationNames.Neotra];
    }
    AddToAugmentations(Neotra);
    
	//NWO 
    var Xanipher = new Augmentation(AugmentationNames.Xanipher);
    Xanipher.setInfo("A concoction of advanced nanobots that is orally ingested into the " +
                     "body. These nanobots induce physiological change and significantly " + 
                     "improve the body's functionining in all aspects. <br><br>" + 
                     "This augmentation: <br>" + 
                     "Increases all of the player's stats by 20%<br>" + 
                     "Increases the player's experience gain rate for all stats by 15%");
    Xanipher.setRequirements(350000, 800000000);
    Xanipher.addToFactions(["NWO"]);
    if (augmentationExists(AugmentationNames.Xanipher)) {
        delete Augmentations[AugmentationNames.Xanipher];
    }
    AddToAugmentations(Xanipher);
    
    //ClarkeIncorporated
    var nextSENS = new Augmentation(AugmentationNames.nextSENS);
    nextSENS.setInfo("The body is genetically re-engineered to maintain a state " + 
                     "of negligible senescence, preventing the body from " + 
                     "deteriorating with age. <br><br>" + 
                     "This augmentation increases all of the player's stats by 20%");
    nextSENS.setRequirements(175000, 375000000); 
    nextSENS.addToFactions(["Clarke Incorporated"]);
    if (augmentationExists(AugmentationNames.nextSENS)) {
        delete Augmentations[AugmentationNames.nextSENS];
    }
    AddToAugmentations(nextSENS); 
    
	//OmniTekIncorporated
    var OmniTekInfoLoad = new Augmentation(AugmentationNames.OmniTekInfoLoad);
    OmniTekInfoLoad.setInfo("OmniTek's data and information repository is uploaded " + 
                            "into your brain, enhancing your programming and " +
                            "hacking abilities. <br><br>" + 
                            "This augmentation:<br>" + 
                            "Increases the player's hacking skill by 20%<br>" + 
                            "Increases the player's hacking experience gain rate by 25%");
    OmniTekInfoLoad.setRequirements(250000, 550000000)
    OmniTekInfoLoad.addToFactions(["OmniTek Incorporated"]);
    if (augmentationExists(AugmentationNames.OmniTekInfoLoad)) {
        delete Augmentations[AugmentationNames.OmniTekInfoLoad];
    }
    AddToAugmentations(OmniTekInfoLoad);
    
	//FourSigma
    //TODO Later when Intelligence is added in . Some aug that greatly increases int
    
	//KuaiGongInternational
    var PhotosyntheticCells = new Augmentation(AugmentationNames.PhotosyntheticCells);
    PhotosyntheticCells.setInfo("Chloroplasts are added to epidermal stem cells and are applied " + 
                                "to the body using a skin graft. The result is photosynthetic " + 
                                "skin cells, allowing users to generate their own energy " + 
                                "and nutrition using solar power. <br><br>" + 
                                "This augmentation increases the player's strength, defense, and agility by 40%");
    PhotosyntheticCells.setRequirements(225000, 525000000);
    PhotosyntheticCells.addToFactions(["KuaiGong International"]);
    if (augmentationExists(AugmentationNames.PhotosyntheticCells)) {
        delete Augmentations[AugmentationNames.PhotosyntheticCells];
    }
    AddToAugmentations(PhotosyntheticCells);
    
	//BitRunners
    var Neurolink = new Augmentation(AugmentationNames.Neurolink);
    Neurolink.setInfo("A brain implant that provides a high-bandwidth, direct neural link between your " + 
                      "mind and BitRunners' data servers, which reportedly contain " +
                      "the largest database of hacking tools and information in the world. <br><br>" + 
                      "This augmentation: <br>" + 
                      "Increases the player's hacking skill by 15%<br>" + 
                      "Increases the player's hacking experience gain rate by 20%<br>" + 
                      "Increases the player's chance of successfully performing a hack by 10%<br>" +
                      "Increases the player's hacking speed by 5%<br>" + 
                      "Lets the player start with the FTPCrack.exe and relaySMTP.exe programs after a reset");
    Neurolink.setRequirements(350000, 850000000);
    Neurolink.addToFactions(["BitRunners"]);
    if (augmentationExists(AugmentationNames.Neurolink)) {
        delete Augmentations[AugmentationNames.Neurolink];
    }
    AddToAugmentations(Neurolink);
    
	//BlackHand
    var TheBlackHand = new Augmentation(AugmentationNames.TheBlackHand);
    TheBlackHand.setInfo("A highly advanced bionic hand. This prosthetic not only " +
                         "enhances strength and dexterity but it is also embedded " + 
                         "with hardware and firmware that lets the user connect to, access and hack " + 
                         "devices and machines just by touching them. <br><br>" + 
                         "This augmentation: <br>" + 
                         "Increases the player's strength and dexterity by 15%<br>" + 
                         "Increases the player's hacking skill by 10%<br>" + 
                         "Increases the player's hacking speed by 2%<br>" + 
                         "Increases the amount of money the player gains from hacking by 10%");
    TheBlackHand.setRequirements(40000, 100000000);
    TheBlackHand.addToFactions(["The Black Hand"]);
    if (augmentationExists(AugmentationNames.TheBlackHand)) {
        delete Augmentations[AugmentationNames.TheBlackHand];
    }
    AddToAugmentations(TheBlackHand);
    
	//NiteSec
    var CRTX42AA = new Augmentation(AugmentationNames.CRTX42AA);
    CRTX42AA.setInfo("The CRTX42-AA gene is injected into the genome. " + 
                     "The CRTX42-AA is an artificially-synthesized gene that targets the visual and prefrontal " +
                     "cortex and improves cognitive abilities. <br><br>" + 
                     "This augmentation: <br>" + 
                     "Improves the player's hacking skill by 8%<br>" + 
                     "Improves the player's hacking experience gain rate by 15%");
    CRTX42AA.setRequirements(18000, 45000000);
    CRTX42AA.addToFactions(["NiteSec"]);
    if (augmentationExists(AugmentationNames.CRTX42AA)) {
        delete Augmentations[AugmentationNames.CRTX42AA];
    }
    AddToAugmentations(CRTX42AA);
   
	//Chongqing
    var Neuregen = new Augmentation(AugmentationNames.Neuregen);
    Neuregen.setInfo("A drug that genetically modifies the neurons in the brain. " +
                     "The result is that these neurons never die and continuously " + 
                     "regenerate and strengthen themselves. <br><br>" + 
                     "This augmentation increases the player's hacking experience gain rate by 40%");
    Neuregen.setRequirements(15000, 75000000);
    Neuregen.addToFactions(["Chongqing"]);
    if (augmentationExists(AugmentationNames.Neuregen)) {
        delete Augmentations[AugmentationNames.Neuregen];
    }
    AddToAugmentations(Neuregen);
    
	//Sector12
    var CashRoot = new Augmentation(AugmentationNames.CashRoot);
    CashRoot.setInfo("A collection of digital assets saved on a small chip. The chip is implanted " + 
                     "into your wrist. A small jack in the chip allows you to connect it to a computer " +
                     "and upload the assets. <br><br>" + 
                     "This augmentation: <br>" + 
                     "Lets the player start with $1,000,000 after a reset<br>" + 
                     "Lets the player start with the BruteSSH.exe program after a reset");
    CashRoot.setRequirements(5000, 25000000);
    CashRoot.addToFactions(["Sector-12"]);
    if (augmentationExists(AugmentationNames.CashRoot)) {
        delete Augmentations[AugmentationNames.CashRoot];
    }
    AddToAugmentations(CashRoot);
    
	//NewTokyo
    var NutriGen = new Augmentation(AugmentationNames.NutriGen);
    NutriGen.setInfo("A thermo-powered artificial nutrition generator. Endogenously " + 
                     "synthesizes glucose, amino acids, and vitamins and redistributes them " +
                     "across the body. The device is powered by the body's naturally wasted " + 
                     "energy in the form of heat.<br><br>" + 
                     "This augmentation: <br>" + 
                     "Increases the player's experience gain rate for all combat stats by 20%");
    NutriGen.setRequirements(2500, 500000);
    NutriGen.addToFactions(["New Tokyo"]);
    if (augmentationExists(AugmentationNames.NutriGen)) {
        delete Augmentations[AugmentationNames.NutriGen];
    }
    AddToAugmentations(NutriGen);
    
	//Aevum
    //TODO Later Something that lets you learn advanced math...this increases int
           //and profits as a trader/from trading
    
    //Ishima
    var INFRARet = new Augmentation(AugmentationNames.INFRARet);
    INFRARet.setInfo("A retina implant consisting of a tiny chip that sits behind the " + 
                     "retina. This implant lets people visually detect infrared radiation. <br><br>"  + 
                     "This augmentation: <br>" +
                     "Increases the player's crime success rate by 25%<br>" +
                     "Increases the amount of money the player gains from crimes by 10%<br>" +                      
                     "Increases the player's dexterity by 10%");
    INFRARet.setRequirements(3000, 6000000);
    INFRARet.addToFactions(["Ishima"]);
    if (augmentationExists(AugmentationNames.INFRARet)) {
        delete Augmentations[AugmentationNames.INFRARet];
    }
    AddToAugmentations(INFRARet);
    
	//Volhaven
    var DermaForce = new Augmentation(AugmentationNames.DermaForce);
    DermaForce.setInfo("A synthetic skin is grafted onto the body. The skin consists of " +
                       "millions of nanobots capable of projecting high-density muon beams, " +
                       "creating an energy barrier around the user. <br><br>" + 
                       "This augmentation increases the player's defense by 50%");
    DermaForce.setRequirements(6000, 10000000);
    DermaForce.addToFactions(["Volhaven"]);
    if (augmentationExists(AugmentationNames.DermaForce)) {
        delete Augmentations[AugmentationNames.DermaForce];
    }
    AddToAugmentations(DermaForce);
    
	//SpeakersForTheDead
    var GrapheneBrachiBlades = new Augmentation(AugmentationNames.GrapheneBrachiBlades);
    GrapheneBrachiBlades.setInfo("An upgrade to the BrachiBlades augmentation. It infuses " + 
                                 "the retractable blades with an advanced graphene material " + 
                                 "to make them much stronger and lighter. <br><br>" + 
                                 "This augmentation:<br>" + 
                                 "Increases the player's strength and defense by 40%<br>" +
                                 "Increases the player's crime success rate by 10%<br>" + 
                                 "Increases the amount of money the player gains from crimes by 30%");
    GrapheneBrachiBlades.setRequirements(90000, 500000000);
    GrapheneBrachiBlades.addToFactions(["Speakers for the Dead"]);
    if (augmentationExists(AugmentationNames.GrapheneBrachiBlades)) {
        delete Augmentations[AugmentationNames.GrapheneBrachiBlades];
    }
    AddToAugmentations(GrapheneBrachiBlades);
    
	//DarkArmy
    var GrapheneBionicArms = new Augmentation(AugmentationNames.GrapheneBionicArms);
    GrapheneBionicArms.setInfo("An upgrade to the Bionic Arms augmentation. It infuses the " + 
                               "prosthetic arms with an advanced graphene material " + 
                               "to make them much stronger and lighter. <br><br>" + 
                               "This augmentation increases the player's strength and dexterity by 85%");
    GrapheneBionicArms.setRequirements(200000, 750000000);
    GrapheneBionicArms.addToFactions(["The Dark Army"]);
    if (augmentationExists(AugmentationNames.GrapheneBionicArms)) {
        delete Augmentations[AugmentationNames.GrapheneBionicArms];
    }
    AddToAugmentations(GrapheneBionicArms);
    
	//TheSyndicate
    var BrachiBlades = new Augmentation(AugmentationNames.BrachiBlades);
    BrachiBlades.setInfo("A set of retractable plasteel blades are implanted in the arm, underneath the skin. " +
                         "<br><br>This augmentation: <br>" + 
                         "Increases the player's strength and defense by 15%<br>" + 
                         "Increases the player's crime success rate by 10%<br>" + 
                         "Increases the amount of money the player gains from crimes by 15%");
    BrachiBlades.setRequirements(5000, 18000000);
    BrachiBlades.addToFactions(["The Syndicate"]);
    if (augmentationExists(AugmentationNames.BrachiBlades)) {
        delete Augmentations[AugmentationNames.BrachiBlades];
    }
    AddToAugmentations(BrachiBlades);
    
    //Tetrads
    var BionicArms = new Augmentation(AugmentationNames.BionicArms);
    BionicArms.setInfo("Cybernetic arms created from plasteel and carbon fibers that completely replace " + 
                       "the user's organic arms. <br><br>" + 
                       "This augmentation increases the user's strength and dexterity by 30%");
    BionicArms.setRequirements(25000, 55000000);
    BionicArms.addToFactions(["Tetrads"]);
    if (augmentationExists(AugmentationNames.BionicArms)) {
        delete Augmentations[AugmentationNames.BionicArms];
    }
    AddToAugmentations(BionicArms);
    
	//TianDiHui
    var SNA = new Augmentation(AugmentationNames.SNA);
    SNA.setInfo("A cranial implant that affects the user's personality, making them better " +
                "at negotiation in social situations. <br><br>" + 
                "This augmentation: <br>" + 
                "Increases the amount of money the player earns at a company by 10%<br>" + 
                "Increases the amount of reputation the player gains when working for a " + 
                "company or faction by 15%");
    SNA.setRequirements(2500, 6000000);
    SNA.addToFactions(["Tian Di Hui"]);
    if (augmentationExists(AugmentationNames.SNA)) {
        delete Augmentations[AugmentationNames.SNA];
    }
    AddToAugmentations(SNA);
    
    //Update costs based on how many have been purchased
    var mult = Math.pow(CONSTANTS.MultipleAugMultiplier, Player.queuedAugmentations.length);
    for (var name in Augmentations) {
        if (Augmentations.hasOwnProperty(name)) {
            Augmentations[name].baseCost *= mult;
        }
    }
}

applyAugmentation = function(aug, reapply=false) { 
    Augmentations[aug.name].owned = true;
    switch(aug.name) {
        //Combat stat augmentations
        case AugmentationNames.Targeting1:
            Player.dexterity_mult *= 1.15;
            break;
        case AugmentationNames.Targeting2:
            Player.dexterity_mult *= 1.25;
            break;
        case AugmentationNames.Targeting3:
            Player.dexterity_mult *= 1.40;
            break;
        case AugmentationNames.SyntheticHeart:         //High level
            Player.agility_mult *= 1.5;
            Player.strength_mult *= 1.5;
            break;
        case AugmentationNames.SynfibrilMuscle:        //Medium-high level
            Player.strength_mult    *= 1.35;
            Player.defense_mult     *= 1.35;
            break;
        case AugmentationNames.CombatRib1:
            Player.strength_mult    *= 1.1;
            Player.defense_mult     *= 1.1;
            break;
        case AugmentationNames.CombatRib2:
            Player.strength_mult    *= 1.15;
            Player.defense_mult     *= 1.15;
            break;
        case AugmentationNames.CombatRib3:
            Player.strength_mult    *= 1.20;
            Player.defense_mult     *= 1.20;
            break;
        case AugmentationNames.NanofiberWeave:         //Med level
            Player.strength_mult    *= 1.25;
            Player.defense_mult     *= 1.25;
            break;
        case AugmentationNames.SubdermalArmor:         //High level
            Player.defense_mult     *= 2.25;
            break;
        case AugmentationNames.WiredReflexes:          //Low level
            Player.agility_mult     *= 1.05;
            Player.dexterity_mult   *= 1.05;
            break;
        case AugmentationNames.GrapheneBoneLacings:   //High level
            Player.strength_mult    *= 1.75;
            Player.defense_mult     *= 1.75;
            break;
        case AugmentationNames.BionicSpine:            //Med level
            Player.strength_mult    *= 1.18;
            Player.defense_mult     *= 1.18;
            Player.agility_mult     *= 1.18;
            Player.dexterity_mult   *= 1.18;
            break;
        case AugmentationNames.GrapheneBionicSpine:   //High level
            Player.strength_mult    *= 1.65;
            Player.defense_mult     *= 1.65;
            Player.agility_mult     *= 1.65;
            Player.dexterity_mult   *= 1.65;
            break;
        case AugmentationNames.BionicLegs:             //Med level
            Player.agility_mult     *= 1.6;
            break;
        case AugmentationNames.GrapheneBionicLegs:    //High level
            Player.agility_mult     *= 2.75;
            break;
            
        //Labor stats augmentations
        case AugmentationNames.EnhancedSocialInteractionImplant: //Med-high level
            Player.charisma_mult        *= 1.6;
            Player.charisma_exp_mult    *= 1.6;
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
            Player.hacking_speed_mult *= 1.03;
            Player.hacking_money_mult *= 1.15;
            Player.hacking_mult       *= 1.12;
            break;
        case AugmentationNames.ArtificialSynapticPotentiation:    //Med level
            Player.hacking_speed_mult   *= 1.02;
            Player.hacking_chance_mult  *= 1.05;
            Player.hacking_exp_mult     *= 1.05;
            break;
        case AugmentationNames.EnhancedMyelinSheathing:       //Med level
            Player.hacking_speed_mult *= 1.03;
            Player.hacking_exp_mult   *= 1.1;
            Player.hacking_mult       *= 1.08;
            break;
        case AugmentationNames.SynapticEnhancement:    //Low Level
            Player.hacking_speed_mult *= 1.03;
            break;
        case AugmentationNames.NeuralRetentionEnhancement:    //Med level
            Player.hacking_exp_mult   *= 1.25;
            break;
        case AugmentationNames.DataJack:                        //Med low level
            Player.hacking_money_mult *= 1.25;
            break;
        case AugmentationNames.ENM:       //Medium level
            Player.hacking_mult           *= 1.08;
            break;
        case AugmentationNames.ENMCore:      //Medium level
            Player.hacking_speed_mult     *= 1.03;
            Player.hacking_money_mult     *= 1.1;
            Player.hacking_chance_mult    *= 1.03;
            Player.hacking_exp_mult       *= 1.07;
            Player.hacking_mult           *= 1.07;
            break;
        case AugmentationNames.ENMCoreV2:   //Medium high level
            Player.hacking_speed_mult     *= 1.05;
            Player.hacking_money_mult     *= 1.3;
            Player.hacking_chance_mult    *= 1.05;
            Player.hacking_exp_mult       *= 1.15;
            Player.hacking_mult           *= 1.08;
            break;
        case AugmentationNames.ENMCoreV3:   //High level
            Player.hacking_speed_mult     *= 1.05;
            Player.hacking_money_mult     *= 1.4;
            Player.hacking_chance_mult    *= 1.1;
            Player.hacking_exp_mult       *= 1.25;
            Player.hacking_mult           *= 1.1;
            break;
        case AugmentationNames.ENMAnalyzeEngine:    //High level
            Player.hacking_speed_mult     *= 1.1;
            break;
        case AugmentationNames.ENMDMA:  //High level
            Player.hacking_money_mult     *= 1.4;
            Player.hacking_chance_mult    *= 1.2;
            break;
        case AugmentationNames.Neuralstimulator:    //Medium Level
            Player.hacking_speed_mult     *= 1.02;
            Player.hacking_chance_mult    *= 1.1;
            Player.hacking_exp_mult       *= 1.12;
            break;
        case AugmentationNames.NeuralAccelerator:
            Player.hacking_mult         *= 1.1;
            Player.hacking_exp_mult     *= 1.15;
            Player.hacking_money_mult   *= 1.2;
            break;
        case AugmentationNames.CranialSignalProcessorsG1:
            Player.hacking_speed_mult   *= 1.01;
            Player.hacking_mult         *= 1.05;
            break;
        case AugmentationNames.CranialSignalProcessorsG2:
            Player.hacking_speed_mult   *= 1.02;
            Player.hacking_chance_mult  *= 1.05;
            Player.hacking_mult         *= 1.07;
            break;
        case AugmentationNames.CranialSignalProcessorsG3:
            Player.hacking_speed_mult   *= 1.02;
            Player.hacking_money_mult   *= 1.15;
            Player.hacking_mult         *= 1.09;
            break;
        case AugmentationNames.CranialSignalProcessorsG4:
            Player.hacking_speed_mult   *= 1.02;
            Player.hacking_money_mult   *= 1.2;
            Player.hacking_grow_mult    *= 1.25;
            break;
        case AugmentationNames.CranialSignalProcessorsG5:
            Player.hacking_mult         *= 1.3;
            Player.hacking_money_mult   *= 1.25;
            Player.hacking_grow_mult    *= 1.75;
            break;
        case AugmentationNames.NeuronalDensification:
            Player.hacking_mult         *= 1.15;
            Player.hacking_exp_mult     *= 1.1;
            Player.hacking_speed_mult   *= 1.03;
            break;

        //Work augmentations
        case AugmentationNames.NuoptimalInjectorImplant:    //Low medium level
            Player.company_rep_mult   *= 1.2;
            break;
        case AugmentationNames.SpeechEnhancement:  //Low level
            Player.company_rep_mult   *= 1.1;
            Player.charisma_mult      *= 1.1;
            break;
        case AugmentationNames.FocusWire:   //Med level
            Player.hacking_exp_mult     *= 1.1;
            Player.strength_exp_mult    *= 1.1;
            Player.defense_exp_mult     *= 1.1;
            Player.dexterity_exp_mult   *= 1.1;
            Player.agility_exp_mult     *= 1.1;
            Player.charisma_exp_mult    *= 1.1;
            Player.company_rep_mult     *= 1.1;
            Player.work_money_mult      *= 1.2;
            break;
        case AugmentationNames.PCDNI:  //Med level
            Player.company_rep_mult   *= 1.3;
            Player.hacking_mult       *= 1.08;
            break;
        case AugmentationNames.PCDNIOptimizer:   //High level
            Player.company_rep_mult   *= 1.75;
            Player.hacking_mult       *= 1.1;
            break;    
        case AugmentationNames.PCDNINeuralNetwork:        //High level
            Player.company_rep_mult   *= 2;
            Player.hacking_mult       *= 1.1;
            Player.hacking_speed_mult *= 1.05;
            break;
        case AugmentationNames.ADRPheromone1:
            Player.company_rep_mult     *= 1.1;
            Player.faction_rep_mult     *= 1.1;
            break;
        
        //Hacknet Node Augmentations
        case AugmentationNames.HacknetNodeCPUUpload:
            Player.hacknet_node_money_mult            *= 1.15;
            Player.hacknet_node_purchase_cost_mult    *= 0.85;
            break;
        case AugmentationNames.HacknetNodeCacheUpload:
            Player.hacknet_node_money_mult            *= 1.10;
            Player.hacknet_node_level_cost_mult       *= 0.85;
            break;
        case AugmentationNames.HacknetNodeNICUpload:
            Player.hacknet_node_money_mult            *= 1.1;
            Player.hacknet_node_purchase_cost_mult    *= 0.9;
            break;
        case AugmentationNames.HacknetNodeKernelDNI:
            Player.hacknet_node_money_mult            *= 1.25;
            break;
        case AugmentationNames.HacknetNodeCoreDNI:
            Player.hacknet_node_money_mult            *= 1.45;
            break;
        
        //Misc augmentations
        case AugmentationNames.NeuroFluxGovernor:
            Player.hacking_chance_mult *= 1.01;
            Player.hacking_speed_mult  *= 1.01;
            Player.hacking_money_mult  *= 1.01;
            Player.hacking_grow_mult   *= 1.01;
            Player.hacking_mult        *= 1.01;

            Player.strength_mult       *= 1.01;
            Player.defense_mult        *= 1.01;
            Player.dexterity_mult      *= 1.01;
            Player.agility_mult        *= 1.01;
            Player.charisma_mult       *= 1.01;

            Player.hacking_exp_mult    *= 1.01;
            Player.strength_exp_mult   *= 1.01;
            Player.defense_exp_mult    *= 1.01;
            Player.dexterity_exp_mult  *= 1.01;
            Player.agility_exp_mult    *= 1.01;
            Player.charisma_exp_mult   *= 1.01;

            Player.company_rep_mult    *= 1.01;
            Player.faction_rep_mult    *= 1.01;

            Player.crime_money_mult    *= 1.01;
            Player.crime_success_mult  *= 1.01;

            Player.hacknet_node_money_mult            *= 1.01;
            Player.hacknet_node_purchase_cost_mult    *= 0.99;
            Player.hacknet_node_ram_cost_mult         *= 0.99;
            Player.hacknet_node_core_cost_mult        *= 0.99;
            Player.hacknet_node_level_cost_mult       *= 0.99;

            Player.work_money_mult    *= 1.01;
        
            if (!reapply) {
                Augmentations[aug.name].level = aug.level;
                for (var i = 0; i < Player.augmentations.length; ++i) {
                    if (Player.augmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
                        Player.augmentations[i].level = aug.level;
                        break;
                    }
                }
            }
            break;    
        case AugmentationNames.Neurotrainer1:      //Low Level
            Player.hacking_exp_mult   *= 1.1;
            Player.strength_exp_mult  *= 1.1;
            Player.defense_exp_mult   *= 1.1;
            Player.dexterity_exp_mult *= 1.1;
            Player.agility_exp_mult   *= 1.1;
            Player.charisma_exp_mult  *= 1.1;
            break;
        case AugmentationNames.Neurotrainer2:     //Medium level
            Player.hacking_exp_mult   *= 1.15;
            Player.strength_exp_mult  *= 1.15;
            Player.defense_exp_mult   *= 1.15;
            Player.dexterity_exp_mult *= 1.15;
            Player.agility_exp_mult   *= 1.15;
            Player.charisma_exp_mult  *= 1.15;
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
            Player.dexterity_mult     *= 1.4;
            Player.hacking_speed_mult *= 1.03;
            Player.hacking_money_mult *= 1.1;
            break;
        case AugmentationNames.LuminCloaking1:
            Player.agility_mult       *= 1.05;
            Player.crime_money_mult   *= 1.1;
            break;
        case AugmentationNames.LuminCloaking2:
            Player.agility_mult       *= 1.1;
            Player.defense_mult       *= 1.1;
            Player.crime_money_mult   *= 1.25;
            break;
        case AugmentationNames.HemoRecirculator:
            Player.strength_mult      *= 1.1;
            Player.defense_mult       *= 1.1;
            Player.agility_mult       *= 1.1;
            Player.dexterity_mult     *= 1.1;
            break;
        case AugmentationNames.SmartSonar:
            Player.dexterity_mult     *= 1.1;
            Player.dexterity_exp_mult *= 1.15;
            Player.crime_money_mult   *= 1.25;
            break;
        case AugmentationNames.PowerRecirculator:
            Player.hacking_mult         *= 1.05;
            Player.strength_mult        *= 1.05;
            Player.defense_mult         *= 1.05;
            Player.dexterity_mult       *= 1.05;
            Player.agility_mult         *= 1.05;
            Player.charisma_mult        *= 1.05;
            Player.hacking_exp_mult     *= 1.1;
            Player.strength_exp_mult    *= 1.1;
            Player.defense_exp_mult     *= 1.1;
            Player.dexterity_exp_mult   *= 1.1;
            Player.agility_exp_mult     *= 1.1;
            Player.charisma_exp_mult    *= 1.1;
            break;
        //Unique augmentations (for factions)
        case AugmentationNames.QLink:
            Player.hacking_speed_mult   *= 1.1;
            Player.hacking_chance_mult  *= 1.3;
            Player.hacking_money_mult   *= 2;
            break;
        case AugmentationNames.SPTN97:
            Player.strength_mult        *= 1.75;
            Player.defense_mult         *= 1.75;
            Player.dexterity_mult       *= 1.75;
            Player.agility_mult         *= 1.75;
            Player.hacking_mult         *= 1.15;
            break;
        case AugmentationNames.HiveMind:
            Player.hacking_grow_mult    *= 3;
            break;
        case AugmentationNames.CordiARCReactor:
            Player.strength_mult        *= 1.35;
            Player.defense_mult         *= 1.35;
            Player.dexterity_mult       *= 1.35;
            Player.agility_mult         *= 1.35;
            Player.strength_exp_mult    *= 1.35;
            Player.defense_exp_mult     *= 1.35;
            Player.dexterity_exp_mult   *= 1.35;
            Player.agility_exp_mult     *= 1.35;
            break;
        case AugmentationNames.SmartJaw:
            Player.charisma_mult        *= 1.5;
            Player.charisma_exp_mult    *= 1.5;
            Player.company_rep_mult     *= 1.25;
            Player.faction_rep_mult     *= 1.25;
            break;
        case AugmentationNames.Neotra:
            Player.strength_mult        *= 1.55;
            Player.defense_mult         *= 1.55;
            break;
        case AugmentationNames.Xanipher:
            Player.hacking_mult         *= 1.2;
            Player.strength_mult        *= 1.2;
            Player.defense_mult         *= 1.2;
            Player.dexterity_mult       *= 1.2;
            Player.agility_mult         *= 1.2;
            Player.charisma_mult        *= 1.2;
            Player.hacking_exp_mult     *= 1.15;
            Player.strength_exp_mult    *= 1.15;
            Player.defense_exp_mult     *= 1.15;
            Player.dexterity_exp_mult   *= 1.15;
            Player.agility_exp_mult     *= 1.15;
            Player.charisma_exp_mult    *= 1.15;
            break;
        case AugmentationNames.nextSENS:
            Player.hacking_mult         *= 1.2;
            Player.strength_mult        *= 1.2;
            Player.defense_mult         *= 1.2;
            Player.dexterity_mult       *= 1.2;
            Player.agility_mult         *= 1.2;
            Player.charisma_mult        *= 1.2;
            break;
        case AugmentationNames.OmniTekInfoLoad:
            Player.hacking_mult         *= 1.2;
            Player.hacking_exp_mult     *= 1.25;
            break;
        case AugmentationNames.PhotosyntheticCells:
            Player.strength_mult        *= 1.4;
            Player.defense_mult         *= 1.4;
            Player.agility_mult         *= 1.4;
            break;
        case AugmentationNames.Neurolink:
            Player.hacking_mult         *= 1.15;
            Player.hacking_exp_mult     *= 1.2;
            Player.hacking_chance_mult  *= 1.1;
            Player.hacking_speed_mult   *= 1.05;
            break;
        case AugmentationNames.TheBlackHand:
            Player.strength_mult        *= 1.15;
            Player.dexterity_mult       *= 1.15;
            Player.hacking_mult         *= 1.1;
            Player.hacking_speed_mult   *= 1.02;
            Player.hacking_money_mult   *= 1.1;
            break;
        case AugmentationNames.CRTX42AA:
            Player.hacking_mult         *= 1.08;
            Player.hacking_exp_mult     *= 1.15;
            break;
        case AugmentationNames.Neuregen:
            Player.hacking_exp_mult     *= 1.4;
            break;
        case AugmentationNames.CashRoot:
            break;
        case AugmentationNames.NutriGen:
            Player.strength_exp_mult    *= 1.2;
            Player.defense_exp_mult     *= 1.2;
            Player.dexterity_exp_mult   *= 1.2;
            Player.agility_exp_mult     *= 1.2;
            break;
        case AugmentationNames.INFRARet:
            Player.crime_success_mult   *= 1.25;
            Player.crime_money_mult     *= 1.1;
            Player.dexterity_mult       *= 1.1;
            break;
        case AugmentationNames.DermaForce:
            Player.defense_mult         *= 1.5;
            break;
        case AugmentationNames.GrapheneBrachiBlades:
            Player.strength_mult        *= 1.4;
            Player.defense_mult         *= 1.4;
            Player.crime_success_mult   *= 1.1;
            Player.crime_money_mult     *= 1.3;
            break;
        case AugmentationNames.GrapheneBionicArms:
            Player.strength_mult        *= 1.85;
            Player.dexterity_mult       *= 1.85;
            break;
        case AugmentationNames.BrachiBlades:
            Player.strength_mult        *= 1.15;
            Player.defense_mult         *= 1.15;
            Player.crime_success_mult   *= 1.1;
            Player.crime_money_mult     *= 1.15;
            break;
        case AugmentationNames.BionicArms:
            Player.strength_mult        *= 1.3;
            Player.dexterity_mult       *= 1.3;
            break;
        case AugmentationNames.SNA:
            Player.work_money_mult      *= 1.1;
            Player.company_rep_mult     *= 1.15;
            Player.faction_rep_mult     *= 1.15;
            break;
        default:
            throw new Error("ERROR: No such augmentation!");
            return;
    }

    if (aug.name == AugmentationNames.NeuroFluxGovernor) {
        for (var i = 0; i < Player.augmentations.length; ++i) {
            if (Player.augmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
                //Already have this aug, just upgrade the level
                return;
            }
        }
    }
    
    if (!reapply) {
        var ownedAug = new PlayerOwnedAugmentation(aug.name);
        Player.augmentations.push(ownedAug);
    }
}

function PlayerOwnedAugmentation(name) {
    this.name = name;
    this.level = 1;
}

function installAugmentations() {
    if (Player.queuedAugmentations.length == 0) {
        dialogBoxCreate("You have not purchased any Augmentations to install!");
        return;
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
}

PlayerObject.prototype.reapplyAllAugmentations = function() {
    console.log("Re-applying augmentations");
    //Reset multipliers
    this.hacking_chance_mult    = 1;  //Increase through ascensions/augmentations
    this.hacking_speed_mult     = 1;  //Decrease through ascensions/augmentations
    this.hacking_money_mult     = 1;  //Increase through ascensions/augmentations. Can't go above 1
    this.hacking_grow_mult      = 1;
    
    this.hacking_mult       = 1;
    this.strength_mult      = 1;
    this.defense_mult       = 1;
    this.dexterity_mult     = 1;
    this.agility_mult       = 1;
    this.charisma_mult      = 1;
    
    this.hacking_exp_mult    = 1;
    this.strength_exp_mult   = 1;
    this.defense_exp_mult    = 1;
    this.dexterity_exp_mult  = 1;
    this.agility_exp_mult    = 1;
    this.charisma_exp_mult   = 1;

    this.company_rep_mult    = 1;
    this.faction_rep_mult    = 1;
    
    this.crime_money_mult       = 1;
    this.crime_success_mult     = 1;
    
    this.hacknet_node_money_mult            = 1;
    this.hacknet_node_purchase_cost_mult    = 1;
    this.hacknet_node_ram_cost_mult         = 1;
    this.hacknet_node_core_cost_mult        = 1;
    this.hacknet_node_level_cost_mult       = 1;
    
    this.work_money_mult = 1;
    
    for (i = 0; i < this.augmentations.length; ++i) {
        //Compatibility with new version
        if (typeof this.augmentations[i] === 'string' || this.augmentations[i] instanceof String) {
            var newOwnedAug = new PlayerOwnedAugmentation(this.augmentations[i]);
            if (this.augmentations[i] == AugmentationNames.NeuroFluxGovernor) {
                newOwnedAug.level = Augmentations[AugmentationNames.NeuroFluxGovernor].level;
            }
            this.augmentations[i] = newOwnedAug;
        }
        
        var augName = this.augmentations[i].name;
        var aug = Augmentations[augName];
        aug.owned = true;
        if (aug == null) {
            console.log("WARNING: Invalid augmentation name");
            continue;
        }
        if (aug.name == AugmentationNames.NeuroFluxGovernor) {
            for (j = 0; j < aug.level; ++j) {
                applyAugmentation(this.augmentations[i], true);
            }
            continue;
        }
        applyAugmentation(this.augmentations[i], true);
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