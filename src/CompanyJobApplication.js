/* Functions that handle applying for different jobs/positions in a Company */

//Determines the job that the Player should get (if any) at the current
//company
PlayerObject.prototype.applyForJob = function(entryPosType) {
    var currCompany = Companies[this.companyName];
    var currPositionName = this.companyPosition.positionName;
	var company = Companies[this.location]; //Company being applied to
	
    var pos = entryPosType;
    //var pos = CompanyPositions.SoftwareIntern;
    
    while (true) {
        if (Engine.Debug) {console.log("Determining qualification for next Company Position");}
        var newPos = getNextCompanyPosition(pos);
        
        //Check if this company has this position
        if (company.hasPosition(newPos)) {
            if (newPos == null) {
                if (Engine.Debug) {
                    console.log("Player already at highest position, cannot go any higher");
                }
                break;
            }
            
            if (!this.isQualified(company, newPos)) {
                //If player not qualified for next job, break loop so player will be given current job
                break;
            }
            pos = newPos;
        } else {
            //TODO Post something about having no position to be promoted to
            return;
        }
        
    }
    
    //Check if the determined job is the same as the player's current job
    if (currCompany.companyName == company.companyName &&
        pos.positionName == currPositionName) {
        //TODO Post something about not being able to get a promotion
        return; //Same job, do nothing
    }
	
    //Lose reputation from a Company if you are leaving it for another job
	if (currCompany.companyName != company.companyName) {
        company.playerReputation -= 1000;
    }
    
    this.companyName = company.companyName;
    this.companyPosition = pos;
    
    //TODO Post something about being promoted/getting new job
}

PlayerObject.prototype.applyForSoftwareJob = function() {
    applyForJob(CompanyPositions.SoftwareIntern);
}

PlayerObject.prototype.applyForItJob = function() {
	applyForJob(CompanyPositions.ITIntern);
}

PlayerObject.prototype.applyForSecurityEngineerJob = function() {
    var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.SecurityEngineer)) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.SecurityEngineer;
        //TODO Post that u got job
    } else {
        //TODO Post not qualified
    }
}

PlayerObject.prototype.applyForNetworkEngineerJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.NetworkEngineer)) {
        applyForJob(CompanyPositions.NetworkEngineer);
    } else {
        //TODO Say you aren't qualified
    }
}

PlayerObject.prototype.applyForBusinessJob = function() {
	applyForJob(CompanyPositions.BusinessIntern);
}

PlayerObject.prototype.applyForSecurityJob = function() {
    //TODO If case for POlice departments
	applyForJob(CompanyPositions.SecurityGuard);
}

PlayerObject.prototype.applyForAgentJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.FieldAgent)) {
        applyForJob(CompanyPositions.FieldAgent);
    } else {
        //TODO Post not qualified
    }
}

PlayerObject.prototype.applyForEmployeeJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.Employee) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.Employee;
        //TODO Post that u got the job
    } else {
        //TODO Post not qualified
    }
}

PlayerObject.prototype.applyForWaiterJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.Waiter) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.Waiter;
        //TODO Post that u got job
    } else {
        //TODO Post not qualified
    }
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