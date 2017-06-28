function NetscriptFunctions(workerScript) {
    return {
        hacknetnodes : Player.hacknetNodes,
        scan : function(ip=workerScript.serverIp){
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeRejectMsg(workerScript, 'Invalid IP or hostname passed into scan() command');
            }
            var out = [];
            for (var i = 0; i < server.serversOnNetwork.length; i++) {
                var entry = server.getServerOnNetwork(i).hostname;
                if (entry == null) {
                    continue;
                }
                out.push(entry);
            }
            workerScript.scriptRef.log('scan() returned ' + server.serversOnNetwork.length + ' connections for ' + server.hostname);
            return out;
        },
        hack : function(ip){
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Hack() call has incorrect number of arguments. Takes 1 argument");
            }
            var threads = workerScript.scriptRef.threads;
            if (isNaN(threads) || threads < 1) {threads = 1;}
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("hack() error. Invalid IP or hostname passed in: " + ip + ". Stopping...");
            }
            
            //Calculate the hacking time 
            var hackingTime = scriptCalculateHackingTime(server); //This is in seconds
            
            //No root access or skill level too low
            if (server.hasAdminRights == false) {
                throw workerScript.scriptRef.log("Cannot hack this server (" + server.hostname + ") because user does not have root access");
            }
            
            if (server.requiredHackingSkill > Player.hacking_skill) {
                throw workerScript.scriptRef.log("Cannot hack this server (" + server.hostname + ") because user's hacking skill is not high enough");
            }
            
            workerScript.scriptRef.log("Attempting to hack " + ip + " in " + hackingTime.toFixed(3) + " seconds (t=" + threads + ")");
            //console.log("Hacking " + server.hostname + " after " + hackingTime.toString() + " seconds (t=" + threads + ")");
            return netscriptDelay(hackingTime* 1000).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                var hackChance = scriptCalculateHackingChance(server);
                var rand = Math.random();
                var expGainedOnSuccess = scriptCalculateExpGain(server) * threads;
                var expGainedOnFailure = (expGainedOnSuccess / 4);
                if (rand < hackChance) {	//Success!
                    var moneyGained = scriptCalculatePercentMoneyHacked(server);
                    moneyGained = Math.floor(server.moneyAvailable * moneyGained) * threads;
                    
                    //Over-the-top safety checks
                    if (moneyGained <= 0) {
                        moneyGained = 0;
                        expGainedOnSuccess = expGainedOnFailure;
                    }
                    if (moneyGained > server.moneyAvailable) {moneyGained = server.moneyAvailable;}
                    server.moneyAvailable -= moneyGained;
                    if (server.moneyAvailable < 0) {server.moneyAvailable = 0;}
                    
                    Player.gainMoney(moneyGained);
                    workerScript.scriptRef.onlineMoneyMade += moneyGained;
                    workerScript.scriptRef.recordHack(server.ip, moneyGained, threads);
                    Player.gainHackingExp(expGainedOnSuccess);
                    workerScript.scriptRef.onlineExpGained += expGainedOnSuccess;
                    //console.log("Script successfully hacked " + server.hostname + " for $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) +  " exp");
                    workerScript.scriptRef.log("Script SUCCESSFULLY hacked " + server.hostname + " for $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) +  " exp (t=" + threads + ")");
                    server.fortify(CONSTANTS.ServerFortifyAmount * threads);
                    return Promise.resolve(true);
                } else {	
                    //Player only gains 25% exp for failure? TODO Can change this later to balance
                    Player.gainHackingExp(expGainedOnFailure);
                    workerScript.scriptRef.onlineExpGained += expGainedOnFailure;
                    //console.log("Script unsuccessful to hack " + server.hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " exp");
                    workerScript.scriptRef.log("Script FAILED to hack " + server.hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " exp (t=" + threads + ")");
                    return Promise.resolve(false);
                }
            });
        },
        sleep : function(time){
            if (time === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "sleep() call has incorrect number of arguments. Takes 1 argument");
            }
            workerScript.scriptRef.log("Sleeping for " + sleepTime + " milliseconds");
            return netscriptDelay(sleepTime).then(function() {
                return Promise.resolve(true);
            });
        },
        grow : function(ip){
            var threads = workerScript.scriptRef.threads;
            if (isNaN(threads) || threads < 1) {threads = 1;}
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "grow() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("Cannot grow(). Invalid IP or hostname passed in: " + ip);
            }
                                        
            //No root access or skill level too low
            if (server.hasAdminRights == false) {
                throw workerScript.scriptRef.log("Cannot grow this server (" + server.hostname + ") because user does not have root access");
            }
            
            var growTime = scriptCalculateGrowTime(server);
            //console.log("Executing grow() on server " + server.hostname + " in " + formatNumber(growTime/1000, 3) + " seconds")
            workerScript.scriptRef.log("Executing grow() on server " + server.hostname + " in " + formatNumber(growTime/1000, 3) + " seconds (t=" + threads + ")");
            return netscriptDelay(growTime).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                server.moneyAvailable += (1 * threads); //It can be grown even if it has no money
                var growthPercentage = processSingleServerGrowth(server, 450 * threads);
                workerScript.scriptRef.recordGrow(server.ip, threads);
                var expGain = scriptCalculateExpGain(server) * threads;
                if (growthPercentage == 1) {
                    expGain = 0;
                }
                workerScript.scriptRef.log("Available money on " + server.hostname + " grown by " 
                                           + formatNumber(growthPercentage*100 - 100, 6) + "%. Gained " + 
                                           formatNumber(expGain, 4) + " hacking exp (t=" + threads +")");            
                workerScript.scriptRef.onlineExpGained += expGain;
                Player.gainHackingExp(expGain);   
                return Promise.resolve(growthPercentage);
            }); 
        },
        weaken : function(ip){
            var threads = workerScript.scriptRef.threads;
            if (isNaN(threads) || threads < 1) {threads = 1;}
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "weaken() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("Cannot weaken(). Invalid IP or hostname passed in: " + ip);
            }
                                        
            //No root access or skill level too low
            if (server.hasAdminRights == false) {
                throw workerScript.scriptRef.log("Cannot weaken this server (" + server.hostname + ") because user does not have root access");
            }
            
            var weakenTime = scriptCalculateWeakenTime(server);
            //console.log("Executing weaken() on server " + server.hostname + " in " + formatNumber(weakenTime/1000, 3) + " seconds")
            workerScript.scriptRef.log("Executing weaken() on server " + server.hostname + " in " + 
                                       formatNumber(weakenTime/1000, 3) + " seconds (t=" + threads + ")");
            return netscriptDelay(weakenTime).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                server.weaken(CONSTANTS.ServerWeakenAmount * threads);
                workerScript.scriptRef.recordWeaken(server.ip, threads);
                var expGain = scriptCalculateExpGain(server) * threads;
                workerScript.scriptRef.log("Server security level on " + server.hostname + " weakened to " + server.hackDifficulty + 
                                           ". Gained " + formatNumber(expGain, 4) + " hacking exp (t=" + threads + ")");
                workerScript.scriptRef.onlineExpGained += expGain;
                Player.gainHackingExp(expGain); 
                return Promise.resolve(CONSTANTS.ServerWeakenAmount * threads);
            });                           
        },
        print : function(args){
            if (args === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "print() call has incorrect number of arguments. Takes 1 argument");
            }
            workerScript.scriptRef.log(args.toString());
        },
        nuke : function(ip){
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("Cannot call " + programName + ". Invalid IP or hostname passed in: " + ip);
            }
            if (server.openPortCount < server.numOpenPortsRequired) {
                throw makeRuntimeRejectMsg(workerScript, "Not enough ports opened to use NUKE.exe virus");
            }
            if (server.hasAdminRights) {
                workerScript.scriptRef.log("Already have root access to " + server.hostname);
            } else {
                server.hasAdminRights = true;
                workerScript.scriptRef.log("Executed NUKE.exe virus on " + server.hostname + " to gain root access");
            }
            return true;
        },
        brutessh : function(ip){
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("Cannot call " + programName + ". Invalid IP or hostname passed in: " + ip);
            }
            if (!server.sshPortOpen) {
                workerScript.scriptRef.log("Executed BruteSSH.exe virus on " + server.hostname + " to open SSH port (22)");
                server.sshPortOpen = true; 
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("SSH Port (22) already opened on " + server.hostname);
            }
            return true;
        },
        ftpcrack : function(ip){
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("Cannot call " + programName + ". Invalid IP or hostname passed in: " + ip);
            }
            if (!server.ftpPortOpen) {
                workerScript.scriptRef.log("Executed FTPCrack.exe virus on " + server.hostname + " to open FTP port (21)");
                server.ftpPortOpen = true; 
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("FTP Port (21) already opened on " + server.hostname);
            }
            return true;
        },
        relaysmtp : function(ip){
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("Cannot call " + programName + ". Invalid IP or hostname passed in: " + ip);
            }
            if (!server.smtpPortOpen) {
                workerScript.scriptRef.log("Executed relaySMTP.exe virus on " + server.hostname + " to open SMTP port (25)");
                server.smtpPortOpen = true; 
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("SMTP Port (25) already opened on " + server.hostname);
            }
            return true;
        },
        httpworm : function(ip){
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("Cannot call " + programName + ". Invalid IP or hostname passed in: " + ip);
            }
            if (!server.httpPortOpen) {
                workerScript.scriptRef.log("Executed HTTPWorm.exe virus on " + server.hostname + " to open HTTP port (80)");
                server.httpPortOpen = true; 
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("HTTP Port (80) already opened on " + server.hostname);
            }
            return true;
        },
        sqlinject : function(ip){
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("Cannot call " + programName + ". Invalid IP or hostname passed in: " + ip);
            }
            if (!server.sqlPortOpen) {
                workerScript.scriptRef.log("Executed SQLInject.exe virus on " + server.hostname + " to open SQL port (1433)");
                server.sqlPortOpen = true; 
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("SQL Port (1433) already opened on " + server.hostname);
            }
            return true;
        },
        run : function(scriptname,threads = 1,argsForNewScript=[]){
            if (scriptname === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "run() call has incorrect number of arguments. Usage: run(scriptname, [numThreads], [arg1], [arg2]...)");
            }
            if (isNaN(threads) || threads < 1) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument for thread count passed into run(). Must be numeric and greater than 0");
            }
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }
            
            return runScriptFromScript(scriptServer, scriptname, argsForNewScript, workerScript, threads);
        },
        exec : function(scriptname,ip,threads = 1,argsForNewScript=[]){
            if (scriptname === undefined || ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "exec() call has incorrect number of arguments. Usage: exec(scriptname, server, [numThreads], [arg1], [arg2]...)");
            }
            if (isNaN(threads) || threads < 1) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument for thread count passed into exec(). Must be numeric and greater than 0");
            }
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid hostname/ip passed into exec() command: " + args[1]);
            }
            
            return runScriptFromScript(server, scriptname, argsForNewScript, workerScript, threads);
        },
        kill : function(filename,ip,argsForKillTarget=[]){
            if (filename === undefined || ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "kill() call has incorrect number of arguments. Usage: kill(scriptname, server, [arg1], [arg2]...)"); 
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("kill() failed. Invalid IP or hostname passed in: " + ip);
            }
            var runningScriptObj = findRunningScript(filename, argsForKillTarget, server);
            if (runningScriptObj == null) {
                workerScript.scriptRef.log("kill() failed. No such script "+ filename + " on " + server.hostname + " with args: " + printArray(argsForKillTarget));
                return false;
            }
            var res = killWorkerScript(runningScriptObj, server.ip);
            if (res) {
                workerScript.scriptRef.log("Killing " + filename + " on " + server.hostname + " with args: " + printArray(argsForKillTarget) +  ". May take up to a few minutes for the scripts to die...");
                return true;
            } else {
                workerScript.scriptRef.log("kill() failed. No such script "+ filename + " on " + server.hostname + " with args: " + printArray(argsForKillTarget));
                return false;
            }
        },
        killall : function(ip){
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "killall() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("killall() failed. Invalid IP or hostname passed in: " + ip);
            }
            for (var i = server.runningScripts.length-1; i >= 0; --i) {
                killWorkerScript(server.runningScripts[i], server.ip);
            }
            workerScript.scriptRef.log("killall(): Killing all scripts on " + server.hostname + ". May take a few minutes for the scripts to die");
            return true;
        },
        scp : function(scriptname,ip){
            if (scriptname === undefined || ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "scp() call has incorrect number of arguments. Takes 2 arguments");
            }
            var destServer = getServer(ip);
            if (destServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid hostname/ip passed into scp() command: " + ip);
            }
            
            var currServ = getServer(workerScript.serverIp);
            if (currServ == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server ip for this script. This is a bug please contact game developer");
            }
            
            var sourceScript = null;
            for (var i = 0; i < currServ.scripts.length; ++i) {
                if (scriptname == currServ.scripts[i].filename) {
                    sourceScript = currServ.scripts[i];
                    break;
                }
            }
            if (sourceScript == null) {
                workerScript.scriptRef.log(scriptname + " does not exist. scp() failed");
                return false;
            }
            
            //Overwrite script if it already exists
            for (var i = 0; i < destServer.scripts.length; ++i) {
                if (scriptname == destServer.scripts[i].filename) {
                    workerScript.scriptRef.log("WARNING: " + scriptname + " already exists on " + destServer.hostname + " and it will be overwritten.");
                    workerScript.scriptRef.log(scriptname + " overwritten on " + destServer.hostname);
                    var oldScript = destServer.scripts[i];
                    oldScript.code = sourceScript.code;
                    oldScript.ramUsage = sourceScript.ramUsage;
                    return true;
                }
            }
           
            //Create new script if it does not already exist
            var newScript = new Script();
            newScript.filename = scriptname;
            newScript.code = sourceScript.code;
            newScript.ramUsage = sourceScript.ramUsage;
            newScript.server = destServer.ip;
            destServer.scripts.push(newScript);
            workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
            return true;
        },
        hasRootAccess : function(ip){
            if (ip===undefinied){
                throw makeRuntimeRejectMsg(workerScript, "hasRootAccess() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null){
                throw workerScript.scriptRef.log("hasRootAccess() failed. Invalid IP or hostname passed in: " + ip);
            }
            return server.hasAdimRights;
        },
        getHostname : function(){
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }
            return scriptServer.hostname;
        },
        getHackingLevel : function(){
            Player.updateSkillLevels();
            workerScript.scriptRef.log("getHackingLevel() returned " + Player.hacking_skill);
            return Player.hacking_skill;
        },
        getServerMoneyAvailable : function(ip){
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("Cannot getServerMoneyAvailable(). Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerMoneyAvailable() returned " + formatNumber(server.moneyAvailable, 2) + " for " + server.hostname);
            return server.moneyAvailable;
        },
        getServerSecurityLevel : function(ip){
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("getServerSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerSecurityLevel() returned " + formatNumber(server.hackDifficulty, 3) + " for " + server.hostname);
            return server.hackDifficulty;
        },
        getServerBaseSecurityLevel : function(ip){
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("getServerBaseSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerBaseSecurityLevel() returned " + formatNumber(server.baseDifficulty, 3) + " for " + server.hostname);
            return server.baseDifficulty;
        },
        getServerRequiredHackingLevel : function(ip){
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("getServerRequiredHackingLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerRequiredHackingLevel returned " + formatNumber(server.requiredHackingSkill, 0) + " for " + server.hostname);
            return server.requiredHackingSkill;
        },
        getServerMaxMoney : function(ip){
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("getServerRequiredHackingLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerMaxMoney() returned " + formatNumber(server.moneyMax, 0) + " for " + server.hostname);
            return server.moneyMax;
        },
        fileExists : function(filename,ip=workerScript.serverIp){
            if (filename === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "fileExists() call has incorrect number of arguments. Usage: fileExists(scriptname, [server])"); 
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("fileExists() failed. Invalid IP or hostname passed in: " + ip);
            }
            for (var i = 0; i < server.scripts.length; ++i) {
                if (filename == server.scripts[i].filename) {
                    return true;
                }
            }
            if (Player.hasProgram(filename)) {
                return true; //wrong?
            }
            return false;
        },
        isRunning : function(filename,ip,argsForTargetScript=[]){
            if (filename === undefined || ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "isRunning() call has incorrect number of arguments. Usage: isRunning(scriptname, server, [arg1], [arg2]...)"); 
            }
            var server = getServer(ip);
            if (server == null) {
                throw workerScript.scriptRef.log("isRunning() failed. Invalid IP or hostname passed in: " + ip);
            }
            return findRunningScript(filename, argsForTargetScript, server) != null;
        },
        purchaseHacknetNode : purchaseHacknet
    }
}

