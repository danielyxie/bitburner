/* Functions that handle applying for different jobs/positions in a Company */

//Determines the job that the Player should get (if any) at the current
//company
PlayerObject.prototype.applyForJob = function(entryPosType) {
    if (Engine.Debug) {
        console.log("Player.applyForJob() called");
    }
    
    var currCompany = "";
    if (this.companyName != "") {
        currCompany = Companies[this.companyName];
    }
    var currPositionName = "";
    if (this.companyPosition != "") {
        currPositionName = this.companyPosition.positionName;
    }
	var company = Companies[this.location]; //Company being applied to
	
    var pos = entryPosType;
    
    if (!this.isQualified(company, pos)) {
        dialogBoxCreate("You are not qualified for this position");
        return;
    }
    
    while (true) {
        if (Engine.Debug) {console.log("Determining qualification for next Company Position");}
        var newPos = getNextCompanyPosition(pos);
        
        if (newPos == null) {
            if (Engine.Debug) {
                console.log("Player already at highest position, cannot go any higher");
            }
            break;
        }
        
        //Check if this company has this position
        if (company.hasPosition(newPos)) {
            if (!this.isQualified(company, newPos)) {
                //If player not qualified for next job, break loop so player will be given current job
                break;
            }
            pos = newPos;
        } else {
            break;
        }
        
    }
    
    //Check if the determined job is the same as the player's current job
    if (currCompany != "") {
        if (currCompany.companyName == company.companyName &&
            pos.positionName == currPositionName) {
            dialogBoxCreate("Unfortunately, you do not qualify for a promotion");
            return; //Same job, do nothing
        }
    }
    
	
    //Lose reputation from a Company if you are leaving it for another job
    if (currCompany != "") {
        if (currCompany.companyName != company.companyName) {
            company.playerReputation -= 1000;
        }
    }
	
    
    this.companyName = company.companyName;
    this.companyPosition = pos;
    
    dialogBoxCreate("Congratulations! You were offered a new job at ", this.companyName, " as a " + pos.positionName);
}

PlayerObject.prototype.applyForSoftwareJob = function() {
    this.applyForJob(CompanyPositions.SoftwareIntern);
}

PlayerObject.prototype.applyForItJob = function() {
	this.applyForJob(CompanyPositions.ITIntern);
}

PlayerObject.prototype.applyForSecurityEngineerJob = function() {
    var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.SecurityEngineer)) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.SecurityEngineer;
        dialogBoxCreate("Congratulations, you were offered a position at ", this.companyName, " as a Security Engineer!" , "");
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForNetworkEngineerJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.NetworkEngineer)) {
        this.applyForJob(CompanyPositions.NetworkEngineer);
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForBusinessJob = function() {
	this.applyForJob(CompanyPositions.BusinessIntern);
}

PlayerObject.prototype.applyForSecurityJob = function() {
    //TODO If case for POlice departments
	this.applyForJob(CompanyPositions.SecurityGuard);
}

PlayerObject.prototype.applyForAgentJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.FieldAgent)) {
        this.applyForJob(CompanyPositions.FieldAgent);
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForEmployeeJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.Employee)) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.Employee;
        dialogBoxCreate("Congratulations, you are now employed at ", this.companyName, "", "");
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForWaiterJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.Waiter)) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.Waiter;
        dialogBoxCreate("Congratulations, you are now employed as a waiter at ", this.companyName, "", "");
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
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