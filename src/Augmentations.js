//Augmentations
function Augmentation(name) {
	this.name = name;
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
	var Targeting1 = new Augmentation("Targeting I");
	AddToAugmentations(Targeting1);
	
	var Targeting2 = new Augmentation("Targeting II");
	AddToAugmentations(Targeting2);
	
	var Targeting3 = new Augmentation("Targeting III");
	AddToAugmentations(Targeting3);
	
	var SyntheticHeart = new Augmentation("Synthetic Heart");
	AddToAugmentations(SyntheticHeart);
	
	var MicrofibralMuscle = new Augmentation("Microfibral Muscle");
	AddToAugmentations(MicrofibralMuscle)
	
	var CombatStrength1 = new Augmentation("Combat Strength I");
	AddToAugmentations(CombatStrength1);
	
	var CombatStrength2 = new Augmentation("Combat Strength II");
	AddToAugmentations(CombatStrength2);
	
	var CombatStrength3 = new Augmentation("Combat Strength III");
	AddToAugmentations(CombatStrength3);
	
	var NanofiberWeave = new Augmentation("Nanofiber Weave");
	AddToAugmentations(NanofiberWeave);
	
	var SubdermalArmor = new Augmentation("Subdermal Armor");
	AddToAugmentations(SubdermalArmor);
	
	var WiredReflexes = new Augmentation("Wired Reflexes");
	AddToAugmentations(WiredReflexes);
	
	var GrapheneBoneLacings = new Augmentation("Graphene Bone Lacings");
	AddToAugmentations(GrapheneBoneLacings);
	
	var BionicSpine = new Augmentation("Bionic Spine");
	AddToAugmentations(BionicSpine);
	
	var GrapheneBionicSpine = new Augmentation("Graphene Bionic Spine");
	AddToAugmentations(GrapheneBionicSpine);
	
	//Labor stat augmentations
	var SpeechProcessor = new Augmentation("Speech Processor Implant");
	AddToAugmentations(SpeechProcessor);
	
	var CASIE = new Augmentation("Computer Assisted Social Interaction Enhancement");
	AddToAugmentations(CASIE);
	
	//Hacking augmentations
	var ArtificialBioNeuralNetwork = new Augmentation("Artificial Bio-neural Network Implant");
	AddToAugmentations(ArtificialBioNeuralNetwork);
	
	var ArtificialSynapticPotentiation = new Augmentation("Artificial Synaptic Potentiation");
	AddToAugmentations(ArtificialSynapticPotentiation);
	
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
	
	//Misc augmentations
}

applyAugmentations = function(aug) {
	switch(aug.name) {
		//Combat stat augmentations
		case "Targeting I":
			//Dex 5%
			break;
		case "Targeting II":
			//Dex 5% 
			break;
		case "Targeting III":
			//Dex 5%
			break;
		case "Synthetic Heart":
			//Agi and Str 10%
			break;
		case "Microfibral muscle":
			//Strength and Defense 10%
			break;
		case "Combat Strength I":
			//Str and Defense 5%
			break;
		case "Combat Strength II":
			break;
		case "Combat Strength III":
			break;
		case "Nanofiber Weave":
			//str + Defense 10%
			break;
		case "Subdermal Armor":
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
		case "Graphene Bionic Spine":
			//Everything 5%
			break;
			
		//Labor stats augmentations
		case "Computer Assisted Social Interaction Enhancement":
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
		
		default:
			console.log("No such augmentation!");
			break;
	}
}