import {Bladeburner}                            from "./Bladeburner";
import {CompanyPositions}                       from "./Company/CompanyPositions";
import {Companies}                              from "./Company/Companies";
import {getJobRequirementText}                  from "./Company/GetJobRequirementText";
import * as posNames                            from "./Company/data/CompanyPositionNames";
import { Corporation }                          from "./Corporation/Corporation";
import {CONSTANTS}                              from "./Constants";
import { Crimes }                               from "./Crime/Crimes";
import {Engine}                                 from "./engine";
import {beginInfiltration}                      from "./Infiltration";
import {hasBladeburnerSF}                       from "./NetscriptFunctions";
import {Locations}                              from "./Locations";
import {Player}                                 from "./Player";
import {Server, AllServers, AddToAllServers}    from "./Server";
import {purchaseServer,
        purchaseRamForHomeComputer}             from "./ServerPurchases";
import {Settings}                               from "./Settings";
import { SourceFileFlags }                      from "./SourceFile/SourceFileFlags";
import {SpecialServerNames, SpecialServerIps}   from "./SpecialServerIps";

import {numeralWrapper}                         from "./ui/numeralFormat";

import {dialogBoxCreate}                        from "../utils/DialogBox";
import {clearEventListeners}                    from "../utils/uiHelpers/clearEventListeners";
import {createRandomIp}                         from "../utils/IPAddress";
import {formatNumber}                           from "../utils/StringHelperFunctions";
import {yesNoBoxCreate, yesNoTxtInpBoxCreate,
        yesNoBoxGetYesButton, yesNoBoxGetNoButton,
        yesNoTxtInpBoxGetYesButton, yesNoTxtInpBoxGetNoButton,
        yesNoTxtInpBoxGetInput, yesNoBoxClose,
        yesNoTxtInpBoxClose}                    from "../utils/YesNoBox";

import { createElement }                        from "../utils/uiHelpers/createElement";
import { createPopup }                          from "../utils/uiHelpers/createPopup";
import { createPopupCloseButton }               from "../utils/uiHelpers/createPopupCloseButton";
import { removeElementById }                    from "../utils/uiHelpers/removeElementById";


