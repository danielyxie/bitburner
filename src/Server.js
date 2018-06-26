import {BitNodeMultipliers}                         from "./BitNode.js";
import {CONSTANTS}                                  from "./Constants.js";
import {Programs}                                   from "./CreateProgram.js";
import {Player}                                     from "./Player.js";
import {RunningScript, Script}                      from "./Script.js";
import {SpecialServerNames, SpecialServerIps}       from "./SpecialServerIps.js";
import {getRandomInt}                               from "../utils/HelperFunctions";
import {createRandomIp, isValidIPAddress, ipExists} from "../utils/IPAddress.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                           from "../utils/JSONReviver.js";

function Server(params={ip:createRandomIp(), hostname:""}) {
    /* Properties */
    //Connection information
    this.ip = params.ip ? params.ip : createRandomIp();

    var hostname = params.hostname;
    var i = 0;
    var suffix = "";
    while (GetServerByHostname(hostname+suffix) != null) {
        //Server already exists
        suffix = "-" + i;
        ++i;
    }
    this.hostname           =     hostname + suffix;
    this.organizationName   =     params.organizationName != null ? params.organizationName   : "";
    this.isConnectedTo      =     params.isConnectedTo  != null   ? params.isConnectedTo      : false;

    //Access information
    this.hasAdminRights     =    params.adminRights != null       ? params.adminRights        : false;
    this.purchasedByPlayer  =    params.purchasedByPlayer != null ? params.purchasedByPlayer  : false;
    this.manuallyHacked     =    false;  //Flag that tracks whether or not the server has been hacked at least once

    //RAM, CPU speed and Scripts
    this.maxRam     = params.maxRam != null ? params.maxRam : 0;  //GB
    this.ramUsed    = 0;
    this.cpuCores   = 1; //Max of 8, affects hacking times and Hacking Mission starting Cores

    this.scripts        = [];
    this.runningScripts = [];   //Stores RunningScript objects
    this.programs       = [];
    this.messages       = [];
    this.textFiles      = [];
    this.dir            = 0;    //new Directory(this, null, ""); TODO

    /* Hacking information (only valid for "foreign" aka non-purchased servers) */
    this.requiredHackingSkill   = params.requiredHackingSkill != null ? params.requiredHackingSkill : 1;
    this.moneyAvailable         = params.moneyAvailable != null       ? params.moneyAvailable * BitNodeMultipliers.ServerStartingMoney : 0;
    this.moneyMax               = 25 * this.moneyAvailable * BitNodeMultipliers.ServerMaxMoney;

    //Hack Difficulty is synonymous with server security. Base Difficulty = Starting difficulty
    this.hackDifficulty         = params.hackDifficulty != null ? params.hackDifficulty * BitNodeMultipliers.ServerStartingSecurity : 1;
    this.baseDifficulty         = this.hackDifficulty;
    this.minDifficulty          = Math.max(1, Math.round(this.hackDifficulty / 3));
    this.serverGrowth           = params.serverGrowth != null   ? params.serverGrowth : 1; //Integer from 0 to 100. Affects money increase from grow()

    //The IP's of all servers reachable from this one (what shows up if you run scan/netstat)
    //  NOTE: Only contains IP and not the Server objects themselves
    this.serversOnNetwork        = [];

    //Port information, required for porthacking servers to get admin rights
    this.numOpenPortsRequired = params.numOpenPortsRequired != null ? params.numOpenPortsRequired : 5;
    this.sshPortOpen          = false;    //Port 22
    this.ftpPortOpen          = false;    //Port 21
    this.smtpPortOpen         = false;    //Port 25
    this.httpPortOpen         = false;    //Port 80
    this.sqlPortOpen          = false;    //Port 1433
    this.openPortCount        = 0;
};

Server.prototype.setMaxRam = function(ram) {
    this.maxRam = ram;
}

//The serverOnNetwork array holds the IP of all the servers. This function
//returns the actual Server objects
Server.prototype.getServerOnNetwork = function(i) {
    if (i > this.serversOnNetwork.length) {
        console.log("Tried to get server on network that was out of range");
        return;
    }
    return AllServers[this.serversOnNetwork[i]];
}

//Given the name of the script, returns the corresponding
//script object on the server (if it exists)
Server.prototype.getScript = function(scriptName) {
    for (var i = 0; i < this.scripts.length; i++) {
        if (this.scripts[i].filename == scriptName) {
            return this.scripts[i];
        }
    }
    return null;
}

Server.prototype.capDifficulty = function() {
    if (this.hackDifficulty < this.minDifficulty) {this.hackDifficulty = this.minDifficulty;}
    if (this.hackDifficulty < 1) {this.hackDifficulty = 1;}
    //Place some arbitrarily limit that realistically should never happen unless someone is
    //screwing around with the game
    if (this.hackDifficulty > 1000000) {this.hackDifficulty = 1000000;}
}

//Strengthens a server's security level (difficulty) by the specified amount
Server.prototype.fortify = function(amt) {
    this.hackDifficulty += amt;
    this.capDifficulty();
}

Server.prototype.weaken = function(amt) {
    this.hackDifficulty -= (amt * BitNodeMultipliers.ServerWeakenRate);
    this.capDifficulty();
}

//Functions for loading and saving a Server
Server.prototype.toJSON = function() {
    return Generic_toJSON("Server", this);
}

Server.fromJSON = function(value) {
    return Generic_fromJSON(Server, value.data);
}

Reviver.constructors.Server = Server;

