//Netburner Company class
//    Note: Company Positions can be loaded every time with init() but Company class needs
//          to be saved/loaded from localStorage
function Company(name, salaryMult, expMult, jobStatReqOffset) {
    this.companyName        = name;
    this.info               = "";
    this.companyPositions   = [];   //Names (only name, not object) of all company positions
    this.perks              = [];   //Available Perks
    this.salaryMultiplier   = salaryMult;   //Multiplier for base salary
    this.expMultiplier      = expMult;      //Multiplier for base exp gain
    
    //The additional levels you need in the relevant stat to qualify for a job.
    //E.g the offset for a megacorporation will be high, let's say 200, so the
    //stat level you'd need to get an intern job would be 200 instead of 1. 
    this.jobStatReqOffset   = jobStatReqOffset;    
    
    //Player-related properties for company
    this.isPlayerEmployed   = false;
    this.playerPosition     = "";   //Name (only name, not object) of the current position player holds
    this.playerReputation   = 1;    //"Reputation" within company, gain reputation by working for company
    this.favor              = 0;
};

Company.prototype.setInfo = function(inf) {
    this.info = inf;
}

Company.prototype.addPosition = function(pos) {
    this.companyPositions.push(pos.positionName); //Company object holds only name of positions
}

Company.prototype.addPositions = function(positions) {
    for (var i = 0; i < positions.length; i++) {
        this.addPosition(positions[i]);
    }
}

Company.prototype.hasPosition = function(pos) {
    for (var i = 0; i < this.companyPositions.length; ++i) {
        if (pos.positionName == this.companyPositions[i]) {
            return true;
        }
    }
    return false;
}

Company.prototype.gainFavor = function() {
    if (this.favor == null || this.favor == undefined) {this.favor = 0;}
    this.favor += (this.playerReputation / CONSTANTS.CompanyReputationToFavor);
}

Company.prototype.toJSON = function() {
    return Generic_toJSON("Company", this);
}

Company.fromJSON = function(value) {
    return Generic_fromJSON(Company, value.data);
}

Reviver.constructors.Company = Company;

//Object that defines a position within a Company and its requirements
function CompanyPosition(name, reqHack, reqStr, reqDef, reqDex, reqAgi, reqCha, reqRep, salary) {
    this.positionName       = name;
    this.requiredHacking    = reqHack;
    this.requiredStrength   = reqStr;
    this.requiredDefense    = reqDef;
    this.requiredDexterity  = reqDex;
    this.requiredAgility    = reqAgi;
    this.requiredCharisma   = reqCha;
    this.requiredReputation = reqRep;
    
    //Base salary for a position. This will be multiplied by a company-specific multiplier. Better companies will have
    //higher multipliers.
    //
    //NOTE: This salary denotes the $ gained every loop (200 ms)
    this.baseSalary         = salary;
};

//Set the parameters that are used to determine how good/effective the Player is at a job. 
//The Player's "effectiveness" at a job determines how much reputation he gains when he works
//
//NOTE: These parameters should total to 100, such that each parameter represents a "weighting" of how
//        important that stat/skill is for the job
CompanyPosition.prototype.setPerformanceParameters = function(hackEff, strEff, defEff, dexEff, agiEff, chaEff) {
    if (hackEff + strEff + defEff + dexEff + agiEff + chaEff != 100) {
        console.log("CompanyPosition.setPerformanceParameters() arguments do not total to 100");
        return;
    }
    this.hackingEffectiveness   = hackEff;
    this.strengthEffectiveness  = strEff;
    this.defenseEffectiveness   = defEff;
    this.dexterityEffectiveness = dexEff;
    this.agilityEffectiveness   = agiEff;
    this.charismaEffectiveness  = chaEff;
}

//Set the stat/skill experience a Player should gain for working at a CompanyPosition. The experience is per game loop (200 ms)
//These will be constant for a single position, but is affected by a company-specific multiplier
CompanyPosition.prototype.setExperienceGains = function(hack, str, def, dex, agi, cha) {
    this.hackingExpGain         = hack;
    this.strengthExpGain        = str;
    this.defenseExpGain         = def;
    this.dexterityExpGain       = dex;
    this.agilityExpGain         = agi;
    this.charismaExpGain        = cha;
}

//Calculate a player's effectiveness at a certain job. Returns the amount of job reputation
//that should be gained every game loop (200 ms)
CompanyPosition.prototype.calculateJobPerformance = function(hacking, str, def, dex, agi, cha) {
    var hackRatio   = this.hackingEffectiveness   * hacking / CONSTANTS.MaxSkillLevel;
    var strRatio    = this.strengthEffectiveness  * str / CONSTANTS.MaxSkillLevel;
    var defRatio    = this.defenseEffectiveness   * def / CONSTANTS.MaxSkillLevel;
    var dexRatio    = this.dexterityEffectiveness * dex / CONSTANTS.MaxSkillLevel;
    var agiRatio    = this.agilityEffectiveness   * agi / CONSTANTS.MaxSkillLevel;
    var chaRatio    = this.charismaEffectiveness  * cha / CONSTANTS.MaxSkillLevel;
    return (hackRatio + strRatio + defRatio + dexRatio + agiRatio + chaRatio) / 100;
}

CompanyPosition.prototype.isSoftwareJob = function() {
    if (this.positionName == "Software Engineering Intern" || 
        this.positionName == "Junior Software Engineer" || 
        this.positionName == "Senior Software Engineer" || 
        this.positionName == "Lead Software Developer" || 
        this.positionName == "Head of Software" ||
        this.positionName == "Head of Engineering" || 
        this.positionName == "Vice President of Technology" || 
        this.positionName == "Chief Technology Officer") {
            return true;
    }
    return false;
}

CompanyPosition.prototype.isITJob = function() {
    if (this.positionName == "IT Intern" || 
        this.positionName == "IT Analyst" || 
        this.positionName == "IT Manager" || 
        this.positionName == "Systems Administrator") {
            return true;
    }
    return false;
}