function displayLocationContent() {
    var returnToWorld           = clearEventListeners("location-return-to-world-button");

    var locationName            = document.getElementById("location-name");

    var locationInfo            = document.getElementById("location-info");

    var softwareJob             = document.getElementById("location-software-job");
    var softwareConsultantJob   = document.getElementById("location-software-consultant-job")
    var itJob                   = document.getElementById("location-it-job");
    var securityEngineerJob     = document.getElementById("location-security-engineer-job");
    var networkEngineerJob      = document.getElementById("location-network-engineer-job");
    var businessJob             = document.getElementById("location-business-job");
    var businessConsultantJob   = document.getElementById("location-business-consultant-job");
    var securityJob             = document.getElementById("location-security-job");
    var agentJob                = document.getElementById("location-agent-job");
    var employeeJob             = document.getElementById("location-employee-job");
    var employeePartTimeJob     = document.getElementById("location-parttime-employee-job");
    var waiterJob               = document.getElementById("location-waiter-job");
    var waiterPartTimeJob       = document.getElementById("location-parttime-waiter-job");

    var work                    = clearEventListeners("location-work");

	var jobTitle 			    = document.getElementById("location-job-title");
	var jobReputation 		    = document.getElementById("location-job-reputation");
    var companyFavor            = document.getElementById("location-company-favor");
    var locationTxtDiv1         = document.getElementById("location-text-divider-1");
    var locationTxtDiv2         = document.getElementById("location-text-divider-2");
    var locationTxtDiv3         = document.getElementById("location-text-divider-3");

    var gymTrainStr             = document.getElementById("location-gym-train-str");
    var gymTrainDef             = document.getElementById("location-gym-train-def");
    var gymTrainDex             = document.getElementById("location-gym-train-dex");
    var gymTrainAgi             = document.getElementById("location-gym-train-agi");

    var studyComputerScience    = document.getElementById("location-study-computer-science");
    var classDataStructures     = document.getElementById("location-data-structures-class");
    var classNetworks           = document.getElementById("location-networks-class");
    var classAlgorithms         = document.getElementById("location-algorithms-class");
    var classManagement         = document.getElementById("location-management-class");
    var classLeadership         = document.getElementById("location-leadership-class");

    var purchase2gb             = document.getElementById("location-purchase-2gb");
    var purchase4gb             = document.getElementById("location-purchase-4gb");
    var purchase8gb             = document.getElementById("location-purchase-8gb");
    var purchase16gb            = document.getElementById("location-purchase-16gb");
    var purchase32gb            = document.getElementById("location-purchase-32gb");
    var purchase64gb            = document.getElementById("location-purchase-64gb");
    var purchase128gb           = document.getElementById("location-purchase-128gb");
    var purchase256gb           = document.getElementById("location-purchase-256gb");
    var purchase512gb           = document.getElementById("location-purchase-512gb");
    var purchase1tb             = document.getElementById("location-purchase-1tb");
    var purchaseTor             = document.getElementById("location-purchase-tor");
    var purchaseHomeRam         = document.getElementById("location-purchase-home-ram");
    var purchaseHomeCores       = document.getElementById("location-purchase-home-cores");

    var travelAgencyText        = document.getElementById("location-travel-agency-text");
    var travelToAevum           = document.getElementById("location-travel-to-aevum");
    var travelToChongqing       = document.getElementById("location-travel-to-chongqing");
    var travelToSector12        = document.getElementById("location-travel-to-sector12");
    var travelToNewTokyo        = document.getElementById("location-travel-to-newtokyo");
    var travelToIshima          = document.getElementById("location-travel-to-ishima");
    var travelToVolhaven        = document.getElementById("location-travel-to-volhaven");

    var infiltrate              = clearEventListeners("location-infiltrate");

    var hospitalTreatment       = document.getElementById("location-hospital-treatment");

    var slumsDescText           = document.getElementById("location-slums-description");
    var slumsShoplift           = document.getElementById("location-slums-shoplift");
    var slumsRobStore           = document.getElementById("location-slums-rob-store");
    var slumsMug                = document.getElementById("location-slums-mug");
    var slumsLarceny            = document.getElementById("location-slums-larceny");
    var slumsDealDrugs          = document.getElementById("location-slums-deal-drugs");
    var slumsBondForgery        = document.getElementById("location-slums-bond-forgery");
    var slumsTrafficArms        = document.getElementById("location-slums-traffic-arms");
    var slumsHomicide           = document.getElementById("location-slums-homicide");
    var slumsGta                = document.getElementById("location-slums-gta");
    var slumsKidnap             = document.getElementById("location-slums-kidnap");
    var slumsAssassinate        = document.getElementById("location-slums-assassinate");
    var slumsHeist              = document.getElementById("location-slums-heist");

    var cityHallCreateCorporation   = document.getElementById("location-cityhall-create-corporation");

    var nsaBladeburner = document.getElementById("location-nsa-bladeburner");

    const vitalifeResleeve = document.getElementById("location-vitalife-resleeve");

    var loc = Player.location;

    returnToWorld.addEventListener("click", function() {
        Engine.loadWorldContent();
    });

    locationName.innerHTML = loc;
    locationName.style.display = "block";

    locationInfo.style.display = "block";

    softwareJob.style.display = "none";
    softwareConsultantJob.style.display = "none";
    itJob.style.display = "none";
    securityEngineerJob.style.display = "none";
    networkEngineerJob.style.display = "none";
    businessJob.style.display = "none";
    businessConsultantJob.style.display = "none";
    securityJob.style.display = "none";
    agentJob.style.display = "none";
    employeeJob.style.display = "none";
    employeePartTimeJob.style.display = "none";
    waiterJob.style.display = "none";
    waiterPartTimeJob.style.display = "none";

    softwareJob.innerHTML = "Apply for Software Job";
    softwareConsultantJob.innerHTML = "Apply for a Software Consultant job";
    itJob.innerHTML = "Apply for IT Job";
    securityEngineerJob.innerHTML = "Apply for Security Engineer Job";
    networkEngineerJob.innerHTML = "Apply for Network Engineer Job";
    businessJob.innerHTML = "Apply for Business Job";
    businessConsultantJob.innerHTML = "Apply for a Business Consultant Job";
    securityJob.innerHTML = "Apply for Security Job";
    agentJob.innerHTML = "Apply for Agent Job";
    employeeJob.innerHTML = "Apply to be an Employee";
    employeePartTimeJob.innerHTML = "Apply to be a Part-time Employee";
    waiterJob.innerHTML = "Apply to be a Waiter";
    waiterPartTimeJob.innerHTML = "Apply to be a Part-time Waiter"

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
    purchaseHomeCores.style.display = "none";

    purchase2gb.innerHTML = "Purchase 2GB Server - $" + formatNumber(2*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase4gb.innerHTML = "Purchase 4GB Server - $" + formatNumber(4*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase8gb.innerHTML = "Purchase 8GB Server - $" + formatNumber(8*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase16gb.innerHTML = "Purchase 16GB Server - $" + formatNumber(16*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase32gb.innerHTML = "Purchase 32GB Server - $" + formatNumber(32*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase64gb.innerHTML = "Purchase 64GB Server - $" + formatNumber(64*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase128gb.innerHTML = "Purchase 128GB Server - $" + formatNumber(128*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase256gb.innerHTML = "Purchase 256GB Server - $" + formatNumber(256*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase512gb.innerHTML = "Purchase 512GB Server - $" + formatNumber(512*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase1tb.innerHTML = "Purchase 1TB Server - $" + formatNumber(1024*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    if (!SpecialServerIps.hasOwnProperty("Darkweb Server")) {
        purchaseTor.classList.add("a-link-button");
        purchaseTor.classList.remove("a-link-button-bought");
        purchaseTor.innerHTML = "Purchase TOR Router - $" + formatNumber(CONSTANTS.TorRouterCost, 2);
    } else {
        purchaseTor.classList.remove("a-link-button");
        purchaseTor.classList.add("a-link-button-bought");
        purchaseTor.innerHTML = "TOR Router - Purchased";
    }


    travelAgencyText.style.display = "none";
    travelToAevum.style.display = "none";
    travelToChongqing.style.display = "none";
    travelToSector12.style.display = "none";
    travelToNewTokyo.style.display = "none";
    travelToIshima.style.display = "none";
    travelToVolhaven.style.display = "none";

    infiltrate.style.display = "none";

    hospitalTreatment.style.display = "none";

    slumsDescText.style.display = "none";
    slumsShoplift.style.display = "none";
    slumsRobStore.style.display = "none";
    slumsMug.style.display = "none";
    slumsLarceny.style.display = "none";
    slumsDealDrugs.style.display = "none";
    slumsBondForgery.style.display = "none";
    slumsTrafficArms.style.display = "none";
    slumsHomicide.style.display = "none";
    slumsGta.style.display = "none";
    slumsKidnap.style.display = "none";
    slumsAssassinate.style.display = "none";
    slumsHeist.style.display = "none";

    cityHallCreateCorporation.style.display = "none";
    nsaBladeburner.style.display = "none";
    vitalifeResleeve.style.display = "none";

    //Check if the player is employed at this Location. If he is, display the "Work" button,
    //update the job title, etc.
    if (loc != "" && Object.keys(Player.jobs).includes(loc)) {
        let company = Companies[loc];

        jobTitle.style.display = "block";
        jobReputation.style.display = "inline";
        companyFavor.style.display = "inline";
        locationTxtDiv1.style.display = "block";
        locationTxtDiv2.style.display = "block";
        locationTxtDiv3.style.display = "block";
        jobTitle.innerHTML = `Job Title: ${Player.jobs[loc]}`;
        let repGain = company.getFavorGain();
        if (repGain.length != 2) {repGain = 0;}
        repGain = repGain[0];
        jobReputation.innerHTML = "Company reputation: " + formatNumber(company.playerReputation, 4) +
                                  "<span class='tooltiptext'>You will earn " +
                                  formatNumber(repGain, 0) +
                                  " faction favor upon resetting after installing an Augmentation</span>";
        companyFavor.innerHTML = "Company Favor: " + formatNumber(company.favor, 0) +
                                 "<span class='tooltiptext'>Company favor increases the rate at which " +
                                 "you earn reputation for this company by 1% per favor. Company favor " +
                                 "is gained whenever you reset after installing an Augmentation. The amount of " +
                                 "favor you gain depends on how much reputation you have with the company</span>";
        work.style.display = "block";

        let currPos = CompanyPositions[Player.jobs[loc]];
        if (currPos == null) {
            throw new Error("Player's companyPosition property has an invalid value");
        }

        work.addEventListener("click", function() {
            if (currPos.isPartTimeJob() || currPos.isSoftwareConsultantJob() || currPos.isBusinessConsultantJob()) {
                Player.startWorkPartTime(loc);
            } else {
                Player.startWork(loc);
            }
            return false;
        });

        //Change the text for the corresponding position from "Apply for X Job" to "Apply for promotion"
        if (currPos.isSoftwareJob()) {
            softwareJob.innerHTML = "Apply for a promotion (Software)";
        } else if (currPos.isSoftwareConsultantJob()) {
            softwareConsultantJob.innerHTML = "Apply for a promotion (Software Consultant)";
        } else if (currPos.isITJob()) {
            itJob.innerHTML = "Apply for a promotion (IT)";
        } else if (currPos.isSecurityEngineerJob()) {
            securityEngineerJob.innerHTML = "Apply for a promotion (Security Engineer)";
        } else if (currPos.isNetworkEngineerJob()) {
            networkEngineerJob.innerHTML = "Apply for a promotion (Network Engineer)";
        } else if (currPos.isBusinessJob()) {
            businessJob.innerHTML = "Apply for a promotion (Business)";
        } else if (currPos.isBusinessConsultantJob()) {
            businessConsultantJob.innerHTML = "Apply for a promotion (Business Consultant)";
        } else if (currPos.isSecurityJob()) {
            securityJob.innerHTML = "Apply for a promotion (Security)";
        } else if (currPos.isAgentJob()) {
            agentJob.innerHTML = "Apply for a promotion (Agent)";
        }
    } else {
		jobTitle.style.display = "none";
		jobReputation.style.display = "none";
        companyFavor.style.display = "none";
        locationTxtDiv1.style.display = "none";
        locationTxtDiv2.style.display = "none";
        locationTxtDiv3.style.display = "none";
	}

    //Calculate hospital Cost
    if (Player.hp < 0) {Player.hp = 0;}
    var hospitalTreatmentCost = (Player.max_hp - Player.hp) * CONSTANTS.HospitalCostPerHp;

    //Set tooltip for job requirements
    setJobRequirementTooltip(loc, CompanyPositions[posNames.SoftwareCompanyPositions[0]], softwareJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.SoftwareConsultantCompanyPositions[0]], softwareConsultantJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.ITCompanyPositions[0]], itJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.SecurityEngineerCompanyPositions[0]], securityEngineerJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.NetworkEngineerCompanyPositions[0]], networkEngineerJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.BusinessCompanyPositions[0]], businessJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.BusinessConsultantCompanyPositions[0]], businessConsultantJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.SecurityCompanyPositions[0]], securityJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.AgentCompanyPositions[0]], agentJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.MiscCompanyPositions[1]], employeeJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.PartTimeCompanyPositions[1]], employeePartTimeJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.MiscCompanyPositions[0]], waiterJob);
    setJobRequirementTooltip(loc, CompanyPositions[posNames.PartTimeCompanyPositions[0]], waiterPartTimeJob);

    switch (loc) {
        case Locations.AevumTravelAgency:
            travelAgencyText.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToSector12.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToIshima.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;

        case Locations.AevumSummitUniversity:
            var costMult = 4, expMult = 3;
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
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumECorp,
                                4800, 116, 150, 6);
            break;

        case Locations.AevumBachmanAndAssociates:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumBachmanAndAssociates,
                                1350, 42, 60, 4.1);
            break;

        case Locations.AevumClarkeIncorporated:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumClarkeIncorporated,
                                1800, 34, 75, 3.6);
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
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumFulcrumTechnologies,
                                4140, 96, 100, 6.2);
            break;

        case Locations.AevumAeroCorp:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumAeroCorp,
                                1350, 32, 50, 4.4);
            break;

        case Locations.AevumGalacticCybersystems:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumGalacticCybersystems,
                                1260, 30, 50, 3.95);
            break;

        case Locations.AevumWatchdogSecurity:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumWatchdogSecurity,
                                690, 20, 30, 3);
            break;

        case Locations.AevumRhoConstruction:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumRhoConstruction,
                                485, 16, 20, 1.9);
            break;

        case Locations.AevumPolice:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumPolice,
                                565, 18, 25, 2.2);
            break;

        case Locations.AevumNetLinkTechnologies:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";

            purchase2gb.style.display = "block";
            purchase4gb.style.display = "block";
            purchase8gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumNetLinkTechnologies,
                                144, 10, 25, 1.4);
            break;

        case Locations.AevumCrushFitnessGym:
            var costMult = 3, expMult = 2;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
            break;

        case Locations.AevumSnapFitnessGym:
            var costMult = 10, expMult = 5;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
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
            setInfiltrateButton(infiltrate, Locations.ChongqingKuaiGongInternational,
                                4450, 100, 100, 6.1);
            break;

        case Locations.ChongqingSolarisSpaceSystems:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.ChongqingSolarisSpaceSystems,
                                2915, 52, 75, 6);
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
            var costMult = 3, expMult = 2;
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
            setInfiltrateButton(infiltrate, Locations.Sector12MegaCorp,
                                4500, 114, 125, 6.75);
            break;

        case Locations.Sector12BladeIndustries:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12BladeIndustries,
                                2160, 46, 100, 4.2);
            break;

        case Locations.Sector12FourSigma:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12FourSigma,
                                1350, 58, 100, 7);
            break;

        case Locations.Sector12IcarusMicrosystems:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12IcarusMicrosystems,
                                730, 32, 70, 5.4);
            break;

        case Locations.Sector12UniversalEnergy:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12UniversalEnergy,
                                700, 24, 50, 4.3);
            break;

        case Locations.Sector12DeltaOne:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12DeltaOne,
                                970, 38, 75, 4.5);
            break;

        case Locations.Sector12CIA:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12CIA,
                                1170, 44, 80, 4.6);
            break;

        case Locations.Sector12NSA:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            if (Player.bitNodeN === 6 || hasBladeburnerSF === true) {
                if (Player.bitNodeN === 8) {break;}
                if (Player.bladeburner instanceof Bladeburner) {
                    //Note: Can't infiltrate NSA when part of bladeburner
                    nsaBladeburner.innerText = "Enter Bladeburner Headquarters";
                } else {
                    setInfiltrateButton(infiltrate, Locations.Sector12NSA,
                                        1135, 40, 80, 5);
                    nsaBladeburner.innerText = "Apply to Bladeburner Division";
                }
                nsaBladeburner.style.display = "block";
            } else {
                setInfiltrateButton(infiltrate, Locations.Sector12NSA,
                                    1135, 40, 80, 5);
            }
            break;

        case Locations.Sector12AlphaEnterprises:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            businessJob.style.display = "block";
            purchase2gb.style.display = "block";
            purchase4gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12AlphaEnterprises,
                                200, 14, 40, 2.25);
            break;

        case Locations.Sector12CarmichaelSecurity:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12CarmichaelSecurity,
                                405, 18, 60, 2.5);
            break;

        case Locations.Sector12FoodNStuff:
			locationInfo.innerHTML = Companies[loc].info;

            employeeJob.style.display = "block";
            employeePartTimeJob.style.display = "block";
            break;

        case Locations.Sector12JoesGuns:
			locationInfo.innerHTML = Companies[loc].info;

            employeeJob.style.display = "block";
            employeePartTimeJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12JoesGuns,
                                120, 8, 20, 1.8);
            break;

        case Locations.Sector12IronGym:
            var costMult = 1, expMult = 1;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
            break;

        case Locations.Sector12PowerhouseGym:
            var costMult = 20, expMult = 10;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
            break;

        case Locations.Sector12CityHall:
            cityHallCreateCorporation.style.display = "block";
            if (Player.corporation instanceof Corporation) {
                cityHallCreateCorporation.className = "a-link-button-inactive";
            } else {
                cityHallCreateCorporation.className = "a-link-button";
            }
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
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.NewTokyoDefComm,
                                1050, 28, 70, 4);
            break;

        case Locations.NewTokyoVitaLife:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.NewTokyoVitaLife,
                                605, 22, 100, 3.5);
            if (Player.bitNodeN === 10 || SourceFileFlags[10]) {
                vitalifeResleeve.style.display = "block";
            }

            break;

        case Locations.NewTokyoGlobalPharmaceuticals:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.NewTokyoGlobalPharmaceuticals,
                                700, 24, 80, 3.8);
            break;

        case Locations.NewTokyoNoodleBar:
			locationInfo.innerHTML = Companies[loc].info;

            waiterJob.style.display = "block";
            waiterPartTimeJob.style.display = "block";
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
            softwareConsultantJob.style.display = "block";
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
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.IshimaStormTechnologies,
                                570, 24, 100, 4.1);
            break;

        case Locations.IshimaNovaMedical:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.IshimaNovaMedical,
                                485, 20, 50, 3.2);
            break;

        case Locations.IshimaOmegaSoftware:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            businessJob.style.display = "block";

            purchase4gb.style.display = "block";
            purchase8gb.style.display = "block";
            purchase16gb.style.display = "block";
            purchase32gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.IshimaOmegaSoftware,
                                130, 10, 40, 1.6);
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
            var costMult = 5, expMult = 4;
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
            setInfiltrateButton(infiltrate, Locations.VolhavenOmniTekIncorporated,
                                1215, 44, 100, 4.4);
            break;

        case Locations.VolhavenNWO:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenNWO,
                                1460, 56, 200, 6.8);
            break;

        case Locations.VolhavenHeliosLabs:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenHeliosLabs,
                                1080, 28, 75, 3);
            break;

        case Locations.VolhavenOmniaCybersystems:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenOmniaCybersystems,
                                725, 28, 90, 4.9);
            break;

        case Locations.VolhavenLexoCorp:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenLexoCorp,
                                340, 14, 60, 2);
            break;

        case Locations.VolhavenSysCoreSecurities:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenSysCoreSecurities,
                                430, 18, 75, 2.4);
            break;

        case Locations.VolhavenCompuTek:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
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
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenCompuTek,
                                195, 12, 60, 2.1);
            break;

        case Locations.VolhavenMilleniumFitnessGym:
            var costMult = 7, expMult = 4;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
            break;

        //All Slums
        case Locations.AevumSlums:
        case Locations.ChongqingSlums:
        case Locations.Sector12Slums:
        case Locations.NewTokyoSlums:
        case Locations.IshimaSlums:
        case Locations.VolhavenSlums:
            var shopliftChance = Crimes.Shoplift.successRate(Player);
            var robStoreChance = Crimes.RobStore.successRate(Player);
            var mugChance = Crimes.Mug.successRate(Player);
            var larcenyChance = Crimes.Larceny.successRate(Player);
            var drugsChance = Crimes.DealDrugs.successRate(Player);
            var bondChance = Crimes.BondForgery.successRate(Player);
            var armsChance = Crimes.TraffickArms.successRate(Player);
            var homicideChance = Crimes.Homicide.successRate(Player);
            var gtaChance = Crimes.GrandTheftAuto.successRate(Player);
            var kidnapChance = Crimes.Kidnap.successRate(Player);
            var assassinateChance = Crimes.Assassination.successRate(Player);
            var heistChance = Crimes.Heist.successRate(Player);

            slumsDescText.style.display = "block";
            slumsShoplift.style.display = "block";
            slumsShoplift.innerHTML = "Shoplift (" + (shopliftChance*100).toFixed(3) + "% chance of success)";
            slumsShoplift.innerHTML += '<span class="tooltiptext"> Attempt to shoplift from a low-end retailer </span>';
            slumsRobStore.style.display = "block";
            slumsRobStore.innerHTML = "Rob store(" + (robStoreChance*100).toFixed(3) + "% chance of success)";
            slumsRobStore.innerHTML += '<span class="tooltiptext">Attempt to commit armed robbery on a high-end store </span>';
            slumsMug.style.display = "block";
            slumsMug.innerHTML = "Mug someone (" + (mugChance*100).toFixed(3) + "% chance of success)";
            slumsMug.innerHTML += '<span class="tooltiptext"> Attempt to mug a random person on the street </span>';
            slumsLarceny.style.display = "block";
            slumsLarceny.innerHTML = "Larceny (" + (larcenyChance*100).toFixed(3) + "% chance of success)";
            slumsLarceny.innerHTML +="<span class='tooltiptext'> Attempt to rob property from someone's house </span>";
            slumsDealDrugs.style.display = "block";
            slumsDealDrugs.innerHTML = "Deal Drugs (" + (drugsChance*100).toFixed(3) + "% chance of success)";
            slumsDealDrugs.innerHTML += '<span class="tooltiptext"> Attempt to deal drugs </span>';
            slumsBondForgery.style.display = "block";
            slumsBondForgery.innerHTML = "Bond Forgery (" + (bondChance*100).toFixed(3) + "% chance of success)";
            slumsBondForgery.innerHTML += "<span class='tooltiptext'> Attempt to forge corporate bonds</span>";
            slumsTrafficArms.style.display = "block";
            slumsTrafficArms.innerHTML = "Traffick Illegal Arms (" + (armsChance*100).toFixed(3) + "% chance of success)";
            slumsTrafficArms.innerHTML += '<span class="tooltiptext"> Attempt to smuggle illegal arms into the city and sell them to gangs and criminal organizations </span>';
            slumsHomicide.style.display = "block";
            slumsHomicide.innerHTML = "Homicide (" + (homicideChance*100).toFixed(3) + "% chance of success)";
            slumsHomicide.innerHTML += '<span class="tooltiptext"> Attempt to murder a random person on the street</span>';
            slumsGta.style.display = "block";
            slumsGta.innerHTML = "Grand Theft Auto (" + (gtaChance*100).toFixed(3) + "% chance of success)";
            slumsGta.innerHTML += '<span class="tooltiptext"> Attempt to commit grand theft auto </span>';
            slumsKidnap.style.display = "block";
            slumsKidnap.innerHTML = "Kidnap and Ransom (" + (kidnapChance*100).toFixed(3) + "% chance of success)";
            slumsKidnap.innerHTML += '<span class="tooltiptext"> Attempt to kidnap and ransom a high-profile target </span>';
            slumsAssassinate.style.display = "block";
            slumsAssassinate.innerHTML = "Assassinate (" + (assassinateChance*100).toFixed(3) + "% chance of success)";
            slumsAssassinate.innerHTML += '<span class="tooltiptext"> Attempt to assassinate a high-profile target </span>';
            slumsHeist.style.display = "block";
            slumsHeist.innerHTML = "Heist (" + (heistChance*100).toFixed(3) + "% chance of success)";
            slumsHeist.innerHTML += '<span class="tooltiptext"> Attempt to pull off the ultimate heist </span>';
            break;

        //Hospital
        case Locations.Hospital:
            hospitalTreatment.innerText = "Get treatment for wounds - $" + formatNumber(hospitalTreatmentCost, 2).toString();
            hospitalTreatment.style.display = "block";
            break;

        default:
            console.log("ERROR: INVALID LOCATION");
    }

    // Make the "Apply to be Employee and Waiter" texts disappear if you already hold the job
    // Includes part-time stuff
    if (Object.keys(Player.jobs).includes(loc)) {
        var currPos = Player.jobs[loc];

        if (currPos == "Employee") {
            employeeJob.style.display = "none";
        } else if (currPos == "Waiter") {
            waiterJob.style.display = "none";
        } else if (currPos == "Part-time Employee") {
            employeePartTimeJob.style.display = "none";
        } else if (currPos == "Part-time Waiter") {
            waiterPartTimeJob.style.display = "none";
        }
    }
}

