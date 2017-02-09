//Augmentations
function Augmentation(name) {
	this.name = name;
    this.info = "";
	this.owned = false;	//Whether the player has it (you can only have each augmentation once)
}

Augmentation.prototype.setInfo(inf) {
	this.info = inf;
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
//TODO SOmething that increases rate at which you gain faction respect
//		Similarly. something that helps you gain company reputation
initAugmentations = function() {
	//Combat stat augmentations
	var Targeting1 = new Augmentation("Augmented Targeting I");
	Targeting1.addToFactions("The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
							 "OmniTek Incorporated", "KuaiGong International", "Blade Industries");
	AddToAugmentations(Targeting1);
	
	var Targeting2 = new Augmentation("Augmented Targeting II");
	Targeting2.addToFactions("The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
							 "OmniTek Incorporated", "KuaiGong International", "Blade Industries");
	AddToAugmentations(Targeting2);
	
	var Targeting3 = new Augmentation("Augmented Targeting III");
	Targeting3.addToFactions("The Dark Army", "The Syndicate", "OmniTek Incorporated",
							 "KuaiGong International", "Blade Industries", "The Covenant");
	AddToAugmentations(Targeting3);
	
	var SyntheticHeart = new Augmentation("Synthetic Heart");
	SyntheticHeart.addToFactions("KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
								 "NWO", "The Covenant", "Daedalus", "Illuminati");
	AddToAugmentations(SyntheticHeart);
    
	var SynfibrilMuscle = new Augmentation("Synfibril Muscle");
	SynfibrilMuscle.addToFactions("KuaiGong International", "Fulcrum Secret Technologies", "Speakers for the Dead",
								  "NWO", "The Covenant", "Daedalus", "Illuminati", "Blade Industries");
	AddToAugmentations(SynfibrilMuscle)
	
	var CombatRib1 = new Augmentation("Combat Rib I");
	CombatRib1.addToFactions("The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
							 "OmniTek Incorporated", "KuaiGong International", "Blade Industries");
	AddToAugmentations(CombatRib1);
	
	var CombatRib2 = new Augmentation("Combat Rib II");
	CombatRib2.addToFactions("The Dark Army", "The Syndicate", "Sector-12", "Volhaven", "Ishima",
							 "OmniTek Incorporated", "KuaiGong International", "Blade Industries");
	AddToAugmentations(CombatRib2);
	
	var CombatRib3 = new Augmentation("Combat Rib III");
	CombatRib3.addToFactions("The Dark Army", "The Syndicate", "OmniTek Incorporated",
							 "KuaiGong International", "Blade Industries", "The Covenant");
	AddToAugmentations(CombatRib3);
	
	var NanofiberWeave = new Augmentation("Nanofiber Weave");
	NanofiberWeave.addToFactions("Tian Di Hui", "The Syndicate", "The Dark Army", "Speakers for the Dead",
								 "Blade Industries", "Fulcrum Secret Technologies", "OmniTek Incorporated");
	AddToAugmentations(NanofiberWeave);
	
	var SubdermalArmor = new Augmentation("NEMEAN Subdermal Weave");
	SubdermalArmor.addToFactions("The Syndicate", "Fulcrum Secret Technologies", "Illuminati", "Daedalus",
								 "The Covenant");
	AddToAugmentations(SubdermalArmor);
	
	var WiredReflexes = new Augmentation("Wired Reflexes");
	WiredReflexes.addToFactions("Tian Di Hui", "Sector-12", "Volhaven", "Aevum", "Ishima", 
								"The Syndicate", "The Dark Army", "Speakers for the Dead");
	AddToAugmentations(WiredReflexes);
	
	var GrapheneBoneLacings = new Augmentation("Graphene Bone Lacings");
	GrapheneBoneLacings.addToFactions("Fulcrum Secret Technologies", "The Covenant");
	AddToAugmentations(GrapheneBoneLacings);
	
	var BionicSpine = new Augmentation("Bionic Spine");
	BionicSpine.addToFactions("Speakers for the Dead", "The Syndicate", "KuaiGong International",
							  "OmniTek Incorporated", "Blade Industries");
	AddToAugmentations(BionicSpine);
	
	var GrapheneBionicSpine = new Augmentation("Graphene Bionic Spine Upgrade");
	GrapheneBionicSpine.addToFactions("Fulcrum Secret Technologies", "ECorp");
	AddToAugmentations(GrapheneBionicSpine);
    
    var BionicLegs = new Augmentation("Bionic Legs");
	BionicLegs.addToFactions("Speakers for the Dead", "The Syndicate", "KuaiGong International",
							 "OmniTek Incorporated", "Blade Industries");
    AddToAugmentations(BionicLegs);
    
    var GrapheneBionicLegs = new Augmentation("Graphene Bionic Legs Upgrade");
	GrapheneBionicLegs.addToFactions("MegaCorp", "ECorp", "Fulcrum Secret Technologies");
    AddToAugmentations(GrapheneBionicLegs);
	
	//Labor stat augmentations
	var SpeechProcessor = new Augmentation("Speech Processor Implant"); //Cochlear imlant?
	SpeechProcessor.addToFactions("Tian Di Hui", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
								  "Ishima", "Volhaven");
	AddToAugmentations(SpeechProcessor);
	
	var EnhancedSocialInteractionImplant = new Augmentation("Enhanced Social Interaction Implant");
	EnhancedSocialInteractionImplant.addToFactions("Bachman & Associates", "NWO", "Clarke Incorporated",
												   "OmniTek Incorporated", "Four Sigma");
	AddToAugmentations(EnhancedSocialInteractionImplant);
	
	//Hacking augmentations
	var ArtificialBioNeuralNetwork = new Augmentation("Artificial Bio-neural Network Implant");
	ArtificialBioNeuralNetwork.addToFactions("BitRunners", "Fulcrum Secret Technologies");
	AddToAugmentations(ArtificialBioNeuralNetwork);
	
	var ArtificialSynapticPotentiation = new Augmentation("Artificial Synaptic Potentiation");
	ArtificialSynapticPotentiation.addToFactions("The Black Hand", "NiteSec");
	AddToAugmentations(ArtificialSynapticPotentiation);
    
    var EnhancedMyelinSheathing = new Augmentation("Enhanced Myelin Sheating");
	EnhancedMyelinSheating.addToFactions("Fulcrum Secret Technologies", "BitRunners", "The Black Hand");
    AddToAugmentations(EnhancedMyelinSheathing);
	
	var SynapticEnhancement = new Augmentation("Synaptic Enhancement Implant");
	SynapticEnhancement.addToFactions("CyberSec");
	AddToAugmentations(SynapticEnhancement);
	
	var NeuralRetentionEnhancement = new Augmentation("Neural-Retention Enhancement");
	NeuralRetentionEnhancement.addToFactions("CyberSec", "NiteSec");
	AddToAugmentations(NeuralRetentionEnhancement);
	
	var DataJack = new Augmentation("DataJack");
	DataJack.addToFactions("BitRunners", "The Black Hand", "NiteSec", "Chongqing", "New Tokyo");
	AddToAugmentations(DataJack);
	
	var ENM = new Augmentation("Embedded Netburner Module");
	ENM.addToFactions("BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp", 
					  "Fulcrum Secret Technologies", "NWO", "Blade Industries");
	AddToAugmentations(ENM);
	
	var ENMCore = new Augmentation("Embedded Netburner Module Core Implant");
	ENMCore.addToFactions("BitRunners", "The Black Hand", "NiteSec", "ECorp", "MegaCorp", 
						  "Fulcrum Secret Technologies", "NWO", "Blade Industries");
	AddToAugmentations(ENMCore);
	
	var ENMCoreV2 = new Augmentation("Embedded Netburner Module Core V2 Upgrade");
	ENMCoreV2.addToFactions("ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
							"Blade Industries", "OmniTek Incorporated", "KuaiGong International");
	AddToAugmentations(ENMCoreV2);
	
	var ENMCoreV3 = new Augmentation("Embedded Netburner Module Core V3 Upgrade");
	ENMCoreV3.addToFactions("ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
							"Daedalus", "The Covenant", "Illuminati");
	AddToAugmentations(ENMCoreV3);
	
	var ENMAnalyzeEngine = new Augmentation("Embedded Netburner Module Analyze Engine");
	ENMCoreV3.addToFactions("ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
							"Daedalus", "The Covenant", "Illuminati");
	AddToAugmentations(ENMAnalyzeEngine);
	
	var ENMDMA = new Augmentation("Embedded Netburner Module Direct Memory Access Upgrade");
	ENMCoreV3.addToFactions("ECorp", "MegaCorp", "Fulcrum Secret Technologies", "NWO",
							"Daedalus", "The Covenant", "Illuminati");
	AddToAugmentations(ENMDMA);
	
	var Neuralstimulator = new Augmentation("Neuralstimulator");
	Neuralstimulator.addToFactions("The Black Hand", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
								   "Ishima", "Volhaven", "Bachman & Associates", "Clarke Incorporated", 
								   "Four Sigma");
	AddToAugmentations(Neuralstimulator);
    
	
    //Work Augmentations
    var NuoptimalInjectorImplant = new Augmentation("Nuoptimal Nootropic Injector Implant");
	NuoptimalInjectorImplant.addToFactions("Tian Di Hui", "Volhaven", "New Tokyo", "Chongqing", "Ishima",
										   "Clarke Incorporated", "Four Sigma", "Bachman & Associates");
    AddToAugmentations(NuoptimalInjectorImplant);
    
    var SpeechEnhancement = new Augmentation("Speech Enhancement");
	SpeechEnhancement.addToFactions("Tian Di Hui", "Speakers for the Dead", "Four Sigma", "KuaiGong International",
									"Clarke Incorporated", "Four Sigma", "Bachman & Associates");
    AddToAugmentations(SpeechEnhancement);
    
    var FocusWire = new Augmentation("FocusWire"); //Stops procrastination
	FocusWire.addToFactions("Bachman & Associates", "Clarke Incorporated", "Four Sigma", "KuaiGong International");
    AddToAugmentations(FocusWire)
    
    var PCDNI = new Augmentation("PC Direct-Neural Interface");
	PCDNI.addToFactions("Four Sigma", "OmniTek Incorporated", "ECorp", "Blade Industries");
    AddToAugmentations(PCDNI);
    
    var PCDNIOptimizer = new Augmentation("PC Direct-Neural Interface Optimization Submodule");
	PCDNI.addToFactions("Fulcrum Secret Technologies", "ECorp", "Blade Industries");
    AddToAugmentations(PCDNIOptimizer);
	
	var PCDNINeuralNetwork = new Augmentation("PC Direct-Neural Interface NeuroNet Injector");
	PCDNI.addToFactions("Fulcrum Secret Technologies");
    AddToAugmentations(PCDNINeuralNetwork);
    
	//Misc augmentations
    var Neurotrainer1 = new Augmentation("Neurotrainer I");
	Neurotrainer1.addToFactions("CyberSec");
    AddToAugmentations(Neurotrainer1);
    
    var Neurotrainer2 = new Augmentation("Neurotrainer II");
	Neurotrainer2.addToFactions("BitRunners", "NiteSec");
    AddToAugmentations(Neurotrainer2);
    
    var Neurotrainer3 = new Augmentation("Neurotrainer III");
	Neurotrainer3.addToFactions("NWO", "Four Sigma");
    AddToAugmentations(Neurotrainer3);
    
    var Hypersight = new Augmentation("HyperSight Corneal Implant");
	Hypersight.addToFactions("Blade Industries", "KuaiGong International");
    AddToAugmentations(Hypersight);
}

applyAugmentation = function(aug) {
	switch(aug.name) {
		//Combat stat augmentations
		case "Augmented Targeting I":
			//Dex 5%
			break;
		case "Augmented Targeting II":
			//Dex 5% 
			break;
		case "Augmented Targeting III":
			//Dex 5%
			break;
		case "Synthetic Heart":
			//Agi and Str - HIGH LEVEL
			break;
		case "Synfibril Muscle":
			//Strength and Defense - MED HIGH LEVEL
			break;
		case "Combat Rib I":
			//Str and Defense 5%
			break;
		case "Combat Rib II":
			break;
		case "Combat Rib III":
			break;
		case "Nanofiber Weave":
			//str + Defense - MED LEVEL
			break;
		case "NEMEAN Subdermal Weave":
			//Defense - HIGH LEVEL
			break;
		case "Wired Reflexes":
			//Agility - Low level
			break;
		case "Graphene Bone Lacings":
			//Strength defense - HIGH level
			break;
		case "Bionic Spine":
			//Everything  - Medium level
			break;
		case "Graphene Bionic Spine Upgrade":
			//Everything - high level
			break;
        case "Bionic Legs":
            //Agi - Med level
            break;
		case "Graphene Bionic Legs Upgrade":
			//Agi - HIGH level
			break;
			
		//Labor stats augmentations
		case "Enhanced Social Interaction Implant":
			//Charisma 10% - Med high level
			break;
		case "Speech Processor Implant":
			//Charisma 5% - Med level
			break;

		//Hacking augmentations
		case "Artificial Bio-neural Network Implant":
			//Hacking speed and money gained - MED Level
			break;
		case "Artificial Synaptic Potentiation":
			//Hacking speed - MED Level
			break;
        case "Enhanced Myelin Sheating":
            //Hacking speed and exp gain - MED Level
            break;
		case "Synaptic Enhancement Implant":
			//Hacking speed - LOw level
			break;
		case "Neural-Retention Enhancement":
			//Gain 10% more hacking exp - med level
			break;
		case "DataJack":
			//5% more money from hacking - med low level
			break;
		case "Embedded Netburner Module":
			//Doesn't give anyhting itself but allows user to install
			//ENM upgrades in the future, which are very powerful
			//Med level
			break;
		case "Embedded Netburner Module Core Implant":
			//Hacking speed, money gained, and exp gained - Med level
			break;
		case "Embedded Netburner Module Core V2 Upgrade":
			//Hacking speed, money gained, and exp gained - Med High Level
			break;
		case "Embedded Netburner Module Core V3 Upgrade":
			//Hacking speed, money gained, and exp gained - High level
			break;
		case "Embedded Netburner Module Analyze Engine":
			//Hacking speed 20%  - High level
			break;
		case "Embedded Netburner Module Direct Memory Access Upgrade":
			//Money hacked 20%  - High level
			break;
		case "Neuralstimulator":
			//Hacking speed, money gained, and exp gained - Med level
			break;
        case "PC Direct-Neural Interface NeuroNet Injector":
            //Hacking speed increases
            break;
            
        //Work augmentations
        case "Nuoptimal Nootropic Injector Implant":
            //Increase in gains for software, IT, and Business jobs - Low Med Level
            break;
        case "Speech Enhancement":
            //Increase in business jobs and reputation gained - Low Level
            break;
        case "FocusWire":
            //Increase in all gains and reputation gained - Med Level
            break;
        case "PC Direct-Neural Interface":
            //Allows people to directly communicate interface with PCs..which helps with Software and IT jobs
			//Med level
            break;
        case "PC Direct-Neural Interface Optimization Submodule":
            //Allows u to better optimize code/pc when connecting with PC DNI..helps with software/IT jobs
			//High level
            break;	
		case "PC Direct-Neural Interface NeuroNet Injector":
            //Allow you to use ur brain as aneural net on a computer lol...increases everything
			//High Level
            break;
        
        //Misc augmentations
        case "Neurotrainer I":
            //Increase all exp gains - Low level
            break;
        case "Neurotrainer II":
            //Increase all exp gains - Med level
            break;
        case "Neurotrainer III":
            //Increase all exp gains - High Level
            break;
        case "HyperSight Corneal Implant":
            //Increases sight..which increases dex..hacking speed + money? - Med high level
            break;
		
		default:
			console.log("No such augmentation!");
			break;
	}
}