function initForeignServers() {
    //MegaCorporations
    var ECorpServer = new Server({
        ip:createRandomIp(), hostname:"ecorp", organizationName:"ECorp",
        requiredHackingSkill:getRandomInt(1150, 1300), moneyAvailable:getRandomInt(30e9, 70e9),
        hackDifficulty:99,serverGrowth:99, numOpenPortsRequired: 5,
    });
    AddToAllServers(ECorpServer);

    var MegaCorpServer = new Server({
        ip:createRandomIp(), hostname:"megacorp", organizationName:"MegaCorp",
        requiredHackingSkill:getRandomInt(1150, 1300), moneyAvailable:getRandomInt(40e9, 60e9),
        hackDifficulty:99, serverGrowth:99, numOpenPortsRequired:5
    });
    AddToAllServers(MegaCorpServer);

    var BachmanAndAssociatesServer = new Server({
        ip:createRandomIp(), hostname:"b-and-a", organizationName:"Bachman & Associates",
        requiredHackingSkill:getRandomInt(1000, 1050), moneyAvailable:getRandomInt(20e9, 25e9),
        hackDifficulty:getRandomInt(75, 85), serverGrowth:getRandomInt(65, 75), numOpenPortsRequired:5
    });
    AddToAllServers(BachmanAndAssociatesServer);

    var BladeIndustriesServer = new Server({
        ip:createRandomIp(), hostname:"blade", organizationName:"Blade Industries", maxRam:128,
        requiredHackingSkill:getRandomInt(1000, 1100), moneyAvailable:getRandomInt(12e9, 20e9),
        hackDifficulty:getRandomInt(90, 95), serverGrowth:getRandomInt(60, 75), numOpenPortsRequired:5
    });
    BladeIndustriesServer.messages.push("beyond-man.lit");
    AddToAllServers(BladeIndustriesServer);

    var NWOServer = new Server({
        ip:createRandomIp(), hostname:"nwo", organizationName:"New World Order",
        requiredHackingSkill:getRandomInt(1000, 1200), moneyAvailable:getRandomInt(25e9, 35e9),
        hackDifficulty:99, serverGrowth:getRandomInt(75, 85), numOpenPortsRequired:5
    });
    NWOServer.messages.push("the-hidden-world.lit");
    AddToAllServers(NWOServer);

    var ClarkeIncorporatedServer = new Server({
        ip:createRandomIp(), hostname:"clarkeinc", organizationName:"Clarke Incorporated",
        requiredHackingSkill:getRandomInt(1000, 1200), moneyAvailable:getRandomInt(15e9, 25e9),
        hackDifficulty:getRandomInt(50, 60), serverGrowth:getRandomInt(50, 70), numOpenPortsRequired:5
    });
    ClarkeIncorporatedServer.messages.push("beyond-man.lit");
    ClarkeIncorporatedServer.messages.push("cost-of-immortality.lit");
    AddToAllServers(ClarkeIncorporatedServer);

    var OmniTekIncorporatedServer = new Server({
        ip:createRandomIp(), hostname:"omnitek", organizationName:"OmniTek Incorporated", maxRam:256,
        requiredHackingSkill:getRandomInt(900, 1100), moneyAvailable:getRandomInt(15e9, 20e9),
        hackDifficulty:getRandomInt(90, 99), serverGrowth:getRandomInt(95, 99), numOpenPortsRequired:5
    });
    OmniTekIncorporatedServer.messages.push("coded-intelligence.lit");
    OmniTekIncorporatedServer.messages.push("history-of-synthoids.lit");
    AddToAllServers(OmniTekIncorporatedServer);

    var FourSigmaServer = new Server({
        ip:createRandomIp(), hostname:"4sigma", organizationName:"FourSigma",
        requiredHackingSkill:getRandomInt(950, 1200), moneyAvailable:getRandomInt(15e9, 25e9),
        hackDifficulty:getRandomInt(60, 70), serverGrowth:getRandomInt(75, 99), numOpenPortsRequired:5
    });
    AddToAllServers(FourSigmaServer);

    var KuaiGongInternationalServer = new Server({
        ip:createRandomIp(), hostname:"kuai-gong", organizationName:"KuaiGong International",
        requiredHackingSkill:getRandomInt(1000, 1250), moneyAvailable:getRandomInt(20e9, 30e9),
        hackDifficulty:getRandomInt(95, 99), serverGrowth:getRandomInt(90, 99), numOpenPortsRequired:5,
    });
    AddToAllServers(KuaiGongInternationalServer);

    //Technology and communications companies (large targets)
    var FulcrumTechnologiesServer = new Server({
        ip:createRandomIp(), hostname:"fulcrumtech", organizationName:"Fulcrum Technologies", maxRam:512,
        requiredHackingSkill:getRandomInt(1000, 1200), moneyAvailable:getRandomInt(1.4e9, 1.8e9),
        hackDifficulty:getRandomInt(85, 95), serverGrowth:getRandomInt(80, 99), numOpenPortsRequired:5
    });
    FulcrumTechnologiesServer.messages.push("simulated-reality.lit");
    AddToAllServers(FulcrumTechnologiesServer);

    var FulcrumSecretTechnologiesServer = new Server({
        ip:createRandomIp(), hostname:"fulcrumassets", organizationName:"Fulcrum Technologies Assets",
        requiredHackingSkill:getRandomInt(1200, 1500), moneyAvailable:1e6,
        hackDifficulty:99, serverGrowth:1, numOpenPortsRequired:5
    });
    AddToAllServers(FulcrumSecretTechnologiesServer);
    SpecialServerIps.addIp(SpecialServerNames.FulcrumSecretTechnologies, FulcrumSecretTechnologiesServer.ip);

    var StormTechnologiesServer = new Server({
        ip:createRandomIp(), hostname:"stormtech", organizationName:"Storm Technologies",
        requiredHackingSkill:getRandomInt(900, 1050), moneyAvailable:getRandomInt(1e9, 1.2e9),
        hackDifficulty:getRandomInt(80, 90), serverGrowth:getRandomInt(70, 90), numOpenPortsRequired:5
    });
    AddToAllServers(StormTechnologiesServer);

    var DefCommServer = new Server({
        ip:createRandomIp(), hostname:"defcomm", organizationName:"DefComm",
        requiredHackingSkill:getRandomInt(900, 1000), moneyAvailable:getRandomInt(800e6, 950e6),
        hackDifficulty:getRandomInt(85, 95), serverGrowth:getRandomInt(50, 70), numOpenPortsRequired:5
    });
    AddToAllServers(DefCommServer);

    var InfoCommServer = new Server({
        ip:createRandomIp(), hostname:"infocomm", organizationName:"InfoComm",
        requiredHackingSkill:getRandomInt(875, 950), moneyAvailable:getRandomInt(600e6, 900e6),
        hackDifficulty:getRandomInt(70, 90), serverGrowth:getRandomInt(35, 75), numOpenPortsRequired:5
    });
    AddToAllServers(InfoCommServer);

    var HeliosLabsServer = new Server({
        ip:createRandomIp(), hostname:"helios", organizationName:"Helios Labs", maxRam:128,
        requiredHackingSkill:getRandomInt(800, 900), moneyAvailable:getRandomInt(550e6, 750e6),
        hackDifficulty:getRandomInt(85, 95), serverGrowth:getRandomInt(70, 80), numOpenPortsRequired:5
    });
    HeliosLabsServer.messages.push("beyond-man.lit");
    AddToAllServers(HeliosLabsServer);

    var VitaLifeServer = new Server({
        ip:createRandomIp(), hostname:"vitalife", organizationName:"VitaLife", maxRam:64,
        requiredHackingSkill:getRandomInt(775, 900), moneyAvailable:getRandomInt(700e6, 800e6),
        hackDifficulty:getRandomInt(80, 90), serverGrowth:getRandomInt(60, 80), numOpenPortsRequired:5
    });
    VitaLifeServer.messages.push("A-Green-Tomorrow.lit");
    AddToAllServers(VitaLifeServer);

    var IcarusMicrosystemsServer = new Server({
        ip:createRandomIp(), hostname:"icarus", organizationName:"Icarus Microsystems",
        requiredHackingSkill:getRandomInt(850, 925), moneyAvailable:getRandomInt(900e6, 1000e6),
        hackDifficulty:getRandomInt(85, 95), serverGrowth:getRandomInt(85, 95), numOpenPortsRequired:5
    });
    AddToAllServers(IcarusMicrosystemsServer);

    var UniversalEnergyServer = new Server({
        ip:createRandomIp(), hostname:"univ-energy", organizationName:"Universal Energy", maxRam:64,
        requiredHackingSkill:getRandomInt(800, 900), moneyAvailable:getRandomInt(1.1e9, 1.2e9),
        hackDifficulty:getRandomInt(80, 90), serverGrowth:getRandomInt(80, 90), numOpenPortsRequired:4
    });
    AddToAllServers(UniversalEnergyServer);

    var TitanLabsServer = new Server({
        ip:createRandomIp(), hostname:"titan-labs", organizationName:"Titan Laboratories", maxRam:64,
        requiredHackingSkill:getRandomInt(800, 875), moneyAvailable:getRandomInt(750e6, 900e6),
        hackDifficulty:getRandomInt(70, 80), serverGrowth:getRandomInt(60, 80), numOpenPortsRequired:5
    });
    TitanLabsServer.messages.push("coded-intelligence.lit");
    AddToAllServers(TitanLabsServer);

    var MicrodyneTechnologiesServer = new Server({
        ip:createRandomIp(), hostname:"microdyne", organizationName:"Microdyne Technologies", maxRam:32,
        requiredHackingSkill:getRandomInt(800, 875), moneyAvailable:getRandomInt(500e6, 700e6),
        hackDifficulty:getRandomInt(65, 75), serverGrowth:getRandomInt(70, 90), numOpenPortsRequired:5
    });
    MicrodyneTechnologiesServer.messages.push("synthetic-muscles.lit");
    AddToAllServers(MicrodyneTechnologiesServer);

    var TaiYangDigitalServer = new Server({
        ip:createRandomIp(), hostname:"taiyang-digital", organizationName:"Taiyang Digital",
        requiredHackingSkill:getRandomInt(850, 950), moneyAvailable:getRandomInt(800e6, 900e6),
        hackDifficulty:getRandomInt(70, 80), serverGrowth:getRandomInt(70, 80), numOpenPortsRequired:5
    });
    TaiYangDigitalServer.messages.push("A-Green-Tomorrow.lit");
    TaiYangDigitalServer.messages.push("brighter-than-the-sun.lit");
    AddToAllServers(TaiYangDigitalServer);

    var GalacticCyberSystemsServer = new Server({
        ip:createRandomIp(), hostname:"galactic-cyber", organizationName:"Galactic Cybersystems",
        requiredHackingSkill:getRandomInt(825, 875), moneyAvailable:getRandomInt(750e6, 850e6),
        hackDifficulty:getRandomInt(55, 65), serverGrowth:getRandomInt(70, 90), numOpenPortsRequired:5
    });
    AddToAllServers(GalacticCyberSystemsServer);

    //Defense Companies ("Large" Companies)
    var AeroCorpServer = new Server({
        ip:createRandomIp(), hostname:"aerocorp", organizationName:"AeroCorp",
        requiredHackingSkill:getRandomInt(850, 925), moneyAvailable:getRandomInt(1e9, 1.2e9),
        hackDifficulty:getRandomInt(80, 90), serverGrowth:getRandomInt(55, 65), numOpenPortsRequired:5
    });
    AeroCorpServer.messages.push("man-and-machine.lit");
    AddToAllServers(AeroCorpServer);

    var OmniaCybersystemsServer = new Server({
        ip:createRandomIp(), hostname:"omnia", organizationName:"Omnia Cybersystems", maxRam:64,
        requiredHackingSkill:getRandomInt(850, 950), moneyAvailable:getRandomInt(900e6, 1e9),
        hackDifficulty:getRandomInt(85, 95), serverGrowth:getRandomInt(60, 70), numOpenPortsRequired:5
    });
    OmniaCybersystemsServer.messages.push("history-of-synthoids.lit");
    AddToAllServers(OmniaCybersystemsServer);

    var ZBDefenseServer = new Server({
        ip:createRandomIp(), hostname:"zb-def", organizationName:"ZB Defense Industries",
        requiredHackingSkill:getRandomInt(775, 825), moneyAvailable:getRandomInt(900e6, 1.1e9),
        hackDifficulty:getRandomInt(55, 65), serverGrowth:getRandomInt(65, 75), numOpenPortsRequired:4
    });
    ZBDefenseServer.messages.push("synthetic-muscles.lit");
    AddToAllServers(ZBDefenseServer);

    var AppliedEnergeticsServer = new Server({
        ip:createRandomIp(), hostname:"applied-energetics", organizationName:"Applied Energetics",
        requiredHackingSkill:getRandomInt(775, 850), moneyAvailable:getRandomInt(700e6, 1e9),
        hackDifficulty:getRandomInt(60, 80), serverGrowth:getRandomInt(70, 75), numOpenPortsRequired:4
    });
    AddToAllServers(AppliedEnergeticsServer);

    var SolarisSpaceSystemsServer = new Server({
        ip:createRandomIp(), hostname:"solaris", organizationName:"Solaris Space Systems", maxRam:64,
        requiredHackingSkill:getRandomInt(750, 850), moneyAvailable:getRandomInt(700e6, 900e6),
        hackDifficulty:getRandomInt(70, 80), serverGrowth:getRandomInt(70, 80), numOpenPortsRequired:5
    });
    SolarisSpaceSystemsServer.messages.push("A-Green-Tomorrow.lit");
    SolarisSpaceSystemsServer.messages.push("the-failed-frontier.lit");
    AddToAllServers(SolarisSpaceSystemsServer);

    var DeltaOneServer = new Server({
        ip:createRandomIp(), hostname:"deltaone", organizationName:"Delta One",
        requiredHackingSkill:getRandomInt(800, 900), moneyAvailable:getRandomInt(1.3e9, 1.7e9),
        hackDifficulty:getRandomInt(75, 85), serverGrowth:getRandomInt(50, 70), numOpenPortsRequired:5
    });
    AddToAllServers(DeltaOneServer);

    //Health, medicine, pharmaceutical companies ("Large" targets)
    var GlobalPharmaceuticalsServer = new Server({
        ip:createRandomIp(), hostname:"global-pharm", organizationName:"Global Pharmaceuticals", maxRam:32,
        requiredHackingSkill:getRandomInt(750, 850), moneyAvailable:getRandomInt(1.5e9, 1.75e9),
        hackDifficulty:getRandomInt(75, 85), serverGrowth:getRandomInt(80, 90), numOpenPortsRequired:4
    });
    GlobalPharmaceuticalsServer.messages.push("A-Green-Tomorrow.lit");
    AddToAllServers(GlobalPharmaceuticalsServer);

    var NovaMedicalServer = new Server({
        ip:createRandomIp(), hostname:"nova-med", organizationName:"Nova Medical",
        requiredHackingSkill:getRandomInt(775, 850), moneyAvailable:getRandomInt(1.1e9, 1.25e9),
        hackDifficulty:getRandomInt(60, 80), serverGrowth:getRandomInt(65, 85), numOpenPortsRequired:4
    });
    AddToAllServers(NovaMedicalServer);

    var ZeusMedicalServer = new Server({
        ip:createRandomIp(), hostname:"zeus-med", organizationName:"Zeus Medical",
        requiredHackingSkill:getRandomInt(800, 850), moneyAvailable:getRandomInt(1.3e9, 1.5e9),
        hackDifficulty:getRandomInt(70, 90), serverGrowth:getRandomInt(70, 80), numOpenPortsRequired:5
    });
    AddToAllServers(ZeusMedicalServer);

    var UnitaLifeGroupServer = new Server({
        ip:createRandomIp(), hostname:"unitalife", organizationName:"UnitaLife Group", maxRam:32,
        requiredHackingSkill:getRandomInt(775, 825), moneyAvailable:getRandomInt(1e9, 1.1e9),
        hackDifficulty:getRandomInt(70, 80), serverGrowth:getRandomInt(70, 80), numOpenPortsRequired:4
    });
    AddToAllServers(UnitaLifeGroupServer);

    //"Medium level" targets
    var LexoCorpServer = new Server({
        ip:createRandomIp(), hostname:"lexo-corp", organizationName:"Lexo Corporation", maxRam:32,
        requiredHackingSkill:getRandomInt(650, 750), moneyAvailable:getRandomInt(700e6, 800e6),
        hackDifficulty:getRandomInt(60, 80), serverGrowth:getRandomInt(55, 65), numOpenPortsRequired:4
    });
    AddToAllServers(LexoCorpServer);

    var RhoConstructionServer = new Server({
        ip:createRandomIp(), hostname:"rho-construction", organizationName:"Rho Construction",
        requiredHackingSkill:getRandomInt(475, 525), moneyAvailable:getRandomInt(500e6, 700e6),
        hackDifficulty:getRandomInt(40, 60), serverGrowth:getRandomInt(40, 60), numOpenPortsRequired:3
    });
    AddToAllServers(RhoConstructionServer);

    var AlphaEnterprisesServer = new Server({
        ip:createRandomIp(), hostname:"alpha-ent", organizationName:"Alpha Enterprises", maxRam:32,
        requiredHackingSkill:getRandomInt(500, 600), moneyAvailable:getRandomInt(600e6, 750e6),
        hackDifficulty:getRandomInt(50, 70), serverGrowth:getRandomInt(50, 60),numOpenPortsRequired:4
    });
    AlphaEnterprisesServer.messages.push("sector-12-crime.lit");
    AddToAllServers(AlphaEnterprisesServer);

    var AevumPoliceServer = new Server({
        ip:createRandomIp(), hostname:"aevum-police", organizationName:"Aevum Police Network", maxRam:32,
        requiredHackingSkill:getRandomInt(400, 450), moneyAvailable:getRandomInt(200e6, 400e6),
        hackDifficulty:getRandomInt(70, 80), serverGrowth:getRandomInt(30, 50), numOpenPortsRequired:4
    });
    AddToAllServers(AevumPoliceServer);

    var RothmanUniversityServer = new Server({
        ip:createRandomIp(), hostname:"rothman-uni", organizationName:"Rothman University Network", maxRam:64,
        requiredHackingSkill:getRandomInt(370, 430), moneyAvailable:getRandomInt(175e6, 250e6),
        hackDifficulty:getRandomInt(45, 55), serverGrowth:getRandomInt(35, 45), numOpenPortsRequired:3
    });
    RothmanUniversityServer.messages.push("secret-societies.lit");
    RothmanUniversityServer.messages.push("the-failed-frontier.lit");
    RothmanUniversityServer.messages.push("tensions-in-tech-race.lit");
    AddToAllServers(RothmanUniversityServer);

    var ZBInstituteOfTechnologyServer = new Server({
        ip:createRandomIp(), hostname:"zb-institute", organizationName:"ZB Institute of Technology Network", maxRam:64,
        requiredHackingSkill:getRandomInt(725, 775), moneyAvailable:getRandomInt(800e6, 1.1e9),
        hackDifficulty:getRandomInt(65, 85), serverGrowth:getRandomInt(75, 85), numOpenPortsRequired:5
    });
    AddToAllServers(ZBInstituteOfTechnologyServer);

    var SummitUniversityServer = new Server({
        ip:createRandomIp(), hostname:"summit-uni", organizationName:"Summit University Network", maxRam:32,
        requiredHackingSkill:getRandomInt(425, 475), moneyAvailable:getRandomInt(200e6, 350e6),
        hackDifficulty:getRandomInt(45, 65), serverGrowth:getRandomInt(40, 60), numOpenPortsRequired:3
    });
    SummitUniversityServer.messages.push("secret-societies.lit");
    SummitUniversityServer.messages.push("the-failed-frontier.lit");
    SummitUniversityServer.messages.push("synthetic-muscles.lit");
    AddToAllServers(SummitUniversityServer);

    var SysCoreSecuritiesServer = new Server({
        ip:createRandomIp(), hostname:"syscore", organizationName:"SysCore Securities",
        requiredHackingSkill:getRandomInt(550, 650), moneyAvailable:getRandomInt(400e6, 600e6),
        hackDifficulty:getRandomInt(60, 80), serverGrowth:getRandomInt(60, 70), numOpenPortsRequired:4
    });
    AddToAllServers(SysCoreSecuritiesServer);

    var CatalystVenturesServer = new Server({
        ip:createRandomIp(), hostname:"catalyst", organizationName:"Catalyst Ventures",
        requiredHackingSkill:getRandomInt(400, 450), moneyAvailable:getRandomInt(300e6, 550e6),
        hackDifficulty:getRandomInt(60, 70), serverGrowth:getRandomInt(25, 55), numOpenPortsRequired:3,
    });
    CatalystVenturesServer.messages.push("tensions-in-tech-race.lit");
    AddToAllServers(CatalystVenturesServer);

    var TheHubServer = new Server({
        ip:createRandomIp(), hostname:"the-hub", organizationName:"The Hub",
        requiredHackingSkill:getRandomInt(275, 325), moneyAvailable:getRandomInt(150e6, 200e6),
        hackDifficulty:getRandomInt(35, 45), serverGrowth:getRandomInt(45, 55), numOpenPortsRequired:2
    });
    AddToAllServers(TheHubServer);

    var CompuTekServer = new Server({
        ip:createRandomIp(), hostname:"comptek", organizationName:"CompuTek",
        requiredHackingSkill:getRandomInt(300, 400), moneyAvailable:getRandomInt(220e6, 250e6),
        hackDifficulty:getRandomInt(55, 65), serverGrowth:getRandomInt(45, 65), numOpenPortsRequired:3
    });
    CompuTekServer.messages.push("man-and-machine.lit");
    AddToAllServers(CompuTekServer);

    var NetLinkTechnologiesServer = new Server({
        ip:createRandomIp(), hostname:"netlink", organizationName:"NetLink Technologies", maxRam:64,
        requiredHackingSkill:getRandomInt(375, 425), moneyAvailable:275e6,
        hackDifficulty:getRandomInt(60, 80), serverGrowth:getRandomInt(45, 75), numOpenPortsRequired:3
    });
    NetLinkTechnologiesServer.messages.push("simulated-reality.lit");
    AddToAllServers(NetLinkTechnologiesServer);

    var JohnsonOrthopedicsServer = new Server({
        ip:createRandomIp(), hostname:"johnson-ortho", organizationName:"Johnson Orthopedics",
        requiredHackingSkill:getRandomInt(250, 300), moneyAvailable:getRandomInt(70e6, 85e6),
        hackDifficulty:getRandomInt(35, 65), serverGrowth:getRandomInt(35, 65), numOpenPortsRequired:2
    });
    AddToAllServers(JohnsonOrthopedicsServer);

    //"Low level" targets
    var FoodNStuffServer = new Server({
        ip:createRandomIp(), hostname:"foodnstuff", organizationName:"Food N Stuff Supermarket", maxRam:16,
        requiredHackingSkill:1, moneyAvailable:2e6,
        hackDifficulty:10, serverGrowth:5, numOpenPortsRequired:0
    });
    FoodNStuffServer.messages.push("sector-12-crime.lit");
    AddToAllServers(FoodNStuffServer);

    var SigmaCosmeticsServer = new Server({
        ip:createRandomIp(), hostname:"sigma-cosmetics", organizationName:"Sigma Cosmetics", maxRam:16,
        requiredHackingSkill:5, moneyAvailable:2.3e6,
        hackDifficulty:10, serverGrowth:10, numOpenPortsRequired:0
    });
    AddToAllServers(SigmaCosmeticsServer);

    var JoesGunsServer = new Server({
        ip:createRandomIp(), hostname:"joesguns", organizationName:"Joe's Guns", maxRam:16,
        requiredHackingSkill:10, moneyAvailable:2.5e6,
        hackDifficulty:15, serverGrowth:20, numOpenPortsRequired:0
    });
    AddToAllServers(JoesGunsServer);

    var Zer0NightclubServer = new Server({
        ip:createRandomIp(), hostname:"zer0", organizationName:"ZER0 Nightclub", maxRam:32,
        requiredHackingSkill:75, moneyAvailable:7.5e6,
        hackDifficulty:25, serverGrowth:40, numOpenPortsRequired:1
    });
    AddToAllServers(Zer0NightclubServer);

    var NectarNightclubServer = new Server({
        ip:createRandomIp(), hostname:"nectar-net", organizationName:"Nectar Nightclub Network", maxRam:16,
        requiredHackingSkill:20, moneyAvailable:2.75e6,
        hackDifficulty:20, serverGrowth:25, numOpenPortsRequired:0
    });
    AddToAllServers(NectarNightclubServer);

    var NeoNightclubServer = new Server({
        ip:createRandomIp(), hostname:"neo-net", organizationName:"Neo Nightclub Network", maxRam:32,
        requiredHackingSkill:50, moneyAvailable:5e6,
        hackDifficulty:25, serverGrowth:25, numOpenPortsRequired:1
    });
    NeoNightclubServer.messages.push("the-hidden-world.lit");
    AddToAllServers(NeoNightclubServer);

    var SilverHelixServer = new Server({
        ip:createRandomIp(), hostname:"silver-helix", organizationName:"Silver Helix", maxRam:64,
        requiredHackingSkill:150, moneyAvailable:45e6,
        hackDifficulty:30, serverGrowth:30, numOpenPortsRequired:2
    });
    SilverHelixServer.messages.push("new-triads.lit");
    AddToAllServers(SilverHelixServer);

    var HongFangTeaHouseServer = new Server({
        ip:createRandomIp(), hostname:"hong-fang-tea", organizationName:"HongFang Teahouse", maxRam:16,
        requiredHackingSkill:30, moneyAvailable:3e6,
        hackDifficulty:15, serverGrowth:20, numOpenPortsRequired:0
    });
    HongFangTeaHouseServer.messages.push("brighter-than-the-sun.lit");
    AddToAllServers(HongFangTeaHouseServer);

    var HaraKiriSushiBarServer = new Server({
        ip:createRandomIp(), hostname:"harakiri-sushi", organizationName:"HaraKiri Sushi Bar Network",maxRam:16,
        requiredHackingSkill:40, moneyAvailable:4e6,
        hackDifficulty:15, serverGrowth:40, numOpenPortsRequired:0
    });
    AddToAllServers(HaraKiriSushiBarServer);

    var PhantasyServer = new Server({
        ip:createRandomIp(), hostname:"phantasy", organizationName:"Phantasy Club", maxRam:32,
        requiredHackingSkill:100, moneyAvailable:24e6,
        hackDifficulty:20, serverGrowth:35, numOpenPortsRequired:2
    });
    AddToAllServers(PhantasyServer);

    var MaxHardwareServer = new Server({
        ip:createRandomIp(), hostname:"max-hardware", organizationName:"Max Hardware Store", maxRam:32,
        requiredHackingSkill:80, moneyAvailable:10e6,
        hackDifficulty:15, serverGrowth:30, numOpenPortsRequired:1,
    });
    AddToAllServers(MaxHardwareServer);

    var OmegaSoftwareServer = new Server({
        ip:createRandomIp(), hostname:"omega-net", organizationName:"Omega Software", maxRam:32,
        requiredHackingSkill:getRandomInt(180, 220), moneyAvailable:getRandomInt(60e6, 70e6),
        hackDifficulty:getRandomInt(25, 35), serverGrowth:getRandomInt(30, 40), numOpenPortsRequired:2
    });
    OmegaSoftwareServer.messages.push("the-new-god.lit");
    AddToAllServers(OmegaSoftwareServer);

    //Gyms
    var CrushFitnessGymServer = new Server({
        ip:createRandomIp(), hostname:"crush-fitness", organizationName:"Crush Fitness",
        requiredHackingSkill:getRandomInt(225, 275), moneyAvailable:getRandomInt(40e6, 60e6),
        hackDifficulty:getRandomInt(35, 45), serverGrowth:getRandomInt(27, 33), numOpenPortsRequired:2
    });
    AddToAllServers(CrushFitnessGymServer);

    var IronGymServer = new Server({
        ip:createRandomIp(), hostname:"iron-gym", organizationName:"Iron Gym Network", maxRam:32,
        requiredHackingSkill:100, moneyAvailable:20e6,
        hackDifficulty:30, serverGrowth:20, numOpenPortsRequired:1
    });
    AddToAllServers(IronGymServer);

    var MilleniumFitnessGymServer = new Server({
        ip:createRandomIp(), hostname:"millenium-fitness", organizationName:"Millenium Fitness Network",
        requiredHackingSkill:getRandomInt(475, 525), moneyAvailable:250e6,
        hackDifficulty:getRandomInt(45, 55), serverGrowth:getRandomInt(25, 45), numOpenPortsRequired:3,
    });
    AddToAllServers(MilleniumFitnessGymServer);

    var PowerhouseGymServer = new Server({
        ip:createRandomIp(), hostname:"powerhouse-fitness", organizationName:"Powerhouse Fitness",
        requiredHackingSkill:getRandomInt(950, 1100), moneyAvailable:900e6,
        hackDifficulty:getRandomInt(55, 65), serverGrowth:getRandomInt(50, 60), numOpenPortsRequired:5,
    });
    AddToAllServers(PowerhouseGymServer);

    var SnapFitnessGymServer = new Server({
        ip:createRandomIp(), hostname:"snap-fitness", organizationName:"Snap Fitness",
        requiredHackingSkill:getRandomInt(675, 800), moneyAvailable:450e6,
        hackDifficulty:getRandomInt(40, 60), serverGrowth:getRandomInt(40, 60), numOpenPortsRequired:4
    });
    AddToAllServers(SnapFitnessGymServer);

    //Faction servers, cannot hack money from these
    var BitRunnersServer = new Server({
        ip:createRandomIp(), hostname:"run4theh111z", organizationName:"The Runners", maxRam:128,
        requiredHackingSkill:getRandomInt(505, 550), moneyAvailable:0,
        hackDifficulty:0, serverGrowth:0, numOpenPortsRequired:4
    });
    BitRunnersServer.messages.push("simulated-reality.lit");
    BitRunnersServer.messages.push("the-new-god.lit");
    AddToAllServers(BitRunnersServer);
    SpecialServerIps.addIp(SpecialServerNames.BitRunnersServer, BitRunnersServer.ip);

    var TheBlackHandServer = new Server({
        ip:createRandomIp(), hostname:"I.I.I.I", organizationName:"I.I.I.I", maxRam:64,
        requiredHackingSkill:getRandomInt(340, 365), moneyAvailable:0,
        hackDifficulty:0, serverGrowth:0, numOpenPortsRequired:3,
    });
    TheBlackHandServer.messages.push("democracy-is-dead.lit");
    AddToAllServers(TheBlackHandServer);
    SpecialServerIps.addIp(SpecialServerNames.TheBlackHandServer, TheBlackHandServer.ip);

    var NiteSecServer = new Server({
        ip:createRandomIp(), hostname:"avmnite-02h", organizationName:"NiteSec", maxRam:32,
        requiredHackingSkill:getRandomInt(202, 220), moneyAvailable:0,
        hackDifficulty:0, serverGrowth:0, numOpenPortsRequired:2
    });
    NiteSecServer.messages.push("democracy-is-dead.lit");
    AddToAllServers(NiteSecServer);
    SpecialServerIps.addIp(SpecialServerNames.NiteSecServer, NiteSecServer.ip);

    var DarkArmyServer = new Server({
        ip:createRandomIp(), hostname:".", organizationName:".", maxRam:16,
        requiredHackingSkill:getRandomInt(505, 550), moneyAvailable:0,
        hackDifficulty:0, serverGrowth:0, numOpenPortsRequired:4
    });
    AddToAllServers(DarkArmyServer);
    SpecialServerIps.addIp(SpecialServerNames.TheDarkArmyServer, DarkArmyServer.ip);

    var CyberSecServer = new Server({
        ip:createRandomIp(), hostname:"CSEC", organizationName:"CyberSec", maxRam:8,
        requiredHackingSkill:getRandomInt(51, 60), moneyAvailable:0,
        hackDifficulty:0, serverGrowth:0, numOpenPortsRequired:1
    });
    CyberSecServer.messages.push("democracy-is-dead.lit");
    AddToAllServers(CyberSecServer);
    SpecialServerIps.addIp(SpecialServerNames.CyberSecServer, CyberSecServer.ip);

    var DaedalusServer = new Server({
        ip:createRandomIp(), hostname:"The-Cave", organizationName:"Helios",
        requiredHackingSkill:925, moneyAvailable:0,
        hackDifficulty:0, serverGrowth:0, numOpenPortsRequired:5
    });
    DaedalusServer.messages.push("alpha-omega.lit");
    AddToAllServers(DaedalusServer);
    SpecialServerIps.addIp(SpecialServerNames.DaedalusServer, DaedalusServer.ip);

    //Super special Servers
    var WorldDaemon = new Server({
        ip:createRandomIp(), hostname:SpecialServerNames.WorldDaemon, organizationName:SpecialServerNames.WorldDaemon,
        requiredHackingSkill:3000, moneyAvailable:0,
        hackDifficulty:0, serverGrowth:0, numOpenPortsRequired:5
    });
    AddToAllServers(WorldDaemon);
    SpecialServerIps.addIp(SpecialServerNames.WorldDaemon, WorldDaemon.ip);

    /* Create a randomized network for all the foreign servers */
    //Groupings for creating a randomized network
    var NetworkGroup1 =     [IronGymServer, FoodNStuffServer, SigmaCosmeticsServer, JoesGunsServer, HongFangTeaHouseServer, HaraKiriSushiBarServer];
    var NetworkGroup2 =     [MaxHardwareServer, NectarNightclubServer, Zer0NightclubServer, CyberSecServer];
    var NetworkGroup3 =     [OmegaSoftwareServer, PhantasyServer, SilverHelixServer, NeoNightclubServer];
    var NetworkGroup4 =     [CrushFitnessGymServer, NetLinkTechnologiesServer, CompuTekServer, TheHubServer, JohnsonOrthopedicsServer, NiteSecServer];
    var NetworkGroup5 =     [CatalystVenturesServer, SysCoreSecuritiesServer, SummitUniversityServer, ZBInstituteOfTechnologyServer, RothmanUniversityServer, TheBlackHandServer];
    var NetworkGroup6 =     [LexoCorpServer, RhoConstructionServer, AlphaEnterprisesServer, AevumPoliceServer, MilleniumFitnessGymServer];
    var NetworkGroup7 =     [GlobalPharmaceuticalsServer, AeroCorpServer, GalacticCyberSystemsServer, SnapFitnessGymServer];
    var NetworkGroup8 =     [DeltaOneServer, UnitaLifeGroupServer, OmniaCybersystemsServer];
    var NetworkGroup9 =     [ZeusMedicalServer, SolarisSpaceSystemsServer, UniversalEnergyServer, IcarusMicrosystemsServer, DefCommServer];
    var NetworkGroup10 =    [NovaMedicalServer, ZBDefenseServer, TaiYangDigitalServer, InfoCommServer];
    var NetworkGroup11 =    [AppliedEnergeticsServer, MicrodyneTechnologiesServer, TitanLabsServer, BitRunnersServer];
    var NetworkGroup12 =    [VitaLifeServer, HeliosLabsServer, StormTechnologiesServer, FulcrumTechnologiesServer];
    var NetworkGroup13 =    [KuaiGongInternationalServer, FourSigmaServer, OmniTekIncorporatedServer, DarkArmyServer];
    var NetworkGroup14 =    [PowerhouseGymServer, ClarkeIncorporatedServer, NWOServer, BladeIndustriesServer, BachmanAndAssociatesServer];
    var NetworkGroup15 =    [FulcrumSecretTechnologiesServer, MegaCorpServer, ECorpServer, DaedalusServer];

    for (var i = 0; i < NetworkGroup2.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup1[Math.floor(Math.random() * NetworkGroup1.length)];
        NetworkGroup2[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup2[i].ip);
    }

    for (var i = 0; i < NetworkGroup3.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup2[Math.floor(Math.random() * NetworkGroup2.length)];
        NetworkGroup3[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup3[i].ip);
    }

    for (var i = 0; i < NetworkGroup4.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup3[Math.floor(Math.random() * NetworkGroup3.length)];
        NetworkGroup4[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup4[i].ip);
    }

    for (var i = 0; i < NetworkGroup5.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup4[Math.floor(Math.random() * NetworkGroup4.length)];
        NetworkGroup5[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup5[i].ip);
    }

    for (var i = 0; i < NetworkGroup6.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup5[Math.floor(Math.random() * NetworkGroup5.length)];
        NetworkGroup6[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup6[i].ip);
    }

    for (var i = 0; i < NetworkGroup7.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup6[Math.floor(Math.random() * NetworkGroup6.length)];
        NetworkGroup7[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup7[i].ip);
    }

    for (var i = 0; i < NetworkGroup8.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup7[Math.floor(Math.random() * NetworkGroup7.length)];
        NetworkGroup8[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup8[i].ip);
    }

    for (var i = 0; i < NetworkGroup9.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup8[Math.floor(Math.random() * NetworkGroup8.length)];
        NetworkGroup9[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup9[i].ip);
    }

    for (var i = 0; i < NetworkGroup10.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup9[Math.floor(Math.random() * NetworkGroup9.length)];
        NetworkGroup10[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup10[i].ip);
    }

    for (var i = 0; i < NetworkGroup11.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup10[Math.floor(Math.random() * NetworkGroup10.length)];
        NetworkGroup11[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup11[i].ip);
    }

    for (var i = 0; i < NetworkGroup12.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup11[Math.floor(Math.random() * NetworkGroup11.length)];
        NetworkGroup12[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup12[i].ip);
    }

    for (var i = 0; i < NetworkGroup13.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup12[Math.floor(Math.random() * NetworkGroup12.length)];
        NetworkGroup13[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup13[i].ip);
    }

    for (var i = 0; i < NetworkGroup14.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup13[Math.floor(Math.random() * NetworkGroup13.length)];
        NetworkGroup14[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup14[i].ip);
    }

    for (var i = 0; i < NetworkGroup15.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup14[Math.floor(Math.random() * NetworkGroup14.length)];
        NetworkGroup15[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup15[i].ip);
    }

    //Connect the first tier of servers to the player's home computer
    for (var i = 0; i < NetworkGroup1.length; i++) {
        Player.getHomeComputer().serversOnNetwork.push(NetworkGroup1[i].ip);
        NetworkGroup1[i].serversOnNetwork.push(Player.homeComputer);
    }
}