function initLocationButtons() {
    //Buttons to travel to different locations in World
    let aevumTravelAgency = document.getElementById("aevum-travelagency");
    aevumTravelAgency.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumTravelAgency;
        Engine.loadLocationContent();
        return false;
    });

    let aevumHospital = document.getElementById("aevum-hospital");
    aevumHospital.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

    let aevumSummitUniversity = document.getElementById("aevum-summituniversity");
    aevumSummitUniversity.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumSummitUniversity;
        Engine.loadLocationContent();
        return false;
    });

    let aevumECorp = document.getElementById("aevum-ecorp");
    aevumECorp.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumECorp;
        Engine.loadLocationContent();
        return false;
    });

    let aevumBachmanAndAssociates = document.getElementById("aevum-bachmanandassociates");
    aevumBachmanAndAssociates.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumBachmanAndAssociates;
        Engine.loadLocationContent();
        return false;
    });

    let aevumClarkeIncorporated = document.getElementById("aevum-clarkeincorporated");
    aevumClarkeIncorporated.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
       Player.location = Locations.AevumClarkeIncorporated;
       Engine.loadLocationContent();
       return false;
    });

    let aevumFulcrumTechnologies = document.getElementById("aevum-fulcrumtechnologies");
    aevumFulcrumTechnologies.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumFulcrumTechnologies;
        Engine.loadLocationContent();
        return false;
    });

    let aevumAeroCorp = document.getElementById("aevum-aerocorp");
    aevumAeroCorp.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumAeroCorp;
        Engine.loadLocationContent();
        return false;
    });

    let aevumGalacticCybersystems = document.getElementById("aevum-galacticcybersystems");
    aevumGalacticCybersystems.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumGalacticCybersystems;
        Engine.loadLocationContent();
        return false;
    });

    let aevumWatchdogSecurity = document.getElementById("aevum-watchdogsecurity");
    aevumWatchdogSecurity.addEventListener("click", function() {
        Player.location = Locations.AevumWatchdogSecurity;
        Engine.loadLocationContent();
        return false;
    });

    let aevumRhoConstruction = document.getElementById("aevum-rhoconstruction");
    aevumRhoConstruction.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumRhoConstruction;
        Engine.loadLocationContent();
        return false;
    });

    let aevumPolice = document.getElementById("aevum-aevumpolice");
    aevumPolice.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumPolice;
        Engine.loadLocationContent();
        return false;
    });

    let aevumNetLinkTechnologies = document.getElementById("aevum-netlinktechnologies");
    aevumNetLinkTechnologies.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumNetLinkTechnologies;
        Engine.loadLocationContent();
        return false;
    });

    let aevumCrushFitnessGym = document.getElementById("aevum-crushfitnessgym");
    aevumCrushFitnessGym.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumCrushFitnessGym;
        Engine.loadLocationContent();
        return false;
    });

    let aevumSnapFitnessGym = document.getElementById("aevum-snapfitnessgym");
    aevumSnapFitnessGym.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumSnapFitnessGym;
        Engine.loadLocationContent();
        return false;
    });

    let aevumSlums = document.getElementById("aevum-slums");
    aevumSlums.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.AevumSlums;
        Engine.loadLocationContent();
        return false;
    });

	let chongqingTravelAgency = document.getElementById("chongqing-travelagency");
	chongqingTravelAgency.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.ChongqingTravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let chongqingHospital = document.getElementById("chongqing-hospital");
    chongqingHospital.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

	let chongqingKuaiGongInternational = document.getElementById("chongqing-kuaigonginternational");
	chongqingKuaiGongInternational.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.ChongqingKuaiGongInternational;
		Engine.loadLocationContent();
        return false;
	});

	let chongqingSolarisSpaceSystems = document.getElementById("chongqing-solarisspacesystems");
	chongqingSolarisSpaceSystems.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.ChongqingSolarisSpaceSystems;
		Engine.loadLocationContent();
        return false;
	});

    let chongqingSlums = document.getElementById("chongqing-slums");
    chongqingSlums.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.ChongqingSlums;
        Engine.loadLocationContent();
        return false;
    });

	let sector12TravelAgency = document.getElementById("sector12-travelagency");
	sector12TravelAgency.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12TravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let sector12Hospital = document.getElementById("sector12-hospital");
    sector12Hospital.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

    let sector12RothmanUniversity = document.getElementById("sector12-rothmanuniversity");
    sector12RothmanUniversity.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.Sector12RothmanUniversity;
        Engine.loadLocationContent();
        return false;
    });

	let sector12MegaCorp = document.getElementById("sector12-megacorp");
	sector12MegaCorp.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12MegaCorp;
		Engine.loadLocationContent();
        return false;
	});

	let sector12BladeIndustries = document.getElementById("sector12-bladeindustries");
	sector12BladeIndustries.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12BladeIndustries;
		Engine.loadLocationContent();
        return false;
	});

	let sector12FourSigma = document.getElementById("sector12-foursigma");
	sector12FourSigma.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12FourSigma;
		Engine.loadLocationContent();
        return false;
	});

	let sector12IcarusMicrosystems = document.getElementById("sector12-icarusmicrosystems");
	sector12IcarusMicrosystems.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12IcarusMicrosystems;
		Engine.loadLocationContent();
        return false;
	});

	let sector12UniversalEnergy = document.getElementById("sector12-universalenergy");
	sector12UniversalEnergy.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12UniversalEnergy;
		Engine.loadLocationContent();
        return false;
	});

	let sector12DeltaOne = document.getElementById("sector12-deltaone");
	sector12DeltaOne.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12DeltaOne;
		Engine.loadLocationContent();
        return false;
	});

	let sector12CIA = document.getElementById("sector12-cia");
	sector12CIA.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12CIA;
		Engine.loadLocationContent();
        return false;
	});

	let sector12NSA = document.getElementById("sector12-nsa");
	sector12NSA.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12NSA;
		Engine.loadLocationContent();
        return false;
	});

	let sector12AlphaEnterprises = document.getElementById("sector12-alphaenterprises");
	sector12AlphaEnterprises.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12AlphaEnterprises;
		Engine.loadLocationContent();
        return false;
	});

	let sector12CarmichaelSecurity = document.getElementById("sector12-carmichaelsecurity");
	sector12CarmichaelSecurity.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12CarmichaelSecurity;
		Engine.loadLocationContent();
        return false;
	});

	let sector12FoodNStuff = document.getElementById("sector12-foodnstuff");
	sector12FoodNStuff.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12FoodNStuff;
		Engine.loadLocationContent();
        return false;
	});

	let sector12JoesGuns = document.getElementById("sector12-joesguns");
	sector12JoesGuns.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12JoesGuns;
		Engine.loadLocationContent();
        return false;
	});

	let sector12IronGym = document.getElementById("sector12-irongym");
	sector12IronGym.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12IronGym;
		Engine.loadLocationContent();
        return false;
	});

	let sector12PowerhouseGym = document.getElementById("sector12-powerhousegym");
	sector12PowerhouseGym.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.Sector12PowerhouseGym;
		Engine.loadLocationContent();
        return false;
	});

    let sector12Slums = document.getElementById("sector12-slums");
    sector12Slums.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.Sector12Slums;
        Engine.loadLocationContent();
        return false;
    });

    let sector12CityHall = document.getElementById("sector12-cityhall");
    sector12CityHall.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.Sector12CityHall;
        Engine.loadLocationContent();
        return false;
    });

	let newTokyoTravelAgency = document.getElementById("newtokyo-travelagency");
	newTokyoTravelAgency.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.NewTokyoTravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let newTokyoHospital = document.getElementById("newtokyo-hospital");
    newTokyoHospital.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

	let newTokyoDefComm = document.getElementById("newtokyo-defcomm");
	newTokyoDefComm.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.NewTokyoDefComm;
		Engine.loadLocationContent();
        return false;
	});

	let newTokyoVitaLife = document.getElementById("newtokyo-vitalife");
	newTokyoVitaLife.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.NewTokyoVitaLife;
		Engine.loadLocationContent();
        return false;
	});

	let newTokyoGlobalPharmaceuticals = document.getElementById("newtokyo-globalpharmaceuticals");
	newTokyoGlobalPharmaceuticals.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.NewTokyoGlobalPharmaceuticals;
		Engine.loadLocationContent();
        return false;
	});

	let newTokyoNoodleBar = document.getElementById("newtokyo-noodlebar");
	newTokyoNoodleBar.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.NewTokyoNoodleBar;
		Engine.loadLocationContent();
        return false;
	});

    let newTokyoSlums = document.getElementById("newtokyo-slums");
    newTokyoSlums.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.NewTokyoSlums;
        Engine.loadLocationContent();
        return false;
    });

	let ishimaTravelAgency = document.getElementById("ishima-travelagency");
	ishimaTravelAgency.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.IshimaTravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let ishimaHospital = document.getElementById("ishima-hospital");
    ishimaHospital.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

	let ishimaStormTechnologies = document.getElementById("ishima-stormtechnologies");
	ishimaStormTechnologies.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.IshimaStormTechnologies;
		Engine.loadLocationContent();
        return false;
	});

	let ishimaNovaMedical = document.getElementById("ishima-novamedical");
	ishimaNovaMedical.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.IshimaNovaMedical;
		Engine.loadLocationContent();
        return false;
	});

	let ishimaOmegaSoftware = document.getElementById("ishima-omegasoftware");
	ishimaOmegaSoftware.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.IshimaOmegaSoftware;
		Engine.loadLocationContent();
        return false;
	});

    let ishimaSlums = document.getElementById("ishima-slums");
    ishimaSlums.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.IshimaSlums;
        Engine.loadLocationContent();
        return false;
    });

	let volhavenTravelAgency = document.getElementById("volhaven-travelagency");
	volhavenTravelAgency.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.VolhavenTravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let volhavenHospital = document.getElementById("volhaven-hospital");
    volhavenHospital.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

    let volhavenZBInstituteOfTechnology = document.getElementById("volhaven-zbinstituteoftechnology");
    volhavenZBInstituteOfTechnology.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.VolhavenZBInstituteOfTechnology;
        Engine.loadLocationContent();
        return false;
    });

	let volhavenOmniTekIncorporated = document.getElementById("volhaven-omnitekincorporated");
	volhavenOmniTekIncorporated.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.VolhavenOmniTekIncorporated;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenNWO = document.getElementById("volhaven-nwo");
	volhavenNWO.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.VolhavenNWO;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenHeliosLabs = document.getElementById("volhaven-helioslabs");
	volhavenHeliosLabs.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.VolhavenHeliosLabs;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenOmniaCybersystems = document.getElementById("volhaven-omniacybersystems");
	volhavenOmniaCybersystems.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.VolhavenOmniaCybersystems;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenLexoCorp = document.getElementById("volhaven-lexocorp");
	volhavenLexoCorp.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.VolhavenLexoCorp;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenSysCoreSecurities = document.getElementById("volhaven-syscoresecurities");
	volhavenSysCoreSecurities.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.VolhavenSysCoreSecurities;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenCompuTek = document.getElementById("volhaven-computek");
	volhavenCompuTek.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.VolhavenCompuTek;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenMilleniumFitnessGym = document.getElementById("volhaven-milleniumfitnessgym");
	volhavenMilleniumFitnessGym.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
		Player.location = Locations.VolhavenMilleniumFitnessGym;
		Engine.loadLocationContent();
        return false;
	});

    let volhavenSlums = document.getElementById("volhaven-slums");
    volhavenSlums.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.location = Locations.VolhavenSlums;
        Engine.loadLocationContent();
        return false;
    });

    //Buttons to interact at a location (apply for job/promotion, train, purchase, etc.)
    var softwareJob             = document.getElementById("location-software-job");
    var softwareConsultantJob   = document.getElementById("location-software-consultant-job")
    var itJob                   = document.getElementById("location-it-job");
    var securityEngineerJob     = document.getElementById("location-security-engineer-job");
    var networkEngineerJob      = document.getElementById("location-network-engineer-job");
    var businessJob             = document.getElementById("location-business-job");
    var businessConsultantJob   = document.getElementById("location-business-consultant-job");
    var securityJob             = document.getElementById("location-security-job");
    var agentJob                = document.getElementById("location-agent-job");
    var employeeJob             = document.getElementById("location-employee-job");
    var employeePartTimeJob     = document.getElementById("location-parttime-employee-job");
    var waiterJob               = document.getElementById("location-waiter-job");
    var waiterPartTimeJob       = document.getElementById("location-parttime-waiter-job");

    var work                = document.getElementById("location-work");

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
    var purchaseHomeCores   = document.getElementById("location-purchase-home-cores");

    var travelToAevum       = document.getElementById("location-travel-to-aevum");
    var travelToChongqing   = document.getElementById("location-travel-to-chongqing");
    var travelToSector12    = document.getElementById("location-travel-to-sector12");
    var travelToNewTokyo    = document.getElementById("location-travel-to-newtokyo");
    var travelToIshima      = document.getElementById("location-travel-to-ishima");
    var travelToVolhaven    = document.getElementById("location-travel-to-volhaven");

    var slumsShoplift       = document.getElementById("location-slums-shoplift");
    var slumsRobStore       = document.getElementById("location-slums-rob-store");
    var slumsMug            = document.getElementById("location-slums-mug");
    var slumsLarceny        = document.getElementById("location-slums-larceny");
    var slumsDealDrugs      = document.getElementById("location-slums-deal-drugs");
    var slumsBondForgery    = document.getElementById("location-slums-bond-forgery");
    var slumsTrafficArms    = document.getElementById("location-slums-traffic-arms");
    var slumsHomicide       = document.getElementById("location-slums-homicide");
    var slumsGta            = document.getElementById("location-slums-gta");
    var slumsKidnap         = document.getElementById("location-slums-kidnap");
    var slumsAssassinate    = document.getElementById("location-slums-assassinate");
    var slumsHeist          = document.getElementById("location-slums-heist");

    var cityHallCreateCorporation = document.getElementById("location-cityhall-create-corporation");

    var nsaBladeburner = document.getElementById("location-nsa-bladeburner");

    const vitalifeResleeve = document.getElementById("location-vitalife-resleeve");

    var hospitalTreatment   = document.getElementById("location-hospital-treatment");

    softwareJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForSoftwareJob();
        return false;
    });

    softwareConsultantJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForSoftwareConsultantJob();
        return false;
    });

    itJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForItJob();
        return false;
    });

    securityEngineerJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForSecurityEngineerJob();
        return false;
    });

    networkEngineerJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForNetworkEngineerJob();
        return false;
    });

    businessJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForBusinessJob();
        return false;
    });

    businessConsultantJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForBusinessConsultantJob();
        return false;
    });

    securityJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForSecurityJob();
        return false;
    });

    agentJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForAgentJob();
        return false;
    });

    employeeJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForEmployeeJob();
        return false;
    });

    employeePartTimeJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForPartTimeEmployeeJob();
        return false;
    });

    waiterJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForWaiterJob();
        return false;
    });

    waiterPartTimeJob.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.applyForPartTimeWaiterJob();
        return false;
    });

    purchase2gb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(2, 2 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase4gb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(4, 4 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase8gb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(8, 8 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase16gb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(16, 16 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase32gb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(32, 32 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase64gb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(64, 64 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase128gb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(128, 128 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase256gb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(256, 256 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase512gb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(512, 512 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase1tb.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseServerBoxCreate(1024, 1024 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchaseTor.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        purchaseTorRouter();
        return false;
    });

    purchaseHomeRam.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        const cost = Player.getUpgradeHomeRamCost();
        const ram = Player.getHomeComputer().maxRam;

        var yesBtn = yesNoBoxGetYesButton(), noBtn = yesNoBoxGetNoButton();
        yesBtn.innerHTML = "Purchase"; noBtn.innerHTML = "Cancel";
        yesBtn.addEventListener("click", ()=>{
            purchaseRamForHomeComputer(cost);
            yesNoBoxClose();
        });
        noBtn.addEventListener("click", ()=>{
            yesNoBoxClose();
        });
        yesNoBoxCreate("Would you like to purchase additional RAM for your home computer? <br><br>" +
                       "This will upgrade your RAM from " + ram + "GB to " + ram*2 + "GB. <br><br>" +
                       "This will cost " + numeralWrapper.format(cost, '$0.000a'));
    });

    purchaseHomeCores.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        var currentCores = Player.getHomeComputer().cpuCores;
        if (currentCores >= 8) {return;} //Max of 8 cores

        //Cost of purchasing another cost is found by indexing this array with number of current cores
        var cost = [0,
                    10000000000,                 //1->2 Cores - 10 bn
                    250000000000,               //2->3 Cores - 250 bn
                    5000000000000,              //3->4 Cores - 5 trillion
                    100000000000000,            //4->5 Cores - 100 trillion
                    1000000000000000,           //5->6 Cores - 1 quadrillion
                    20000000000000000,          //6->7 Cores - 20 quadrillion
                    200000000000000000];        //7->8 Cores - 200 quadrillion
        cost = cost[currentCores];
        var yesBtn = yesNoBoxGetYesButton(), noBtn = yesNoBoxGetNoButton();
        yesBtn.innerHTML = "Purchase"; noBtn.innerHTML = "Cancel";
        yesBtn.addEventListener("click", ()=>{
            if (Player.money.lt(cost)) {
                dialogBoxCreate("You do not have enough money to purchase an additional CPU Core for your home computer!");
            } else {
                Player.loseMoney(cost);
                Player.getHomeComputer().cpuCores++;
                dialogBoxCreate("You purchased an additional CPU Core for your home computer! It now has " +
                                Player.getHomeComputer().cpuCores +  " cores.");
            }
            yesNoBoxClose();
        });
        noBtn.addEventListener("click", ()=>{
            yesNoBoxClose();
        });
        yesNoBoxCreate("Would you like to purchase an additional CPU Core for your home computer? Each CPU Core " +
                       "lets you start with an additional Core Node in Hacking Missions.<br><br>" +
                       "Purchasing an additional core (for a total of " + (Player.getHomeComputer().cpuCores + 1) + ") will " +
                       "cost " + numeralWrapper.format(cost, '$0.000a'));
    });

    travelToAevum.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        travelBoxCreate(Locations.Aevum, CONSTANTS.TravelCost);
        return false;
    });

    travelToChongqing.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        travelBoxCreate(Locations.Chongqing, CONSTANTS.TravelCost);
        return false;
    });

    travelToSector12.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        travelBoxCreate(Locations.Sector12, CONSTANTS.TravelCost);
        return false;
    });

    travelToNewTokyo.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        travelBoxCreate(Locations.NewTokyo, CONSTANTS.TravelCost);
        return false;
    });

    travelToIshima.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        travelBoxCreate(Locations.Ishima, CONSTANTS.TravelCost);
        return false;
    });

    travelToVolhaven.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        travelBoxCreate(Locations.Volhaven, CONSTANTS.TravelCost);
        return false;
    });

    slumsShoplift.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.Shoplift.commit(Player);
        return false;
    });

    slumsRobStore.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.RobStore.commit(Player);
        return false;
    });

    slumsMug.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.Mug.commit(Player);
        return false;
    });

    slumsLarceny.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.Larceny.commit(Player);
        return false;
    });

    slumsDealDrugs.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.DealDrugs.commit(Player);
        return false;
    });

    slumsBondForgery.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.BondForgery.commit(Player);
        return false;
    });

    slumsTrafficArms.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.TraffickArms.commit(Player);
        return false;
    });

    slumsHomicide.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.Homicide.commit(Player);
        return false;
    });

    slumsGta.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.GrandTheftAuto.commit(Player);
        return false;
    });

    slumsKidnap.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.Kidnap.commit(Player);
        return false;
    });

    slumsAssassinate.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.Assassination.commit(Player);
        return false;
    });

    slumsHeist.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Crimes.Heist.commit(Player);
        return false;
    });

    cityHallCreateCorporation.addEventListener("click", function() {
        const popupId = "create-corporation-popup";
        const txt = createElement("p", {
            innerHTML: "Would you like to start a corporation? This will require $150b for registration " +
                       "and initial funding. This $150b can either be self-funded, or you can obtain " +
                       "the seed money from the government in exchange for 500 million shares<br><br>" +
                       "If you would like to start one, please enter a name for your corporation below:",
        });

        const nameInput = createElement("input", {
            placeholder: "Corporation Name",
        });

        const selfFundedButton = createElement("button", {
            class: "popup-box-button",
            innerText: "Self-Fund",
            clickListener: () => {
                if (Player.money.lt(150e9)) {
                    dialogBoxCreate("You don't have enough money to create a corporation! You need $150b");
                    return false;
                }
                Player.loseMoney(150e9);

                const companyName = nameInput.value;
                if (companyName == null || companyName == "") {
                    dialogBoxCreate("Invalid company name!");
                    return false;
                }

                Player.corporation = new Corporation({
                    name: companyName,
                });

                displayLocationContent();
                document.getElementById("world-menu-header").click();
                document.getElementById("world-menu-header").click();
                dialogBoxCreate("Congratulations! You just self-funded your own corporation. You can visit " +
                                "and manage your company in the City");
                removeElementById(popupId);
                return false;
            }
        });

        const seedMoneyButton = createElement("button", {
            class: "popup-box-button",
            innerText: "Use Seed Money",
            clickListener: () => {
                const companyName = nameInput.value;
                if (companyName == null || companyName == "") {
                    dialogBoxCreate("Invalid company name!");
                    return false;
                }

                Player.corporation = new Corporation({
                    name: companyName,
                });
                Player.corporation.totalShares += 500e6;

                displayLocationContent();
                document.getElementById("world-menu-header").click();
                document.getElementById("world-menu-header").click();
                dialogBoxCreate("Congratulations! You just started your own corporation with government seed money. " +
                                "You can visit and manage your company in the City");
                removeElementById(popupId);
                return false;
            }
        })

        const cancelBtn = createPopupCloseButton(popupId, { class: "popup-box-button" });

        if (Player.corporation instanceof Corporation) {
            return;
        } else {
            createPopup(popupId, [txt, nameInput, cancelBtn, selfFundedButton, seedMoneyButton]);
            nameInput.focus();
        }
    });

    nsaBladeburner.addEventListener("click", function() {
        if (Player.bladeburner && Player.bladeburner instanceof Bladeburner) {
            //Enter Bladeburner division
            Engine.loadBladeburnerContent();
        } else {
            //Apply for Bladeburner division
            if (Player.strength >= 100 && Player.defense >= 100 &&
                Player.dexterity >= 100 && Player.agility >= 100) {
                Player.bladeburner = new Bladeburner({new:true});
                dialogBoxCreate("You have been accepted into the Bladeburner division!");
                displayLocationContent();
                document.getElementById("world-menu-header").click();
                document.getElementById("world-menu-header").click();
            } else {
                dialogBoxCreate("Rejected! Please apply again when you have 100 of each combat stat (str, def, dex, agi)");
            }
        }
    });

    vitalifeResleeve.addEventListener("click", function() {
        Engine.loadResleevingContent();
    });

    hospitalTreatment.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        if (Player.hp < 0) {Player.hp = 0;}
        var price = (Player.max_hp - Player.hp) * CONSTANTS.HospitalCostPerHp;
        Player.loseMoney(price);
        dialogBoxCreate("You were healed to full health! The hospital billed " +
                        "you for $" + formatNumber(price, 2).toString());
        Player.hp = Player.max_hp;
        displayLocationContent();
        return false;
    });
}