CompanyPosition.prototype.isSecurityEngineerJob = function() {
    if (this.positionName == "Security Engineer") {
        return true;
    }
    return false;
}

CompanyPosition.prototype.isNetworkEngineerJob = function() {
    if (this.positionName == "Network Engineer" || this.positionName == "Network Administrator") {
        return true;
    }
    return false;
}

CompanyPosition.prototype.isBusinessJob = function() {
    if (this.positionName == "Business Intern" ||
        this.positionName == "Business Analyst" ||
        this.positionName == "Business Manager" ||
        this.positionName == "Operations Manager" ||
        this.positionName == "Chief Financial Officer" ||
        this.positionName == "Chief Executive Officer") {
            return true;
    }
    return false;
}

CompanyPosition.prototype.isSecurityJob = function() {
    if (this.positionName == "Security Guard" ||
        this.positionName == "Police Officer" ||
        this.positionName == "Security Officer" ||
        this.positionName == "Security Supervisor" ||
        this.positionName == "Head of Security") {
            return true;
    }
    return false;
}

CompanyPosition.prototype.isAgentJob = function() {
    if (this.positionName == "Field Agent" || 
        this.positionName == "Secret Agent" || 
        this.positionName == "Special Operative") {
            return true;
    }
    return false;
}

CompanyPosition.prototype.isSoftwareConsultantJob = function() {
    if (this.positionName == "Software Consultant" || 
        this.positionName == "Senior Software Consultant") {return true;}
    return false;
}

CompanyPosition.prototype.isBusinessConsultantJob = function() {
    if (this.positionName == "Business Consultant" ||
        this.positionName == "Senior Business Consultant") {return true;}
    return false;
}

CompanyPosition.prototype.isPartTimeJob = function() {
    if (this.isSoftwareConsultantJob() ||
        this.isBusinessConsultantJob() || 
        this.positionName == "Part-time Waiter" ||
        this.positionName == "Part-time Employee") {return true;}
    return false;
}

CompanyPosition.prototype.toJSON = function() {
    return Generic_toJSON("CompanyPosition", this);
}

CompanyPosition.fromJSON = function(value) {
    return Generic_fromJSON(CompanyPosition, value.data);
}

Reviver.constructors.CompanyPosition = CompanyPosition;