function numCycleForGrowth(server, growth) {
    let ajdGrowthRate = 1 + (CONSTANTS.ServerBaseGrowthRate - 1) / server.hackDifficulty;
    if(ajdGrowthRate > CONSTANTS.ServerMaxGrowthRate) {
        ajdGrowthRate = CONSTANTS.ServerMaxGrowthRate;
    }

    const serverGrowthPercentage = server.serverGrowth / 100;

    const cycles = Math.log(growth)/(Math.log(ajdGrowthRate)*Player.hacking_grow_mult*serverGrowthPercentage);
    return cycles;
}

//Applied server growth for a single server. Returns the percentage growth
function processSingleServerGrowth(server, numCycles) {
    //Server growth processed once every 450 game cycles
    const numServerGrowthCycles = Math.max(Math.floor(numCycles / 450), 0);

    //Get adjusted growth rate, which accounts for server security
    const growthRate = CONSTANTS.ServerBaseGrowthRate;
    var adjGrowthRate = 1 + (growthRate - 1) / server.hackDifficulty;
    if (adjGrowthRate > CONSTANTS.ServerMaxGrowthRate) {adjGrowthRate = CONSTANTS.ServerMaxGrowthRate;}

    //Calculate adjusted server growth rate based on parameters
    const serverGrowthPercentage = server.serverGrowth / 100;
    const numServerGrowthCyclesAdjusted = numServerGrowthCycles * serverGrowthPercentage * BitNodeMultipliers.ServerGrowthRate;

    //Apply serverGrowth for the calculated number of growth cycles
    var serverGrowth = Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted * Player.hacking_grow_mult);
    if (serverGrowth < 1) {
        console.log("WARN: serverGrowth calculated to be less than 1");
        serverGrowth = 1;
    }

    const oldMoneyAvailable = server.moneyAvailable;
    server.moneyAvailable *= serverGrowth;

    // in case of data corruption
    if (server.moneyMax && isNaN(server.moneyAvailable)) {
        server.moneyAvailable = server.moneyMax;
    }

    // cap at max
    if (server.moneyMax && server.moneyAvailable > server.moneyMax) {
        server.moneyAvailable = server.moneyMax;
    }
    
    // if there was any growth at all, increase security
    if(oldMoneyAvailable !== server.moneyAvailable) {
        //Growing increases server security twice as much as hacking
        let usedCycles = numCycleForGrowth(server, server.moneyAvailable / oldMoneyAvailable);
        usedCycles = Math.max(0, usedCycles);
        server.fortify(2 * CONSTANTS.ServerFortifyAmount * Math.ceil(usedCycles));
    }
    return server.moneyAvailable / oldMoneyAvailable;
}