function travelToCity(destCityName, cost) {
    if (Player.firstTimeTraveled === false) {
        Player.firstTimeTraveled = true;
        document.getElementById("travel-tab").style.display = "list-item";
        document.getElementById("world-menu-header").click();
        document.getElementById("world-menu-header").click();
    }

    if (Player.money.lt(cost)) {
        dialogBoxCreate("You cannot afford to travel to " + destCityName);
        return;
    }
    Player.loseMoney(cost);

    Player.city = destCityName;
    dialogBoxCreate("You are now in " + destCityName + "!");
    Engine.loadWorldContent();
}

function purchaseTorRouter() {
    if (Player.money.lt(CONSTANTS.TorRouterCost)) {
        dialogBoxCreate("You cannot afford to purchase the Tor router");
        return;
    }
    Player.loseMoney(CONSTANTS.TorRouterCost);

    var darkweb = new Server({
        ip:createRandomIp(), hostname:"darkweb", organizationName:"",
        isConnectedTo:false, adminRights:false, purchasedByPlayer:false, maxRam:1
    });
    AddToAllServers(darkweb);
    SpecialServerIps.addIp("Darkweb Server", darkweb.ip);

    const purchaseTor = document.getElementById("location-purchase-tor");
    purchaseTor.setAttribute("class", "a-link-button-bought");
    purchaseTor.innerHTML = "TOR Router - Purchased";

    Player.getHomeComputer().serversOnNetwork.push(darkweb.ip);
    darkweb.serversOnNetwork.push(Player.getHomeComputer().ip);
    dialogBoxCreate("You have purchased a Tor router!<br>You now have access to the dark web from your home computer<br>Use the scan/scan-analyze commands to search for the dark web connection.");
}

