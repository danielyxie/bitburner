/* Perks
 *  Defines Perks that are unlocked when you gain enough reputation in a 
 *  company or faction 
 */
Perks = {
    FreeCoffeeCompanyPerk:          "Free Coffee",
    FreeFoodCompanyPerk:            "Free Food", 
    NetworkingCompanyPerk:          "Networking",
    PersonalTrainerCompanyPerk:     "Personal Trainer",
    KnowledgeBaseCompanyPerk:       "Company Knowledge Base", 
    NootropicsCompanyPerk:          "Company-provided Nootropics",
    
    NetworkingFactionPerk:          "Networking", 
    SupercomputerFactionPerk:       "Remote Supercomputer Use",
    VPNFactionPerk:                 "High-Speed VPN",
    PrivateServerFactionPerk:       "Private Faction Server",
    InsiderKnowledgeFactionPerk:    "Insider Knowledge",
}

function Perk(name, reqRep, info) {
    this.name           = name;
    this.info           = info;
    this.requiredRep    = reqRep;
    
    //Company/faction specific multipliers
    this.money_mult         = 1;
    this.hacking_mult       = 1;
    this.combat_stat_mult   = 1;
    this.labor_stat_mult    = 1;
    this.repmult            = 1;
    
    /* Properties below set when a Perk is gained by the player */
    this.applied        = false;
    
    this.companyPerk    = false;
    this.companyName    = "";
    
    this.factionPerk    = false;
    this.factionName    = "";
}

Perk.prototype.setCompany = function(companyName) {
    if (this.factionPerk) {
        console.log("ERR: Perk cannot be both faction and company perk");
        return;
    }
    this.companyPerk = true;
    this.companyName = companyName;
}

Perk.prototype.setFaction = function(factionName) {
    if (this.companyPerk) {
        console.log("ERR: Perk cannot be both faction and company perk");
        return;
    }
    this.factionPerk = true;
    this.factionName = factionName;
}

Perk.prototype.toJSON = function() {
    return Generic_toJSON("Perk", this);
}

Perk.fromJSON = function(value) {
    return Generic_fromJSON(Perk, value.data);
}

Reviver.constructors.Perk = Perk;

/* Company Perks */
//Free Coffee - Increased money and hacking exp gain
//Free Food - Increased combat stat gain
//Networking - Company Rep Gain Rate + , Charisma exp gain rate + 
//Company Personal Trainer - Increase in combat stat gain rates
//Knowledge Base - Increase hacking skill by some percentage
//Nootropics  - Increase hacking mult, and hacking exp gain mult

/* Faction Perks */
//Networking - Faction Rep Gain Rate + , Chariasma Exp Gain Rate + 
//Remote Supercomputer - increase in hacking speed, chance, and money
//High Speed VPN - Hack chance increase
//Private Server - Gives you a server with a lot of RAM that you can use
//Insider Knowledge - Ppl in faction from other companies have insider information that lets you hack 
//                   other servers easier. Increase in hack chance

applyPerk = function(perk) {
    switch (perk.name) {
        case Perks.FreeCoffeeCompanyPerk:
            break;
        case Perks.FreeFoodCompanyPerk:
            break;
        case Perks.NetworkingCompanyPerk:
            break;
        case Perks.PersonalTrainerCompanyPerk:
            break;
        case Perks.KnowledgeBaseCompanyPerk:
            break;
        case Perks.NootropicsCompanyPerk:
            break;
        case Perks.NetworkingFactionPerk:
            break;
        case Perks.SupercomputerFactionPerk:
            break;
        case Perks.VPNFactionPerk:
            break;
        case Perks.PrivateServerFactionPerk:
            break;
        case Perks.InsiderKnowledgeFactionPerk:
            break;
        default: 
            console.log("WARNING: Unrecognized perk: " + perk.name);
            return;
    }
}

losePerk = function(perk) {
    
}