/* Display Location Content when visiting somewhere in the World*/

Locations = {
    //Cities
	Aevum: 			"Aevum",
	Chongqing: 		"Chongqing",
	Sector12: 		"Sector-12",
	NewTokyo: 		"New Tokyo",
	Ishima: 		"Ishima",
	Volhaven: 		"Volhaven",
    
    
    //Aevum Locations
    AevumTravelAgency:          "Aevum Travel Agency",
    AevumECorp:                 "ECorp",
    AevumBachmanAndAssociates:  "Bachman & Associates",
    AevumClarkeIncorporated:    "Clarke Incorporated",
    AevumFulcrumTechnologies:   "Fulcrum Technolgies",
    AevumAeroCorp:              "AeroCorp",
    AevumGalacticCybersystems:  "Galactic Cybersystems",
    AevumWatchdogSecurity:      "Watchdog Security",
    AevumRhoConstruction:       "Rho Construction",
    AevumPolice:                "Aevum Police HQ", 
    AevumNetLinkTechnologies:   "NetLink Technologies",
    AevumCrushFitnessGym:       "Crush Fitness Gym",
    AevumSnapFitnessGym:        "Snap Fitness Gym",
    
    //Chongqing locations
    ChongqingTravelAgency:          "Chongqing Travel Agency", 
    ChongqingKuaiGongInternational: "KuaiGong International",
    ChongqingSolarisSpaceSystems:   "Solaris Space Systems",
    
    //Sector 12
    Sector12TravelAgency:       "Sector-12 Travel Agency",
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
    
    //New Tokyo
    NewTokyoTravelAgency:           "New Tokyo Travel Agency",
    NewTokyoDefComm:                "DefComm",
    NewTokyoVitaLife:               "VitaLife",
    NewTokyoGlobalPharmaceuticals:  "Global Pharmaceuticals",
    NewTokyoNoodleBar:              "Noodle Bar",
    
    //Ishima
    IshimaTravelAgency:         "Ishima Travel Agency",
    IshimaStormTechnologies:    "Storm Technologies",
    IshimaNovaMedical:          "Nova Medical",
    IshimaOmegaSoftware:        "Omega Software",
    
    //Volhaven
    VolhavenTravelAgency:           "Volhaven Travel Agency",
    VolhavenOmniTekIncorporated:    "OmniTek Incorporated",
    VolhavenNWO:                    "NWO",
    VolhavenHeliosLabs:             "Helios Labs",
    VolhavenOmniaCybersystems:      "Omnia Cybersystems",
    VolhavenLexoCorp:               "LexoCorp",
    VolhavenSysCoreSecurities:      "SysCore Securities",
    VolhavenCompuTek:               "CompuTek",
    VolhavenMilleniumFitnessGym:    "Millenium Fitness Gym",
}