function displayUniversityLocationContent(costMult) {
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
    classNetworksButton.innerHTML       = "Take Networks course ($"         + networksCost       + " / sec)";
    classAlgorithmsButton.innerHTML     = "Take Algorithms course ($"       + algorithmsCost     + " / sec)";
    classManagementButton.innerHTML     = "Take Management course ($"       + managementCost     + " / sec)";
    classLeadershipButton.innerHTML     = "Take Leadership course ($"       + leadershipCost     + " / sec)";
}

function setUniversityLocationButtons(costMult, expMult) {
    var newStudyCS = clearEventListeners("location-study-computer-science");
    newStudyCS.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassStudyComputerScience);
        return false;
    });

    var newClassDataStructures = clearEventListeners("location-data-structures-class");
    newClassDataStructures.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassDataStructures);
        return false;
    });

    var newClassNetworks = clearEventListeners("location-networks-class");
    newClassNetworks.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassNetworks);
        return false;
    });

    var newClassAlgorithms = clearEventListeners("location-algorithms-class");
    newClassAlgorithms.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassAlgorithms);
        return false;
    });

    var newClassManagement = clearEventListeners("location-management-class");
    newClassManagement.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassManagement);
        return false;
    });

    var newClassLeadership = clearEventListeners("location-leadership-class");
    newClassLeadership.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassLeadership);
        return false;
    });
}

