import {Augmentations, AugmentationNames,
        PlayerOwnedAugmentation}                from "./Augmentations.js";
import {BitNodeMultipliers}                     from "./BitNode.js";
import {CONSTANTS}                              from "./Constants.js";
import {Engine}                                 from "./engine.js";
import {FactionInfo}                            from "./FactionInfo.js";
import {Locations}                              from "./Location.js";
import {HackingMission, setInMission}           from "./Missions.js";
import {Player}                                 from "./Player.js";
import {Settings}                               from "./Settings.js";

import {dialogBoxCreate}                        from "../utils/DialogBox.js";
import {factionInvitationBoxCreate}             from "../utils/FactionInvitationBox.js";
import {clearEventListeners}                    from "../utils/HelperFunctions.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver.js";
import {formatNumber, isPositiveNumber}         from "../utils/StringHelperFunctions.js";
import {yesNoBoxCreate, yesNoBoxGetYesButton,
        yesNoBoxGetNoButton, yesNoBoxClose}     from "../utils/YesNoBox.js";


//Netburner Faction class
function factionInit() {
    $('#faction-donate-input').on('input', function() {
        if (Engine.currentPage == Engine.Page.Faction) {
            var val = document.getElementById("faction-donate-input").value;
            if (isPositiveNumber(val)) {
                var numMoneyDonate = Number(val);
                document.getElementById("faction-donate-rep-gain").innerHTML =
                    "This donation will result in " + formatNumber(numMoneyDonate/1000000 * Player.faction_rep_mult, 3) + " reputation gain";
            } else {
                document.getElementById("faction-donate-rep-gain").innerHTML =
                    "This donation will result in 0 reputation gain";
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", factionInit, false);

function Faction(name="") {
    this.name 				= name;
    this.augmentations 		= [];   //Name of augmentation only
    this.info 		        = "";	//Introductory/informational text about the faction

    //Player-related properties for faction
    this.isMember 			= false; 	//Whether player is member
    this.isBanned           = false;    //Whether or not player is banned from joining this faction
    this.playerReputation 	= 0;  		//"Reputation" within faction
    this.alreadyInvited     = false;

    //Multipliers for unlocking and purchasing augmentations
    this.augmentationPriceMult = 1;
    this.augmentationRepRequirementMult = 1;

    //Faction favor
    this.favor              = 0;
    this.rolloverRep        = 0;
};

Faction.prototype.setAugmentationMultipliers = function(price, rep) {
    this.augmentationPriceMult = price;
    this.augmentationRepRequirementMult = rep;
}

Faction.prototype.setInfo = function(inf) {
	this.info = inf;
}

Faction.prototype.gainFavor = function() {
    if (this.favor == null || this.favor == undefined) {this.favor = 0;}
    if (this.rolloverRep == null || this.rolloverRep == undefined) {this.rolloverRep = 0;}
    var res = this.getFavorGain();
    if (res.length != 2) {
        console.log("Error: invalid result from getFavorGain() function");
        return;
    }
    this.favor += res[0];
    this.rolloverRep = res[1];
}

//Returns an array with [How much favor would be gained, how much favor would be left over]
Faction.prototype.getFavorGain = function() {
    if (this.favor == null || this.favor == undefined) {this.favor = 0;}
    if (this.rolloverRep == null || this.rolloverRep == undefined) {this.rolloverRep = 0;}
    var favorGain = 0, rep = this.playerReputation + this.rolloverRep;
    var reqdRep = CONSTANTS.FactionReputationToFavorBase *
                  Math.pow(CONSTANTS.FactionReputationToFavorMult, this.favor);
    while(rep > 0) {
        if (rep >= reqdRep) {
            ++favorGain;
            rep -= reqdRep;
        } else {
            break;
        }
        reqdRep *= CONSTANTS.FactionReputationToFavorMult;
    }
    return [favorGain, rep];
}

//Adds all Augmentations to this faction.
Faction.prototype.addAllAugmentations = function() {
    this.augmentations.length = 0;
    for (var name in Augmentations) {
        if (Augmentations.hasOwnProperty(name)) {
            this.augmentations.push(name);
        }
    }
}

Faction.prototype.toJSON = function() {
	return Generic_toJSON("Faction", this);
}

Faction.fromJSON = function(value) {
	return Generic_fromJSON(Faction, value.data);
}

Reviver.constructors.Faction = Faction;

//Map of factions indexed by faction name
let Factions = {}

function loadFactions(saveString) {
    Factions = JSON.parse(saveString, Reviver);
}

function AddToFactions(faction) {
	var name = faction.name;
	Factions[name] = faction;
}

function factionExists(name) {
    return Factions.hasOwnProperty(name);
}

//TODO Augmentation price and rep requirement mult are 1 for everything right now,
//      This might change in the future for balance
function initFactions() {
	//Endgame
	var Illuminati 				= new Faction("Illuminati");
    Illuminati.setInfo(FactionInfo.IlluminatiInfo);
    if (factionExists("Illuminati")) {
        Illuminati.favor = Factions["Illuminati"].favor;
        delete Factions["Illuminati"];
    }
	AddToFactions(Illuminati);

	var Daedalus 				= new Faction("Daedalus");
    Daedalus.setInfo(FactionInfo.DaedalusInfo);
    if (factionExists("Daedalus")) {
        Daedalus.favor = Factions["Daedalus"].favor;
        delete Factions["Daedalus"];
    }
	AddToFactions(Daedalus);

	var Covenant 				= new Faction("The Covenant");
    Covenant.setInfo(FactionInfo.CovenantInfo);
    if (factionExists("The Covenant")) {
        Covenant.favor = Factions["The Covenant"].favor;
        delete Factions["The Covenant"];
    }
	AddToFactions(Covenant);

	//Megacorporations, each forms its own faction
	var ECorp 					= new Faction("ECorp");
    ECorp.setInfo(FactionInfo.ECorpInfo);
    if (factionExists("ECorp")) {
        ECorp.favor = Factions["ECorp"].favor;
        delete Factions["ECorp"];
    }
	AddToFactions(ECorp);

	var MegaCorp 				= new Faction("MegaCorp");
    MegaCorp.setInfo(FactionInfo.MegaCorpInfo);
    if (factionExists("MegaCorp")) {
        MegaCorp.favor = Factions["MegaCorp"].favor;
        delete Factions["MegaCorp"];
    }
	AddToFactions(MegaCorp);

	var BachmanAndAssociates 	= new Faction("Bachman & Associates");
    BachmanAndAssociates.setInfo(FactionInfo.BachmanAndAssociatesInfo);
    if (factionExists("Bachman & Associates")) {
        BachmanAndAssociates.favor = Factions["Bachman & Associates"].favor;
        delete Factions["Bachman & Associates"];
    }
	AddToFactions(BachmanAndAssociates);

	var BladeIndustries 		= new Faction("Blade Industries");
    BladeIndustries.setInfo(FactionInfo.BladeIndustriesInfo);
    if (factionExists("Blade Industries")) {
        BladeIndustries.favor = Factions["Blade Industries"].favor;
        delete Factions["Blade Industries"];
    }
	AddToFactions(BladeIndustries);

	var NWO 					= new Faction("NWO");
    NWO.setInfo(FactionInfo.NWOInfo);
    if (factionExists("NWO")) {
        NWO.favor = Factions["NWO"].favor;
        delete Factions["NWO"];
    }
	AddToFactions(NWO);

	var ClarkeIncorporated 		= new Faction("Clarke Incorporated");
    ClarkeIncorporated.setInfo(FactionInfo.ClarkeIncorporatedInfo);
    if (factionExists("Clarke Incorporated")) {
        ClarkeIncorporated.favor = Factions["Clarke Incorporated"].favor;
        delete Factions["Clarke Incorporated"];
    }
	AddToFactions(ClarkeIncorporated);

	var OmniTekIncorporated 	= new Faction("OmniTek Incorporated");
    OmniTekIncorporated.setInfo(FactionInfo.OmniTekIncorporatedInfo);
    if (factionExists("OmniTek Incorporated")) {
        OmniTekIncorporated.favor = Factions["OmniTek Incorporated"].favor;
        delete Factions["OmniTek Incorporated"];
    }
	AddToFactions(OmniTekIncorporated);

	var FourSigma 				= new Faction("Four Sigma");
    FourSigma.setInfo(FactionInfo.FourSigmaInfo);
    if (factionExists("Four Sigma")) {
        FourSigma.favor = Factions["Four Sigma"].favor;
        delete Factions["Four Sigma"];
    }
	AddToFactions(FourSigma);

	var KuaiGongInternational 	= new Faction("KuaiGong International");
    KuaiGongInternational.setInfo(FactionInfo.KuaiGongInternationalInfo);
    if (factionExists("KuaiGong International")) {
        KuaiGongInternational.favor = Factions["KuaiGong International"].favor;
        delete Factions["KuaiGong International"];
    }
	AddToFactions(KuaiGongInternational);

    //Other corporations
    var FulcrumTechnologies     = new Faction("Fulcrum Secret Technologies");
    FulcrumTechnologies.setInfo(FactionInfo.FulcrumSecretTechnologiesInfo);
    if (factionExists("Fulcrum Secret Technologies")) {
        FulcrumTechnologies.favor = Factions["Fulcrum Secret Technologies"].favor;
        delete Factions["Fulcrum Secret Technologies"];
    }
    AddToFactions(FulcrumTechnologies);

	//Hacker groups
	var BitRunners 				= new Faction("BitRunners");
    BitRunners.setInfo(FactionInfo.BitRunnersInfo);
    if (factionExists("BitRunners")) {
        BitRunners.favor = Factions["BitRunners"].favor;
        delete Factions["BitRunners"];
    }
	AddToFactions(BitRunners);

	var BlackHand				= new Faction("The Black Hand");
    BlackHand.setInfo(FactionInfo.BlackHandInfo);
    if (factionExists("The Black Hand")) {
        BlackHand.favor = Factions["The Black Hand"].favor;
        delete Factions["The Black Hand"];
    }
	AddToFactions(BlackHand);

	var NiteSec 				= new Faction("NiteSec");
    NiteSec.setInfo(FactionInfo.NiteSecInfo);
    if (factionExists("NiteSec")) {
        NiteSec.favor = Factions["NiteSec"].favor;
        delete Factions["NiteSec"];
    }
	AddToFactions(NiteSec);

	//City factions, essentially governments
	var Chongqing 				= new Faction("Chongqing");
    Chongqing.setInfo(FactionInfo.ChongqingInfo);
    if (factionExists("Chongqing")) {
        Chongqing.favor = Factions["Chongqing"].favor;
        delete Factions["Chongqing"];
    }
	AddToFactions(Chongqing);

	var Sector12 				= new Faction("Sector-12");
    Sector12.setInfo(FactionInfo.Sector12Info);
    if (factionExists("Sector-12")) {
        Sector12.favor = Factions["Sector-12"].favor;
        delete Factions["Sector-12"];
    }
	AddToFactions(Sector12);

	var NewTokyo				= new Faction("New Tokyo");
    NewTokyo.setInfo(FactionInfo.NewTokyoInfo);
    if (factionExists("New Tokyo")) {
        NewTokyo.favor = Factions["New Tokyo"].favor;
        delete Factions["New Tokyo"];
    }
	AddToFactions(NewTokyo);

	var Aevum 				    = new Faction("Aevum");
    Aevum.setInfo(FactionInfo.AevumInfo);
    if (factionExists("Aevum")) {
        Aevum.favor = Factions["Aevum"].favor;
        delete Factions["Aevum"];
    }
	AddToFactions(Aevum);

    var Ishima                 	= new Faction("Ishima");
    Ishima.setInfo
	var Volhaven 				= new Faction("Volhaven");
    Volhaven.setInfo(FactionInfo.VolhavenInfo);
    if (factionExists("Volhaven")) {
        Volhaven.favor = Factions["Volhaven"].favor;
        delete Factions["Volhaven"];
    }
	AddToFactions(Volhaven);(FactionInfo.IshimaInfo);
    if (factionExists("Ishima")) {
        Ishima.favor = Factions["Ishima"].favor;
        delete Factions["Ishima"];
    }
	AddToFactions(Ishima);


	//Criminal Organizations/Gangs
	var SpeakersForTheDead		= new Faction("Speakers for the Dead");
    SpeakersForTheDead.setInfo(FactionInfo.SpeakersForTheDeadInfo);
    if (factionExists("Speakers for the Dead")) {
        SpeakersForTheDead.favor = Factions["Speakers for the Dead"].favor;
        delete Factions["Speakers for the Dead"];
    }
	AddToFactions(SpeakersForTheDead);

	var DarkArmy				= new Faction("The Dark Army");
    DarkArmy.setInfo(FactionInfo.DarkArmyInfo);
    if (factionExists("The Dark Army")) {
        DarkArmy.favor = Factions["The Dark Army"].favor;
        delete Factions["The Dark Army"];
    }
	AddToFactions(DarkArmy);

	var TheSyndicate 			= new Faction("The Syndicate");
    TheSyndicate.setInfo(FactionInfo.TheSyndicateInfo);
    if (factionExists("The Syndicate")) {
        TheSyndicate.favor = Factions["The Syndicate"].favor;
        delete Factions["The Syndicate"];
    }
	AddToFactions(TheSyndicate);

    var Silhouette              = new Faction("Silhouette");
    Silhouette.setInfo(FactionInfo.SilhouetteInfo);
    if (factionExists("Silhouette")) {
        Silhouette.favor = Factions["Silhouette"].favor;
        delete Factions["Silhouette"];
    }
    AddToFactions(Silhouette);

    var Tetrads                 = new Faction("Tetrads"); //Low-medium level asian crime gang
    Tetrads.setInfo(FactionInfo.TetradsInfo);
    if (factionExists("Tetrads")) {
        Tetrads.favor = Factions["Tetrads"].favor;
        delete Factions["Tetrads"];
    }
    AddToFactions(Tetrads);

    var SlumSnakes              = new Faction("Slum Snakes"); //Low level crime gang
    SlumSnakes.setInfo(FactionInfo.SlumSnakesInfo);
    if (factionExists("Slum Snakes")) {
        SlumSnakes.favor = Factions["Slum Snakes"].favor;
        delete Factions["Slum Snakes"];
    }
    AddToFactions(SlumSnakes);

	//Earlygame factions - factions the player will prestige with early on that don't
	//belong in other categories
    var Netburners              = new Faction("Netburners");
    Netburners.setInfo(FactionInfo.NetburnersInfo);
    if (factionExists("Netburners")) {
        Netburners.favor = Factions["Netburners"].favor;
        delete Factions["Netburners"];
    }
    AddToFactions(Netburners);

	var TianDiHui				= new Faction("Tian Di Hui");	//Society of the Heaven and Earth
    TianDiHui.setInfo(FactionInfo.TianDiHuiInfo);
    if (factionExists("Tian Di Hui")) {
        TianDiHui.favor = Factions["Tian Di Hui"].favor;
        delete Factions["Tian Di Hui"];
    }
	AddToFactions(TianDiHui);

	var CyberSec 				= new Faction("CyberSec");
    CyberSec.setInfo(FactionInfo.CyberSecInfo);
    if (factionExists("CyberSec")) {
        CyberSec.favor = Factions["CyberSec"].favor;
        delete Factions["CyberSec"];
    }
	AddToFactions(CyberSec);
}

function inviteToFaction(faction) {
    if (Settings.SuppressFactionInvites) {
        faction.alreadyInvited = true;
        Player.factionInvitations.push(faction.name);
    } else {
        factionInvitationBoxCreate(faction);
    }
}

function joinFaction(faction) {
	faction.isMember = true;
    Player.factions.push(faction.name);

    //Determine what factions you are banned from now that you have joined this faction
    if (faction.name == "Chongqing") {
        Factions["Sector-12"].isBanned = true;
        Factions["Aevum"].isBanned = true;
        Factions["Volhaven"].isBanned = true;
    } else if (faction.name == "Sector-12") {
        Factions["Chongqing"].isBanned = true;
        Factions["New Tokyo"].isBanned = true;
        Factions["Ishima"].isBanned = true;
        Factions["Volhaven"].isBanned = true;
    } else if (faction.name == "New Tokyo") {
        Factions["Sector-12"].isBanned = true;
        Factions["Aevum"].isBanned = true;
        Factions["Volhaven"].isBanned = true;
    } else if (faction.name == "Aevum") {
        Factions["Chongqing"].isBanned = true;
        Factions["New Tokyo"].isBanned = true;
        Factions["Ishima"].isBanned = true;
        Factions["Volhaven"].isBanned = true;
    } else if (faction.name == "Ishima") {
        Factions["Sector-12"].isBanned = true;
        Factions["Aevum"].isBanned = true;
        Factions["Volhaven"].isBanned = true;
    } else if (faction.name == "Volhaven") {
        Factions["Chongqing"].isBanned = true;
        Factions["Sector-12"].isBanned = true;
        Factions["New Tokyo"].isBanned = true;
        Factions["Aevum"].isBanned = true;
        Factions["Ishima"].isBanned = true;
    }
}

//Displays the HTML content for a specific faction
function displayFactionContent(factionName) {
	var faction = Factions[factionName];
    document.getElementById("faction-name").innerHTML = factionName;
    document.getElementById("faction-info").innerHTML = "<i>" + faction.info + "</i>";
    var repGain = faction.getFavorGain();
    if (repGain.length != 2) {repGain = 0;}
    repGain = repGain[0];
    document.getElementById("faction-reputation").innerHTML = "Reputation: " + formatNumber(faction.playerReputation, 4) +
                                                              "<span class='tooltiptext'>You will earn " +
                                                              formatNumber(repGain, 4) +
                                                              " faction favor upon resetting after installing an Augmentation</span>";
    document.getElementById("faction-favor").innerHTML = "Faction Favor: " + formatNumber(faction.favor, 4) +
                                                         "<span class='tooltiptext'>Faction favor increases the rate at which " +
                                                         "you earn reputation for this faction by 1% per favor. Faction favor " +
                                                         "is gained whenever you reset after installing an Augmentation. The amount of " +
                                                         "favor you gain depends on how much reputation you have with the faction</span>";

    var hackMissionDiv      = document.getElementById("faction-hack-mission-div");
	var hackDiv 			= document.getElementById("faction-hack-div");
	var fieldWorkDiv 		= document.getElementById("faction-fieldwork-div");
	var securityWorkDiv 	= document.getElementById("faction-securitywork-div");
    var donateDiv           = document.getElementById("faction-donate-div");
    var gangDiv             = document.getElementById("faction-gang-div");

    var newHackMissionButton = clearEventListeners("faction-hack-mission-button");
    var newHackButton = clearEventListeners("faction-hack-button");
    var newFieldWorkButton = clearEventListeners("faction-fieldwork-button");
    var newSecurityWorkButton = clearEventListeners("faction-securitywork-button");
    var newDonateWorkButton = clearEventListeners("faction-donate-button");
    newHackMissionButton.addEventListener("click", function() {
        Engine.loadMissionContent();
        var mission = new HackingMission(faction.playerReputation, faction);
        setInMission(true, mission); //Sets inMission flag to true
        mission.init();
        return false;
    });

    newHackButton.addEventListener("click", function() {
        Player.startFactionHackWork(faction);
        return false;
    });

    newFieldWorkButton.addEventListener("click", function() {
        Player.startFactionFieldWork(faction);
        return false;
    });

    newSecurityWorkButton.addEventListener("click", function() {
        Player.startFactionSecurityWork(faction);
        return false;
    });

    newDonateWorkButton.addEventListener("click", function() {
        var donateAmountVal = document.getElementById("faction-donate-input").value;
        if (isPositiveNumber(donateAmountVal)) {
            var numMoneyDonate = Number(donateAmountVal);
            if (Player.money.lt(numMoneyDonate)) {
                dialogBoxCreate("You cannot afford to donate this much money!");
                return;
            }
            Player.loseMoney(numMoneyDonate);
            var repGain = numMoneyDonate / 1000000 * Player.faction_rep_mult;
            faction.playerReputation += repGain;
            dialogBoxCreate("You just donated $" + formatNumber(numMoneyDonate, 2) + " to " +
                            faction.name + " to gain " + formatNumber(repGain, 3) + " reputation");
            displayFactionContent(factionName);
        } else {
            dialogBoxCreate("Invalid amount entered!");
        }
        return false;
    });


    var newPurchaseAugmentationsButton = clearEventListeners("faction-purchase-augmentations");
    newPurchaseAugmentationsButton.addEventListener("click", function() {
        Engine.hideAllContent();
        Engine.Display.factionAugmentationsContent.style.visibility = "visible";

        var newBackButton = clearEventListeners("faction-augmentations-back-button");
        newBackButton.addEventListener("click", function() {
            Engine.loadFactionContent();
            displayFactionContent(factionName);
            return false;
        });
        displayFactionAugmentations(factionName);
        return false;
    });

    if (Player.bitNodeN == 2 && (factionName == "Slum Snakes" || factionName == "Tetrads" ||
        factionName == "The Syndicate" || factionName == "The Dark Army" || factionName == "Speakers for the Dead" ||
        factionName == "NiteSec" || factionName == "The Black Hand")) {
        //Set everything else to invisible
        hackDiv.style.display = "none";
        fieldWorkDiv.style.display = "none";
        securityWorkDiv.style.display = "none";
        donateDiv.style.display = "none";

        var gangDiv = document.getElementById("faction-gang-div");

        if (Player.inGang() && Player.gang.facName != factionName) {
            //If the player has a gang but its not for this faction
            if (gangDiv) {
                gangDiv.style.display = "none";
            }
            return;
        }
        //Create the "manage gang" button if it doesn't exist
        if (gangDiv == null) {
            gangDiv = document.createElement("div");
            gangDiv.setAttribute("id", "faction-gang-div");
            gangDiv.setAttribute("class", "faction-work-div");
            gangDiv.style.display = "inline";

            gangDiv.innerHTML =
                '<div id="faction-gang-div-wrapper" class="faction-work-div-wrapper">' +
                    '<a id="faction-gang-button" class="a-link-button">Manage Gang</a>' +
                    '<p id="faction-gang-text">' +
                        'Create and manage a gang for this Faction. ' +
                        'Gangs will earn you money and faction reputation.' +
                    '</p>' +
                '</div>' +
                '<div class="faction-clear"></div>';

            var descText = document.getElementById("faction-work-description-text");
            if (descText) {
                descText.parentNode.insertBefore(gangDiv, descText.nextSibling);
            } else {
                console.log("ERROR: faciton-work-description-text not found");
                dialogBoxCreate("Error loading this page. This is a bug please report to game developer");
                return;
            }
        }
        gangDiv.style.display = "inline";

        var gangButton = clearEventListeners("faction-gang-button");
        gangButton.addEventListener("click", function() {
            if (!Player.inGang()) {
                var yesBtn = yesNoBoxGetYesButton(), noBtn = yesNoBoxGetNoButton();
                yesBtn.innerHTML = "Create Gang";
                noBtn.innerHTML = "Cancel";
                yesBtn.addEventListener("click", () => {
                    var hacking = false;
                    if (factionName === "NiteSec" || factionName === "The Black Hand") {hacking = true;}
                    Player.startGang(factionName, hacking);
                    Engine.loadGangContent();
                    yesNoBoxClose();
                });
                noBtn.addEventListener("click", () => {
                    yesNoBoxClose();
                });
                yesNoBoxCreate("Would you like to create a new Gang with " + factionName + "?<br><br>" +
                               "Note that this will prevent you from creating a Gang with any other Faction until " +
                               "this BitNode is destroyed. There are NO differences between the Factions you can " +
                               "create a Gang with and each of these Factions have all Augmentations available");
            } else {
                Engine.loadGangContent();
            }

        });

        return;
    } else {
        if (gangDiv) {gangDiv.style.display = "none";}
    }

	if (faction.isMember) {
        if (faction.favor >= (150 * BitNodeMultipliers.RepToDonateToFaction)) {
            donateDiv.style.display = "inline";
        } else {
            donateDiv.style.display = "none";
        }

		switch(faction.name) {
			case "Illuminati":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "Daedalus":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "The Covenant":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "ECorp":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "MegaCorp":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Bachman & Associates":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Blade Industries":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "NWO":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Clarke Incorporated":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "OmniTek Incorporated":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Four Sigma":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "KuaiGong International":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
            case "Fulcrum Secret Technologies":
                hackMissionDiv.style.display = "inline";
                hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "none";
				securityWorkDiv.style.display = "inline";
                break;
			case "BitRunners":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "none";
				securityWorkDiv.style.display = "none";
				break;
			case "The Black Hand":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "NiteSec":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "none";
				securityWorkDiv.style.display = "none";
				break;
			case "Chongqing":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Sector-12":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "New Tokyo":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Aevum":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Ishima":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Volhaven":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "Speakers for the Dead":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
			case "The Dark Army":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "none";
				break;
			case "The Syndicate":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "inline";
				securityWorkDiv.style.display = "inline";
				break;
            case "Silhouette":
                hackMissionDiv.style.display = "inline";
                hackDiv.style.display = "inline";
                fieldWorkDiv.style.display = "inline";
                securityWorkDiv.style.display = "none";
                break;
            case "Tetrads":
                hackMissionDiv.style.display = "none";
                hackDiv.style.display = "none";
                fieldWorkDiv.style.display = "inline";
                securityWorkDiv.style.display = "inline";
                break;
            case "Slum Snakes":
                hackMissionDiv.style.display = "none";
                hackDiv.style.display = "none";
                fieldWorkDiv.style.display = "inline";
                securityWorkDiv.style.display = "inline";
                break;
            case "Netburners":
                hackMissionDiv.style.display = "inline";
                hackDiv.style.display = "inline";
                fieldWorkDiv.style.display = "none";
                securityWorkDiv.style.display = "none";
                break;
			case "Tian Di Hui":
                hackMissionDiv.style.display = "inline";
				hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "none";
				securityWorkDiv.style.display = "inline";
				break;
			case "CyberSec":
                hackMissionDiv.style.display = "inline";
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

function displayFactionAugmentations(factionName) {
    document.getElementById("faction-augmentations-page-desc").innerHTML =
        "Lists all Augmentations that are available to purchase from " + factionName + "<br><br>" +
        "Augmentations are powerful upgrades that will enhance your abilities.";

    var faction = Factions[factionName];

    var augmentationsList = document.getElementById("faction-augmentations-list");
    while (augmentationsList.firstChild) {
        augmentationsList.removeChild(augmentationsList.firstChild);
    }

    for (var i = 0; i < faction.augmentations.length; ++i) {
        (function () {
            var aug = Augmentations[faction.augmentations[i]];
            if (aug == null) {
                console.log("ERROR: Invalid Augmentation");
                return;
            }
            var owned = false;
            for (var j = 0; j < Player.queuedAugmentations.length; ++j) {
                if (Player.queuedAugmentations[j].name == aug.name) {
                    owned = true;
                }
            }
            for (var j = 0; j < Player.augmentations.length; ++j) {
                if (Player.augmentations[j].name == aug.name) {
                    owned = true;
                }
            }

            var item = document.createElement("li");
            var span = document.createElement("span");
            var aDiv = document.createElement("div");
            var aElem = document.createElement("a");
            var pElem = document.createElement("p");
            aElem.setAttribute("href", "#");
            var req = aug.baseRepRequirement * faction.augmentationRepRequirementMult;
            if (aug.name != AugmentationNames.NeuroFluxGovernor && (aug.owned || owned)) {
                aElem.setAttribute("class", "a-link-button-inactive");
                pElem.innerHTML = "ALREADY OWNED";
            } else if (faction.playerReputation >= req) {
                aElem.setAttribute("class", "a-link-button");
                pElem.innerHTML = "UNLOCKED - $" + formatNumber(aug.baseCost * faction.augmentationPriceMult, 2);
            } else {
                aElem.setAttribute("class", "a-link-button-inactive");
                pElem.innerHTML = "LOCKED (Requires " + formatNumber(req, 1) + " faction reputation) - $" + formatNumber(aug.baseCost * faction.augmentationPriceMult, 2);
                pElem.style.color = "red";
            }
            aElem.style.display = "inline";
            pElem.style.display = "inline";
            aElem.innerHTML = aug.name;
            if (aug.name == AugmentationNames.NeuroFluxGovernor) {
                aElem.innerHTML += " - Level " + (getNextNeurofluxLevel());
            }
            span.style.display = "inline-block"

            //The div will have the tooltip.
            aDiv.setAttribute("class", "tooltip");
            aDiv.innerHTML = '<span class="tooltiptext">' + aug.info + " </span>";
            aDiv.appendChild(aElem);

            aElem.addEventListener("click", function() {
                purchaseAugmentationBoxCreate(aug, faction);
            });

            span.appendChild(aDiv);
            span.appendChild(pElem);

            item.appendChild(span);

            augmentationsList.appendChild(item);
        }()); //Immediate invocation closure
    }
}

function purchaseAugmentationBoxCreate(aug, fac) {
    var yesBtn = yesNoBoxGetYesButton(), noBtn = yesNoBoxGetNoButton();
    yesBtn.innerHTML = "Purchase";
    noBtn.innerHTML = "Cancel";
    yesBtn.addEventListener("click", function() {
        purchaseAugmentation(aug, fac);
    });
    noBtn.addEventListener("click", function() {
        yesNoBoxClose();
    });

    yesNoBoxCreate("<h2>" + aug.name + "</h2><br>" +
                   aug.info + "<br><br>" +
                   "<br>Would you like to purchase the " + aug.name + " Augmentation for $" +
                   formatNumber(aug.baseCost * fac.augmentationPriceMult, 2)  + "?");
}

function purchaseAugmentation(aug, fac, sing=false) {
    if (aug.name == AugmentationNames.Targeting2 &&
        Augmentations[AugmentationNames.Targeting1].owned == false) {
        var txt = "You must first install Augmented Targeting I before you can upgrade it to Augmented Targeting II";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.name == AugmentationNames.Targeting3 &&
               Augmentations[AugmentationNames.Targeting2].owned == false) {
        var txt = "You must first install Augmented Targeting II before you can upgrade it to Augmented Targeting III";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.name == AugmentationNames.CombatRib2 &&
               Augmentations[AugmentationNames.CombatRib1].owned == false) {
        var txt = "You must first install Combat Rib I before you can upgrade it to Combat Rib II";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.name == AugmentationNames.CombatRib3 &&
               Augmentations[AugmentationNames.CombatRib2].owned == false) {
        var txt = "You must first install Combat Rib II before you can upgrade it to Combat Rib III";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.name == AugmentationNames.GrapheneBionicSpine &&
               Augmentations[AugmentationNames.BionicSpine].owned == false) {
        var txt = "You must first install a Bionic Spine before you can upgrade it to a Graphene Bionic Spine";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.name == AugmentationNames.GrapheneBionicLegs &&
               Augmentations[AugmentationNames.BionicLegs].owned == false) {
        var txt = "You must first install Bionic Legs before you can upgrade it to Graphene Bionic Legs";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.name == AugmentationNames.ENMCoreV2 &&
               Augmentations[AugmentationNames.ENMCore].owned == false) {
        var txt = "You must first install Embedded Netburner Module Core Implant before you can upgrade it to V2";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.name == AugmentationNames.ENMCoreV3 &&
               Augmentations[AugmentationNames.ENMCoreV2].owned == false) {
        var txt = "You must first install Embedded Netburner Module Core V2 Upgrade before you can upgrade it to V3";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if ((aug.name == AugmentationNames.ENMCore ||
               aug.name == AugmentationNames.ENMAnalyzeEngine ||
               aug.name == AugmentationNames.ENMDMA) &&
               Augmentations[AugmentationNames.ENM].owned == false) {
       var txt = "You must first install the Embedded Netburner Module before installing any upgrades to it";
       if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if ((aug.name ==  AugmentationNames.PCDNIOptimizer ||
               aug.name ==  AugmentationNames.PCDNINeuralNetwork) &&
               Augmentations[AugmentationNames.PCDNI].owned == false) {
        var txt = "You must first install the Pc Direct-Neural Interface before installing this upgrade";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.name == AugmentationNames.GrapheneBrachiBlades &&
               Augmentations[AugmentationNames.BrachiBlades].owned == false) {
        var txt = "You must first install the Brachi Blades augmentation before installing this upgrade";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.name == AugmentationNames.GrapheneBionicArms &&
               Augmentations[AugmentationNames.BionicArms].owned == false) {
        var txt = "You must first install the Bionic Arms augmentation before installing this upgrade";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (Player.money.gte(aug.baseCost * fac.augmentationPriceMult)) {
        if (Player.firstAugPurchased === false) {
            Player.firstAugPurchased = true;
            document.getElementById("augmentations-tab").style.display = "list-item";
            document.getElementById("character-menu-header").click();
            document.getElementById("character-menu-header").click();
        }

        var queuedAugmentation = new PlayerOwnedAugmentation(aug.name);
        if (aug.name == AugmentationNames.NeuroFluxGovernor) {
            queuedAugmentation.level = getNextNeurofluxLevel();
        }
        Player.queuedAugmentations.push(queuedAugmentation);

        Player.loseMoney((aug.baseCost * fac.augmentationPriceMult));

        //If you just purchased Neuroflux Governor, recalculate the cost
        if (aug.name == AugmentationNames.NeuroFluxGovernor) {
            var nextLevel = getNextNeurofluxLevel();
            --nextLevel;
            var mult = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, nextLevel);
            aug.setRequirements(500 * mult, 750000 * mult);

            for (var i = 0; i < Player.queuedAugmentations.length-1; ++i) {
                aug.baseCost *= CONSTANTS.MultipleAugMultiplier;
            }
        }

        for (var name in Augmentations) {
            if (Augmentations.hasOwnProperty(name)) {
                Augmentations[name].baseCost *= CONSTANTS.MultipleAugMultiplier;
            }
        }

        if (sing) {
            return "You purchased " + aug.name;
        } else {
            dialogBoxCreate("You purchased "  + aug.name + ". It's enhancements will not take " +
                            "effect until they are installed. To install your augmentations, go to the " +
                            "'Augmentations' tab on the left-hand navigation menu. Purchasing additional " +
                            "augmentations will now be more expensive.");
        }

        displayFactionAugmentations(fac.name);
    } else {
        if (sing) {
            return "You don't have enough money to purchase " + aug.name;
        } else {
            dialogBoxCreate("You don't have enough money to purchase this Augmentation!");
        }
    }
    yesNoBoxClose();
}

function getNextNeurofluxLevel() {
    var aug = Augmentations[AugmentationNames.NeuroFluxGovernor];
    if (aug == null) {
        for (var i = 0; i < Player.augmentations.length; ++i) {
            if (Player.augmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
                aug = Player.augmentations[i];
            }
        }
        if (aug == null) {
            console.log("ERROR, Could not find NeuroFlux Governor aug");
            return 1;
        }
    }
    var nextLevel = aug.level + 1;
    for (var i = 0; i < Player.queuedAugmentations.length; ++i) {
        if (Player.queuedAugmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
            ++nextLevel;
        }
    }
    return nextLevel;
}

function processPassiveFactionRepGain(numCycles) {
    var numTimesGain = (numCycles / 600) * Player.faction_rep_mult;
    for (var name in Factions) {
		if (Factions.hasOwnProperty(name)) {
			var faction = Factions[name];

			//TODO Get hard value of 1 rep per "rep gain cycle"" for now..
            //maybe later make this based on
            //a player's 'status' like how powerful they are and how much money they have
            if (faction.isMember) {faction.playerReputation += (numTimesGain * BitNodeMultipliers.FactionPassiveRepGain);}
		}
	}
}

export {getNextNeurofluxLevel, Factions, initFactions, inviteToFaction,
        joinFaction, displayFactionContent, processPassiveFactionRepGain,
        loadFactions, Faction, purchaseAugmentation, factionExists};
