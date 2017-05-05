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
        
    //PortHack.exe (in case you delete it lol)
    if (Player.getHomeComputer().programs.indexOf(Programs.NukeProgram) == -1) {    
        portHackALink.style.display = "block";
    }
    
    //BruteSSH
    if (Player.getHomeComputer().programs.indexOf(Programs.BruteSSHProgram) == -1 &&
        Player.hacking_skill >= 50) {
        bruteSshALink.style.display = "block";   
    }
    
    //FTPCrack
    if (Player.getHomeComputer().programs.indexOf(Programs.FTPCrackProgram) == -1 &&
        Player.hacking_skill >= 100) {
        ftpCrackALink.style.display = "block";
    }
    
    //relaySMTP
    if (Player.getHomeComputer().programs.indexOf(Programs.RelaySMTPProgram) == -1 &&
        Player.hacking_skill >= 250) {
        relaySmtpALink.style.display = "block";
        
    }
    
    //HTTPWorm
    if (Player.getHomeComputer().programs.indexOf(Programs.HTTPWormProgram) == -1 &&
        Player.hacking_skill >= 500) {
        httpWormALink.style.display = "block";

    }
    
    //SQLInject
    if (Player.getHomeComputer().programs.indexOf(Programs.SQLInjectProgram) == -1 &&
        Player.hacking_skill >= 750) {
        sqlInjectALink.style.display = "block";
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
    return count;
}