function displayGymLocationContent(costMult) {
    var gymStrButton    = document.getElementById("location-gym-train-str");
    var gymDefButton    = document.getElementById("location-gym-train-def");
    var gymDexButton    = document.getElementById("location-gym-train-dex");
    var gymAgiButton    = document.getElementById("location-gym-train-agi");
    gymStrButton.style.display = "block";
    gymDefButton.style.display = "block";
    gymDexButton.style.display = "block";
    gymAgiButton.style.display = "block";

    //Costs (per second)
    var cost = CONSTANTS.ClassGymBaseCost * costMult;

    //Update button text to show cost
    gymStrButton.innerHTML = "Train Strength ($" + cost + " / sec)";
    gymDefButton.innerHTML = "Train Defense ($" + cost + " / sec)";
    gymDexButton.innerHTML = "Train Dexterity ($" + cost + " / sec)";
    gymAgiButton.innerHTML = "Train Agility ($" + cost + " / sec)";
}

function setGymLocationButtons(costMult, expMult) {
    var gymStr = clearEventListeners("location-gym-train-str");
    gymStr.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassGymStrength);
        return false;
    });

    var gymDef = clearEventListeners("location-gym-train-def");
    gymDef.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassGymDefense);
        return false;
    });

    var gymDex = clearEventListeners("location-gym-train-dex");
    gymDex.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassGymDexterity);
        return false;
    });

    var gymAgi = clearEventListeners("location-gym-train-agi");
    gymAgi.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassGymAgility);
        return false;
    });
}

