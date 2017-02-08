//Augmentations
function Augmentation(name) {
	this.name = name;
    this.info = "";
	this.owned = false;	//Whether the player has it (you can only have each augmentation once)
	this.description = "";
}

Augmentation.prototype.setDescription(desc) {
	this.description = desc;
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
	AddToAugmentations(Targeting1);
	
	var Targeting2 = new Augmentation("Augmented Targeting II");
	AddToAugmentations(Targeting2);
	
	var Targeting3 = new Augmentation("Augmented Targeting III");
	AddToAugmentations(Targeting3);
	
	var SyntheticHeart = new Augmentation("Synthetic Heart");
	AddToAugmentations(SyntheticHeart);
    
	var SynfibrilMuscle = new Augmentation("Synfibril Muscle");
	AddToAugmentations(SynfibrilMuscle)
	
	var CombatRib1 = new Augmentation("Combat Rib I");
	AddToAugmentations(CombatRib1);
	
	var CombatRib2 = new Augmentation("Combat Rib II");
	AddToAugmentations(CombatRib2);
	
	var CombatRib3 = new Augmentation("Combat Rib III");
	AddToAugmentations(CombatRib3);
	
	var NanofiberWeave = new Augmentation("Nanofiber Weave");
	AddToAugmentations(NanofiberWeave);
	
	var SubdermalArmor = new Augmentation("NEMEAN Subdermal Weave");
	AddToAugmentations(SubdermalArmor);
	
	var WiredReflexes = new Augmentation("Wired Reflexes");
	AddToAugmentations(WiredReflexes);
	
	var GrapheneBoneLacings = new Augmentation("Graphene Bone Lacings");
	AddToAugmentations(GrapheneBoneLacings);
	
	var BionicSpine = new Augmentation("Bionic Spine");
	AddToAugmentations(BionicSpine);
	
	var GrapheneBionicSpine = new Augmentation("Graphene Bionic Spine Upgrade");
	AddToAugmentations(GrapheneBionicSpine);
    
    var BionicLegs = new Augmentation("Bionic Legs");
    AddToAugmentations(BionicLegs);
    
    var GrapheneBionicLegs = new Augmentation("PC Direct-Neural Interface NeuroNet Injector");
    AddToAugmentations(GrapheneBionicLegs);
	
	//Labor stat augmentations
	var SpeechProcessor = new Augmentation("Speech Processor Implant"); //Cochlear imlant?
	AddToAugmentations(SpeechProcessor);
	
	var EnhancedSocialInteractionImplant = new Augmentation("Enhanced Social Interaction Implant");
	AddToAugmentations(EnhancedSocialInteractionImplant);
	
	//Hacking augmentations
	var ArtificialBioNeuralNetwork = new Augmentation("Artificial Bio-neural Network Implant");
	AddToAugmentations(ArtificialBioNeuralNetwork);
	
	var ArtificialSynapticPotentiation = new Augmentation("Artificial Synaptic Potentiation");
	AddToAugmentations(ArtificialSynapticPotentiation);
    
    var EnhancedMyelinSheathing = new Augmentation("Enhanced Myelin Sheating");
    AddToAugmentations(EnhancedMyelinSheathing);
	
	var SynapticEnhancement = new Augmentation("Synaptic Enhancement Implant");
	AddToAugmentations(SynapticEnhancement);
	
	var NeuralRetentionEnhancement = new Augmentation("Neural-Retention Enhancement");
	AddToAugmentations(NeuralRetentionEnhancement);
	
	var DataJack = new Augmentation("DataJack");
	AddToAugmentations(DataJack);
	
	var ENM = new Augmentation("Embedded Netburner Module");
	AddToAugmentations(ENM);
	
	var ENMCore = new Augmentation("Embedded Netburner Module Core Implant");
	AddToAugmentations(ENMCore);
	
	var ENMCoreV2 = new Augmentation("Embedded Netburner Module Core V2 Upgrade");
	AddToAugmentations(ENMCoreV2);
	
	var ENMCoreV3 = new Augmentation("Embedded Netburner Module Core V3 Upgrade");
	AddToAugmentations(ENMCoreV3);
	
	var ENMAnalyzeEngine = new Augmentation("Embedded Netburner Module Analyze Engine");
	AddToAugmentations(ENMAnalyzeEngine);
	
	var ENMDMA = new Augmentation("Embedded Netburner Module Direct Memory Access Upgrade");
	AddToAugmentations(ENMDMA);
	
	var Neuralstimulator = new Augmentation("Neuralstimulator");
	AddToAugmentations(Neuralstimulator);
    
    var PCDNINeuralNetwork = new Augmentation("PC Direct-Neural Interface NeuroNet Injector");
    AddToAugmentations(PCDNINeuralNetwork);
	
    //Work Augmentations
    var NuoptimalInjectorImplant = new Augmentation("Nuoptimal Nootropic Injector Implant");
    AddToAugmentations(NuoptimalInjectorImplant);
    
    var SpeechEnhancement = new Augmentation("Speech Enhancement");
    AddToAugmentations(SpeechEnhancement);
    
    var FocusWire = new Augmentation("FocusWire"); //Stops procrastination
    AddToAugmentations(FocusWire)
    
    var PCDNI = new Augmentation("PC Direct-Neural Interface");
    AddToAugmentations(PCDNI);
    
    var PCDNIOptimizer = new Augmentation("PC Direct-Neural Interface Optimization Submodule");
    AddToAugmentations(PCDNIOptimizer);
    
	//Misc augmentations
    var Neurotrainer1 = new Augmentation("Neurotrainer I");
    AddToAugmentations(Neurotrainer1);
    
    var Neurotrainer2 = new Augmentation("Neurotrainer II");
    AddToAugmentations(Neurotrainer2);
    
    var Neurotrainer3 = new Augmentation("Neurotrainer III");
    AddToAugmentations(Neurotrainer3);
    
    var Hypersight = new Augmentation("HyperSight Corneal Implant");
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
			//Agi and Str 10%
			break;
		case "Synfibril Muscle":
			//Strength and Defense 10%
			break;
		case "Combat Rib I":
			//Str and Defense 5%
			break;
		case "Combat Rib II":
			break;
		case "Combat Rib III":
			break;
		case "Nanofiber Weave":
			//str + Defense 10%
			break;
		case "NEMEAN Subdermal Weave":
			//Defense 10%
			break;
		case "Wired Reflexes":
			//Agility 10%
			break;
		case "Graphene Bone Lacings":
			//Strength defense 15%
			break;
		case "Bionic Spine":
			//Everything 3%?
			break;
		case "Graphene Bionic Spine Upgrade":
			//Everything 5%
			break;
        case "Bionic Legs":
            //Agi
            break;
        case "PC Direct-Neural Interface NeuroNet Injector":
            //Agi
            break;
			
		//Labor stats augmentations
		case "Enhanced Social Interaction Implant":
			//Charisma 10%
			break;
		case "Speech Processor Implant":
			//Charisma 5%
			break;

		//Hacking augmentations
		case "Artificial Bio-neural Network Implant":
			//Hacking speed and money gained 10%
			break;
		case "Artificial Synaptic Potentiation":
			//Hacking speed 15%
			break;
        case "Enhanced Myelin Sheating":
            //Hacking speed and exp gain 10%
            break;
		case "Synaptic Enhancement Implant":
			//Hacking speed 5%
			break;
		case "Neural-Retention Enhancement":
			//Gain 10% more hacking exp
			break;
		case "DataJack":
			//5% more money from hacking
			break;
		case "Embedded Netburner Module":
			//Doesn't give anyhting itself but allows user to install
			//ENM upgrades in the future, which are very powerful
			break;
		case "Embedded Netburner Module Core Implant":
			//Hacking speed, money gained, and exp gained 5%
			break;
		case "Embedded Netburner Module Core V2 Upgrade":
			//Hacking speed, money gained, and exp gained 10%
			break;
		case "Embedded Netburner Module Core V3 Upgrade":
			//Hacking speed, money gained, and exp gained 15%
			break;
		case "Embedded Netburner Module Analyze Engine":
			//Hacking speed 20%
			break;
		case "Embedded Netburner Module Direct Memory Access Upgrade":
			//Money hacked 20%
			break;
		case "Neuralstimulator":
			//Hacking speed, money gained, and exp gained 10%
			break;
        case "PC Direct-Neural Interface NeuroNet Injector":
            //Hacking speed increases
            break;
            
        //Work augmentations
        case "Nuoptimal Nootropic Injector Implant":
            //Increase in gains for software, IT, and Business jobs
            break;
        case "Speech Enhancement":
            //Increase in business jobs and reputation gained
            break;
        case "FocusWire":
            //Increase in all gains and reputation gained
            break;
        case "PC Direct-Neural Interface":
            //Allows people to directly communicate interface with PCs..which helps with Software and IT jobs
            break;
        case "PC Direct-Neural Interface Optimization Submodule":
            //Allows u to better optimize code/pc when connecting with PC DNI..helps with software/IT jobs
            break;
        
        //Misc augmentations
        case "Neurotrainer I":
            //Increase all exp gains
            break;
        case "Neurotrainer II":
            //Increase all exp gains
            break;
        case "Neurotrainer III":
            //Increase all exp gains
            break;
        case "HyperSight Corneal Implant":
            //Increases sight..which increases dex..hacking speed + money?
            break;
		
		default:
			console.log("No such augmentation!");
			break;
	}
}