//Netburner Faction class
function Faction(name) {
	this.name 				= name;
    this.augmentations 		= [];   //Name of augmentation only
	this.information 		= "";	//Introductory/informational text about the faction
    
    //Player-related properties for faction
	this.isMember 			= false; 	//Whether player is member
    this.isBanned           = false;    //Whether or not player is banned from joining this faction
    this.playerReputation 	= 0;  		//"Reputation" within faction
};

Faction.prototype.setAugmentations = function(augs) {
	for (var i = 0; i < augs.length; i++) {
		this.augmentations.push(augs[i]);
	}
}

Faction.prototype.setInformation = function(info) {
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
	var NewTokyo				= new Faction("New Tokyo");
	AddToFactions(NewTokyo);
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

joinFaction = function(faction) {
	faction.isMember = true;
	
	//Add the faction to the Factions page content
	var item = document.createElement("li");
	var aElem = document.createElement("a");
	aElem.setAttribute("href", "#");
	aElem.innerHTML = faction.name;
	aElem.addEventListener("click", function() {
		displayFactionContent(faction.name);
		return false;
	});
	item.appendChild(aElem);
				
	var factionsList = document.getElementById("factions-list");
	factionsList.appendChild(item);
}

//Displays the HTML content for this faction
displayFactionContent = function(factionName) {
	var faction = Factions[factionName];
	
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
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "Daedalus":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "The Covenant":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "ECorp":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "MegaCorp":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Bachman & Associates":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Blade Industries":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "NWO":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Clarke Incorporated":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "OmniTek Incorporated":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Four Sigma":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "KuaiGong International":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "BitRunners":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "none";
				securityWorkDiv.style.display = "none";
				break;
			case "The Black Hand":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "NiteSec":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "none";
				securityWorkDiv.style.display = "none";
				break;
			case "Chongqing":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Sector-12":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "New Tokyo":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Aevum":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Ishima":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Volhaven":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Speakers for the Dead":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "The Dark Army":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "The Syndicate":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Tian Di Hui":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "none";
				securityWorkDiv.style.display = "inline";
				break;
			case "CyberSec":
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "none";
				securityWorkDiv.style.display = "none";
				break;
			default:
				console.log("Faction does not exist");
				break;
		}
	} else {
		console.log("Not a member of this faction, cannot display faction information");
	}
}