function prestigeHomeComputer(homeComp) {
    homeComp.programs.length = 0; //Remove programs
    homeComp.runningScripts = [];
    homeComp.serversOnNetwork = [];
    homeComp.isConnectedTo = true;
    homeComp.ramUsed = 0;
    homeComp.programs.push(Programs.NukeProgram.name);

    //Update RAM usage on all scripts
    homeComp.scripts.forEach(function(script) {
        script.updateRamUsage();
    });

    homeComp.messages.length = 0; //Remove .lit and .msg files
    homeComp.messages.push("hackers-starting-handbook.lit");
}

//List of all servers that exist in the game, indexed by their ip
let AllServers = {};

function prestigeAllServers() {
    for (var member in AllServers) {
        delete AllServers[member];
    }
    AllServers = {};
}

function loadAllServers(saveString) {
    AllServers = JSON.parse(saveString, Reviver);
}

function SizeOfAllServers() {
    var size = 0, key;
    for (key in AllServers) {
        if (AllServers.hasOwnProperty(key)) size++;
    }
    return size;
}

//Add a server onto the map of all servers in the game
function AddToAllServers(server) {
    var serverIp = server.ip;
    if (ipExists(serverIp)) {
        console.log("IP of server that's being added: " + serverIp);
        console.log("Hostname of the server thats being added: " + server.hostname);
        console.log("The server that already has this IP is: " + AllServers[serverIp].hostname);
        throw new Error("Error: Trying to add a server with an existing IP");
        return;
    }
    AllServers[serverIp] = server;
}

