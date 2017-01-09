//Netburner Faction class
function Faction(name) {
	this.name 				= name;
    this.augmentations 		= [];
	this.information 		= "";	//Introductory/informational text about the faction
    
    //Player-related properties for faction
	this.isMember 			= false; 	//Whether player is member
    this.playerReputation 	= 0;  		//"Reputation" within faction
};

Faction.prototype.setAugmentations = function(augs) {
	for (var i = 0; i < augs.length; i++) {
		this.augmentations.push(augs[i]);
	}
}

Faction.prototype.setInformation(info) {
	this.information = info;
}

Faction.prototype.toJSON = function() {
	return Generic_toJSON("Faction", this);
}

Faction.fromJSON = function(value) {
	return Generic_fromJSON(Faction, value.data);
}

Reviver.constructors.Faction = Faction;

//Map of factions indexed by faction name
Factions = {}

AddToFactions = function(faction) {
	var name = faction.name;
	Factions[name] = faction;
}

//TODO Add faction information
initFactions = function() {
	//Endgame
	var Illuminati 				= new Faction("Illuminati");
	AddToFactions(Illuminati);
	var Daedalus 				= new Faction("Daedalus");
	AddToFactions(Daedalus);
	var Covenant 				= new Faction("The Covenant");
	AddToFactions(Covenant);
	
	//Megacorporations, each forms its own faction
	var ECorp 					= new Faction("ECorp");
	AddToFactions(ECorp);
	var MegaCorp 				= new Faction("MegaCorp");
	AddToFactions(MegaCorp);
	var BachmanAndAssociates 	= new Faction("Bachman & Associates");
	AddToFactions(BachmanAndAssociates);
	var BladeIndustries 		= new Faction("Blade Industries");
	AddToFactions(BladeIndustries);
	var NWO 					= new Faction("NWO");
	AddToFactions(NWO);
	var ClarkeIncorporated 		= new Faction("Clarke Incorporated");
	AddToFactions(ClarkeIncorporated);
	var OmniTekIncorporated 	= new Faction("OmniTek Incorporated");
	AddToFactions(OmniTekIncorporated);
	var FourSigma 				= new Faction("Four Sigma");
	AddToFactions(FourSigma);
	var KuaiGongInternational 	= new Faction("KuaiGong International");
	AddToFactions(KuaiGongInternational);
	
	//Hacker groups
	var BitRunners 				= new Faction("BitRunners");
	AddToFactions(BitRunners);
	var BlackHand				= new Faction("The Black Hand");
	AddToFactions(BlackHand);
	var NiteSec 				= new Faction("NiteSec");
	AddToFactions(NiteSec);
	
	//City factions, essentially governments
	var Chongqing 				= new Faction("Chongqing");
	AddToFactions(Chongqing);
	var Sector12 				= new Faction("Sector-12");
	AddToFactions(Sector12);
	var HongKong				= new Faction("New Tokyo");
	AddToFactions(HongKong);
	var Aevum 				    = new Faction("Aevum");
	AddToFactions(Aevum);
    var Ishima                 	= new Faction("Ishima");
	AddToFactions(Ishima);
	var Volhaven 				= new Faction("Volhaven");
	AddToFactions(Volhaven);
	
	//Criminal Organizations/Gangs
	var SpeakersForTheDead		= new Faction("Speakers for the Dead"); 
	AddToFactions(SpeakersForTheDead);
	var DarkArmy				= new Faction("The Dark Army");
	AddToFactions(DarkArmy);
	var TheSyndicate 			= new Faction("The Syndicate");
	AddToFactions(TheSyndicate);
	
	//Earlygame factions - factions the player will prestige with early on that don't
	//belong in other categories
	var TianDiHui				= new Faction("Tian Di Hui");	//Society of the Heaven and Earth
	AddToFactions(TianDiHui);
	var CyberSec 				= new Faction("CyberSec");
	AddToFactions(CyberSec);
}

//Displays the HTML content for this faction
displayFactionContent = function(faction) {
	var hackDiv 			= document.getElementById("faction-hack-div");
	var fieldWorkDiv 		= document.getElementById("faction-fieldwork-div");
	var securityWorkDiv 	= document.getElementById("faction-securitywork-div");
	
	var hackButton 			= document.getElementById("faction-hack-button");
	var fieldWorkButton 	= document.getElementById("faction-fieldwork-button");
	var securityWorkButton 	= document.getElementById("faction-securitywork-button");
	
	//TODO Add event listeners for the buttons
	
	if (faction.isMember) {
		switch(faction.name) {
			case "Illuminati":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "hidden";
				break;
			case "Daedalus":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "hidden";
				break;
			case "The Covenant":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "hidden";
				break;
			case "ECorp":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "MegaCorp":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Bachman & Associates":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Blade Industries":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "NWO":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Clarke Incorporated":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "OmniTek Incorporated":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Four Sigma":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "KuaiGong International":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "BitRunners":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "hidden";
				securityWorkDiv.style.visibility = "hidden";
				break;
			case "The Black Hand":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "hidden";
				break;
			case "NiteSec":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "hidden";
				securityWorkDiv.style.visibility = "hidden";
				break;
			case "Chongqing":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Sector-12":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "New Tokyo":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Aevum":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Ishima":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Volhaven":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Speakers for the Dead":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "The Dark Army":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "hidden";
				break;
			case "The Syndicate":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "visible";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "Tian Di Hui":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "hidden";
				securityWorkDiv.style.visibility = "visible";
				break;
			case "CyberSec":
				hackDiv.style.visibility = "visible";
				fieldWorkDiv.style.visibility = "hidden";
				securityWorkDiv.style.visibility = "hidden";
				break;
			default:
				console.log("Faction does not exist");
				break;
		}
	} else {
		console.log("Not a member of this faction, cannot display faction information");
	}
}