CompanyPositions = {
    //Constructor: CompanyPosition(name, reqHack, reqStr, reqDef, reqDex, reqAgi, reqCha, reqRep, salary)

    //Software
    SoftwareIntern:             new CompanyPosition("Software Engineering Intern", 1, 0, 0, 0, 0, 0, 0, 13),
    JuniorDev:                  new CompanyPosition("Junior Software Engineer", 51, 0, 0, 0, 0, 0, 8000, 32),
    SeniorDev:                  new CompanyPosition("Senior Software Engineer", 251, 0, 0, 0, 0, 51, 32000, 63),
    LeadDev:                    new CompanyPosition("Lead Software Developer", 401, 0, 0, 0, 0, 151, 144000, 210),
    
    //TODO Through darkweb, maybe?
    FreelanceDeveloper:         new CompanyPosition("Freelance Developer", 0, 0, 0, 0, 0, 0, 0, 0),
    
    SoftwareConsultant:         new CompanyPosition("Software Consultant", 51, 0, 0, 0, 0, 0, 0, 22),
    SeniorSoftwareConsultant:   new CompanyPosition("Senior Software Consultant", 251, 0, 0, 0, 0, 51, 0, 45),
    
    //IT
    ITIntern:                   new CompanyPosition("IT Intern", 1, 0, 0, 0, 0, 0, 0, 11),
    ITAnalyst:                  new CompanyPosition("IT Analyst", 26, 0, 0, 0, 0, 0, 5000, 25),
    ITManager:                  new CompanyPosition("IT Manager", 151, 0, 0, 0, 0, 51, 22000, 48),
    SysAdmin:                   new CompanyPosition("Systems Administrator", 251, 0, 0, 0, 0, 76, 120000, 165),
    SecurityEngineer:           new CompanyPosition("Security Engineer", 151, 0, 0, 0, 0, 26, 28000, 55),
    NetworkEngineer:            new CompanyPosition("Network Engineer", 151, 0, 0, 0, 0, 26, 28000, 55),
    NetworkAdministrator:       new CompanyPosition("Network Administrator", 251, 0, 0, 0, 0, 76, 120000, 165),
    
    //Technology management
    HeadOfSoftware:             new CompanyPosition("Head of Software", 501, 0, 0, 0, 0, 251, 288000, 330),
    HeadOfEngineering:          new CompanyPosition("Head of Engineering", 501, 0, 0, 0, 0, 251, 576000, 660),
    VicePresident:              new CompanyPosition("Vice President of Technology", 601, 0, 0, 0, 0, 401, 1152000, 990),
    CTO:                        new CompanyPosition("Chief Technology Officer", 751, 0, 0, 0, 0, 501, 4608000, 1100),
    
    //Business
    BusinessIntern:             new CompanyPosition("Business Intern", 1, 0, 0, 0, 0, 1, 0, 18),
    BusinessAnalyst:            new CompanyPosition("Business Analyst", 6, 0, 0, 0, 0, 51, 8000, 42),
    BusinessManager:            new CompanyPosition("Business Manager", 51, 0, 0, 0, 0, 101, 32000, 84),
    OperationsManager:          new CompanyPosition("Operations Manager", 51, 0, 0, 0, 0, 226, 144000, 275),
    CFO:                        new CompanyPosition("Chief Financial Officer", 76, 0, 0, 0, 0, 501, 576000, 800),
    CEO:                        new CompanyPosition("Chief Executive Officer", 101, 0, 0, 0, 0, 751, 4608000, 1500),
    
    BusinessConsultant:         new CompanyPosition("Business Consultant", 6, 0, 0, 0, 0, 51, 0, 28),
    SeniorBusinessConsultant:   new CompanyPosition("Senior Business Consultant", 51, 0, 0, 0, 0, 226, 0, 175),
    
    //Non-tech/management jobs
    PartTimeWaiter:             new CompanyPosition("Part-time Waiter", 0, 0, 0, 0, 0, 0, 0, 9),
    PartTimeEmployee:           new CompanyPosition("Part-time Employee", 0, 0, 0, 0, 0, 0, 0, 9),
    
    Waiter:                     new CompanyPosition("Waiter", 0, 0, 0, 0, 0, 0, 0, 11),
    Employee:                   new CompanyPosition("Employee", 0, 0, 0, 0, 0, 0, 0, 11),
    PoliceOfficer:              new CompanyPosition("Police Officer", 11, 101, 101, 101, 101, 51, 8000, 36),
    PoliceChief:                new CompanyPosition("Police Chief", 101, 301, 301, 301, 301, 151, 32000, 175),
    SecurityGuard:              new CompanyPosition("Security Guard", 0, 51, 51, 51, 51, 1, 0, 20),
    SecurityOfficer:            new CompanyPosition("Security Officer", 26, 151, 151, 151, 151, 51, 8000, 75),
    SecuritySupervisor:         new CompanyPosition("Security Supervisor", 26, 251, 251, 251, 251, 101, 32000, 275),
    HeadOfSecurity:             new CompanyPosition("Head of Security",  51, 501, 501, 501, 501, 151, 144000, 550),
    FieldAgent:                 new CompanyPosition("Field Agent",       101, 101, 101, 101, 101, 101, 8000, 55),
    SecretAgent:                new CompanyPosition("Secret Agent",      201, 251, 251, 251, 251, 201, 32000, 190),
    SpecialOperative:           new CompanyPosition("Special Operative", 251, 501, 501, 501, 501, 251, 144000, 425),
    
    init: function() {
        //Argument order: hack, str, def, dex, agi, cha
        //Software
        CompanyPositions.SoftwareIntern.setPerformanceParameters(90, 0, 0, 0, 0, 10);
        CompanyPositions.SoftwareIntern.setExperienceGains(.1, 0, 0, 0, 0, .02);
        CompanyPositions.JuniorDev.setPerformanceParameters(85, 0, 0, 0, 0, 15);
        CompanyPositions.JuniorDev.setExperienceGains(.2, 0, 0, 0, 0, .04);
        CompanyPositions.SeniorDev.setPerformanceParameters(75, 0, 0, 0, 0, 25);
        CompanyPositions.SeniorDev.setExperienceGains(.4, 0, 0, 0, 0, .08);
        CompanyPositions.LeadDev.setPerformanceParameters(70, 0, 0, 0, 0, 30);
        CompanyPositions.LeadDev.setExperienceGains(.5, 0, 0, 0, 0, .1);
        
        CompanyPositions.SoftwareConsultant.setPerformanceParameters(80, 0, 0, 0, 0, 20);
        CompanyPositions.SoftwareConsultant.setExperienceGains(.175, 0, 0, 0, 0, .03);
        CompanyPositions.SeniorSoftwareConsultant.setPerformanceParameters(75, 0, 0, 0, 0, 25);
        CompanyPositions.SeniorSoftwareConsultant.setExperienceGains(.35, 0, 0, 0, 0, .06);
        
        //Security
        CompanyPositions.ITIntern.setPerformanceParameters(90, 0, 0, 0, 0, 10);
        CompanyPositions.ITIntern.setExperienceGains(.05, 0, 0, 0, 0, .01);
        CompanyPositions.ITAnalyst.setPerformanceParameters(85, 0, 0, 0, 0, 15);
        CompanyPositions.ITAnalyst.setExperienceGains(.15, 0, 0, 0, 0, .02);
        CompanyPositions.ITManager.setPerformanceParameters(75, 0, 0, 0, 0, 25);
        CompanyPositions.ITManager.setExperienceGains(.4, 0, 0, 0, 0, .1);
        CompanyPositions.SysAdmin.setPerformanceParameters(80, 0, 0, 0, 0, 20);
        CompanyPositions.SysAdmin.setExperienceGains(.5, 0, 0, 0, 0, .05);
        CompanyPositions.SecurityEngineer.setPerformanceParameters(85, 0, 0, 0, 0, 15);
        CompanyPositions.SecurityEngineer.setExperienceGains(0.4, 0, 0, 0, 0, .05);
        CompanyPositions.NetworkEngineer.setPerformanceParameters(85, 0, 0, 0, 0, 15);
        CompanyPositions.NetworkEngineer.setExperienceGains(0.4, 0, 0, 0, 0, .05);
        CompanyPositions.NetworkAdministrator.setPerformanceParameters(75, 0, 0, 0, 0, 25);
        CompanyPositions.NetworkAdministrator.setExperienceGains(0.5, 0, 0, 0, 0, .1);
        
        //Technology management
        CompanyPositions.HeadOfSoftware.setPerformanceParameters(65, 0, 0, 0, 0, 35);
        CompanyPositions.HeadOfSoftware.setExperienceGains(1, 0, 0, 0, 0, .5);
        CompanyPositions.HeadOfEngineering.setPerformanceParameters(60, 0, 0, 0, 0, 40);
        CompanyPositions.HeadOfEngineering.setExperienceGains(1.1, 0, 0, 0, 0, .5);
        CompanyPositions.VicePresident.setPerformanceParameters(60, 0, 0, 0, 0, 40);
        CompanyPositions.VicePresident.setExperienceGains(1.2, 0, 0, 0, 0, .6);
        CompanyPositions.CTO.setPerformanceParameters(50, 0, 0, 0, 0, 50);
        CompanyPositions.CTO.setExperienceGains(1.5, 0, 0, 0, 1);
        
        //Business
        CompanyPositions.BusinessIntern.setPerformanceParameters(10, 0, 0, 0, 0, 90);
        CompanyPositions.BusinessIntern.setExperienceGains(.01, 0, 0, 0, 0, .1);
        CompanyPositions.BusinessAnalyst.setPerformanceParameters(20, 0, 0, 0, 0, 80);
        CompanyPositions.BusinessAnalyst.setExperienceGains(.02, 0, 0, 0, 0, .2);
        CompanyPositions.BusinessManager.setPerformanceParameters(15, 0, 0, 0, 0, 85);
        CompanyPositions.BusinessManager.setExperienceGains(.02, 0, 0, 0, 0, .4);
        CompanyPositions.OperationsManager.setPerformanceParameters(15, 0, 0, 0, 0, 85);
        CompanyPositions.OperationsManager.setExperienceGains(.02, 0, 0, 0, 0, .4);
        CompanyPositions.CFO.setPerformanceParameters(10, 0, 0, 0, 0, 90);
        CompanyPositions.CFO.setExperienceGains(.05, 0, 0, 0, 0, 1);
        CompanyPositions.CEO.setPerformanceParameters(10, 0, 0, 0, 0, 90);
        CompanyPositions.CEO.setExperienceGains(.1, 0, 0, 0, 0, 1.5);
        
        CompanyPositions.BusinessConsultant.setPerformanceParameters(20, 0, 0, 0, 0, 80);
        CompanyPositions.BusinessConsultant.setExperienceGains(.015, 0, 0, 0, 0, .15);
        CompanyPositions.SeniorBusinessConsultant.setPerformanceParameters(15, 0, 0, 0, 0, 85);
        CompanyPositions.SeniorBusinessConsultant.setExperienceGains(.015, 0, 0, 0, 0, .3);
        
        //Non-tech/management jobs
        CompanyPositions.PartTimeWaiter.setPerformanceParameters(0, 10, 0, 10, 10, 70);
        CompanyPositions.PartTimeWaiter.setExperienceGains(0, .0075, .0075, .0075, .0075, .04);
        CompanyPositions.PartTimeEmployee.setPerformanceParameters(0, 10, 0, 10, 10, 70);
        CompanyPositions.PartTimeEmployee.setExperienceGains(0, .0075, .0075, .0075, .0075, .03);
        
        CompanyPositions.Waiter.setPerformanceParameters(0, 10, 0, 10, 10, 70);
        CompanyPositions.Waiter.setExperienceGains(0, .01, .01, .01, .01, .05);
        CompanyPositions.Employee.setPerformanceParameters(0, 10, 0, 10, 10, 70);
        CompanyPositions.Employee.setExperienceGains(0, .01, .01, .01, .01, .04);
        CompanyPositions.SecurityGuard.setPerformanceParameters(5, 20, 20, 20, 20, 15);
        CompanyPositions.SecurityGuard.setExperienceGains(.01, .02, .02, .02, .02, .01);
        CompanyPositions.PoliceOfficer.setPerformanceParameters(5, 20, 20, 20, 20, 15);
        CompanyPositions.PoliceOfficer.setExperienceGains(.01, .04, .04, .04, .04, .02);
        CompanyPositions.PoliceChief.setPerformanceParameters(5, 20, 20, 20, 20, 15);
        CompanyPositions.PoliceChief.setExperienceGains(.02, .06, .06, .06, .06, .05);
        CompanyPositions.SecurityOfficer.setPerformanceParameters(10, 20, 20, 20, 20, 10);
        CompanyPositions.SecurityOfficer.setExperienceGains(.02, .06, .06, .06, .06, .04);
        CompanyPositions.SecuritySupervisor.setPerformanceParameters(10, 15, 15, 15, 15, 30);
        CompanyPositions.SecuritySupervisor.setExperienceGains(.02, .06, .06, .06, .06, .08);
        CompanyPositions.HeadOfSecurity.setPerformanceParameters(10, 15, 15, 15, 15, 30);
        CompanyPositions.HeadOfSecurity.setExperienceGains(.05, .1, .1, .1, .1, .1);
        CompanyPositions.FieldAgent.setPerformanceParameters(10, 15, 15, 20, 20, 20);
        CompanyPositions.FieldAgent.setExperienceGains(.04, .06, .06, .06, .06, .04);
        CompanyPositions.SecretAgent.setPerformanceParameters(15, 15, 15, 20, 20, 15);
        CompanyPositions.SecretAgent.setExperienceGains(.08, .1, .1, .1, .1, .08);
        CompanyPositions.SpecialOperative.setPerformanceParameters(15, 15, 15, 20, 20, 15);
        CompanyPositions.SpecialOperative.setExperienceGains(.12, .15, .15, .15, .15, .12);
    }
}