//Returns server object with corresponding hostname
//    Relatively slow, would rather not use this a lot
function GetServerByHostname(hostname) {
    for (var ip in AllServers) {
        if (AllServers.hasOwnProperty(ip)) {
            if (AllServers[ip].hostname == hostname) {
                return AllServers[ip];
            }
        }
    }
    return null;
}

//Get server by IP or hostname. Returns null if invalid
function getServer(s) {
    if (!isValidIPAddress(s)) {
        return GetServerByHostname(s);
    }
    if(AllServers[s] !== undefined) {
        return AllServers[s];
    }
    return null;
}

//Debugging tool
function PrintAllServers() {
    for (var ip in AllServers) {
        if (AllServers.hasOwnProperty(ip)) {
            console.log("Ip: " + ip + ", hostname: " + AllServers[ip].hostname);
        }
    }
}

// Directory object (folders)
function Directory(server, parent, name) {
    this.s = server; //Ref to server
    this.p = parent; //Ref to parent directory
    this.c = [];     //Subdirs
    this.n = name;
    this.d = parent.d + 1; //We'll only have a maximum depth of 3 or something
    this.scrs   = []; //Holds references to the scripts in server.scripts
    this.pgms   = [];
    this.msgs   = [];
}

Directory.prototype.createSubdir = function(name) {
    var subdir = new Directory(this.s, this, name);

}

Directory.prototype.getPath = function(name) {
    var res = [];
    var i = this;
    while (i !== null) {
        res.unshift(i.n, "/");
        i = i.parent;
    }
    res.unshift("/");
    return res.join("");
}

export {Server, AllServers, getServer, GetServerByHostname, loadAllServers,
        AddToAllServers, processSingleServerGrowth, initForeignServers,
        prestigeAllServers, prestigeHomeComputer};
