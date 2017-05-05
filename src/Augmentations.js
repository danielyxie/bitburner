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

//TODO Something that decreases RAM usage of scripts
initAugmentations = function() {
    //Combat stat augmentations
    var Targeting1 = new Augmentation("Augmented Targeting I");
    Targeting1.setRequirements(8000, 10000000);
    Targeting1.setInfo("This cranial implant is embedded within the player's inner ear structure and optic nerves. It regulates and enhances the user's " + 
                       "balance and hand-eye coordination. It is also capable of augmenting reality by projecting digital information " + 
                       "directly onto the retina. These enhancements allow the player to better lock-on and keep track of enemies. <br><br>" +
                       "This augmentation increases the player's dexterity by 10%.");
    Targeting1.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    AddToAugmentations(Targeting1);
    
    var Targeting2 = new Augmentation("Augmented Targeting II");
    Targeting2.setRequirements(30000, 20000000);
    Targeting2.setInfo("This is an upgrade of the Augmented Targeting I cranial implant, which is capable of augmenting reality " + 
                       "and enhances the user's balance and hand-eye coordination. <br><br>This upgrade increases the player's dexterity " + 
                       "by an additional 20%.");
    Targeting2.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    AddToAugmentations(Targeting2);
    
    var Targeting3 = new Augmentation("Augmented Targeting III");
    Targeting3.setRequirements(80000, 50000000);
    Targeting3.setInfo("This is an upgrade of the Augmented Targeting II cranial implant, which is capable of augmenting reality " + 
                       "and enhances the user's balance and hand-eye coordination. <br><br>This upgrade increases the player's dexterity " +
                       "by an additional 50%.");
    Targeting3.addToFactions(["The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant"]);
    AddToAugmentations(Targeting3);
    
    var SyntheticHeart = new Augmentation("Synthetic Heart");
    SyntheticHeart.setRequirements(400000, 500000000);
    SyntheticHeart.setInfo("This advanced artificial heart, created from plasteel and graphene, is capable of pumping more blood " + 
                           "at much higher efficiencies than a normal human heart.<br><br> This augmentation increases the player's agility " +
                           "and strength by 100%");
    SyntheticHeart.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                 "NWO", "The Covenant", "Daedalus", "Illuminati"]);
    AddToAugmentations(SyntheticHeart);
    
    var SynfibrilMuscle = new Augmentation("Synfibril Muscle");
    SynfibrilMuscle.setRequirements(300000, 400000000);
    SynfibrilMuscle.setInfo("The myofibrils in human muscles are injected with special chemicals that react with the proteins inside " + 
                            "the myofibrils, altering their underlying structure. The end result is muscles that are stronger and more elastic. " + 
                            "Scientists have named these artificially enhanced units 'synfibrils'.<br><br> This augmentation increases the player's " +
                            "strength and defense by 50%.");
    SynfibrilMuscle.addToFactions(["KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
                                  "NWO", "The Covenant", "Daedalus", "Illuminati", "Blade Industries"]);
    AddToAugmentations(SynfibrilMuscle)
    
    var CombatRib1 = new Augmentation("Combat Rib I");
    CombatRib1.setRequirements(12000, 15000000);
    CombatRib1.setInfo("The human body's ribs are replaced with artificial ribs that automatically and continuously release cognitive " + 
                       "and performance-enhancing drugs into the bloodstream, improving the user's abilities in combat.<br><br>" + 
                       "This augmentation increases the player's strength and defense by 10%.");
    CombatRib1.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    AddToAugmentations(CombatRib1);
    
    var CombatRib2 = new Augmentation("Combat Rib II");
    CombatRib2.setRequirements(40000, 40000000);
    CombatRib2.setInfo("This is an upgrade to the Combat Rib I augmentation, and is capable of releasing even more potent combat-enhancing " + 
                       "drugs into the bloodstream<br><br>. This upgrade increases the player's strength and defense by an additional 20%.")
    CombatRib2.addToFactions(["The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
                             "OmniTek Incorporated", "KuaiGong International", "Blade Industries"]);
    AddToAugmentations(CombatRib2);
    
    var CombatRib3 = new Augmentation("Combat Rib III");
    CombatRib3.setRequirements(120000, 100000000);
    CombatRib3.setInfo("This is an upgrade to the Combat Rib II augmentation, and is capable of releasing even more potent combat-enhancing " + 
                       "drugs into the bloodstream<br><br>. This upgrade increases the player's strength and defense by an additional 30%.");
    CombatRib3.addToFactions(["The Dark Army", "The Syndicate", "OmniTek Incorporated",
                             "KuaiGong International", "Blade Industries", "The Covenant"]);
    AddToAugmentations(CombatRib3);
    
    var NanofiberWeave = new Augmentation("Nanofiber Weave");
    NanofiberWeave.setRequirements(150000, 250000000);
    NanofiberWeave.setInfo("Synthetic nanofibers are woven into the skin's extracellular matrix using electrospinning. " + 
                           "This improves the skin's ability to regenerate itself and protect the body from external stresses and forces.<br><br>" + 
                           "This augmentation increases the player's strength and defense by 30%.");
    NanofiberWeave.addToFactions(["Tian Di Hui", "The Syndicate", "The Dark Army", "Speakers for the Dead",
                                 "Blade Industries", "Fulcrum Secret Technologies", "OmniTek Incorporated"]);
    AddToAugmentations(NanofiberWeave);
    
    var SubdermalArmor = new Augmentation("NEMEAN Subdermal Weave");
    SubdermalArmor.setRequirements(600000, 750000000);
    SubdermalArmor.setInfo("The NEMEAN Subdermal Weave is a thin, light-weight, graphene plating that houses a dilatant fluid. " +
                           "The material is implanted underneath the skin, and is the most advanced form of defensive enhancement " +
                           "that has ever been created. The dilatant fluid, despite being thin and light, is extremely effective " + 
                           "at stopping piercing blows and reducing blunt trauma. The properties of graphene allow the plating to " +
                           "mitigate damage from any fire-related or electrical traumas.<br><br>" + 
                           "This augmentation increases the player's defense by 150%.");
    SubdermalArmor.addToFactions(["The Syndicate", "Fulcrum Secret Technologies", "Illuminati", "Daedalus",
                                 "The Covenant"]);
    AddToAugmentations(SubdermalArmor);
    
    var WiredReflexes = new Augmentation("Wired Reflexes");
    WiredReflexes.setRequirements(3000, 6000000);
    WiredReflexes.setInfo("Synthetic nerve-enhancements are injected into all major parts of the somatic nervous system, " + 
                          "supercharging the body's ability to send signals through neurons. This results in increased reflex speed.<br><br>" + 
                          "This augmentation increases the player's agility by 5%.");
    WiredReflexes.addToFactions(["Tian Di Hui", "Sector-12", "Volhaven", "Aevum", "Ishima", 
                                "The Syndicate", "The Dark Army", "Speakers for the Dead"]);
    AddToAugmentations(WiredReflexes);
    
    var GrapheneBoneLacings = new Augmentation("Graphene Bone Lacings");
    GrapheneBoneLacings.setRequirements(750000, 1000000000);
    GrapheneBoneLacings.setInfo("A graphene-based material is grafted and fused into the user's bones, significantly increasing " +
                                "their density and tensile strength.<br><br>" + 
                                "This augmentation increases the player's strength and defense by 100%.");
    GrapheneBoneLacings.addToFactions(["Fulcrum Secret Technologies", "The Covenant"]);
    AddToAugmentations(GrapheneBoneLacings);
    
    var BionicSpine = new Augmentation("Bionic Spine");
    BionicSpine.setRequirements(150000, 75000000);
    BionicSpine.setInfo("An artificial spine created from plasteel and carbon fibers that completely replaces the organic spine. " + 
                        "Not only is the Bionic Spine physically stronger than a human spine, but it is also capable of digitally " + 
                        "stimulating and regulating the neural signals that are sent and received by the spinal cord. This results in " + 
                        "greatly improved senses and reaction speeds.<br><br>" + 
                        "This augmentation increases all of the player's combat stats by 20%.");
    BionicSpine.addToFactions(["Speakers for the Dead", "The Syndicate", "KuaiGong International",
                              "OmniTek Incorporated", "Blade Industries"]);
    AddToAugmentations(BionicSpine);
    
    var GrapheneBionicSpine = new Augmentation("Graphene Bionic Spine Upgrade");
    GrapheneBionicSpine.setRequirements(650000, 1000000000);
    GrapheneBionicSpine.setInfo("An upgrade to the Bionic Spine augmentation. It fuses the implant with an advanced graphene " + 
                                "material to make it much stronger and lighter.<br><br>" + 
                                "This augmentation increases all of the player's combat stats by 100%.");
    GrapheneBionicSpine.addToFactions(["Fulcrum Secret Technologies", "ECorp"]);
    AddToAugmentations(GrapheneBionicSpine);
    
    var BionicLegs = new Augmentation("Bionic Legs");
    BionicLegs.setRequirements(100000, 60000000);
    BionicLegs.setInfo("Cybernetic legs created from plasteel and carbon fibers that completely replace the user's organic legs. <br><br>" + 
                       "This augmentation increases the player's agility by 50%.");
    BionicLegs.addToFactions(["Speakers for the Dead", "The Syndicate", "KuaiGong International",
                             "OmniTek Incorporated", "Blade Industries"]);
    AddToAugmentations(BionicLegs);
    
    var GrapheneBionicLegs = new Augmentation("Graphene Bionic Legs Upgrade");
    GrapheneBionicLegs.setRequirements(400000, 900000000);
    GrapheneBionicLegs.setInfo("An upgrade to the Bionic Legs augmentation. It fuses the implant with an advanced graphene " + 
                               "material to make it much stronger and lighter.<br><br>" + 
                               "This augmentation increases the player's agility by an additional 150%.");
    GrapheneBionicLegs.addToFactions(["MegaCorp", "ECorp", "Fulcrum Secret Technologies"]);
    AddToAugmentations(GrapheneBionicLegs);
    
    //Labor stat augmentations
    var SpeechProcessor = new Augmentation("Speech Processor Implant"); //Cochlear imlant?
    SpeechProcessor.setRequirements(25000, 15000000);
    SpeechProcessor.setInfo("A cochlear implant with an embedded computer that analyzes incoming speech. " +
                            "The embedded computer processes characteristics of incoming speech, such as tone " +
                            "and inflection, to pick up on subtle cues and aid in social interaction.<br><br>" + 
                            "This augmentation increases the player's charisma by 20%.");
    SpeechProcessor.addToFactions(["Tian Di Hui", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                  "Ishima", "Volhaven"]);
    AddToAugmentations(SpeechProcessor);
    
    TITN41Injection = new Augmentation("TITN-41 Gene-Modification Injection");
    TITN41Injection.setRequirements(40000, 75000000);
    TITN41Injection.setInfo("TITN is a series of viruses that targets and alters the sequences of human DNA in genes that " + 
                            "control personality. The TITN-41 strain alters these genes so that the subject becomes more " + 
                            "outgoing and socialable. <br><br>" + 
                            "This augmentation increases the player's charisma and charisma experience gain rate by 15%");
    TITN41Injection.addToFactions(["Silhouette"]);            
    
    var EnhancedSocialInteractionImplant = new Augmentation("Enhanced Social Interaction Implant");
    EnhancedSocialInteractionImplant.setRequirements(500000, 500000000);
    EnhancedSocialInteractionImplant.setInfo("A cranial implant that greatly assists in the user's ability to analyze social situations " + 
                                             "and interactions. The system uses a wide variety of factors such as facial expression, body " + 
                                             "language, and the voice's tone/inflection to determine the best course of action during social" + 
                                             "situations. The implant also uses deep learning software to continuously learn new behavior" + 
                                             "patterns and how to best respond.<br><br>" + 
                                             "This augmentation increases the player's charisma and charisma experience gain rate by 50%.");
    EnhancedSocialInteractionImplant.addToFactions(["Bachman & Associates", "NWO", "Clarke Incorporated",
                                                   "OmniTek Incorporated", "Four Sigma"]);
    AddToAugmentations(EnhancedSocialInteractionImplant);
    
    //Hacking augmentations
    var BitWire = new Augmentation("BitWire");
    BitWire.setRequirements(4000, 3000000);
    BitWire.setInfo("A small brain implant embedded in the cerebrum. This regulates and improves the brain's computing " + 
                    "capabilities. <br><br> This augmentation increases the player's hacking skill by 5%");
    BitWire.addToFactions(["CyberSec", "BitRunners", "NiteSec"]);
    AddToAugmentations(BitWire);
    
    var ArtificialBioNeuralNetwork = new Augmentation("Artificial Bio-neural Network Implant");
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
    AddToAugmentations(ArtificialBioNeuralNetwork);
    
    var ArtificialSynapticPotentiation = new Augmentation("Artificial Synaptic Potentiation");
    ArtificialSynapticPotentiation.setRequirements(20000, 80000000);
    ArtificialSynapticPotentiation.setInfo("The body is injected with a chemical that artificially induces synaptic potentiation, " + 
                                           "otherwise known as the strengthening of synapses. This results in a enhanced cognitive abilities.<br><br>" + 
                                           "This augmentation increases the player's hacking speed and hacking chance by 1%.");
    ArtificialSynapticPotentiation.addToFactions(["The Black Hand", "NiteSec"]);
    AddToAugmentations(ArtificialSynapticPotentiation);
    
    var EnhancedMyelinSheathing = new Augmentation("Enhanced Myelin Sheathing");
    EnhancedMyelinSheathing.setRequirements(300000, 850000000);
    EnhancedMyelinSheathing.setInfo("Electrical signals are used to induce a new, artificial form of myelinogensis in the human body. " + 
                                    "This process results in the proliferation of new, synthetic myelin sheaths in the nervous " + 
                                    "system. These myelin sheaths can propogate neuro-signals much faster than their organic " + 
                                    "counterparts, leading to greater processing speeds and better brain function.<br><br>" + 
                                    "This augmentation:<br>" + 
                                    "Increases the player's hacking speed by 1%<br>" + 
                                    "Increases the player's hacking skill by 5%<br>" + 
                                    "Increases the player's hacking experience gain rate by 5%");
    EnhancedMyelinSheathing.addToFactions(["Fulcrum Secret Technologies", "BitRunners", "The Black Hand"]);
    AddToAugmentations(EnhancedMyelinSheathing);
    
    var SynapticEnhancement = new Augmentation("Synaptic Enhancement Implant");
    SynapticEnhancement.setRequirements(4000, 2000000);
    SynapticEnhancement.setInfo("A small cranial implant that continuously uses weak electric signals to stimulate the brain and " +
                                "induce stronger synaptic activity. This improves the the user's cognitive abilities.<br><br>" + 
                                "This augmentation increases the player's hacking speed by 1%.");
    SynapticEnhancement.addToFactions(["CyberSec"]);
    AddToAugmentations(SynapticEnhancement);
    
    var NeuralRetentionEnhancement = new Augmentation("Neural-Retention Enhancement");
    NeuralRetentionEnhancement.setRequirements(80000, 100000000);
    NeuralRetentionEnhancement.setInfo("Chemical injections are used to permanently alter and strengthen the brain's neuronal " +
                                       "circuits, strengthening its ability to retain information.<br><br>" + 
                                       "This augmentation increases the player's hacking experience gain rate by 40%.");
    NeuralRetentionEnhancement.addToFactions(["CyberSec", "NiteSec"]);
    AddToAugmentations(NeuralRetentionEnhancement);
    
    var DataJack = new Augmentation("DataJack");
    DataJack.setRequirements(200000, 75000000);
    DataJack.setInfo("A brain implant that provides an interface for direct, wireless communication between a computer's main " + 
                     "memory and the mind. This implant allows the user to not only access a computer's memory, but also alter " + 
                     "and delete it.<br><br>" + 
                     "This augmentation increases the amount of money the player gains from hacking by 20%");
    DataJack.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "Chongqing", "New Tokyo"]);
    AddToAugmentations(DataJack);
    
    var ENM = new Augmentation("Embedded Netburner Module");
    ENM.setRequirements(20000, 100000000);
    ENM.setInfo("A thin device embedded inside the arm containing a wireless module capable of connecting " + 
                "to nearby networks. Once connected, the Netburner Module is capable of capturing and " + 
                "processing all of the traffic on that network. By itself, the Embedded Netburner Module does " + 
                "not do much, but a variety of very powerful upgrades can be installed that allow you to fully " +
                "control the traffic on a network.<br><br>" + 
                "This augmentation increases the player's hacking skill by 2%");
    ENM.addToFactions(["BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp", 
                      "Fulcrum Secret Technologies", "NWO", "Blade Industries"]);
    AddToAugmentations(ENM);
    
    var ENMCore = new Augmentation("Embedded Netburner Module Core Implant");
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
    AddToAugmentations(ENMCore);
    
    var ENMCoreV2 = new Augmentation("Embedded Netburner Module Core V2 Upgrade");
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
    AddToAugmentations(ENMCoreV2);
    
    var ENMCoreV3 = new Augmentation("Embedded Netburner Module Core V3 Upgrade");
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
    AddToAugmentations(ENMCoreV3);
    
    var ENMAnalyzeEngine = new Augmentation("Embedded Netburner Module Analyze Engine");
    ENMAnalyzeEngine.setRequirements(700000, 1000000000);
    ENMAnalyzeEngine.setInfo("Installs the Analyze Engine for the Embedded Netburner Module, which is a CPU cluster " + 
                             "that vastly outperforms the Netburner Module's native single-core processor.<br><br>" + 
                             "This augmentation increases the player's hacking speed by 10%.");
    ENMAnalyzeEngine.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                                   "Daedalus", "The Covenant", "Illuminati"]);
    AddToAugmentations(ENMAnalyzeEngine);
    
    var ENMDMA = new Augmentation("Embedded Netburner Module Direct Memory Access Upgrade");
    ENMDMA.setRequirements(750000, 1100000000);
    ENMDMA.setInfo("This implant installs a Direct Memory Access (DMA) controller into the " + 
                   "Embedded Netburner Module. This allows the Module to send and receive data " + 
                   "directly to and from the main memory of devices on a network.<br><br>" + 
                   "This augmentation: <br>" + 
                   "Increases the amount of money the player gains from hacking by 50%<br>"  +
                   "Increases the player's chance of successfully performing a hack by 20%");            
    ENMDMA.addToFactions(["ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
                         "Daedalus", "The Covenant", "Illuminati"]);
    AddToAugmentations(ENMDMA);
    
    var Neuralstimulator = new Augmentation("Neuralstimulator");
    Neuralstimulator.setRequirements(120000, 600000000);
    Neuralstimulator.setInfo("A cranial implant that intelligently stimulates certain areas of the brain " + 
                             "in order to improve cognitive functions<br><br>" + 
                             "This augmentation:<br>" + 
                             "Increases the player's hacking speed by 1%<br>" + 
                             "Increases the player's chance of successfully performing a hack by 10%<br>" + 
                             "Increases the player's hacking experience gain rate by 20%");
    Neuralstimulator.addToFactions(["The Black Hand", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                   "Ishima", "Volhaven", "Bachman & Associates", "Clarke Incorporated", 
                                   "Four Sigma"]);
    AddToAugmentations(Neuralstimulator);
    
    //Work Augmentations
    var NuoptimalInjectorImplant = new Augmentation("Nuoptimal Nootropic Injector Implant");
    NuoptimalInjectorImplant.setRequirements(12000, 30000000);
    NuoptimalInjectorImplant.setInfo("This torso implant automatically injects nootropic supplements into " + 
                                     "the bloodstream to improve memory, increase focus, and provide other " + 
                                     "cognitive enhancements.<br><br>" + 
                                     "This augmentation increases the amount of reputation the player gains " + 
                                     "when working for a company by 10%.");
    NuoptimalInjectorImplant.addToFactions(["Tian Di Hui", "Volhaven", "New Tokyo", "Chongqing", "Ishima",
                                           "Clarke Incorporated", "Four Sigma", "Bachman & Associates"]);
    AddToAugmentations(NuoptimalInjectorImplant);
    
    var SpeechEnhancement = new Augmentation("Speech Enhancement");
    SpeechEnhancement.setRequirements(5000, 4000000);
    SpeechEnhancement.setInfo("An advanced neural implant that improves your speaking abilities, making " + 
                              "you more convincing and likable in conversations and overall improving your " +
                              "social interactions.<br><br>" + 
                              "This augmentation:<br>" +
                              "Increases the player's charisma by 5%<br>" +
                              "Increases the amount of reputation the player gains when working for a company by 5%");
    SpeechEnhancement.addToFactions(["Tian Di Hui", "Speakers for the Dead", "Four Sigma", "KuaiGong International",
                                    "Clarke Incorporated", "Four Sigma", "Bachman & Associates"]);
    AddToAugmentations(SpeechEnhancement);
    
    var FocusWire = new Augmentation("FocusWire"); //Stops procrastination
    FocusWire.setRequirements(100000, 200000000);
    FocusWire.setInfo("A cranial implant that stops procrastination by blocking specific neural pathways " + 
                      "in the brain.<br><br>" + 
                      "This augmentation: <br>" + 
                      "Increases all experience gains by 10%<br>" +
                      "Increases the amount of money the player gains from working by 5%<br>" + 
                      "Increases the amount of reputation the player gains when working for a company by 5%");
    FocusWire.addToFactions(["Bachman & Associates", "Clarke Incorporated", "Four Sigma", "KuaiGong International"]);
    AddToAugmentations(FocusWire)
    
    var PCDNI = new Augmentation("PC Direct-Neural Interface");
    PCDNI.setRequirements(400000, 650000000);
    PCDNI.setInfo("Installs a Direct-Neural Interface jack into your arm that is compatible with most " + 
                  "computers. Connecting to a computer through this jack allows you to interface with " +
                  "it using the brain's electrochemical signals.<br><br>" + 
                  "This augmentation:<br>" +
                  "Increases the amount of reputation the player gains when working for a company by 10%<br>" + 
                  "Increases the player's hacking skill by 10%");
    PCDNI.addToFactions(["Four Sigma", "OmniTek Incorporated", "ECorp", "Blade Industries"]);
    AddToAugmentations(PCDNI);
    
    var PCDNIOptimizer = new Augmentation("PC Direct-Neural Interface Optimization Submodule");
    PCDNIOptimizer.setRequirements(500000, 875000000);
    PCDNIOptimizer.setInfo("This is a submodule upgrade to the PC Direct-Neural Interface augmentation. It " + 
                           "improves the performance of the interface and gives the user more control options " +
                           "to the connected computer.<br><br>" + 
                           "This augmentation:<br>" + 
                           "Increases the amount of reputation the player gains when working for a company by 20%<br>" + 
                           "Increases the player's hacking skill by 20%");
    PCDNIOptimizer.addToFactions(["Fulcrum Secret Technologies", "ECorp", "Blade Industries"]);
    AddToAugmentations(PCDNIOptimizer);
    
    var PCDNINeuralNetwork = new Augmentation("PC Direct-Neural Interface NeuroNet Injector");
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
    AddToAugmentations(PCDNINeuralNetwork);
    
    
    //HacknetNode Augmentations
    var HacknetNodeCPUUpload = new Augmentation("Hacknet Node CPU Architecture Neural-Upload");
    HacknetNodeCPUUpload.setRequirements(15000, 12000000);
    HacknetNodeCPUUpload.setInfo("Uploads the architecture and design details of a Hacknet Node's CPU into " + 
                                 "the brain. This allows the user to engineer custom hardware and software  " +
                                 "for the Hacknet Node that provides better performance.<br><br>" + 
                                 "This augmentation:<br>" + 
                                 "Increases the amount of money produced by Hacknet Nodes by 15%<br>" + 
                                 "Decreases the cost of purchasing a Hacknet Node Core by 10%");
    HacknetNodeCPUUpload.addToFactions(["Netburners"]);
    AddToAugmentations(HacknetNodeCPUUpload);
    
    var HacknetNodeCacheUpload = new Augmentation("Hacknet Node Cache Architecture Neural-Upload");
    HacknetNodeCacheUpload.setRequirements(6000, 6000000);
    HacknetNodeCacheUpload.setInfo("Uploads the architecture and design details of a Hacknet Node's main-memory cache " + 
                                   "into the brain. This allows the user to engineer custom cache hardware for the  " + 
                                   "Hacknet Node that offers better performance.<br><br>" + 
                                   "This augmentation:<br> " + 
                                   "Increases the amount of money produced by Hacknet Nodes by 10%<br>" + 
                                   "Decreases the cost of leveling up a Hacknet Node by 10%");
    HacknetNodeCacheUpload.addToFactions(["Netburners"]);
    AddToAugmentations(HacknetNodeCacheUpload);
    
    var HacknetNodeNICUpload = new Augmentation("HacknetNode NIC Architecture Neural-Upload");
    HacknetNodeNICUpload.setRequirements(2000, 2000000);
    HacknetNodeNICUpload.setInfo("Uploads the architecture and design details of a Hacknet Node's Network Interface Card (NIC) " + 
                                 "into the brain. This allows the user to engineer a custom NIC for the Hacknet Node that " + 
                                 "offers better performance.<br><br>" + 
                                 "This augmentation:<br>" + 
                                 "Increases the amount of money produced by Hacknet Nodes by 5%<br>" + 
                                 "Decreases the cost of purchasing a Hacknet Node by 5%");
    HacknetNodeNICUpload.addToFactions(["Netburners"]);
    AddToAugmentations(HacknetNodeNICUpload);
    
    var HacknetNodeKernelDNI = new Augmentation("Hacknet Node Kernel Direct-Neural Interface");
    HacknetNodeKernelDNI.setRequirements(25000, 30000000);
    HacknetNodeKernelDNI.setInfo("Installs a Direct-Neural Interface jack into the arm that is capable of connecting to a " + 
                                 "Hacknet Node. This lets the user access and manipulate the Node's kernel using the mind's " + 
                                 "electrochemical signals.<br><br>" + 
                                 "This augmentation increases the amount of money produced by Hacknet Nodes by 50%.");
    HacknetNodeKernelDNI.addToFactions(["Netburners"]);
    AddToAugmentations(HacknetNodeKernelDNI);
    
    var HacknetNodeCoreDNI = new Augmentation("Hacknet Node Core Direct-Neural Interface");
    HacknetNodeCoreDNI.setRequirements(40000, 50000000);
    HacknetNodeCoreDNI.setInfo("Installs a Direct-Neural Interface jack into the arm that is capable of connecting " +
                               "to a Hacknet Node. This lets the user access and manipulate the Node's processing logic using " + 
                               "the mind's electrochemical signals.<br><br>" + 
                               "This augmentation increases the amount of money produced by Hacknet Nodes by 75%.");
    HacknetNodeCoreDNI.addToFactions(["Netburners"]);
    AddToAugmentations(HacknetNodeCoreDNI);
    
    //Misc augmentations
    var Neurotrainer1 = new Augmentation("Neurotrainer I");
    Neurotrainer1.setRequirements(3000, 3000000);
    Neurotrainer1.setInfo("A decentralized cranial implant that improves the brain's ability to learn. It is " + 
                          "installed by releasing millions of nanobots into the human brain, each of which " + 
                          "attaches to a different neural pathway to enhance the brain's ability to retain " + 
                          "and retrieve information.<br><br>" + 
                          "This augmentation increases the player's experience gain rate for all stats by 5%");
    Neurotrainer1.addToFactions(["CyberSec"]);
    AddToAugmentations(Neurotrainer1);
    
    var Neurotrainer2 = new Augmentation("Neurotrainer II");
    Neurotrainer2.setRequirements(16000, 20000000);
    Neurotrainer2.setInfo("A decentralized cranial implant that improves the brain's ability to learn. This " + 
                          "is a more powerful version of the Neurotrainer I augmentation, but it does not " + 
                          "require Neurotrainer I to be installed as a prerequisite.<br><br>" + 
                          "This augmentation increases the player's experience gain rate for all stats by 10%");
    Neurotrainer2.addToFactions(["BitRunners", "NiteSec"]);
    AddToAugmentations(Neurotrainer2);
    
    var Neurotrainer3 = new Augmentation("Neurotrainer III");
    Neurotrainer3.setRequirements(40000, 100000000);
    Neurotrainer3.setInfo("A decentralized cranial implant that improves the brain's ability to learn. This " +
                          "is a more powerful version of the Neurotrainer I and Neurotrainer II augmentation, " + 
                          "but it does not require either of them to be installed as a prerequisite.<br><br>" + 
                          "This augmentation increases the player's experience gain rate for all stats by 20%");
    Neurotrainer3.addToFactions(["NWO", "Four Sigma"]);
    AddToAugmentations(Neurotrainer3);
    
    var Hypersight = new Augmentation("HyperSight Corneal Implant");
    Hypersight.setInfo("A bionic eye implant that grants sight capabilities far beyond those of a natural human. " +
                       "Embedded circuitry within the implant provides the ability to detect heat and movement " +
                       "through solid objects such as wells, thus providing 'x-ray vision'-like capabilities.<br><br>" + 
                       "This augmentation: <br>" + 
                       "Increases the player's dexterity by 50%<br>" + 
                       "Increases the player's hacking speed by 1%<br>" + 
                       "Increases the amount of money the player gains from hacking by 10%");
    Hypersight.setRequirements(120000, 650000000);
    Hypersight.addToFactions(["Blade Industries", "KuaiGong International"]);
    AddToAugmentations(Hypersight);
}

applyAugmentation = function(aug, faction) {
    if (aug.owned) {
        throw new Error("This Augmentation is already owned/applied...somethings wrong");
        return;
    }
    
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
        case "BitWire":
            Player.hacking_mult   *= 1.05;
            break;
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
        
        //Hacknet Node Augmentations
        case "Hacknet Node CPU Architecture Neural-Upload":
            Player.hacknet_node_money_mult            *= 1.15;
            Player.hacknet_node_purchase_cost_mult    *= 0.90;
            break;
        case "Hacknet Node Cache Architecture Neural-Upload":
            Player.hacknet_node_money_mult            *= 1.10;
            Player.hacknet_node_level_cost_mult       *= 0.90;
            break;
        case "HacknetNode NIC Architecture Neural-Upload":
            Player.hacknet_node_money_mult            *= 1.05;
            Player.hacknet_node_purchase_cost_mult    *= 0.95;
            break;
        case "Hacknet Node Kernel Direct-Neural Interface":
            Player.hacknet_node_money_mult            *= 1.50;
            break;
        case "Hacknet Node Core Direct-Neural Interface":
            Player.hacknet_node_money_mult            *= 1.75;
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