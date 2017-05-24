/* Create programs */
Programs = {
    NukeProgram:        "NUKE.exe",
    BruteSSHProgram:    "BruteSSH.exe",
    FTPCrackProgram:    "FTPCrack.exe",
    RelaySMTPProgram:   "relaySMTP.exe",
    HTTPWormProgram:    "HTTPWorm.exe",
    SQLInjectProgram:   "SQLInject.exe",
    DeepscanV1:         "DeepscanV1.exe",
    DeepscanV2:         "DeepscanV2.exe",
}

//TODO Right now the times needed to complete work are hard-coded...
//maybe later make this dependent on hacking level or something
function displayCreateProgramContent() {
    var nukeALink       = document.getElementById("create-program-nuke");
    var bruteSshALink   = document.getElementById("create-program-brutessh");
    var ftpCrackALink   = document.getElementById("create-program-ftpcrack");
    var relaySmtpALink  = document.getElementById("create-program-relaysmtp");
    var httpWormALink   = document.getElementById("create-program-httpworm");
    var sqlInjectALink  = document.getElementById("create-program-sqlinject");
    var deepscanv1ALink = document.getElementById("create-program-deepscanv1");
    var deepscanv2ALink = document.getElementById("create-program-deepscanv2");
    
    nukeALink.style.display = "none";
    bruteSshALink.style.display = "none"; 
    ftpCrackALink.style.display = "none";
    relaySmtpALink.style.display = "none";
    httpWormALink.style.display = "none";
    sqlInjectALink.style.display = "none";
    deepscanv1ALink.style.display = "none";
    deepscanv2ALink.style.display = "none";
        
    //NUKE.exe (in case you delete it lol)
    if (Player.getHomeComputer().programs.indexOf(Programs.NukeProgram) == -1) {    
        nukeALink.style.display = "inline-block";
    }
    
    //BruteSSH
    if (Player.getHomeComputer().programs.indexOf(Programs.BruteSSHProgram) == -1 &&
        Player.hacking_skill >= 50) {
        bruteSshALink.style.display = "inline-block";   
    }
    
    //FTPCrack
    if (Player.getHomeComputer().programs.indexOf(Programs.FTPCrackProgram) == -1 &&
        Player.hacking_skill >= 100) {
        ftpCrackALink.style.display = "inline-block";
    }
    
    //relaySMTP
    if (Player.getHomeComputer().programs.indexOf(Programs.RelaySMTPProgram) == -1 &&
        Player.hacking_skill >= 250) {
        relaySmtpALink.style.display = "inline-block";
    }
    
    //HTTPWorm
    if (Player.getHomeComputer().programs.indexOf(Programs.HTTPWormProgram) == -1 &&
        Player.hacking_skill >= 500) {
        httpWormALink.style.display = "inline-block";
    }
    
    //SQLInject
    if (Player.getHomeComputer().programs.indexOf(Programs.SQLInjectProgram) == -1 &&
        Player.hacking_skill >= 750) {
        sqlInjectALink.style.display = "inline-block";
    }
    
    //Deepscan V1 and V2
    if (!Player.hasProgram(Programs.DeepscanV1) && Player.hacking_skill >= 75) {
        deepscanv1ALink.style.display = "inline-block";
    }
    
    if (!Player.hasProgram(Programs.DeepscanV2) && Player.hacking_skill >= 400) {
        deepscanv2ALink.style.display = "inline-block";
    }
}

//Returns the number of programs that are currently available to be created
function getNumAvailableCreateProgram() {
    var count = 0;
    
    //PortHack.exe (in case you delete it lol)
    if (Player.getHomeComputer().programs.indexOf(Programs.NukeProgram) == -1) {    
        ++count;
    }
    
    //BruteSSH
    if (Player.getHomeComputer().programs.indexOf(Programs.BruteSSHProgram) == -1 &&
        Player.hacking_skill >= 50) {
        ++count;
    }
    
    //FTPCrack
    if (Player.getHomeComputer().programs.indexOf(Programs.FTPCrackProgram) == -1 &&
        Player.hacking_skill >= 100) {
        ++count;
    }
    
    //relaySMTP
    if (Player.getHomeComputer().programs.indexOf(Programs.RelaySMTPProgram) == -1 &&
        Player.hacking_skill >= 250) {
        ++count;
    }
    
    //HTTPWorm
    if (Player.getHomeComputer().programs.indexOf(Programs.HTTPWormProgram) == -1 &&
        Player.hacking_skill >= 500) {
        ++count;
    }
    
    //SQLInject
    if (Player.getHomeComputer().programs.indexOf(Programs.SQLInjectProgram) == -1 &&
        Player.hacking_skill >= 750) {
        ++count;
    }
    
    //Deepscan V1 and V2
        if (!Player.hasProgram(Programs.DeepscanV1) && Player.hacking_skill >= 75) {
        ++count;
    }
    
    if (!Player.hasProgram(Programs.DeepscanV2) && Player.hacking_skill >= 400) {
        ++count;
    }
    
    return count;
}