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

function Faction(name) {
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
    var gain = (this.playerReputation / CONSTANTS.FactionReputationToFavor);
    this.favor += gain;
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

function factionExists(name) {
    return Factions.hasOwnProperty(name);
}

//TODO Augmentation price and rep requirement mult are 1 for everything right now,
//      This might change in the future for balance
initFactions = function() {
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

//This function sets the requirements to join a Faction. It checks whether the Player meets
//those requirements and will return an array of all factions that the Player should
//receive an invitation to
PlayerObject.prototype.checkForFactionInvitations = function() {
    invitedFactions = []; //Array which will hold all Factions th eplayer should be invited to

    var numAugmentations = this.augmentations.length;

    var company = Companies[this.companyName];
    var companyRep = 0;
    if (company != null) {
        companyRep = company.playerReputation;
    }

    //Illuminati
    var illuminatiFac = Factions["Illuminati"];
    if (!illuminatiFac.isBanned && !illuminatiFac.isMember && !illuminatiFac.alreadyInvited &&
        numAugmentations >= 30 &&
        this.money >= 150000000000 &&
        this.hacking_skill >= 1500 &&
        this.strength >= 1200 && this.defense >= 1200 &&
        this.dexterity >= 1200 && this.agility >= 1200) {
        invitedFactions.push(illuminatiFac);
    }

    //Daedalus
    var daedalusFac = Factions["Daedalus"];
    if (!daedalusFac.isBanned && !daedalusFac.isMember && !daedalusFac.alreadyInvited &&
        numAugmentations >= 30 &&
        this.money >= 100000000000 &&
        (this.hacking_skill >= 2500 ||
            (this.strength >= 1500 && this.defense >= 1500 &&
             this.dexterity >= 1500 && this.agility >= 1500))) {
        invitedFactions.push(daedalusFac);
    }

    //The Covenant
    var covenantFac = Factions["The Covenant"];
    if (!covenantFac.isBanned && !covenantFac.isMember && !covenantFac.alreadyInvited &&
        numAugmentations >= 30 &&
        this.money >= 75000000000 &&
        this.hacking_skill >= 850 &&
        this.strength >= 850 &&
        this.defense >= 850 &&
        this.dexterity >= 850 &&
        this.agility >= 850) {
        invitedFactions.push(covenantFac);
    }

    //ECorp
    var ecorpFac = Factions["ECorp"];
    if (!ecorpFac.isBanned && !ecorpFac.isMember && !ecorpFac.alreadyInvited &&
        this.companyName == Locations.AevumECorp && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(ecorpFac);
    }

    //MegaCorp
    var megacorpFac = Factions["MegaCorp"];
    if (!megacorpFac.isBanned && !megacorpFac.isMember && !megacorpFac.alreadyInvited &&
        this.companyName == Locations.Sector12MegaCorp && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(megacorpFac);
    }

    //Bachman & Associates
    var bachmanandassociatesFac = Factions["Bachman & Associates"];
    if (!bachmanandassociatesFac.isBanned && !bachmanandassociatesFac.isMember &&
        !bachmanandassociatesFac.alreadyInvited &&
        this.companyName == Locations.AevumBachmanAndAssociates && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(bachmanandassociatesFac);
    }

    //Blade Industries
    var bladeindustriesFac = Factions["Blade Industries"];
    if (!bladeindustriesFac.isBanned && !bladeindustriesFac.isMember && !bladeindustriesFac.alreadyInvited &&
        this.companyName == Locations.Sector12BladeIndustries && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(bladeindustriesFac);
    }

    //NWO
    var nwoFac = Factions["NWO"];
    if (!nwoFac.isBanned && !nwoFac.isMember && !nwoFac.alreadyInvited &&
        this.companyName == Locations.VolhavenNWO && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(nwoFac);
    }

    //Clarke Incorporated
    var clarkeincorporatedFac = Factions["Clarke Incorporated"];
    if (!clarkeincorporatedFac.isBanned && !clarkeincorporatedFac.isMember && !clarkeincorporatedFac.alreadyInvited &&
        this.companyName == Locations.AevumClarkeIncorporated && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(clarkeincorporatedFac);
    }

    //OmniTek Incorporated
    var omnitekincorporatedFac = Factions["OmniTek Incorporated"];
    if (!omnitekincorporatedFac.isBanned && !omnitekincorporatedFac.isMember && !omnitekincorporatedFac.alreadyInvited &&
        this.companyName == Locations.VolhavenOmniTekIncorporated && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(omnitekincorporatedFac);
    }

    //Four Sigma
    var foursigmaFac = Factions["Four Sigma"];
    if (!foursigmaFac.isBanned && !foursigmaFac.isMember && !foursigmaFac.alreadyInvited &&
        this.companyName == Locations.Sector12FourSigma && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(foursigmaFac);
    }

    //KuaiGong International
    var kuaigonginternationalFac = Factions["KuaiGong International"];
    if (!kuaigonginternationalFac.isBanned && !kuaigonginternationalFac.isMember &&
        !kuaigonginternationalFac.alreadyInvited &&
        this.companyName == Locations.ChongqingKuaiGongInternational && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(kuaigonginternationalFac);
    }

    //Fulcrum Secret Technologies - If u've unlocked fulcrum secret technolgoies server and have a high rep with the company
    var fulcrumsecrettechonologiesFac = Factions["Fulcrum Secret Technologies"];
    var fulcrumSecretServer = AllServers[SpecialServerIps[SpecialServerNames.FulcrumSecretTechnologies]];
    if (fulcrumSecretServer == null) {
        console.log("ERROR: Could not find Fulcrum Secret Technologies Server");
    } else {
        if (!fulcrumsecrettechonologiesFac.isBanned && !fulcrumsecrettechonologiesFac.isMember &&
            !fulcrumsecrettechonologiesFac.alreadyInvited &&
            fulcrumSecretServer.manuallyHacked &&
            this.companyName == Locations.AevumFulcrumTechnologies && companyRep >= 250000) {
            invitedFactions.push(fulcrumsecrettechonologiesFac);
        }
    }

    //BitRunners
    var bitrunnersFac = Factions["BitRunners"];
    var homeComp = this.getHomeComputer();
    var bitrunnersServer = AllServers[SpecialServerIps[SpecialServerNames.BitRunnersServer]];
    if (bitrunnersServer == null) {
        console.log("ERROR: Could not find BitRunners Server");
    } else if (!bitrunnersFac.isBanned && !bitrunnersFac.isMember && bitrunnersServer.manuallyHacked &&
               !bitrunnersFac.alreadyInvited && this.hacking_skill >= 500 && homeComp.maxRam >= 128) {
        invitedFactions.push(bitrunnersFac);
    }

    //The Black Hand
    var theblackhandFac = Factions["The Black Hand"];
    var blackhandServer = AllServers[SpecialServerIps[SpecialServerNames.TheBlackHandServer]];
    if (blackhandServer == null) {
        console.log("ERROR: Could not find The Black Hand Server");
    } else if (!theblackhandFac.isBanned && !theblackhandFac.isMember && blackhandServer.manuallyHacked &&
               !theblackhandFac.alreadyInvited && this.hacking_skill >= 350 && homeComp.maxRam >= 64) {
        invitedFactions.push(theblackhandFac);
    }

    //NiteSec
    var nitesecFac = Factions["NiteSec"];
    var nitesecServer = AllServers[SpecialServerIps[SpecialServerNames.NiteSecServer]];
    if (nitesecServer == null) {
        console.log("ERROR: Could not find NiteSec Server");
    } else if (!nitesecFac.isBanned && !nitesecFac.isMember && nitesecServer.manuallyHacked &&
               !nitesecFac.alreadyInvited && this.hacking_skill >= 200 && homeComp.maxRam >= 32) {
        invitedFactions.push(nitesecFac);
    }

    //Chongqing
    var chongqingFac = Factions["Chongqing"];
    if (!chongqingFac.isBanned && !chongqingFac.isMember && !chongqingFac.alreadyInvited &&
        this.money >= 20000000 && this.city == Locations.Chongqing) {
        invitedFactions.push(chongqingFac);
    }

    //Sector-12
    var sector12Fac = Factions["Sector-12"];
    if (!sector12Fac.isBanned && !sector12Fac.isMember && !sector12Fac.alreadyInvited &&
        this.money >= 15000000 && this.city == Locations.Sector12) {
        invitedFactions.push(sector12Fac);
    }

    //New Tokyo
    var newtokyoFac = Factions["New Tokyo"];
    if (!newtokyoFac.isBanned && !newtokyoFac.isMember && !newtokyoFac.alreadyInvited &&
        this.money >= 20000000 && this.city == Locations.NewTokyo) {
        invitedFactions.push(newtokyoFac);
    }

    //Aevum
    var aevumFac = Factions["Aevum"];
    if (!aevumFac.isBanned && !aevumFac.isMember  && !aevumFac.alreadyInvited &&
        this.money >= 40000000 && this.city == Locations.Aevum) {
        invitedFactions.push(aevumFac);
    }

    //Ishima
    var ishimaFac = Factions["Ishima"];
    if (!ishimaFac.isBanned && !ishimaFac.isMember && !ishimaFac.alreadyInvited &&
        this.money >= 30000000 && this.city == Locations.Ishima) {
        invitedFactions.push(ishimaFac);
    }

    //Volhaven
    var volhavenFac = Factions["Volhaven"];
    if (!volhavenFac.isBanned && !volhavenFac.isMember && !volhavenFac.alreadyInvited &&
        this.money >= 50000000 && this.city == Locations.Volhaven) {
        invitedFactions.push(volhavenFac);
    }

    //Speakers for the Dead
    var speakersforthedeadFac = Factions["Speakers for the Dead"];
    if (!speakersforthedeadFac.isBanned && !speakersforthedeadFac.isMember && !speakersforthedeadFac.alreadyInvited &&
        this.hacking_skill >= 100 && this.strength >= 300 && this.defense >= 300 &&
        this.dexterity >= 300 && this.agility >= 300 && this.numPeopleKilled >= 10 &&
        this.numPeopleKilledTotal >= 100 && this.karma <= -45 && this.companyName != Locations.Sector12CIA &&
        this.companyName != Locations.Sector12NSA) {
        invitedFactions.push(speakersforthedeadFac);
    }

    //The Dark Army
    var thedarkarmyFac = Factions["The Dark Army"];
    if (!thedarkarmyFac.isBanned && !thedarkarmyFac.isMember && !thedarkarmyFac.alreadyInvited &&
        this.hacking_skill >= 300 && this.strength >= 300 && this.defense >= 300 &&
        this.dexterity >= 300 && this.agility >= 300 && this.city == Locations.Chongqing &&
        this.numPeopleKilled >= 5 && this.karma <= -45 && this.companyName != Locations.Sector12CIA &&
        this.companyName != Locations.Sector12NSA) {
        invitedFactions.push(thedarkarmyFac);
    }

    //The Syndicate
    var thesyndicateFac = Factions["The Syndicate"];
    if (!thesyndicateFac.isBanned && !thesyndicateFac.isMember && !thesyndicateFac.alreadyInvited &&
        this.hacking_skill >= 200 && this.strength >= 200 && this.defense >= 200 &&
        this.dexterity >= 200 && this.agility >= 200 &&
        (this.city == Locations.Aevum || this.city == Locations.Sector12) &&
        this.money >= 10000000 && this.karma <= -90 &&
        this.companyName != Locations.Sector12CIA && this.companyName != Locations.Sector12NSA) {
        invitedFactions.push(thesyndicateFac);
    }

    //Silhouette
    var silhouetteFac = Factions["Silhouette"];
    if (!silhouetteFac.isBanned && !silhouetteFac.isMember && !silhouetteFac.alreadyInvited &&
        (this.companyPosition.positionName == CompanyPositions.CTO.positionName ||
         this.companyPosition.positionName == CompanyPositions.CFO.positionName ||
         this.companyPosition.positionName == CompanyPositions.CEO.positionName) &&
         this.money >= 15000000 && this.karma <= -22) {
        invitedFactions.push(silhouetteFac);
    }

    //Tetrads
    var tetradsFac = Factions["Tetrads"];
    if (!tetradsFac.isBanned && !tetradsFac.isMember && !tetradsFac.alreadyInvited &&
        (this.city == Locations.Chongqing || this.city == Locations.NewTokyo ||
        this.city == Locations.Ishima) && this.strength >= 75 && this.defense >= 75 &&
        this.dexterity >= 75 && this.agility >= 75 && this.karma <= -18) {
        invitedFactions.push(tetradsFac);
    }

    //SlumSnakes
    var slumsnakesFac = Factions["Slum Snakes"];
    if (!slumsnakesFac.isBanned && !slumsnakesFac.isMember && !slumsnakesFac.alreadyInvited &&
        this.strength >= 30 && this.defense >= 30 && this.dexterity >= 30 &&
        this.agility >= 30 && this.karma <= -9 && this.money >= 1000000) {
        invitedFactions.push(slumsnakesFac);
    }

    //Netburners
    var netburnersFac = Factions["Netburners"];
    var totalHacknetRam = 0;
    var totalHacknetCores = 0;
    var totalHacknetLevels = 0;
    for (var i = 0; i < Player.hacknetNodes.length; ++i) {
        totalHacknetLevels += Player.hacknetNodes[i].level;
        totalHacknetRam += Player.hacknetNodes[i].ram;
        totalHacknetCores += Player.hacknetNodes[i].cores;
    }
    if (!netburnersFac.isBanned && !netburnersFac.isMember && !netburnersFac.alreadyInvited &&
        this.hacking_skill >= 80 && totalHacknetRam >= 8 &&
        totalHacknetCores >= 4 && totalHacknetLevels >= 100) {
        invitedFactions.push(netburnersFac);
    }

    //Tian Di Hui
    var tiandihuiFac = Factions["Tian Di Hui"];
    if (!tiandihuiFac.isBanned &&  !tiandihuiFac.isMember && !tiandihuiFac.alreadyInvited &&
        this.money >= 1000000 && this.hacking_skill >= 50 &&
        (this.city == Locations.Chongqing || this.city == Locations.NewTokyo ||
         this.city == Locations.Ishima)) {
        invitedFactions.push(tiandihuiFac);
    }

    //CyberSec
    var cybersecFac = Factions["CyberSec"];
    var cybersecServer = AllServers[SpecialServerIps[SpecialServerNames.CyberSecServer]];
    if (cybersecServer == null) {
        console.log("ERROR: Could not find CyberSec Server");
    } else if (!cybersecFac.isBanned && !cybersecFac.isMember && cybersecServer.manuallyHacked &&
               !cybersecFac.alreadyInvited && this.hacking_skill >= 50) {
        invitedFactions.push(cybersecFac);
    }

    return invitedFactions;
}

inviteToFaction = function(faction) {
    if (Settings.SuppressFactionInvites) {
        faction.alreadyInvited = true;
        Player.factionInvitations.push(faction.name);
    } else {
        factionInvitationBoxCreate(faction);
    }
}

joinFaction = function(faction) {
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

leaveFaction = function(faction) {
    faction.isMember = false;
    var i = Player.factions.indexOf(faction.name);
    if (i > -1) {
        Player.factions.splice(i, 1);
    }

    //Unban from faction
    if (faction.name == "Chongqing") {
        Factions["Sector-12"].isBanned = false;
        Factions["Aevum"].isBanned = false;
        Factions["Volhaven"].isBanned = false;
    } else if (faction.name == "Sector-12") {
        Factions["Chongqing"].isBanned = false;
        Factions["New Tokyo"].isBanned = false;
        Factions["Ishima"].isBanned = false;
        Factions["Volhaven"].isBanned = false;
    } else if (faction.name == "New Tokyo") {
        Factions["Sector-12"].isBanned = false;
        Factions["Aevum"].isBanned = false;
        Factions["Volhaven"].isBanned = false;
    } else if (faction.name == "Aevum") {
        Factions["Chongqing"].isBanned = false;
        Factions["New Tokyo"].isBanned = false;
        Factions["Ishima"].isBanned = false;
        Factions["Volhaven"].isBanned = false;
    } else if (faction.name == "Ishima") {
        Factions["Sector-12"].isBanned = false;
        Factions["Aevum"].isBanned = false;
        Factions["Volhaven"].isBanned = false;
    } else if (faction.name == "Volhaven") {
        Factions["Chongqing"].isBanned = false;
        Factions["Sector-12"].isBanned = false;
        Factions["New Tokyo"].isBanned = false;
        Factions["Aevum"].isBanned = false;
        Factions["Ishima"].isBanned = false;
    }
}

//Displays the HTML content for a specific faction
displayFactionContent = function(factionName) {
	var faction = Factions[factionName];
    document.getElementById("faction-name").innerHTML = factionName;
    document.getElementById("faction-info").innerHTML = "<i>" + faction.info + "</i>";
    document.getElementById("faction-reputation").innerHTML = "Reputation: " + formatNumber(faction.playerReputation, 4) +
                                                              "<span class='tooltiptext'>You will earn " +
                                                              formatNumber(faction.playerReputation / CONSTANTS.FactionReputationToFavor, 4) +
                                                              " faction favor upon resetting after installing an Augmentation</span>";
    document.getElementById("faction-favor").innerHTML = "Faction Favor: " + formatNumber(faction.favor, 4) +
                                                         "<span class='tooltiptext'>Faction favor increases the rate at which " +
                                                         "you earn reputation for this faction by 1% per favor. Faction favor " +
                                                         "is gained whenever you reset after installing an Augmentation. The amount of " +
                                                         "favor you gain depends on how much reputation you have with the faction</span>";

	var hackDiv 			= document.getElementById("faction-hack-div");
	var fieldWorkDiv 		= document.getElementById("faction-fieldwork-div");
	var securityWorkDiv 	= document.getElementById("faction-securitywork-div");
    var donateDiv           = document.getElementById("faction-donate-div");

	//Set new event listener for all of the work buttons
    //The old buttons need to be replaced to clear the old event listeners
    var newHackButton = clearEventListeners("faction-hack-button");
    var newFieldWorkButton = clearEventListeners("faction-fieldwork-button");
    var newSecurityWorkButton = clearEventListeners("faction-securitywork-button");
    var newDonateWorkButton = clearEventListeners("faction-donate-button");

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
            if (Player.money < numMoneyDonate) {
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

    //Set new event listener for the purchase augmentation buttons
    //The old button needs to be replaced to clear the old event listeners
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

	if (faction.isMember) {
        if (faction.favor >= 150) {
            donateDiv.style.display = "inline";
        } else {
            donateDiv.style.display = "none";
        }

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
            case "Fulcrum Secret Technologies":
                hackDiv.style.display = "inline";
				fieldWorkDiv.style.display = "none";
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
            case "Silhouette":
                hackDiv.style.display = "inline";
                fieldWorkDiv.style.display = "inline";
                securityWorkDiv.style.display = "none";
                break;
            case "Tetrads":
                hackDiv.style.display = "none";
                fieldWorkDiv.style.display = "inline";
                securityWorkDiv.style.display = "inline";
                break;
            case "Slum Snakes":
                hackDiv.style.display = "none";
                fieldWorkDiv.style.display = "inline";
                securityWorkDiv.style.display = "inline";
                break;
            case "Netburners":
                hackDiv.style.display = "inline";
                fieldWorkDiv.style.display = "none";
                securityWorkDiv.style.display = "none";
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

displayFactionAugmentations = function(factionName) {
    document.getElementById("faction-augmentations-page-desc").innerHTML = "Lists all augmentations that are available to purchase from " + factionName;
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

function processPassiveFactionRepGain(numCycles) {
    var numTimesGain = (numCycles / 600) * Player.faction_rep_mult;
    for (var name in Factions) {
		if (Factions.hasOwnProperty(name)) {
			var faction = Factions[name];

			//TODO Get hard value of 1 rep per "rep gain cycle"" for now..
            //maybe later make this based on
            //a player's 'status' like how powerful they are and how much money they have
            if (faction.isMember) {faction.playerReputation += numTimesGain;}
		}
	}
}