displayLocationContent = function() {
    returnToWorld       = document.getElementById("location-return-to-world-button");
    locationName        = document.getElementById("location-name");
    locationInfo        = document.getElementById("location-info");
    
    softwareJob         = document.getElementById("location-software-job");
    itJob               = document.getElementById("location-it-job");
    securityEngineerJob = document.getElementById("location-security-engineer-job");
    networkEngineerJob  = document.getElementById("location-network-engineer-job");
    businessJob         = document.getElementById("location-business-job");
    securityJob         = document.getElementById("location-security-job");
    agentJob            = document.getElementById("location-agent-job");
    employeeJob         = document.getElementById("location-employee-job");
    waiterJob           = document.getElementById("location-waiter-job");
    
    work                = document.getElementById("location-work");
    
    gymTrainStr         = document.getElementById("location-gym-train-str");
    gymTrainDef         = document.getElementById("location-gym-train-def");
    gymTrainDex         = document.getElementById("location-gym-train-dex");
    gymTrainAgi         = document.getElementById("location-gym-train-agi");
    
    purchase1gb         = document.getElementById("location-purchase-1gb");
    purchase2gb         = document.getElementById("location-purchase-2gb");
    purchase4gb         = document.getElementById("location-purchase-4gb");
    purchase8gb         = document.getElementById("location-purchase-8gb");
    purchase16gb        = document.getElementById("location-purchase-16gb");
    purchase32gb        = document.getElementById("location-purchase-32gb");
    purchase64gb        = document.getElementById("location-purchase-64gb");
    purchase128gb       = document.getElementById("location-purchase-128gb");
    purchase256gb       = document.getElementById("location-purchase-256gb");
    purchase512gb       = document.getElementById("location-purchase-512gb");
    purchase1tb         = document.getElementById("location-purchase-1tb");
    
    travelToAevum       = document.getElementById("location-travel-to-aevum");
    travelToChongqing   = document.getElementById("location-travel-to-chongqing");
    travelToSector12    = document.getElementById("location-travel-to-sector12");
    travelToNewTokyo    = document.getElementById("location-travel-to-newtokyo");
    travelToIshima      = document.getElementById("location-travel-to-ishima");
    travelToVolhaven    = document.getElementById("location-travel-to-volhaven");
    
    softwareJob.style.display = "none";
    itJob.style.display = "none";
    securityEngineerJob.style.display = "none";
    networkEngineerJob.style.display = "none";
    businessJob.style.display = "none";
    securityJob.style.display = "none";
    agentJob.style.display = "none";
    employeeJob.style.display = "none";
    waiterJob.style.display = "none";
    
    work.style.display = "none";
    
    gymTrainStr.style.display = "none";
    gymTrainDef.style.display = "none";
    gymTrainDex.style.display = "none";
    gymTrainAgi.style.display = "none";
    
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
    
    travelToAevum.style.display = "none";
    travelToChongqing.style.display = "none";
    travelToSector12.style.display = "none";
    travelToNewTokyo.style.display = "none";
    travelToIshima.style.display = "none";
    travelToVolhaven.style.display = "none";
    
    switch (Player.location) {
        case Locations.AevumTravelAgency: 
            travelToChongqing.style.display = "inline";
            travelToSector12.style.display = "inline";
            travelToNewTokyo.style.display = "inline";
            travelToIshima.style.display = "inline";
            travelToVolhaven.style.display = "inline";
            break;
            
        case Locations.AevumECorp:  
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;
        case Locations.AevumBachmanAndAssociates: 
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.AevumClarkeIncorporated:   
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.AevumFulcrumTechnologies:  
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.AevumAeroCorp:        
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.AevumGalacticCybersystems: 
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.AevumWatchdogSecurity:  
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            securityJob.style.display = "inline";
            agentJob.style.display = "inline";
            break;

        case Locations.AevumRhoConstruction: 
            softwareJob.style.display = "inline";
            businessJob.style.display = "inline";   
            break;

        case Locations.AevumPolice:     
            softwareJob.style.display = "inline";
            securityJob.style.display = "inline";        
            break;

        case Locations.AevumNetLinkTechnologies:  
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            break;

        case Locations.AevumCrushFitnessGym:  
            gymTrainStr.style.display = "inline";
            gymTrainDef.style.display = "inline";
            gymTrainDex.style.display = "inline";
            gymTrainAgi.style.display = "inline";
            break;

        case Locations.AevumSnapFitnessGym:  
            gymTrainStr.style.display = "inline";
            gymTrainDef.style.display = "inline";
            gymTrainDex.style.display = "inline";
            gymTrainAgi.style.display = "inline";
            break;


        case Locations.ChongqingTravelAgency:   
            travelToAevum.style.display = "inline";
            travelToSector12.style.display = "inline";
            travelToNewTokyo.style.display = "inline";
            travelToIshima.style.display = "inline";
            travelToVolhaven.style.display = "inline";        
            break;

        case Locations.ChongqingKuaiGongInternational:
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.ChongqingSolarisSpaceSystems:  
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;


        case Locations.Sector12TravelAgency:   
            travelToAevum.style.display = "inline";
            travelToChongqing.style.display = "inline";
            travelToNewTokyo.style.display = "inline";
            travelToIshima.style.display = "inline";
            travelToVolhaven.style.display = "inline";
            break;

        case Locations.Sector12MegaCorp:  
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.Sector12BladeIndustries:   
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.Sector12FourSigma:    
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.Sector12IcarusMicrosystems: 
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.Sector12UniversalEnergy:
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.Sector12DeltaOne:      
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.Sector12CIA:     
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            securityJob.style.display = "inline";
            agentJob.style.display = "inline";
            break;

        case Locations.Sector12NSA:          
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            securityJob.style.display = "inline";
            agentJob.style.display = "inline";
            break;

        case Locations.Sector12AlphaEnterprises:
            softwareJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.Sector12CarmichaelSecurity:
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            securityJob.style.display = "inline";
            agentJob.style.display = "inline";
            break;

        case Locations.Sector12FoodNStuff:
            employeeJob.style.display = "inline";
            break;

        case Locations.Sector12JoesGuns:
            employeeJob.style.display = "inline";
            break;

        case Locations.Sector12IronGym:
            gymTrainStr.style.display = "inline";
            gymTrainDef.style.display = "inline";
            gymTrainDex.style.display = "inline";
            gymTrainAgi.style.display = "inline";
            break;

        case Location.Sector12PowerhouseGym:
            gymTrainStr.style.display = "inline";
            gymTrainDef.style.display = "inline";
            gymTrainDex.style.display = "inline";
            gymTrainAgi.style.display = "inline";
            break;


        case Locations.NewTokyoTravelAgency: 
            travelToAevum.style.display = "inline";
            travelToChongqing.style.display = "inline";
            travelToSector12.style.display = "inline";
            travelToIshima.style.display = "inline";
            travelToVolhaven.style.display = "inline";
            break;

        case Locations.NewTokyoDefComm:       
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.NewTokyoVitaLife:
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.NewTokyoGlobalPharmaceuticals: 
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.NewTokyoNoodleBar:      
            waiterJob.style.display = "inline";
            break;
        

        case Locations.IshimaTravelAgency:      
            travelToAevum.style.display = "inline";
            travelToChongqing.style.display = "inline";
            travelToSector12.style.display = "inline";
            travelToNewTokyo.style.display = "inline";
            travelToVolhaven.style.display = "inline";
            break;

        case Locations.IshimaStormTechnologies:
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "none";
            agentJob.style.display = "none";
            employeeJob.style.display = "none";
            waiterJob.style.display = "none";        
            break;

        case Locations.IshimaNovaMedical:         
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.IshimaOmegaSoftware:   
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.VolhavenTravelAgency:       
            travelToAevum.style.display = "inline";
            travelToChongqing.style.display = "inline";
            travelToSector12.style.display = "inline";
            travelToNewTokyo.style.display = "inline";
            travelToIshima.style.display = "inline";
            break;

        case Locations.VolhavenOmniTekIncorporated:   
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.VolhavenNWO:      
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.VolhavenHeliosLabs:            
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            break;

        case Locations.VolhavenOmniaCybersystems:
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.VolhavenLexoCorp:
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            businessJob.style.display = "inline";
            securityJob.style.display = "inline";
            break;

        case Locations.VolhavenSysCoreSecurities:     
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            break;

        case Locations.VolhavenCompuTek:       
            softwareJob.style.display = "inline";
            itJob.style.display = "inline";
            securityEngineerJob.style.display = "inline";
            networkEngineerJob.style.display = "inline";
            break;

        case Locations.VolhavenMilleniumFitnessGym:   
            gymTrainStr.style.display = "inline";
            gymTrainDef.style.display = "inline";
            gymTrainDex.style.display = "inline";
            gymTrainAgi.style.display = "inline";
            break;

    }
}

