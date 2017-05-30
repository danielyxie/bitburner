/* Perks
 *  Defines Perks that are unlocked when you gain enough reputation in a 
 *  company or faction 
 */
PerkNames = {
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

PerkInfo = {
    FreeCoffee:         "Your company provides free coffee, improving your focus " + 
                        "and productivity",
    FreeFood:           "Your company provides free healthy and nutritious food",
    NetworkingCompany:  "Working at this company provides many opportunities to " + 
                        "build your professional network!",
    PersonalTrainer:    "Your company provides a free personal trainer to help you train",
    KnowledgeBase:      "The company has a comprehensive knowledge base that " + 
                        "you can use to learn",
    Nootropics:         "Your company provides free nootropics, cognitive-enhancing drugs",
    NetworkingFaction:  "Being a member of this faction provides many opportunities to " + 
                        "build your network of contacts",
    SupercomputerFaction: "You are able to use your Faction's private supercomputer, " + 
                          "giving you unparalleled computing power",
    VPN:                "You are able to use your Faction's high-speed VPN to more securely " + 
                        "access the Internet",
    PrivateServer:      "You are able to use your Faction's private server",
    InsiderKnowledge:   "Other members of the faction give you insider information about other " +
                        "companies and factions"
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

    var freeCoffee = new Perk(PerkNames.FreeCoffeeCompanyPerk, 6000, PerkInfo.FreeCoffee);
    
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
        case PerkNames.FreeCoffeeCompanyPerk:
            //Increase money and hacking exp gain
            Player.hacking_money_mult       *= 1.25;
            Player.hacking_exp_mult         *= 1.25;
            break;
        case PerkNames.FreeFoodCompanyPerk:
            Player.strength_exp_mult        *= 1.2;
            Player.defense_exp_mult         *= 1.2;
            Player.dexterity_exp_mult       *= 1.2;
            Player.agility_exp_mult         *= 1.2;
            break;
        case PerkNames.NetworkingCompanyPerk:
            Player.company_rep_mult         *= 1.1;
            Player.charisma_exp_mult        *= 1.2;
            break;
        case PerkNames.PersonalTrainerCompanyPerk:
            Player.strength_exp_mult        *= 1.15;
            Player.defense_exp_mult         *= 1.15;
            Player.dexterity_exp_mult       *= 1.15;
            Player.agility_exp_mult         *= 1.15;
            break;
        case PerkNames.KnowledgeBaseCompanyPerk:
            break;
        case PerkNames.NootropicsCompanyPerk:
            break;
        case PerkNames.NetworkingFactionPerk:
            break;
        case PerkNames.SupercomputerFactionPerk:
            break;
        case PerkNames.VPNFactionPerk:
            break;
        case PerkNames.PrivateServerFactionPerk:
            break;
        case PerkNames.InsiderKnowledgeFactionPerk:
            break;
        default: 
            console.log("WARNING: Unrecognized perk: " + perk.name);
            return;
    }
}

losePerk = function(perk) {
    
}