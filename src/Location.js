/* Display Location Content when visiting somewhere in the World*/

    
Locations = {
    //Cities
	Aevum: 			"Aevum",
    //AevumDesc:      ""
	Chongqing: 		"Chongqing",
	Sector12: 		"Sector-12",
	NewTokyo: 		"New Tokyo",
	Ishima: 		"Ishima",
	Volhaven: 		"Volhaven",
    
    //Aevum Locations
    AevumTravelAgency:          "Aevum Travel Agency",
    AevumSummitUniversity:      "Summit University",
    AevumECorp:                 "ECorp",
    AevumBachmanAndAssociates:  "Bachman & Associates",
    AevumClarkeIncorporated:    "Clarke Incorporated",
    AevumFulcrumTechnologies:   "Fulcrum Technolgies",
    AevumAeroCorp:              "AeroCorp",
    AevumGalacticCybersystems:  "Galactic Cybersystems",
    AevumWatchdogSecurity:      "Watchdog Security",
    AevumRhoConstruction:       "Rho Construction",
    AevumPolice:                "Aevum Police Headquarters", 
    AevumNetLinkTechnologies:   "NetLink Technologies",
    AevumCrushFitnessGym:       "Crush Fitness Gym",
    AevumSnapFitnessGym:        "Snap Fitness Gym",
    AevumSlums:                 "Aevum Slums",
    
    //Chongqing locations
    ChongqingTravelAgency:          "Chongqing Travel Agency", 
    ChongqingKuaiGongInternational: "KuaiGong International",
    ChongqingSolarisSpaceSystems:   "Solaris Space Systems",
    ChongqingSlums:                 "Chongqing Slums",
    
    //Sector 12
    Sector12TravelAgency:       "Sector-12 Travel Agency",
    Sector12RothmanUniversity:  "Rothman University",
    Sector12MegaCorp:           "MegaCorp",
    Sector12BladeIndustries:    "Blade Industries",
    Sector12FourSigma:          "Four Sigma",
    Sector12IcarusMicrosystems: "Icarus Microsystems",
    Sector12UniversalEnergy:    "Universal Energy",
    Sector12DeltaOne:           "DeltaOne",
    Sector12CIA:                "Central Intelligence Agency",
    Sector12NSA:                "National Security Agency",
    Sector12AlphaEnterprises:   "Alpha Enterprises",
    Sector12CarmichaelSecurity: "Carmichael Security",
    Sector12FoodNStuff:         "FoodNStuff",
    Sector12JoesGuns:           "Joe's Guns",
    Sector12IronGym:            "Iron Gym",
    Sector12PowerhouseGym:      "Powerhouse Gym",
    Sector12Slums:              "Sector-12 Slums",
    
    //New Tokyo
    NewTokyoTravelAgency:           "New Tokyo Travel Agency",
    NewTokyoDefComm:                "DefComm",
    NewTokyoVitaLife:               "VitaLife",
    NewTokyoGlobalPharmaceuticals:  "Global Pharmaceuticals",
    NewTokyoNoodleBar:              "Noodle Bar",
    NewTokyoSlums:                  "New Tokyo Slums",
    
    //Ishima
    IshimaTravelAgency:         "Ishima Travel Agency",
    IshimaStormTechnologies:    "Storm Technologies",
    IshimaNovaMedical:          "Nova Medical",
    IshimaOmegaSoftware:        "Omega Software",
    IshimaSlums:                "Ishima Slums",
    
    //Volhaven
    VolhavenTravelAgency:               "Volhaven Travel Agency",
    VolhavenZBInstituteOfTechnology:    "ZB Institute of Technology",
    VolhavenOmniTekIncorporated:        "OmniTek Incorporated",
    VolhavenNWO:                        "NWO",
    VolhavenHeliosLabs:                 "Helios Labs",
    VolhavenOmniaCybersystems:          "Omnia Cybersystems",
    VolhavenLexoCorp:                   "LexoCorp",
    VolhavenSysCoreSecurities:          "SysCore Securities",
    VolhavenCompuTek:                   "CompuTek",
    VolhavenMilleniumFitnessGym:        "Millenium Fitness Gym",
    VolhavenSlums:                      "Volhaven Slums",
}

