/* Create programs */
Programs = {
    NukeProgram: "NUKE.exe",
    BruteSSHProgram: "BruteSSH.exe",
    FTPCrackProgram: "FTPCrack.exe",
    RelaySMTPProgram: "relaySMTP.exe",
    HTTPWormProgram: "HTTPWorm.exe",
    SQLInjectProgram: "SQLInject.exe",
}

function displayCreateProgramContent() {
    var portHackALink   = document.getElementById("create-program-porthack");
    var bruteSshALink   = document.getElementById("create-program-brutessh");
    var ftpCrackALink   = document.getElementById("create-program-ftpcrack");
    var relaySmtpALink  = document.getElementById("create-program-relaysmtp");
    var httpWormALink   = document.getElementById("create-program-httpworm");
    var sqlInjectALink  = document.getElementById("create-program-sqlinject");
    
    portHackALink.style.display = "none";
    bruteSshALink.style.display = "none"; 
    ftpCrackALink.style.display = "none";
    relaySmtpALink.style.display = "none";
    httpWormALink.style.display = "none";
    sqlInjectALink.style.display = "none";
    
    //TODO These addEventListeners should only happen once so I guess just put them in Engine.init()
    
    //PortHack.exe (in case you delete it lol)
    if (Player.getHomeComputer().programs.indexOf(Programs.NukeProgram) == -1) {    
        portHackALink.style.display = "block";
        portHackALink.addEventListener("click", function() {
            createProgram(Programs.PortHackProgram);
        });
    }
    
    //BruteSSH
    if (Player.getHomeComputer().programs.indexOf(Programs.BruteSSHProgram) == -1 &&
        Player.hacking_skill >= 50) {
        bruteSshALink.style.display = "block";
        bruteSshALink.addEventListener("click", function() {
            createProgram(Programs.BruteSSHProgram);
        });
    }
    
    //FTPCrack
    if (Player.getHomeComputer().programs.indexOf(Programs.FTPCrackProgram) == -1 &&
        Player.hacking_skill >= 125) {
        ftpCrackALink.style.display = "block";
        ftpCrackALink.addEventListener("click", function() {
            createProgram(Programs.FTPCrackProgram);
        });
    }
    
    //relaySMTP
    if (Player.getHomeComputer().programs.indexOf(Programs.RelaySMTPProgram) == -1 &&
        Player.hacking_skill >= 300) {
        relaySmtpALink.style.display = "block";
        relaySmtpAlink.addEventListener("click", function() {
            createProgram(Programs.RelaySMTPProgram);
        });
    }
    
    //HTTPWorm
    if (Player.getHomeComputer().programs.indexOf(Programs.HTTPWormProgram) == -1 &&
        Player.hacking_skill >= 500) {
        httpWormALink.style.display = "block";
        httpWormALink.addEventListener("click", function() {
            createProgram(Programs.HTTPWormProgram);
        });
    }
    
    //SQLInject
    if (Player.getHomeComputer().programs.indexOf(Programs.SQLInjectProgram) == -1 &&
        Player.hacking_skill >= 750) {
        sqlInjectALink.style.display = "block";
        sqlInjectALink.addEventListener("click", function() {
            createProgram(Programs.SQLInjectProgram);
        });
    }
}

function createProgram(programName) {
    Player.startCreateProgramWork(programName);
}