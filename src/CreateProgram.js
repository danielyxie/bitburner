/* Create programs */
Programs = {
    NukeProgram: "NUKE.exe",
    BruteSSHProgram: "BruteSSH.exe",
    FTPCrackProgram: "FTPCrack.exe",
    RelaySMTPProgram: "relaySMTP.exe",
    HTTPWormProgram: "HTTPWorm.exe",
    SQLInjectProgram: "SQLInject.exe",
}

//TODO Right now the times needed to complete work are hard-coded...
//maybe later make this dependent on hacking level or something
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
            Player.startCreateProgramWork(Programs.BruteSSHProgram, CONSTANTS.MillisecondsPerQuarterHour);
        });
    }
    
    //FTPCrack
    if (Player.getHomeComputer().programs.indexOf(Programs.FTPCrackProgram) == -1 &&
        Player.hacking_skill >= 100) {
        ftpCrackALink.style.display = "block";
        ftpCrackALink.addEventListener("click", function() {
            Player.startCreateProgramWork(Programs.FTPCrackProgram, CONSTANTS.MillisecondsHalfHour);
        });
    }
    
    //relaySMTP
    if (Player.getHomeComputer().programs.indexOf(Programs.RelaySMTPProgram) == -1 &&
        Player.hacking_skill >= 250) {
        relaySmtpALink.style.display = "block";
        relaySmtpAlink.addEventListener("click", function() {
            Player.startCreateProgramWork(Programs.RelaySMTPProgram. CONSTANTS.MillisecondsPer2Hours);
        });
    }
    
    //HTTPWorm
    if (Player.getHomeComputer().programs.indexOf(Programs.HTTPWormProgram) == -1 &&
        Player.hacking_skill >= 500) {
        httpWormALink.style.display = "block";
        httpWormALink.addEventListener("click", function() {
            Player.startCreateProgramWork(Programs.HTTPWormProgram, CONSTANTS.MillisecondsPer4Hours);
        });
    }
    
    //SQLInject
    if (Player.getHomeComputer().programs.indexOf(Programs.SQLInjectProgram) == -1 &&
        Player.hacking_skill >= 750) {
        sqlInjectALink.style.display = "block";
        sqlInjectALink.addEventListener("click", function() {
            Player.startCreateProgramWork(Programs.SQLInjectProgram, CONSTANTS.MillisecondsPer8Hours);
        });
    }
}