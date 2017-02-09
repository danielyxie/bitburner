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
    
    //Other corporations
    var FulcrumTechnologies     = new Faction("Fulcrum Secret Technologies");
    AddToFactions(FulcrumTechnologies);
	
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

//This function sets the requirements to join a Faction. It checks whether the Player meets
//those requirements and will return an array of all factions that the Player should
//receive an invitation to
PlayerObject.prototype.checkForFactionInvitations() {
    invitedFactions = []; //Array which will hold NAMES of all Factions player should be invited to
    
    var companyRep = Companies[this.companyName].playerReputation;
    
    //Illuminati
    var illuminatiFac = Factions["Illuminati"];
    if (illuminatiFac.isBanned == false && illuminatiFac.isMember == false &&
        this.numAugmentations >= 10 && 
        this.money >= 10000000000 && this.total_money >= 20000000000 &&
        this.hacking_skill >= 800 && this.total_hacking >= 7000 &&
        this.strength >= 900 && this.total_strength >= 10000 && 
        this.defense >= 900 && this.total_defense >= 10000 &&
        this.dexterity >= 900 && this.total_dexterity >= 10000 && 
        this.agility >= 900 && this.total_agility >= 10000) {
        invitedFactions.push("Illuminati");
    }
        
    //Daedalus
    var daedalusFac = Factions["Daedalus"];
    if (daedalusFac.isBanned == false && daedalusFac.isMember == false &&
        this.numAugmentations >= 15 && 
        this.money >= 1000000000 && this.total_money >= 10000000000 &&
        this.hacking_skill >= 1000 && this.total_hacking >= 10000 &&
        this.strength >= 500 && this.total_strength >= 8000 && 
        this.defense >= 500 && this.total_defense >= 8000 &&
        this.dexterity >= 500 && this.total_dexterity >= 8000 && 
        this.agility >= 500 && this.total_agility >= 8000) {
        invitedFactions.push("Daedalus");
    }
    
    //The Covenant
    var covenantFac = Factions["The Covenant"];
    if (covenantFac.isBanned == false && covenantFac.isMember == false &&
        this.numAugmentations >= 12 &&
        this.money >= 5000000000 && this.total_money >= 10000000000 &&
        this.hacking_skill >= 850 && this.total_hack >= 5000 && 
        this.strength >= 850 && this.total_strength >= 5000 &&
        this.defense >= 850 && this.total_defense >= 5000 &&
        this.dexterity >= 850 && this.total_dexterity >= 5000 &&
        this.agility >= 850 && this.total_agility >= 5000) {
        invitedFactions.push("The Covenant");
    }
    
    //ECorp
    var ecorpFac = Factions["ECorp"];
    if (ecorpFac.isBanned == false && ecorpFac.isMember == false && 
        this.companyName == Locations.AevumECorp && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push("ECorp");
    }
    
    //MegaCorp
    var megacorpFac = Factions["MegaCorp"];
    if (megacorpFac.isBanned == false && megacorpFac.isMember == false && 
        this.companyName == Locations.Sector12MegaCorp && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push("MegaCorp");
    }
        
    //Bachman & Associates
    var bachmanandassociatesFac = Factions["Bachman & Associates"];
    if (bachmanandassociatesFac.isBanned == false && bachmanandassociatesFac.isMember == false &&
        this.companyName == Locations.AevumBachmanAndAssociates && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push("Bachman & Associates");
    }
    
    //Blade Industries
    var bladeindustriesFac = Factions["Blade Industries"];
    if (bladeindustriesFac.isBanned == false && bladeindustriesFac.isMember == false && 
        this.companyName == Locations.Sector12BladeIndustries && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push("Blade Industries");
    }
    
    //NWO
    var nwoFac = Factions["NWO"];
    if (nwoFac.isBanned == false && nwoFac.isMember == false && 
        this.companyName == Locations.VolhavenNWO && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push("NWO");
    }
    
    //Clarke Incorporated
    var clarkeincorporatedFac = Factions["Clarke Incorporated"];
    if (clarkeincorporatedFac.isBanned == false && clarkeincorporatedFac.isMember == false &&
        this.companyName == Locations.AevumClarkeIncorporated && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push("Clarke Incorporated");
    }
    
    //OmniTek Incorporated
    
    var omnitekincorporatedFac = Factions["OmniTek Incorporated"];
    if (omnitekincorporatedFac.isBanned == false && omnitekincorporatedFac.isMember == false &&
        this.companyName == Locations.VolhavenOmniTekIncorporated && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push("OmniTek Incorporated");
    }
    
    //Four Sigma
    var foursigmaFac = Factions["Four Sigma"];
    if (foursigmaFac.isBanned == false && foursigmaFac.isMember == false && 
        this.companyName == Locations.Sector12FourSigma && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push("Four Sigma");
    }
    
    //KuaiGong International
    var kuaigonginternationalFac = Factions["KuaiGong International"];
    if (kuaigonginternationalFac.isBanned == false && kuaigonginternationalFac.isMember == false &&
        this.companyName == Locations.ChongqingKuaiGongInternational && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push("KuaiGong International");
    }
    
    //Fulcrum Secret Technologies - If u've unlocked fulcrum secret technolgoies server and have a high rep with the company
    var fulcrumsecrettechonologiesFac = Factions["Fulcrum Secret Technologies"];
    var fulcrumSecretServer = AllServers[SpecialServerIps.fulcrumSecretServer];
    if (fulcrumSecretServer == null) {
        console.log("Error: Could not find Fulcrum Secret Technologies Server");
    }
    if (fulcrumsecrettechonologiesFac.isBanned == false && fulcrumsecrettechonologiesFac.isMember == false &&
        fulcrumSecretServer.hasAdminRights && 
        this.companyName == Locations.AevumFulcrumTechnologies && companyRep >= 250000) {
        invitedFactions.push("Fulcrum Secret Technologies");
    }
    
    //BitRunners
    var bitrunnersFac = Factions["BitRunners"];
    var homeComp = AllServers[this.homeComputer];
    if (bitrunnersFac.isBanned == false && bitrunnersFac.isMember == false &&
        this.hacking_skill >= 600 && homeComp.maxRam >= 32) {
        invitedFactions.push("BitRunners");
    }
    
    //The Black Hand
    var theblackhandFac = Factions["The Black Hand"];
    if (theblackhandFac.isBanned == false && theblackhandFac.isMember == false &&
        this.hacking_skill >= 400 && this.strength >= 300 && this.defense >= 300 &&
        this.agility >= 300 && this.dexterity >= 300 && homeComp.maxRam >= 16) {
        invitedFactions.push("The Black Hand");
    }
    
    //NiteSec
    var nitesecFac = Factions["NiteSec"];
    if (nitesecFac.isBanned == false && nitesecFac.isMember == false && 
        this.hacking_skill >= 500 && homeComp.maxRam >= 32) {
        invitedFactions.push("NiteSec");
    }
    
    //Chongqing
    //Sector-12
    //New Tokyo
    //Aevum
    //Ishima
    //Volhaven
    //Speakers for the Dead
    //The Dark Army
    //The Syndicate
    //Tian Di Hui
    //CyberSec
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