//Returns the next highest position in the company for the relevant career/field
//I.E returns what your next job would be if you qualify for a promotion
getNextCompanyPosition = function(currPos) {
    //Software
    if (currPos.positionName == CompanyPositions.SoftwareIntern.positionName) {
        return CompanyPositions.JuniorDev;
    }
    if (currPos.positionName == CompanyPositions.JuniorDev.positionName) {
        return CompanyPositions.SeniorDev; 
    }
    if (currPos.positionName == CompanyPositions.SeniorDev.positionName) {
        return CompanyPositions.LeadDev;
    }
    if (currPos.positionName == CompanyPositions.LeadDev.positionname) {
        return CompanyPositions.HeadOfSoftware;
    }
    
    //Software Consultant
    if (currPos.positionName == CompanyPositions.SoftwareConsultant.positionName) {
        return CompanyPositions.SeniorSoftwareConsultant;
    }
    
    //IT
    if (currPos.positionName == CompanyPositions.ITIntern.positionName) {
        return CompanyPositions.ITAnalyst;
    }
    if (currPos.positionName == CompanyPositions.ITAnalyst.positionName) {
        return CompanyPositions.ITManager;
    }
    if (currPos.positionName == CompanyPositions.ITManager.positionName) {
        return CompanyPositions.SysAdmin;
    }
    if (currPos.positionName == CompanyPositions.SysAdmin.positionName) {
        return CompanyPositions.HeadOfEngineering;
    }
    
    //Security/Network Engineer
    if (currPos.positionName == CompanyPositions.SecurityEngineer.positionName) {
        return CompanyPositions.HeadOfEngineering;
    }
    if (currPos.positionName == CompanyPositions.NetworkEngineer.positionName) {
        return CompanyPositions.NetworkAdministrator;
    }
    if (currPos.positionName == CompanyPositions.NetworkAdministrator.positionName) {
        return CompanyPositions.HeadOfEngineering;
    }
        
    //Technology management
    if (currPos.positionName == CompanyPositions.HeadOfSoftware.positionName) {
        return CompanyPositions.HeadOfEngineering;
    }
    if (currPos.positionName == CompanyPositions.HeadOfEngineering.positionName) {
        return CompanyPositions.VicePresident;
    }
    if (currPos.positionName == CompanyPositions.VicePresident.positionName) {
        return CompanyPositions.CTO;
    }
    
    //Business
    if (currPos.positionName == CompanyPositions.BusinessIntern.positionName) {
        return CompanyPositions.BusinessAnalyst;
    }
    if (currPos.positionName == CompanyPositions.BusinessAnalyst.positionName) {
        return CompanyPositions.BusinessManager;
    }
    if (currPos.positionName == CompanyPositions.BusinessManager.positionName) {
        return CompanyPositions.OperationsManager;
    }
    if (currPos.positionName == CompanyPositions.OperationsManager.positionName) {
        return CompanyPositions.CFO;
    }
    if (currPos.positionName == CompanyPositions.CFO.positionName) {
        return CompanyPositions.CEO;
    }
    
    //Business consultant
    if (currPos.positionName == CompanyPositions.BusinessConsultant.positionName) {
        return CompanyPositions.SeniorBusinessConsultant;
    }
    
    //Police
    if (currPos.positionName == CompanyPositions.PoliceOfficer.positionName) {
        return CompanyPositions.PoliceChief;
    }
    
    //Security
    if (currPos.positionName == CompanyPositions.SecurityGuard.positionName) {
        return CompanyPositions.SecurityOfficer;
    }
    if (currPos.positionName == CompanyPositions.SecurityOfficer.positionName) {
        return CompanyPositions.SecuritySupervisor;
    }
    if (currPos.positionName == CompanyPositions.SecuritySupervisor.positionName) {
        return CompanyPositions.HeadOfSecurity;
    }

    //Agent
    if (currPos.positionName == CompanyPositions.FieldAgent.positionName) {
        return CompanyPositions.SecretAgent;
    }
    if (currPos.positionName == CompanyPositions.SecretAgent.positionName) {
        return CompanyPositions.SpecialOperative;
    }
    
    return null;
}