displayLocationContent = function() {
	if (Engine.debug) {
		console.log("displayLocationContent() called with location " + Player.location)
	}
    
    var returnToWorld       = document.getElementById("location-return-to-world-button");
    
    var locationName        = document.getElementById("location-name");

    var locationInfo        = document.getElementById("location-info");

    var softwareJob         = document.getElementById("location-software-job");
    var itJob               = document.getElementById("location-it-job");
    var securityEngineerJob = document.getElementById("location-security-engineer-job");
    var networkEngineerJob  = document.getElementById("location-network-engineer-job");
    var businessJob         = document.getElementById("location-business-job");
    var securityJob         = document.getElementById("location-security-job");
    var agentJob            = document.getElementById("location-agent-job");
    var employeeJob         = document.getElementById("location-employee-job");
    var waiterJob           = document.getElementById("location-waiter-job");

    var work                = document.getElementById("location-work");
	
	var jobTitle 			= document.getElementById("location-job-title");
	var jobReputation 		= document.getElementById("location-job-reputation");

    var gymTrainStr         = document.getElementById("location-gym-train-str");
    var gymTrainDef         = document.getElementById("location-gym-train-def");
    var gymTrainDex         = document.getElementById("location-gym-train-dex");
    var gymTrainAgi         = document.getElementById("location-gym-train-agi");
    
    var studyComputerScience= document.getElementById("location-study-computer-science");
    var classDataStructures = document.getElementById("location-data-structures-class");
    var classNetworks       = document.getElementById("location-networks-class");
    var classAlgorithms     = document.getElementById("location-algorithms-class");
    var classManagement     = document.getElementById("location-management-class");
    var classLeadership     = document.getElementById("location-leadership-class");

    var purchase1gb         = document.getElementById("location-purchase-1gb");
    var purchase2gb         = document.getElementById("location-purchase-2gb");
    var purchase4gb         = document.getElementById("location-purchase-4gb");
    var purchase8gb         = document.getElementById("location-purchase-8gb");
    var purchase16gb        = document.getElementById("location-purchase-16gb");
    var purchase32gb        = document.getElementById("location-purchase-32gb");
    var purchase64gb        = document.getElementById("location-purchase-64gb");
    var purchase128gb       = document.getElementById("location-purchase-128gb");
    var purchase256gb       = document.getElementById("location-purchase-256gb");
    var purchase512gb       = document.getElementById("location-purchase-512gb");
    var purchase1tb         = document.getElementById("location-purchase-1tb");
    var purchaseTor         = document.getElementById("location-purchase-tor");
    var purchaseHomeRam     = document.getElementById("location-purchase-home-ram");

    var travelAgencyText    = document.getElementById("location-travel-agency-text");
    var travelToAevum       = document.getElementById("location-travel-to-aevum");
    var travelToChongqing   = document.getElementById("location-travel-to-chongqing");
    var travelToSector12    = document.getElementById("location-travel-to-sector12");
    var travelToNewTokyo    = document.getElementById("location-travel-to-newtokyo");
    var travelToIshima      = document.getElementById("location-travel-to-ishima");
    var travelToVolhaven    = document.getElementById("location-travel-to-volhaven");
	
    var slumsDescText       = document.getElementById("location-slums-description");
    var slumsShoplift       = document.getElementById("location-slums-shoplift");
    var slumsMug            = document.getElementById("location-slums-mug");
    var slumsDealDrugs      = document.getElementById("location-slums-deal-drugs");
    var slumsTrafficArms    = document.getElementById("location-slums-traffic-arms");
    var slumsHomicide       = document.getElementById("location-slums-homicide");
    var slumsKidnap         = document.getElementById("location-slums-kidnap");
    
    var loc = Player.location;
    
    returnToWorld.addEventListener("click", function() {
        Engine.loadWorldContent();
    });

    locationName.innerHTML = loc;
    locationName.style.display = "block";

    locationInfo.style.display = "block";
    
    softwareJob.style.display = "none";
    itJob.style.display = "none";
    securityEngineerJob.style.display = "none";
    networkEngineerJob.style.display = "none";
    businessJob.style.display = "none";
    securityJob.style.display = "none";
    agentJob.style.display = "none";
    employeeJob.style.display = "none";
    waiterJob.style.display = "none";
    
    softwareJob.innerHTML = "Apply for Software Job";
    itJob.innerHTML = "Apply for IT Job";
    securityEngineerJob.innerHTML = "Apply for Security Engineer Job";
    networkEngineerJob.innerHTML = "Apply for Network Engineer Job";
    businessJob.innerHTML = "Apply for Business Job";
    securityJob.innerHTML = "Apply for Security Job";
    agentJob.innerHTML = "Apply for Agent Job";
    employeeJob.innerHTML = "Apply to be an Employee";
    waiterJob.innerHTML = "Apply to be a Waiter";
    
    work.style.display = "none";
    
    gymTrainStr.style.display = "none";
    gymTrainDef.style.display = "none";
    gymTrainDex.style.display = "none";
    gymTrainAgi.style.display = "none";
    
    studyComputerScience.style.display = "none";
    classDataStructures.style.display = "none";
    classNetworks.style.display = "none";
    classAlgorithms.style.display = "none";
    classManagement.style.display = "none";
    classLeadership.style.display = "none";
    
    purchase1gb.style.display = "none";
    purchase2gb.style.display = "none";
    purchase4gb.style.display = "none";
    purchase8gb.style.display = "none";
    purchase16gb.style.display = "none";
    purchase32gb.style.display = "none";
    purchase64gb.style.display = "none";
    purchase128gb.style.display = "none";
    purchase256gb.style.display = "none";
    purchase512gb.style.display = "none";
    purchase1tb.style.display = "none";
    purchaseTor.style.display = "none";
    purchaseHomeRam.style.display = "none";
    
    travelAgencyText.style.display = "none";
    travelToAevum.style.display = "none";
    travelToChongqing.style.display = "none";
    travelToSector12.style.display = "none";
    travelToNewTokyo.style.display = "none";
    travelToIshima.style.display = "none";
    travelToVolhaven.style.display = "none";
    
    slumsDescText.style.display = "none";
    slumsShoplift.style.display = "none";
    slumsMug.style.display = "none";
    slumsDealDrugs.style.display = "none";
    slumsTrafficArms.style.display = "none";
    slumsHomicide.style.display = "none";
    slumsKidnap.style.display = "none";
    
    //Check if the player is employed at this Location. If he is, display the "Work" button,
    //update the job title, etc.
    if (loc == Player.companyName) {
        var company = Companies[loc];
        
        jobTitle.style.display = "block";
        jobReputation.style.display = "block";
        jobTitle.innerHTML = "Job Title: " + Player.companyPosition.positionName;
        jobReputation.innerHTML = "Company reputation: " + (company.playerReputation.toFixed(4)).toLocaleString();
        work.style.display = "block";
        
        work.addEventListener("click", function() {
            Player.startWork();
            return false;
        });
        
        var currPos = Player.companyPosition;
        
        //Change the text for the corresponding position from "Apply for X Job" to "Apply for promotion"
        if (currPos.isSoftwareJob()) {
            softwareJob.innerHTML = "Apply for a promotion (Software)";
        } else if (currPos.isITJob()) {
            itJob.innerHTML = "Apply for a promotion (IT)";
        } else if (currPos.isSecurityEngineerJob()) {
            securityEngineerJob.innerHTML = "Apply for a promotion (Security Engineer)";
        } else if (currPos.isNetworkEngineerJob()) {
            networkEngineerJob.innerHTML = "Apply for a promotion (Network Engineer)";
        } else if (currPos.isBusinessJob()) {
            businessJob.innerHTML = "Apply for a promotion (Business)";
        } else if (currPos.isSecurityJob()) {
            securityJob.innerHTML = "Apply for a promotion (Security)";
        } else if (currPos.isAgentJob()) {
            agentJob.innerHTML = "Apply for a promotion (Agent)";
        }
    } else {
		jobTitle.style.display = "none";
		jobReputation.style.display = "none";
	}
    
    switch (loc) {
        case Locations.AevumTravelAgency: 
            travelAgencyText.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToSector12.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToIshima.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;
            
        case Locations.AevumSummitUniveristy:
            var costMult = 3;
            var expMult = 2;
            displayUniversityLocationContent(costMult);
            setUniversityLocationButtons(costMult, expMult);
            break;
            
        case Locations.AevumECorp:  
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            
            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchase512gb.style.display = "block";
            purchase1tb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            break;
            
        case Locations.AevumBachmanAndAssociates: 
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.AevumClarkeIncorporated:   
			locationInfo.innerHTML = Companies[loc].info;
		
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.AevumFulcrumTechnologies:  
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            
            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchase512gb.style.display = "block";
            purchase1tb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            break;

        case Locations.AevumAeroCorp:        
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.AevumGalacticCybersystems: 
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            break;

        case Locations.AevumWatchdogSecurity:  
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            break;

        case Locations.AevumRhoConstruction: 
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            businessJob.style.display = "block";   
            break;

        case Locations.AevumPolice:     
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            securityJob.style.display = "block";        
            break;

        case Locations.AevumNetLinkTechnologies:  
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            
            purchase1gb.style.display = "block";
            purchase2gb.style.display = "block";
            purchase4gb.style.display = "block";
            purchase8gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            break;

        case Locations.AevumCrushFitnessGym:  
            gymTrainStr.style.display = "block";
            gymTrainDef.style.display = "block";
            gymTrainDex.style.display = "block";
            gymTrainAgi.style.display = "block";
            break;

        case Locations.AevumSnapFitnessGym:  			
            gymTrainStr.style.display = "block";
            gymTrainDef.style.display = "block";
            gymTrainDex.style.display = "block";
            gymTrainAgi.style.display = "block";
            break;

        case Locations.ChongqingTravelAgency:   
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToSector12.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToIshima.style.display = "block";
            travelToVolhaven.style.display = "block";        
            break;

        case Locations.ChongqingKuaiGongInternational:
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.ChongqingSolarisSpaceSystems:  
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;


        case Locations.Sector12TravelAgency:   
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToIshima.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;
            
        case Locations.Sector12RothmanUniversity:
            var costMult = 2;
            var expMult = 1;
            displayUniversityLocationContent(costMult);
            setUniversityLocationButtons(costMult, expMult);
            break;

        case Locations.Sector12MegaCorp:  
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.Sector12BladeIndustries:  
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.Sector12FourSigma:    
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.Sector12IcarusMicrosystems: 
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            break;

        case Locations.Sector12UniversalEnergy:
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            break;

        case Locations.Sector12DeltaOne:      
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.Sector12CIA:     
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            break;

        case Locations.Sector12NSA:          
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            break;

        case Locations.Sector12AlphaEnterprises:
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            businessJob.style.display = "block";
            purchase1gb.style.display = "block";
            purchase2gb.style.display = "block";
            purchase4gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            break;

        case Locations.Sector12CarmichaelSecurity:
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            break;

        case Locations.Sector12FoodNStuff:
			locationInfo.innerHTML = Companies[loc].info;
			
            employeeJob.style.display = "block";
            break;

        case Locations.Sector12JoesGuns:
			locationInfo.innerHTML = Companies[loc].info;
			
            employeeJob.style.display = "block";
            break;

        case Locations.Sector12IronGym:
            gymTrainStr.style.display = "block";
            gymTrainDef.style.display = "block";
            gymTrainDex.style.display = "block";
            gymTrainAgi.style.display = "block";
            break;

        case Locations.Sector12PowerhouseGym:
            gymTrainStr.style.display = "block";
            gymTrainDef.style.display = "block";
            gymTrainDex.style.display = "block";
            gymTrainAgi.style.display = "block";
            break;

        case Locations.NewTokyoTravelAgency: 
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToSector12.style.display = "block";
            travelToIshima.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;

        case Locations.NewTokyoDefComm:
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            break;

        case Locations.NewTokyoVitaLife:
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            break;

        case Locations.NewTokyoGlobalPharmaceuticals: 
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.NewTokyoNoodleBar:      	
			locationInfo.innerHTML = Companies[loc].info;
			
            waiterJob.style.display = "block";
            break;
        

        case Locations.IshimaTravelAgency:
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToSector12.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;

        case Locations.IshimaStormTechnologies:
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "none";
            agentJob.style.display = "none";
            employeeJob.style.display = "none";
            waiterJob.style.display = "none"; 

            purchase32gb.style.display = "block";
            purchase64gb.style.display = "block";
            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchaseHomeRam.style.display = "block";
            break;

        case Locations.IshimaNovaMedical:         
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            break;

        case Locations.IshimaOmegaSoftware:   
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            businessJob.style.display = "block";
            
            purchase4gb.style.display = "block";
            purchase8gb.style.display = "block";
            purchase16gb.style.display = "block";
            purchase32gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            break;

        case Locations.VolhavenTravelAgency:
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToSector12.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToIshima.style.display = "block";
            break;
            
        case Locations.VolhavenZBInstituteOfTechnology:
            var costMult = 4;
            var expMult = 3;
            displayUniversityLocationContent(costMult);
            setUniversityLocationButtons(costMult, expMult);
            break;

        case Locations.VolhavenOmniTekIncorporated:   
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            
            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchase512gb.style.display = "block";
            purchase1tb.style.display = "block";
            break;

        case Locations.VolhavenNWO:      
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.VolhavenHeliosLabs:            
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            break;

        case Locations.VolhavenOmniaCybersystems:
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.VolhavenLexoCorp:
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            break;

        case Locations.VolhavenSysCoreSecurities:     
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            break;

        case Locations.VolhavenCompuTek:       
			locationInfo.innerHTML = Companies[loc].info;
			
            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            
            purchase8gb.style.display = "block";
            purchase16gb.style.display = "block";
            purchase32gb.style.display = "block";
            purchase64gb.style.display = "block";
            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            break;

        case Locations.VolhavenMilleniumFitnessGym:   
            gymTrainStr.style.display = "block";
            gymTrainDef.style.display = "block";
            gymTrainDex.style.display = "block";
            gymTrainAgi.style.display = "block";
            break;
            
        //All Slums
        case Locations.AevumSlums:
        case Locations.ChongqingSlums:
        case Locations.Sector12Slums:
        case Locations.NewTokyokSlums:
        case Locations.IshimaSlums:
        case Locations.VolhavenSlums:
            var shopliftChance = determineCrimeChanceShoplift();
            var mugChance = determineCrimeChanceMug();
            var drugsChance = determineCrimeChanceDealDrugs();
            var armsChance = determineCrimeChanceTraffickArms();
            var homicideChance = determineCrimeChanceHomicide();
            var kidnapChance = determineCrimeChanceKidnap();
            
            slumsDescText.style.display = "block";
            slumsShoplift.style.display = "block";
            slumsShoplift.innerHTML = "Shoplift (" + (shopliftChance*100).toFixed(3) + "% chance of success)";
            slumsMug.style.display = "block";
            slumsMug.innerHTML = "Mug someone (" + (mugChance*100).toFixed(3) + "% chance of success)";
            slumsDealDrugs.style.display = "block";
            slumsDealDrugs.innerHTML = "Deal Drugs (" + (drugsChance*100).toFixed(3) + "% chance of success)";
            slumsTrafficArms.style.display = "block";
            slumsTrafficArms.innerHTML = "Traffick Illegal Arms (" + (armsChance*100).toFixed(3) + "% chance of success)";
            slumsHomicide.style.display = "block";
            slumsHomicide.innerHTML = "Homicide (" + (homicideChance*100).toFixed(3) + "% chance of success)";
            slumsKidnap.style.display = "block";
            slumsKidnap.innerHTML = "Kidnap and Ransom (" + (kidnapChance*100).toFixed(3) + "% chance of success)";
            
            break;
        default:
            console.log("ERROR: INVALID LOCATION");

    }
    
    //Make the "Apply to be Employee and Waiter" texts disappear if you already hold the job
    if (loc == Player.companyName) {
        var currPos = Player.companyPosition;
        
        if (currPos.positionName == CompanyPositions.Employee.positionName) {
            employeeJob.style.display = "none";
        } else if (currPos.positionName == CompanyPositions.Waiter.positionName) {
            waiterJob.style.display = "none";
        }
    }
}

