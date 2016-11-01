//Netburner Company class
function Company() {
	this.companyName = "";
    this.companyPositions = [];
    
    //Player-related properties for company
    this.isPlayerEmployed = false;
    this.playerPosition = false;
    this.playerReputation = 0;  //"Reputation" within company, gain reputation by working for company
};

function CompanyPosition(name, reqHack, reqStr, reqDef, reqDex, reqAgi) {
    this.positionName       = name;
    this.requiredHacking    = reqHack;
    this.requiredStrength   = reqStr;
    this.requiredDefense    = reqDef;
    this.requiredDexterity  = reqDex;
    this.requiredAgility    = reqAgi;
}