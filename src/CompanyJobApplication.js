/* Functions that handle applying for different jobs/positions in a Company */

PlayerObject.prototype.applyForSoftwareJob = function() {
    var currCompany = Companies[this.companyName];
    var currPositionName = //TODO
	var company = Companies[this.location]; //Company being applied to
	
    var pos = CompanyPositions.SoftwareIntern;
    
    while (true) {
        if (Engine.Debug) {console.log("Determining qualification for next COmpany Position");}
        var newPos = getNextCompanyPosition(pos);
        if (newPos == null) {
            if (Engine.Debug) {
                console.log("Player already at highest position, cannot promote");
            }
            break;
        }
        
        if (!this.isQualified(company, newPos)) {
            //If player not qualified for next job, break loop so player will be given current job
            break;
        }
        pos = newPos;
    }
    
    //Check if the determined job is the same as the player's current job
    if (currCompany.companyName == company.companyName &&
        pos.positionName == )
	
    //Lose reputation from old company b/c Player is leaving
	If Player is not currently in this position, give it to him
	
}

PlayerObject.prototype.applyForItJob = function() {
	
}

PlayerObject.prototype.applyForSecurityEngineerJob = function() {
	
}

PlayerObject.prototype.applyForNetworkEngineerJob = function() {
	
}

PlayerObject.prototype.applyForSusinessJob = function() {
	
}

PlayerObject.prototype.applyForSecurityJob = function() {
	
}

PlayerObject.prototype.applyForAgentJob = function() {
	
}

PlayerObject.prototype.applyForEmployeeJob = function() {
	
}

PlayerObject.prototype.applyForWaiterJob = function() {
	
}

//Checks if the Player is qualified for a certain position
PlayerObject.prototype.isQualified = function(company, position) {
	var offset = company.jobStatReqOffset;
	if (this.hacking_skill >= position.requiredHacking+offset &&
		this.strength 	   >= position.requiredStrength+offset &&
        this.defense       >= position.requiredDefense+offset && 
        this.dexterity     >= position.requiredDexterity+offset &&
        this.agility       >= position.requiredAgility+offset &&
        this.charisma      >= position.requiredCharisma+offset &&
        company.playerReputation >= position.requiredReputation) {
            return true;
    }
    return false;
}