initLocationButtons = function() {
    //Buttons to travel to different locations in World
    aevumTravelAgency = document.getElementById("aevum-travelagency");
    aevumTravelAgency.addEventListener("click", function() {
        Player.location = Locations.AevumTravelAgency;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumSummitUniversity = document.getElementById("aevum-summituniversity");
    aevumSummitUniversity.addEventListener("click", function() {
       Player.location = Locations.AevumSummitUniversity;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumECorp = document.getElementById("aevum-ecorp");
    aevumECorp.addEventListener("click", function() {
        Player.location = Locations.AevumECorp;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumBachmanAndAssociates = document.getElementById("aevum-bachmanandassociates");
    aevumBachmanAndAssociates.addEventListener("click", function() {
        Player.location = Locations.AevumBachmanAndAssociates;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumClarkeIncorporated = document.getElementById("aevum-clarkeincorporated");
    aevumClarkeIncorporated.addEventListener("click", function() {
       Player.location = Locations.AevumClarkeIncorporated; 
       Engine.loadLocationContent();
       return false;
    });
    
    aevumFulcrumTechnologies = document.getElementById("aevum-fulcrumtechnologies");
    aevumFulcrumTechnologies.addEventListener("click", function() {
        Player.location = Locations.AevumFulcrumTechnologies;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumAeroCorp = document.getElementById("aevum-aerocorp");
    aevumAeroCorp.addEventListener("click", function() {
        Player.location = Locations.AevumAeroCorp;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumGalacticCybersystems = document.getElementById("aevum-galacticcybersystems");
    aevumGalacticCybersystems.addEventListener("click", function() {
        Player.location = Locations.AevumGalacticCybersystems;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumWatchdogSecurity = document.getElementById("aevum-watchdogsecurity");
    aevumWatchdogSecurity.addEventListener("click", function() {
        Player.location = Locations.AevumWatchdogSecurity;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumRhoConstruction = document.getElementById("aevum-rhoconstruction");
    aevumRhoConstruction.addEventListener("click", function() {
       Player.location = Locations.AevumRhoConstruction;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumPolice = document.getElementById("aevum-aevumpolice");
    aevumPolice.addEventListener("click", function() {
        Player.location = Locations.AevumPolice;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumNetLinkTechnologies = document.getElementById("aevum-netlinktechnologies");
    aevumNetLinkTechnologies.addEventListener("click", function() {
        Player.location = Locations.AevumNetLinkTechnologies;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumCrushFitnessGym = document.getElementById("aevum-crushfitnessgym");
    aevumCrushFitnessGym.addEventListener("click", function() {
        Player.location = Locations.AevumCrushFitnessGym;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumSnapFitnessGym = document.getElementById("aevum-snapfitnessgym");
    aevumSnapFitnessGym.addEventListener("click", function() {
        Player.location = Locations.AevumSnapFitnessGym;
        Engine.loadLocationContent();
        return false;
    });
    
    aevumSlums = document.getElementById("aevum-slums");
    aevumSlums.addEventListener("click", function() {
        Player.location = Locations.AevumSlums;
        Engine.loadLocationContent();
        return false;
    });
	
	chongqingTravelAgency = document.getElementById("chongqing-travelagency");
	chongqingTravelAgency.addEventListener("click", function() {
		Player.location = Locations.ChongqingTravelAgency;
		Engine.loadLocationContent();
        return false;
	});
	
	chongqingKuaiGongInternational = document.getElementById("chongqing-kuaigonginternational");
	chongqingKuaiGongInternational.addEventListener("click", function() {
		Player.location = Locations.ChongqingKuaiGongInternational;
		Engine.loadLocationContent(); 
        return false;
	});
	
	chongqingSolarisSpaceSystems = document.getElementById("chongqing-solarisspacesystems");
	chongqingSolarisSpaceSystems.addEventListener("click", function() {
		Player.location = Locations.ChongqingSolarisSpaceSystems;
		Engine.loadLocationContent();
        return false;
	});
    
    chongqingSlums = document.getElementById("chongqing-slums");
    chongqingSlums.addEventListener("click", function() {
        Player.location = Locations.ChongqingSlums;
        Engine.loadLocationContent();
        return false;
    });
    
	
	sector12TravelAgency = document.getElementById("sector12-travelagency");
	sector12TravelAgency.addEventListener("click", function() {
		Player.location = Locations.Sector12TravelAgency;
		Engine.loadLocationContent();
        return false;
	});
	
    sector12RothmanUniversity = document.getElementById("sector12-rothmanuniversity");
    sector12RothmanUniversity.addEventListener("click", function() {
        Player.location = Locations.Sector12RothmanUniversity;
        Engine.loadLocationContent();
        return false;
    });
    
	sector12MegaCorp = document.getElementById("sector12-megacorp");
	sector12MegaCorp.addEventListener("click", function() {
		Player.location = Locations.Sector12MegaCorp;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12BladeIndustries = document.getElementById("sector12-bladeindustries");
	sector12BladeIndustries.addEventListener("click", function() {
		Player.location = Locations.Sector12BladeIndustries;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12FourSigma = document.getElementById("sector12-foursigma");
	sector12FourSigma.addEventListener("click", function() {
		Player.location = Locations.Sector12FourSigma;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12IcarusMicrosystems = document.getElementById("sector12-icarusmicrosystems");
	sector12IcarusMicrosystems.addEventListener("click", function() {
		Player.location = Locations.Sector12IcarusMicrosystems;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12UniversalEnergy = document.getElementById("sector12-universalenergy");
	sector12UniversalEnergy.addEventListener("click", function() {
		Player.location = Locations.Sector12UniversalEnergy;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12DeltaOne = document.getElementById("sector12-deltaone");
	sector12DeltaOne.addEventListener("click", function() {
		Player.location = Locations.Sector12DeltaOne;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12CIA = document.getElementById("sector12-cia");
	sector12CIA.addEventListener("click", function() {
		Player.location = Locations.Sector12CIA;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12NSA = document.getElementById("sector12-nsa");
	sector12NSA.addEventListener("click", function() {
		Player.location = Locations.Sector12NSA;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12AlphaEnterprises = document.getElementById("sector12-alphaenterprises");
	sector12AlphaEnterprises.addEventListener("click", function() {
		Player.location = Locations.Sector12AlphaEnterprises; 
		Engine.loadLocationContent();
        return false;
	});
	
	sector12CarmichaelSecurity = document.getElementById("sector12-carmichaelsecurity");
	sector12CarmichaelSecurity.addEventListener("click", function() {
		Player.location = Locations.Sector12CarmichaelSecurity;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12FoodNStuff = document.getElementById("sector12-foodnstuff");
	sector12FoodNStuff.addEventListener("click", function() {
		Player.location = Locations.Sector12FoodNStuff;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12JoesGuns = document.getElementById("sector12-joesguns");
	sector12JoesGuns.addEventListener("click", function() {
		Player.location = Locations.Sector12JoesGuns;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12IronGym = document.getElementById("sector12-irongym");
	sector12IronGym.addEventListener("click", function() {
		Player.location = Locations.Sector12IronGym;
		Engine.loadLocationContent();
        return false;
	});
	
	sector12PowerhouseGym = document.getElementById("sector12-powerhousegym");
	sector12PowerhouseGym.addEventListener("click", function() {
		Player.location = Locations.Sector12PowerhouseGym;
		Engine.loadLocationContent();
        return false;
	});
    
    sector12Slums = document.getElementById("sector12-slums");
    sector12Slums.addEventListener("click", function() {
        Player.location = Locations.Sector12Slums;
        Engine.loadLocationContent();
        return false;
    });
	
	newTokyoTravelAgency = document.getElementById("newtokyo-travelagency");
	newTokyoTravelAgency.addEventListener("click", function() {
		Player.location = Locations.NewTokyoTravelAgency;
		Engine.loadLocationContent();
        return false;
	});
	
	newTokyoDefComm = document.getElementById("newtokyo-defcomm");
	newTokyoDefComm.addEventListener("click", function() {
		Player.location = Locations.NewTokyoDefComm;
		Engine.loadLocationContent();
        return false;
	});
	
	newTokyoVitaLife = document.getElementById("newtokyo-vitalife");
	newTokyoVitaLife.addEventListener("click", function() {
		Player.location = Locations.NewTokyoVitaLife;
		Engine.loadLocationContent();
        return false;
	});
	
	newTokyoGlobalPharmaceuticals = document.getElementById("newtokyo-globalpharmaceuticals");
	newTokyoGlobalPharmaceuticals.addEventListener("click", function() {
		Player.location = Locations.NewTokyoGlobalPharmaceuticals;
		Engine.loadLocationContent();
        return false;
	});
    
	newTokyoNoodleBar = document.getElementById("newtokyo-noodlebar");
	newTokyoNoodleBar.addEventListener("click", function() {
		Player.location = Locations.NewTokyoNoodleBar;
		Engine.loadLocationContent();
        return false;
	});
    
    newTokyoSlums = document.getElementById("newtokyo-slums");
    newTokyoSlums.addEventListener("click", function() {
        Player.location = Locations.NewTokyoSlums;
        Engine.loadLocationContent();
        return false;
    });
	
	ishimaTravelAgency = document.getElementById("ishima-travelagency");
	ishimaTravelAgency.addEventListener("click", function() {
		Player.location = Locations.IshimaTravelAgency;
		Engine.loadLocationContent();
        return false;
	});
	
	ishimaStormTechnologies = document.getElementById("ishima-stormtechnologies");
	ishimaStormTechnologies.addEventListener("click", function() {
		Player.location = Locations.IshimaStormTechnologies;
		Engine.loadLocationContent();
        return false;
	});
	
	ishimaNovaMedical = document.getElementById("ishima-novamedical");
	ishimaNovaMedical.addEventListener("click", function() {
		Player.location = Locations.IshimaNovaMedical;
		Engine.loadLocationContent();
        return false;
	});
	
	ishimaOmegaSoftware = document.getElementById("ishima-omegasoftware");
	ishimaOmegaSoftware.addEventListener("click", function() {
		Player.location = Locations.IshimaOmegaSoftware;
		Engine.loadLocationContent();
        return false;
	});
    
    ishimaSlums = document.getElementById("ishima-slums");
    ishimaSlums.addEventListener("click", function() {
        Player.location = Locations.IshimaSlums;
        Engine.loadLocationContent();
        return false;
    });
	
	volhavenTravelAgency = document.getElementById("volhaven-travelagency");
	volhavenTravelAgency.addEventListener("click", function() {
		Player.location = Locations.VolhavenTravelAgency;
		Engine.loadLocationContent();
        return false;
	});
    
    volhavenZBInstituteOfTechnology = document.getElementById("volhaven-zbinstituteoftechnology");
    volhavenZBInstituteOfTechnology.addEventListener("click", function() {
        Player.location = Locations.VolhavenZBInstituteOfTechnology;
        Engine.loadLocationContent();
        return false;
    });
	
	volhavenOmniTekIncorporated = document.getElementById("volhaven-omnitekincorporated");
	volhavenOmniTekIncorporated.addEventListener("click", function() {
		Player.location = Locations.VolhavenOmniTekIncorporated;
		Engine.loadLocationContent();
        return false;
	});
	
	volhavenNWO = document.getElementById("volhaven-nwo");
	volhavenNWO.addEventListener("click", function() {
		Player.location = Locations.VolhavenNWO;
		Engine.loadLocationContent();
        return false;
	});
	
	volhavenHeliosLabs = document.getElementById("volhaven-helioslabs");
	volhavenHeliosLabs.addEventListener("click", function() {
		Player.location = Locations.VolhavenHeliosLabs;
		Engine.loadLocationContent();
        return false;
	});
	
	volhavenOmniaCybersystems = document.getElementById("volhaven-omniacybersystems");
	volhavenOmniaCybersystems.addEventListener("click", function() {
		Player.location = Locations.VolhavenOmniaCybersystems;
		Engine.loadLocationContent();
        return false;
	});
	
	volhavenLexoCorp = document.getElementById("volhaven-lexocorp");
	volhavenLexoCorp.addEventListener("click", function() {
		Player.location = Locations.VolhavenLexoCorp;
		Engine.loadLocationContent();
        return false;
	});
	
	volhavenSysCoreSecurities = document.getElementById("volhaven-syscoresecurities");
	volhavenSysCoreSecurities.addEventListener("click", function() {
		Player.location = Locations.VolhavenSysCoreSecurities;
		Engine.loadLocationContent();
        return false;
	});
	
	volhavenCompuTek = document.getElementById("volhaven-computek");
	volhavenCompuTek.addEventListener("click", function() {
		Player.location = Locations.VolhavenCompuTek;
		Engine.loadLocationContent();
        return false;
	});
	
	volhavenMilleniumFitnessGym = document.getElementById("volhaven-milleniumfitnessgym");
	volhavenMilleniumFitnessGym.addEventListener("click", function() {
		Player.location = Locations.VolhavenMilleniumFitnessGym;
		Engine.loadLocationContent();
        return false;
	});
    
    volhavenSlums = document.getElementById("volhaven-slums");
    volhavenSlums.addEventListener("click", function() {
        Player.location = Locations.VolhavenSlums;
        Engine.loadLocationContent();
        return false;
    });
    
    
    //Buttons to interact at a location (apply for job/promotion, train, purchase, etc.)
    var softwareJob         = document.getElementById("location-software-job");
    var itJob               = document.getElementById("location-it-job");
    var securityEngineerJob = document.getElementById("location-security-engineer-job");
    var networkEngineerJob  = document.getElementById("location-network-engineer-job");
    var businessJob         = document.getElementById("location-business-job");
    var securityJob         = document.getElementById("location-security-job");
    var agentJob            = document.getElementById("location-agent-job");
    var employeeJob         = document.getElementById("location-employee-job");
    var waiterJob           = document.getElementById("location-waiter-job");

    var work                = document.getElementById("location-work");

    var gymTrainStr         = document.getElementById("location-gym-train-str");
    var gymTrainDef         = document.getElementById("location-gym-train-def");
    var gymTrainDex         = document.getElementById("location-gym-train-dex");
    var gymTrainAgi         = document.getElementById("location-gym-train-agi");

    var purchase1gb         = document.getElementById("location-purchase-1gb");
    var purchase2gb         = document.getElementById("location-purchase-2gb");
    var purchase4gb         = document.getElementById("location-purchase-4gb");
    var purchase8gb         = document.getElementById("location-purchase-8gb");
    var purchase16gb        = document.getElementById("location-purchase-16gb");
    var purchase32gb        = document.getElementById("location-purchase-32gb");
    var purchase64gb        = document.getElementById("location-purchase-64gb");
    var purchase128gb       = document.getElementById("location-purchase-128gb");
    var purchase256gb       = document.getElementById("location-purchase-256gb");
    var purchase512gb       = document.getElementById("location-purchase-512gb");
    var purchase1tb         = document.getElementById("location-purchase-1tb");
    var purchaseTor         = document.getElementById("location-purchase-tor");
    var purchaseHomeRam     = document.getElementById("location-purchase-home-ram");

    var travelToAevum       = document.getElementById("location-travel-to-aevum");
    var travelToChongqing   = document.getElementById("location-travel-to-chongqing");
    var travelToSector12    = document.getElementById("location-travel-to-sector12");
    var travelToNewTokyo    = document.getElementById("location-travel-to-newtokyo");
    var travelToIshima      = document.getElementById("location-travel-to-ishima");
    var travelToVolhaven    = document.getElementById("location-travel-to-volhaven");
    
    var slumsShoplift       = document.getElementById("location-slums-shoplift");
    var slumsMug            = document.getElementById("location-slums-mug");
    var slumsDealDrugs      = document.getElementById("location-slums-deal-drugs");
    var slumsTrafficArms    = document.getElementById("location-slums-traffic-arms");
    var slumsHomicide       = document.getElementById("location-slums-homicide");
    var slumsKidnap         = document.getElementById("location-slums-kidnap");
    
    softwareJob.addEventListener("click", function() {
        Player.applyForSoftwareJob();
        return false;
    });
    
    itJob.addEventListener("click", function() {
        Player.applyForSoftwareJob()
        return false; 
    });
    
    securityEngineerJob.addEventListener("click", function() {
        Player.applyForSecurityEngineerJob();
        return false; 
    });
    
    networkEngineerJob.addEventListener("click", function() {
        Player.applyForNetworkEngineerJob();
        return false; 
    });
    
    businessJob.addEventListener("click", function() {
        Player.applyForBusinessJob();
        return false; 
    });
    
    securityJob.addEventListener("click", function() {
        Player.applyForSecurityJob();
        return false; 
    });
    
    agentJob.addEventListener("click", function() {
        Player.applyForAgentJob();
        return false; 
    });
    
    employeeJob.addEventListener("click", function() {
        Player.applyForEmployeeJob();
        return false; 
    });
    
    waiterJob.addEventListener("click", function() {
        Player.applyForWaiterJob();
        return false; 
    });
    
    purchase1gb.addEventListener("click", function() {
        purchaseServerBoxCreate(1, 50000);
        return false;
    });
    
    purchase2gb.addEventListener("click", function() {
        purchaseServerBoxCreate(2, 100000);
        return false;
    });
    
    purchase4gb.addEventListener("click", function() {
        purchaseServerBoxCreate(4, 250000);
        return false;
    });
    
    purchase8gb.addEventListener("click", function() {
        purchaseServerBoxCreate(8, 1000000);
        return false;
    });
    
    purchase16gb.addEventListener("click", function() {
        purchaseServerBoxCreate(16, 4000000);
        return false;
    });
    
    purchase32gb.addEventListener("click", function() {
        purchaseServerBoxCreate(32, 10000000);
        return false;
    });
    
    purchase64gb.addEventListener("click", function() {
        purchaseServerBoxCreate(64, 20000000);
        return false;
    });
    
    purchase128gb.addEventListener("click", function() {
        purchaseServerBoxCreate(128, 50000000);
        return false;
    });
    
    purchase256gb.addEventListener("click", function() {
        purchaseServerBoxCreate(256, 100000000);
        return false;
    });
    
    purchase512gb.addEventListener("click", function() {
        purchaseServerBoxCreate(512, 250000000);
        return false;
    });
    
    purchase1tb.addEventListener("click", function() {
        purchaseServerBoxCreate(1024, 750000000);
        return false;
    });
    
    purchaseTor.addEventListener("click", function() {
        purchaseTorRouter();
        return false;
    });
    
    purchaseHomeRam.addEventListener("click", function() {
        purchaseRamForHomeBoxCreate();
        return false;
    });
    
    travelToAevum.addEventListener("click", function() {
        travelBoxCreate(Locations.Aevum, 200000);
        return false;
    });
    
    travelToChongqing.addEventListener("click", function() {
        travelBoxCreate(Locations.Chongqing, 200000);
        return false;
    });
    
    travelToSector12.addEventListener("click", function() {
        travelBoxCreate(Locations.Sector12, 200000);
        return false;
    });
    
    travelToNewTokyo.addEventListener("click", function() {
        travelBoxCreate(Locations.NewTokyo, 200000);
        return false;
    });
    
    travelToIshima.addEventListener("click", function() {
        travelBoxCreate(Locations.Ishima, 200000);
        return false;
    });
    
    travelToVolhaven.addEventListener("click", function() {
        travelBoxCreate(Locations.Volhaven, 200000);
        return false;
    });
    
    slumsShoplift.addEventListener("click", function() {
        commitShopliftCrime();
        return false;
    });
    
    slumsMug.addEventListener("click", function() {
        commitMugCrime();
        return false;
    });
    
    slumsDealDrugs.addEventListener("click", function() {
        commitDealDrugsCrime();
        return false;
    });
    
    slumsTrafficArms.addEventListener("click", function() {
        commitTraffickArmsCrime();
        return false;
    });
    
    slumsHomicide.addEventListener("click", function() {
        commitHomicideCrime();
        return false;
    });
    
    slumsKidnap.addEventListener("click", function() {
        commitKidnapCrime();
        return false;
    });
}   

travelToCity = function(destCityName, cost) {
    if (cost > Player.money) {
        dialogBoxCreate("You cannot afford to travel to " + destCityName);  
        return;
    }
    Player.money -= cost;
    
    Player.city = destCityName;
    dialogBoxCreate("You are now in " + destCityName + "!");
    Engine.loadWorldContent();
}

purchaseTorRouter = function() {
    if (CONSTANTS.TorRouterCost > Player.money) {
        dialogBoxCreate("You cannot afford to purchase the Tor router");
        return;
    }
    Player.loseMoney(CONSTANTS.TorRouterCost);
    
    var darkweb = new Server();
    darkweb.init(createRandomIp(), "darkweb", "", true, false, false, false, 1);
    AddToAllServers(darkweb);
    SpecialServerIps.addIp("Darkweb Server", darkweb.ip);
    
    document.getElementById("location-purchase-tor").setAttribute("class", "a-link-button-inactive");
    
    Player.getHomeComputer().serversOnNetwork.push(darkweb.ip);
    darkweb.serversOnNetwork.push(Player.getHomeComputer().ip);
    dialogBoxCreate("You have purchased a Tor router!", "You now have access to the dark web from your home computer", "Use the scan/netstat commands to search for the dark web connection.");
}

displayUniversityLocationContent = function(costMult) {
    var studyComputerScienceButton  = document.getElementById("location-study-computer-science");
    var classDataStructuresButton   = document.getElementById("location-data-structures-class");
    var classNetworksButton         = document.getElementById("location-networks-class");
    var classAlgorithmsButton       = document.getElementById("location-algorithms-class");
    var classManagementButton       = document.getElementById("location-management-class");
    var classLeadershipButton       = document.getElementById("location-leadership-class");
    studyComputerScienceButton.style.display = "block";
    classDataStructuresButton.style.display = "block";
    classNetworksButton.style.display = "block";
    classAlgorithmsButton.style.display = "block";
    classManagementButton.style.display = "block";
    classLeadershipButton.style.display = "block";
    
    //Costs (per second)    
    var dataStructuresCost  = CONSTANTS.ClassDataStructuresBaseCost    * costMult;
    var networksCost        = CONSTANTS.ClassNetworksBaseCost          * costMult;
    var algorithmsCost      = CONSTANTS.ClassAlgorithmsBaseCost        * costMult;
    var managementCost      = CONSTANTS.ClassManagementBaseCost        * costMult;
    var leadershipCost      = CONSTANTS.ClassLeadershipBaseCost        * costMult;
    
    //Update button text to show cost
    classDataStructuresButton.innerHTML = "Take Data Structures course ($"  + dataStructuresCost + " / sec)";
    classNetworksButton.innerHTML       = "Take Networks course ($"         + networksCost       + " / second)";
    classAlgorithmsButton.innerHTML     = "Take Algorithms course ($"       + algorithmsCost     + " / second)";
    classManagementButton.innerHTML     = "Take Management course ($"       + managementCost     + " / second)";
    classLeadershipButton.innerHTML     = "Take Leadership course ($"       + leadershipCost     + " / second)";
}

setUniversityLocationButtons = function(costMult, expMult) {
    var studyComputerScience= document.getElementById("location-study-computer-science");
    var classDataStructures = document.getElementById("location-data-structures-class");
    var classNetworks       = document.getElementById("location-networks-class");
    var classAlgorithms     = document.getElementById("location-algorithms-class");
    var classManagement     = document.getElementById("location-management-class");
    var classLeadership     = document.getElementById("location-leadership-class");
    
    var newStudyCS = studyComputerScience.cloneNode(true);
    studyComputerScience.parentNode.replaceChild(newStudyCS, studyComputerScience)
    newStudyCS.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassStudyComputerScience);
        return false;
    });
    
    var newClassDataStructures = classDataStructures.cloneNode(true);
    classDataStructures.parentNode.replaceChild(newClassDataStructures, classDataStructures);
    newClassDataStructures.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassDataStructures);
        return false;
    });
    
    var newClassNetworks = classNetworks.cloneNode(true);
    classNetworks.parentNode.replaceChild(newClassNetworks, classNetworks);
    newClassNetworks.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassNetworks);
        return false;
    });
    
    var newClassAlgorithms = classAlgorithms.cloneNode(true);
    classAlgorithms.parentNode.replaceChild(newClassAlgorithms, classAlgorithms);
    newClassAlgorithms.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassAlgorithms);
        return false;
    });
    
    var newClassManagement = classManagement.cloneNode(true);
    classManagement.parentNode.replaceChild(newClassManagement, classManagement);
    newClassManagement.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassManagement);
        return false;
    });
    
    var newClassLeadership = classLeadership.cloneNode(true);
    classLeadership.parentNode.replaceChild(newClassLeadership, classLeadership);
    newClassLeadership.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassLeadership);
        return false;
    });
}