/* Initialize all companies. Only called when creating new game/prestiging. Otherwise companies are
 * usually loaded from localStorage */
initCompanies = function() {
    /* Companies that also have servers */
    //Megacorporations
    var ECorp = new Company(Locations.AevumECorp, 3.0, 3.0, 249);
    ECorp.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.AevumECorp)) {
        ECorp.favor = Companies[Locations.AevumECorp].favor;
        delete Companies[Locations.AevumECorp];
    }
    AddToCompanies(ECorp);
    
    var MegaCorp = new Company(Locations.Sector12MegaCorp, 3.0, 3.0, 249);
    MegaCorp.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.Sector12MegaCorp)) {
        MegaCorp.favor = Companies[Locations.Sector12MegaCorp].favor;
        delete Companies[Locations.Sector12MegaCorp];
    }
    AddToCompanies(MegaCorp);
    
    var BachmanAndAssociates = new Company(Locations.AevumBachmanAndAssociates, 2.6, 2.6, 224);
    BachmanAndAssociates.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.AevumBachmanAndAssociates)) {
        BachmanAndAssociates.favor = Companies[Locations.AevumBachmanAndAssociates].favor;
        delete Companies[Locations.AevumBachmanAndAssociates];
    }
    AddToCompanies(BachmanAndAssociates);
    
    var BladeIndustries = new Company(Locations.Sector12BladeIndustries, 2.75, 2.75, 224);
    BladeIndustries.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.Sector12BladeIndustries)) {
        BladeIndustries.favor = Companies[Locations.Sector12BladeIndustries].favor;
        delete Companies[Locations.Sector12BladeIndustries];
    }
    AddToCompanies(BladeIndustries);
    
    var NWO = new Company(Locations.VolhavenNWO, 2.75, 2.75, 249);
    NWO.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.VolhavenNWO)) {
        NWO.favor = Companies[Locations.VolhavenNWO].favor;
        delete Companies[Locations.VolhavenNWO];
    }
    AddToCompanies(NWO);
    
    var ClarkeIncorporated = new Company(Locations.AevumClarkeIncorporated, 2.25, 2.25, 224);
    ClarkeIncorporated.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.AevumClarkeIncorporated)) {
        ClarkeIncorporated.favor = Companies[Locations.AevumClarkeIncorporated].favor;
        delete Companies[Locations.AevumClarkeIncorporated];
    }
    AddToCompanies(ClarkeIncorporated);
    
    var OmniTekIncorporated = new Company(Locations.VolhavenOmniTekIncorporated, 2.25, 2.25, 224);
    OmniTekIncorporated.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.VolhavenOmniTekIncorporated)) {
        OmniTekIncorporated.favor = Companies[Locations.VolhavenOmniTekIncorporated].favor;
        delete Companies[Locations.VolhavenOmniTekIncorporated];
    }
    AddToCompanies(OmniTekIncorporated);
    
    var FourSigma = new Company(Locations.Sector12FourSigma, 2.5, 2.5, 224);
    FourSigma.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.Sector12FourSigma)) {
        FourSigma.favor = Companies[Locations.Sector12FourSigma].favor;
        delete Companies[Locations.Sector12FourSigma];
    }
    AddToCompanies(FourSigma);
    
    var KuaiGongInternational = new Company(Locations.ChongqingKuaiGongInternational, 2.2, 2.2, 224);
    KuaiGongInternational.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.ChongqingKuaiGongInternational)) {
        KuaiGongInternational.favor = Companies[Locations.ChongqingKuaiGongInternational].favor;
        delete Companies[Locations.ChongqingKuaiGongInternational];
    }
    AddToCompanies(KuaiGongInternational);
    
    //Technology and communication companies ("Large" servers)
    var FulcrumTechnologies = new Company(Locations.AevumFulcrumTechnologies, 2.0, 2.0, 224);
    FulcrumTechnologies.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO]);
    if (companyExists(Locations.AevumFulcrumTechnologies)) {
        FulcrumTechnologies.favor = Companies[Locations.AevumFulcrumTechnologies].favor;
        delete Companies[Locations.AevumFulcrumTechnologies];
    }
    AddToCompanies(FulcrumTechnologies);
    
    var StormTechnologies = new Company(Locations.IshimaStormTechnologies, 1.8, 1.8, 199);
    StormTechnologies.addPositions([
        CompanyPositions.SoftwareIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SysAdmin,
        CompanyPositions.SecurityEngineer, CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.HeadOfEngineering,
        CompanyPositions.VicePresident, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager, CompanyPositions.CFO,
        CompanyPositions.CEO]);
    if (companyExists(Locations.IshimaStormTechnologies)) {
        StormTechnologies.favor = Companies[Locations.IshimaStormTechnologies].favor;
        delete Companies[Locations.IshimaStormTechnologies];
    }
    AddToCompanies(StormTechnologies);
    
    var DefComm = new Company(Locations.NewTokyoDefComm, 1.75, 1.75, 199);
    DefComm.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO, CompanyPositions.CFO, CompanyPositions.CEO]);
    if (companyExists(Locations.NewTokyoDefComm)) {
        DefComm.favor = Companies[Locations.NewTokyoDefComm].favor;
        delete Companies[Locations.NewTokyoDefComm];
    }
    AddToCompanies(DefComm);
    
    var HeliosLabs =  new Company(Locations.VolhavenHeliosLabs, 1.8, 1.8, 199);
    HeliosLabs.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO, CompanyPositions.CFO, CompanyPositions.CEO]);
    if (companyExists(Locations.VolhavenHeliosLabs)) {
        HeliosLabs.favor = Companies[Locations.VolhavenHeliosLabs].favor;
        delete Companies[Locations.VolhavenHeliosLabs];
    }
    AddToCompanies(HeliosLabs); 
    
    var VitaLife = new Company(Locations.NewTokyoVitaLife, 1.8, 1.8, 199);
    VitaLife.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO, CompanyPositions.BusinessManager,
        CompanyPositions.OperationsManager, CompanyPositions.CFO, CompanyPositions.CEO]);
    if (companyExists(Locations.NewTokyoVitaLife)) {
        VitaLife.favor = Companies[Locations.NewTokyoVitaLife].favor;
        delete Companies[Locations.NewTokyoVitaLife];
    }
    AddToCompanies(VitaLife);
    
    var IcarusMicrosystems = new Company(Locations.Sector12IcarusMicrosystems, 1.9, 1.9, 199);
    IcarusMicrosystems.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO, CompanyPositions.BusinessManager,
        CompanyPositions.OperationsManager, CompanyPositions.CFO, CompanyPositions.CEO]);
    if (companyExists(Locations.Sector12IcarusMicrosystems)) {
        IcarusMicrosystems.favor = Companies[Locations.Sector12IcarusMicrosystems].favor;
        delete Companies[Locations.Sector12IcarusMicrosystems];
    }
    AddToCompanies(IcarusMicrosystems);
    
    var UniversalEnergy = new Company(Locations.Sector12UniversalEnergy, 2.0, 2.0, 199);
    UniversalEnergy.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO, CompanyPositions.BusinessManager,
        CompanyPositions.OperationsManager, CompanyPositions.CFO, CompanyPositions.CEO]);
    if (companyExists(Locations.Sector12UniversalEnergy)) {
        UniversalEnergy.favor = Companies[Locations.Sector12UniversalEnergy].favor;
        delete Companies[Locations.Sector12UniversalEnergy];
    }
    AddToCompanies(UniversalEnergy); 
    
    var GalacticCybersystems = new Company(Locations.AevumGalacticCybersystems, 1.9, 1.9, 199);
    GalacticCybersystems.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO, CompanyPositions.BusinessManager,
        CompanyPositions.OperationsManager, CompanyPositions.CFO, CompanyPositions.CEO]);
    if (companyExists(Locations.AevumGalacticCybersystems)) {
        GalacticCybersystems.favor = Companies[Locations.AevumGalacticCybersystems].favor;
        delete Companies[Locations.AevumGalacticCybersystems];
    }
    AddToCompanies(GalacticCybersystems);
    
    //Defense Companies ("Large" Companies)
    var AeroCorp = new Company(Locations.AevumAeroCorp, 1.7, 1.7, 199);
    AeroCorp.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO,
        CompanyPositions.OperationsManager, CompanyPositions.CFO, CompanyPositions.CEO,
        CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer, CompanyPositions.SecuritySupervisor,
        CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.AevumAeroCorp)) {
        AeroCorp.favor = Companies[Locations.AevumAeroCorp].favor;
        delete Companies[Locations.AevumAeroCorp];
    }
    AddToCompanies(AeroCorp);
    
    var OmniaCybersystems = new Company(Locations.VolhavenOmniaCybersystems, 1.7, 1.7, 199);
    OmniaCybersystems.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO,
        CompanyPositions.OperationsManager, CompanyPositions.CFO, CompanyPositions.CEO,
        CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer, CompanyPositions.SecuritySupervisor,
        CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.VolhavenOmniaCybersystems)) {
        OmniaCybersystems.favor = Companies[Locations.VolhavenOmniaCybersystems].favor;
        delete Companies[Locations.VolhavenOmniaCybersystems];
    }
    AddToCompanies(OmniaCybersystems);
    
    var SolarisSpaceSystems = new Company(Locations.ChongqingSolarisSpaceSystems, 1.7, 1.7, 199);
    SolarisSpaceSystems.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO,
        CompanyPositions.OperationsManager, CompanyPositions.CFO, CompanyPositions.CEO,
        CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer, CompanyPositions.SecuritySupervisor,
        CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.ChongqingSolarisSpaceSystems)) {
        SolarisSpaceSystems.favor = Companies[Locations.ChongqingSolarisSpaceSystems].favor;
        delete Companies[Locations.ChongqingSolarisSpaceSystems];
    }
    AddToCompanies(SolarisSpaceSystems);
    
    var DeltaOne = new Company(Locations.Sector12DeltaOne, 1.6, 1.6, 199);
    DeltaOne.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.CTO,
        CompanyPositions.OperationsManager, CompanyPositions.CFO, CompanyPositions.CEO,
        CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer, CompanyPositions.SecuritySupervisor,
        CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.Sector12DeltaOne)) {
        DeltaOne.favor = Companies[Locations.Sector12DeltaOne].favor;
        delete Companies[Locations.Sector12DeltaOne];
    }
    AddToCompanies(DeltaOne);
    
    //Health, medicine, pharmaceutical companies ("Large" servers)
    var GlobalPharmaceuticals = new Company(Locations.NewTokyoGlobalPharmaceuticals, 1.8, 1.8, 224);
    GlobalPharmaceuticals.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager,
        CompanyPositions.CFO, CompanyPositions.CEO, CompanyPositions.SecurityGuard,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.NewTokyoGlobalPharmaceuticals)) {
        GlobalPharmaceuticals.favor = Companies[Locations.NewTokyoGlobalPharmaceuticals].favor;
        delete Companies[Locations.NewTokyoGlobalPharmaceuticals];
    }
    AddToCompanies(GlobalPharmaceuticals);
    
    var NovaMedical = new Company(Locations.IshimaNovaMedical, 1.75, 1.75, 199);
    NovaMedical.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.ITIntern, CompanyPositions.BusinessIntern,
        CompanyPositions.JuniorDev, CompanyPositions.SeniorDev, CompanyPositions.LeadDev,
        CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITAnalyst, CompanyPositions.ITManager, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator,
        CompanyPositions.HeadOfSoftware, CompanyPositions.CTO, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager,
        CompanyPositions.CFO, CompanyPositions.CEO, CompanyPositions.SecurityGuard,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.IshimaNovaMedical)) {
        NovaMedical.favor = Companies[Locations.IshimaNovaMedical].favor;
        delete Companies[Locations.IshimaNovaMedical];
    }
    AddToCompanies(NovaMedical);

    //Other large companies
    var CIA = new Company(Locations.Sector12CIA, 2.0, 2.0, 149); 
    CIA.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.ITIntern, CompanyPositions.ITAnalyst,
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity, CompanyPositions.FieldAgent,
        CompanyPositions.SecretAgent, CompanyPositions.SpecialOperative]);
    if (companyExists(Locations.Sector12CIA)) {
        CIA.favor = Companies[Locations.Sector12CIA].favor;
        delete Companies[Locations.Sector12CIA];
    }
    AddToCompanies(CIA);
    
    var NSA = new Company(Locations.Sector12NSA, 2.0, 2.0, 149);
    NSA.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.ITIntern, CompanyPositions.ITAnalyst,
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity, CompanyPositions.FieldAgent,
        CompanyPositions.SecretAgent, CompanyPositions.SpecialOperative]);
    if (companyExists(Locations.Sector12NSA)) {
        NSA.favor = Companies[Locations.Sector12NSA].favor;
        delete Companies[Locations.Sector12NSA];
    }
    AddToCompanies(NSA);
    
    var WatchdogSecurity = new Company(Locations.AevumWatchdogSecurity, 1.5, 1.5, 124);
    WatchdogSecurity.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev,  CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst,
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity, CompanyPositions.FieldAgent,
        CompanyPositions.SecretAgent, CompanyPositions.SpecialOperative]);
    if (companyExists(Locations.AevumWatchdogSecurity)) {
        WatchdogSecurity.favor = Companies[Locations.AevumWatchdogSecurity].favor;
        delete Companies[Locations.AevumWatchdogSecurity];
    }
    AddToCompanies(WatchdogSecurity);
    
    //"Medium level" companies
    var LexoCorp = new Company(Locations.VolhavenLexoCorp, 1.4, 1.4, 99);
    LexoCorp.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev,  CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst,
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.HeadOfSoftware, CompanyPositions.CTO,
        CompanyPositions.BusinessIntern, CompanyPositions.BusinessAnalyst,
        CompanyPositions.OperationsManager, CompanyPositions.CFO, CompanyPositions.CEO, 
        CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer, CompanyPositions.HeadOfSecurity]);
    if (companyExists(Locations.VolhavenLexoCorp)) {
        LexoCorp.favor = Companies[Locations.VolhavenLexoCorp].favor;
        delete Companies[Locations.VolhavenLexoCorp];
    }
    AddToCompanies(LexoCorp);
    
    var RhoConstruction = new Company(Locations.AevumRhoConstruction, 1.3, 1.3, 49);
    RhoConstruction.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.BusinessIntern, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager]);
    if (companyExists(Locations.AevumRhoConstruction)) {
        RhoConstruction.favor = Companies[Locations.AevumRhoConstruction].favor;
        delete Companies[Locations.AevumRhoConstruction];
    }
    AddToCompanies(RhoConstruction);
    
    var AlphaEnterprises = new Company(Locations.Sector12AlphaEnterprises, 1.5, 1.5, 99);
    AlphaEnterprises.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev,  CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.BusinessIntern, CompanyPositions.BusinessAnalyst,
        CompanyPositions.BusinessManager, CompanyPositions.OperationsManager]);
    if (companyExists(Locations.Sector12AlphaEnterprises)) {
        AlphaEnterprises.favor = Companies[Locations.Sector12AlphaEnterprises].favor;
        delete Companies[Locations.Sector12AlphaEnterprises];
    }
    AddToCompanies(AlphaEnterprises);
    
    var AevumPolice = new Company(Locations.AevumPolice, 1.3, 1.3, 99);
    AevumPolice.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.SecurityGuard, CompanyPositions.PoliceOfficer]);
    if (companyExists(Locations.AevumPolice)) {
        AevumPolice.favor = Companies[Locations.AevumPolice].favor;
        delete Companies[Locations.AevumPolice];
    }
    AddToCompanies(AevumPolice);
    
    var SysCoreSecurities = new Company(Locations.VolhavenSysCoreSecurities, 1.3, 1.3, 124);
    SysCoreSecurities.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.CTO]);
    if (companyExists(Locations.VolhavenSysCoreSecurities)) {
        SysCoreSecurities.favor = Companies[Locations.VolhavenSysCoreSecurities].favor;
        delete Companies[Locations.VolhavenSysCoreSecurities];
    }
    AddToCompanies(SysCoreSecurities);
    
    var CompuTek = new Company(Locations.VolhavenCompuTek, 1.2, 1.2, 74);
    CompuTek.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev,  CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.CTO]);
    if (companyExists(Locations.VolhavenCompuTek)) {
        CompuTek.favor = Companies[Locations.VolhavenCompuTek].favor;
        delete Companies[Locations.VolhavenCompuTek];
    }
    AddToCompanies(CompuTek);
    
    var NetLinkTechnologies = new Company(Locations.AevumNetLinkTechnologies, 1.2, 1.2, 99);
    NetLinkTechnologies.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev,  CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst, 
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.CTO]);
    if (companyExists(Locations.AevumNetLinkTechnologies)) {
        NetLinkTechnologies.favor = Companies[Locations.AevumNetLinkTechnologies].favor;
        delete Companies[Locations.AevumNetLinkTechnologies];
    }
    AddToCompanies(NetLinkTechnologies);
    
    var CarmichaelSecurity = new Company(Locations.Sector12CarmichaelSecurity, 1.2, 1.2, 74);
    CarmichaelSecurity.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant, 
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst,
        CompanyPositions.ITManager, CompanyPositions.SysAdmin, CompanyPositions.SecurityEngineer,
        CompanyPositions.NetworkEngineer, CompanyPositions.NetworkAdministrator, CompanyPositions.HeadOfSoftware,
        CompanyPositions.HeadOfEngineering, CompanyPositions.SecurityGuard, CompanyPositions.SecurityOfficer,
        CompanyPositions.SecuritySupervisor, CompanyPositions.HeadOfSecurity, CompanyPositions.FieldAgent,
        CompanyPositions.SecretAgent, CompanyPositions.SpecialOperative]);
    if (companyExists(Locations.Sector12CarmichaelSecurity)) {
        CarmichaelSecurity.favor = Companies[Locations.Sector12CarmichaelSecurity].favor;
        delete Companies[Locations.Sector12CarmichaelSecurity];
    }
    AddToCompanies(CarmichaelSecurity);
    
    //"Low level" companies
    var FoodNStuff = new Company(Locations.Sector12FoodNStuff, 1, 1, 0);
    FoodNStuff.addPositions([CompanyPositions.Employee, CompanyPositions.PartTimeEmployee]);
    if (companyExists(Locations.Sector12FoodNStuff)) {
        FoodNStuff.favor = Companies[Locations.Sector12FoodNStuff].favor;
        delete Companies[Locations.Sector12FoodNStuff];
    }
    AddToCompanies(FoodNStuff);
    
    var JoesGuns = new Company(Locations.Sector12JoesGuns, 1, 1, 0);
    JoesGuns.addPositions([CompanyPositions.Employee, CompanyPositions.PartTimeEmployee]);
    if (companyExists(Locations.Sector12JoesGuns)) {
        JoesGuns.favor = Companies[Locations.Sector12JoesGuns].favor;
        delete Companies[Locations.Sector12JoesGuns];
    }
    AddToCompanies(JoesGuns);
    
    var OmegaSoftware = new Company(Locations.IshimaOmegaSoftware, 1.1, 1.1, 49);
    OmegaSoftware.addPositions([
        CompanyPositions.SoftwareIntern, CompanyPositions.JuniorDev, CompanyPositions.SeniorDev,
        CompanyPositions.LeadDev, CompanyPositions.SoftwareConsultant, CompanyPositions.SeniorSoftwareConsultant,
        CompanyPositions.ITIntern, CompanyPositions.ITAnalyst,
        CompanyPositions.ITManager, CompanyPositions.CTO, CompanyPositions.CEO]);
    if (companyExists(Locations.IshimaOmegaSoftware)) {
        OmegaSoftware.favor = Companies[Locations.IshimaOmegaSoftware].favor;
        delete Companies[Locations.IshimaOmegaSoftware];
    }
    AddToCompanies(OmegaSoftware);
    
    /* Companies that do not have servers */
    var NoodleBar = new Company(Locations.NewTokyoNoodleBar, 1, 1, 0);
    NoodleBar.addPositions([CompanyPositions.Waiter, CompanyPositions.PartTimeWaiter]);
    if (companyExists(Locations.NewTokyoNoodleBar)) {
        NoodleBar.favor = Companies[Locations.NewTokyoNoodleBar].favor;
        delete Companies[Locations.NewTokyoNoodleBar];
    }
    AddToCompanies(NoodleBar);
}

//Map of all companies that exist in the game, indexed by their name
Companies = {}

//Add a Company object onto the map of all Companies in the game
AddToCompanies = function (company) {
    var name = company.companyName;
    Companies[name] = company;
}

function companyExists(name) {
    return Companies.hasOwnProperty(name);
}