function setInfiltrateButton(btn, companyName, startLevel, val, maxClearance, difficulty) {
    btn.style.display = "block";
    btn.addEventListener("click", function() {
        Engine.loadInfiltrationContent();
        beginInfiltration(companyName, startLevel, val, maxClearance, difficulty)
        return false;
    });
}

//Finds the next target job for the player at the given company (loc) and
//adds the tooltiptext to the Application button, given by 'button'
function setJobRequirementTooltip(loc, entryPosType, btn) {
    var company = Companies[loc];
    if (company == null) {return;}
    var pos = Player.getNextCompanyPosition(company, entryPosType);
    if (pos == null) { return };
    if (!company.hasPosition(pos)) { return; }
    var reqText = getJobRequirementText(company, pos, true);
    btn.innerHTML += "<span class='tooltiptext'>" + reqText + "</span>";
}

function travelBoxCreate(destCityName, cost) {
    if(Settings.SuppressTravelConfirmation) {
        travelToCity(destCityName, cost);
        return;
    }
    var yesBtn = yesNoBoxGetYesButton(), noBtn = yesNoBoxGetNoButton();
    yesBtn.innerHTML = "Yes";
    noBtn.innerHTML = "No";
    noBtn.addEventListener("click", () => {
        yesNoBoxClose();
        return false;
    });
    yesBtn.addEventListener("click", () => {
        yesNoBoxClose();
        travelToCity(destCityName, cost);
        return false;
    });
    yesNoBoxCreate("Would you like to travel to " + destCityName + "? The trip will cost $" + formatNumber(cost, 2) + ".");
}

function purchaseServerBoxCreate(ram, cost) {
    var yesBtn = yesNoTxtInpBoxGetYesButton();
    var noBtn = yesNoTxtInpBoxGetNoButton();
    yesBtn.innerHTML = "Purchase Server";
    noBtn.innerHTML = "Cancel";
    yesBtn.addEventListener("click", function() {
        purchaseServer(ram, cost);
        yesNoTxtInpBoxClose();
    });
    noBtn.addEventListener("click", function() {
        yesNoTxtInpBoxClose();
    });

    yesNoTxtInpBoxCreate("Would you like to purchase a new server with " + ram +
                         "GB of RAM for $" + formatNumber(cost, 2) + "?<br><br>" +
                         "Please enter the server hostname below:<br>");
}

export {displayLocationContent, initLocationButtons};