initLocationButtons = function() {
    aevumTravelAgency = document.getElementById("aevum-travelagency");
    aevumTravelAgency.addEventListener("click", function() {
        Player.location = Locations.AevumTravelAgency;
        Engine.loadLocationContent();
    });
    
    aevumECorp = document.getElementById("aevum-ecorp");
    aevumECorp.addEventListener("click", function() {
        Player.location = Locations.AevumECorp;
        Engine.loadLocationContent();
    });
    
    aevumBachmanAndAssociates = document.getElementById("aevum-bachmanandassociates");
    aevumBachmanAndAssociates.addEventListener("click", function() {
        Player.location = Locations.AevumBachmanAndAssociates;
        Engine.loadLocationContent();
    });
    
    aevumClarkeIncorporated = document.getElementById("aevum-clarkeincorporated");
    aevumClarkeIncorporated.addEventListener("click", function() {
       Player.location = Locations.AevumClarkeIncorporated; 
       Engine.loadLocationContent();
    });
    
    aevumFulcrumTechnologies = document.getElementById("aevum-fulcrumtechnologies");
    aevumFulcrumTechnologies.addEventListener("click", function() {
        Player.location = Locations.AevumFulcrumTechnologies;
        Engine.loadLocationContent();
    });
    
    aevumAeroCorp = document.getElementById("aevum-aerocorp");
    aevumAeroCorp.addEventListener("click", function() {
        Player.location = Locations.AevumAeroCorp;
        Engine.loadLocationContent();
    });
    
    aevumGalacticCybersystems = document.getElementById("aevum-galacticcybersystems");
    aevumGalacticCybersystems.addEventListener("click", function() {
        Player.location = Locations.AevumGalacticCybersystems;
        Engine.loadLocationContent();
    });
    
    aevumWatchdogSecurity = document.getElementById("aevum-watchdogsecurity");
    aevumWatchdogSecurity.addEventListener("click", function() {
        Player.location = Locations.AevumWatchdogSecurity;
        Engine.loadLocationContent();
    });
    
    aevumRhoConstruction = document.getElementById("aevum-rhoconstruction");
    aevumRhoConstruction.addEventListener("click", function() {
       Player.location = Locations.AevumRhoConstruction;
        Engine.loadLocationContent();
    });
    
    aevumPolice = document.getElementById("aevum-police");
    aevumPolice.addEventListener("click", function() {
        Player.location = Locations.AevumPolice;
        Engine.loadLocationContent();
    });
    
    aevumNetLinkTechnologies = document.getElementById("aevum-netlinktechnologies");
    aevumNetLinkTechnologies.addEventListener("click", function() {
        Player.location = Locations.AevumNetLinkTechnologies;
        Engine.loadLocationContent();
    });
    
    aevumCrushFitnessGym = document.getElementById("aevum-crushfitnessgym");
    aevumCrushFitnessGym.addEventListener("click", function() {
        Player.location = Locations.AevumCrushFitnessGym;
        Engine.loadLocationContent();
    });
    
    aevumSnapFitnessGym = document.getElementById("aevum-snapfitnessgym");
    aevumSnapFitnessGym.addEventListener("click", function() {
        Player.location = Locations.AevumSnapFitnessGym;
        Engine.loadLocationContent();
    });
    
}