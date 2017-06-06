/* Netscript Functions 
 * Implementation for Netscript features */
function netscriptAssign(exp, workerScript) {
    var env = workerScript.env;
    return new Promise(function(resolve, reject) {
        if (env.stopFlag) {return reject(workerScript);}
        
        if (exp.left.type != "var") {
            return reject(makeRuntimeRejectMsg(workerScript, "Cannot assign to " + JSON.stringify(exp.left)));
        }
        
        var expRightPromise = evaluate(exp.right, workerScript);
        expRightPromise.then(function(expRight) {
            try {
                env.set(exp.left.value, expRight);
            } catch (e) {
                return reject(makeRuntimeRejectMsg(workerScript, "Failed to set environment variable: " + e.toString()));
            }
            resolve(false); //Return false so this doesnt cause conditionals to evaluate
        }, function(e) {
            reject(e);
        });
    });
}

function netscriptBinary(exp, workerScript) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    
    var opPromises = [evaluate(exp.left, workerScript), evaluate(exp.right, workerScript)];
    return Promise.all(opPromises).then(function (ops) {
        try {
            var result = apply_op(exp.operator, ops[0], ops[1]);
            return Promise.resolve(result);
        } catch(e) {
            return Promise.reject(e);
        }
    }).catch(function(e) {
        return Promise.reject(e);
    });
}

function netscriptHack(exp, workerScript) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    
    if (exp.args.length != 1) {
        return Promise.reject(makeRuntimeRejectMsg(workerScript, "Hack() call has incorrect number of arguments. Takes 1 argument"));
    }
    var ipPromise = evaluate(exp.args[0], workerScript);
    return ipPromise.then(function(ip) {
        var server = getServer(ip);
        if (server == null) {
            workerScript.scriptRef.log("hack() error. Invalid IP or hostname passed in: " + ip + ". Stopping...");
            return Promise.reject(makeRuntimeRejectMsg(workerScript, "Invalid IP or hostname passed into hack() command"));
        }
        
        //Calculate the hacking time 
        var hackingTime = scriptCalculateHackingTime(server); //This is in seconds
        
        //No root access or skill level too low
        if (server.hasAdminRights == false) {
            workerScript.scriptRef.log("Cannot hack this server (" + server.hostname + ") because user does not have root access");
            return Promise.reject(makeRuntimeRejectMsg(workerScript, "Script crashed because it did not have root access to " + server.hostname));
        }
        
        if (server.requiredHackingSkill > Player.hacking_skill) {
            workerScript.scriptRef.log("Cannot hack this server (" + server.hostname + ") because user's hacking skill is not high enough");
            return Promise.reject(makeRuntimeRejectMsg(workerScript, "Script crashed because player's hacking skill is not high enough to hack " + server.hostname));
        }
        
        workerScript.scriptRef.log("Attempting to hack " + ip + " in " + hackingTime.toFixed(3) + " seconds");
        return Promise.resolve([server, hackingTime]);
    }).then(function([server, hackingTime]) {
        console.log("Hacking " + server.hostname + " after " + hackingTime.toString() + " seconds.");
        return netscriptDelay(hackingTime* 1000).then(function() {
            if (env.stopFlag) {return Promise.reject(workerScript);}
            var hackChance = scriptCalculateHackingChance(server);
            var rand = Math.random();
            var expGainedOnSuccess = scriptCalculateExpGain(server);
            var expGainedOnFailure = (expGainedOnSuccess / 4);
            if (rand < hackChance) {	//Success!
                var moneyGained = scriptCalculatePercentMoneyHacked(server);
                moneyGained = Math.floor(server.moneyAvailable * moneyGained);
                
                //Safety check
                if (moneyGained <= 0) {moneyGained = 0;}
                
                server.moneyAvailable -= moneyGained;
                Player.gainMoney(moneyGained);
                workerScript.scriptRef.onlineMoneyMade += moneyGained;
                workerScript.scriptRef.recordHack(server.ip, moneyGained);
                
                Player.gainHackingExp(expGainedOnSuccess);
                workerScript.scriptRef.onlineExpGained += expGainedOnSuccess;
                console.log("Script successfully hacked " + server.hostname + " for $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) +  " exp");
                workerScript.scriptRef.log("Script SUCCESSFULLY hacked " + server.hostname + " for $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) +  " exp");
                server.fortify(CONSTANTS.ServerFortifyAmount);
                return Promise.resolve(true);
            } else {	
                //Player only gains 25% exp for failure? TODO Can change this later to balance
                Player.gainHackingExp(expGainedOnFailure);
                workerScript.scriptRef.onlineExpGained += expGainedOnFailure;
                
                console.log("Script unsuccessful to hack " + server.hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " exp");
                workerScript.scriptRef.log("Script FAILED to hack " + server.hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " exp");
                return Promise.resolve(false);
            }
        });
    }).then(function(res) {
        return Promise.resolve(res);
    }).catch(function(e) {
        return Promise.reject(e);
    });
}

function netscriptGrow(exp, workerScript) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    if (exp.args.length != 1) {
        return Promise.reject(makeRuntimeRejectMsg(workerScript, "grow() call has incorrect number of arguments. Takes 1 argument"));
    }
    var ipPromise = evaluate(exp.args[0], workerScript);
    return ipPromise.then(function(ip) {
        if (env.stopFlag) {return Promise.reject(workerScript);}
        var server = getServer(ip);
        if (server == null) {
            workerScript.scriptRef.log("Cannot grow(). Invalid IP or hostname passed in: " + ip);
            return Promise.reject(makeRuntimeRejectMsg(workerScript, "Invalid IP or hostname passed into grow() command"));
        }
                                    
        //No root access or skill level too low
        if (server.hasAdminRights == false) {
            workerScript.scriptRef.log("Cannot grow this server (" + server.hostname + ") because user does not have root access");
            return Promise.reject(makeRuntimeRejectMsg(workerScript, "Script crashed because it did not have root access to " + server.hostname));
        }
        
        var growTime = scriptCalculateGrowTime(server);
        console.log("Executing grow() on server " + server.hostname + " in " + formatNumber(growTime/1000, 3) + " seconds")
        workerScript.scriptRef.log("Executing grow() on server " + server.hostname + " in " + formatNumber(growTime/1000, 3) + " seconds");
        
        return Promise.resolve([server, growTime]);
    }).then(function([server, growTime]) {
        if (env.stopFlag) {return Promise.reject(workerScript);}
        return netscriptDelay(growTime).then(function() {
            if (env.stopFlag) {return Promise.reject(workerScript);}
            server.moneyAvailable += 1; //It can be grown even if it has no money
            var growthPercentage = processSingleServerGrowth(server, 450);
            workerScript.scriptRef.recordGrow(server.ip);
            workerScript.scriptRef.log("Available money on " + server.hostname + " grown by " 
                                       + formatNumber(growthPercentage*100 - 100, 6) + "%");
            var expGain = 0.5 * Player.hacking_exp_mult;
            workerScript.scriptRef.log("Gained " + expGain + " hacking experience");
            workerScript.scriptRef.onlineExpGained += expGain;
            Player.gainHackingExp(expGain);   
            return Promise.resolve(growthPercentage);
        }); 
    }).then(function(res) {
        return Promise.resolve(res);
    }).catch(function(e) {
        return Promise.reject(e);
    })
}

function netscriptWeaken(exp, workerScript) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    if (exp.args.length != 1) {
        return Promise.reject(makeRuntimeRejectMsg(workerScript, "weaken() call has incorrect number of arguments. Takes 1 argument"));
    }
    var ipPromise = evaluate(exp.args[0], workerScript);
    return ipPromise.then(function(ip) {
        if (env.stopFlag) {return Promise.reject(workerScript);}
        var server = getServer(ip);
        if (server == null) {
            workerScript.scriptRef.log("Cannot weaken(). Invalid IP or hostname passed in: " + ip);
            return Promise.reject(makeRuntimeRejectMsg(workerScript, "Invalid IP or hostname passed into weaken() command"));
        }
                                    
        //No root access or skill level too low
        if (server.hasAdminRights == false) {
            workerScript.scriptRef.log("Cannot weaken this server (" + server.hostname + ") because user does not have root access");
            return Promise.reject(makeRuntimeRejectMsg(workerScript, "Script crashed because it did not have root access to " + server.hostname));
        }
        
        var weakenTime = scriptCalculateWeakenTime(server);
        console.log("Executing weaken() on server " + server.hostname + " in " + formatNumber(weakenTime/1000, 3) + " seconds")
        workerScript.scriptRef.log("Executing weaken() on server " + server.hostname + " in " + formatNumber(weakenTime/1000, 3) + " seconds");
        
        return Promise.resolve([server, weakenTime]);
    }).then(function([server, weakenTime]) {
        if (env.stopFlag) {return Promise.reject(workerScript);}
        return netscriptDelay(weakenTime).then(function() {
            if (env.stopFlag) {return Promise.reject(workerScript);}
            server.weaken(CONSTANTS.ServerWeakenAmount);
            workerScript.scriptRef.recordWeaken(server.ip);
            workerScript.scriptRef.log("Server security level on " + server.hostname + " weakened to " + server.hackDifficulty);
            workerScript.scriptRef.log("Gained 3 hacking experience");
            var expGain = 3 * Player.hacking_exp_mult;
            workerScript.scriptRef.log("Gained " + expGain + " hacking experience");
            workerScript.scriptRef.onlineExpGained += expGain;
            Player.gainHackingExp(expGain); 
            return Promise.resolve(CONSTANTS.ServerWeakenAmount);
        });
    }).then(function(res) {
        return Promise.resolve(res);
    }).catch(function(e) {
        return Promise.reject(e);
    });
}

function netscriptRunProgram(exp, workerScript, programName) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    if (exp.args.length != 1) {
        return Promise.reject(makeRuntimeRejectMsg(workerScript, "nuke() call has incorrect number of arguments. Takes 1 argument"));
    }
    var ipPromise = evaluate(exp.args[0], workerScript);
    return ipPromise.then(function(ip) {
        if (env.stopFlag) {return Promise.reject(workerScript);}
        var server = getServer(ip);
        if (server == null) {
            workerScript.scriptRef.log("Cannot call " + programName + ". Invalid IP or hostname passed in: " + ip);
            return Promise.reject(makeRuntimeRejectMsg(workerScript, "Invalid IP or hostname passed into " + programName + " command"));
        }
        
        if (!Player.hasProgram(programName)) {
            return Promise.reject(makeRuntimeRejectMsg(workerScript, "Player does not have " + programName + " on home computer"));
        }
        
        switch(programName) {
            case Programs.NukeProgram:
                return netscriptRunNukeProgram(exp, workerScript, server);
                break;
            case Programs.BruteSSHProgram:
                return netscriptRunBrutesshProgram(exp, workerScript, server);
                break;
            case Programs.FTPCrackProgram:
                return netscriptRunFtpcrackProgram(exp, workerScript, server);
                break;
            case Programs.RelaySMTPProgram:
                return netscriptRunRelaysmtpProgram(exp, workerScript, server);
                break;
            case Programs.HTTPWormProgram:
                return netscriptRunHttpwormProgram(exp, workerScript, server);
                break;
            case Programs.SQLInjectProgram:
                return netscriptRunSqlinjectProgram(exp, workerScript, server);
                break;
            default:
                return Promise.reject(makeRuntimeRejectMsg(workerScript, "Invalid program. This is a bug please contact game dev"));
                break;
        }
    }).then(function(res) {
        return Promise.resolve(res);
    }).catch(function(e) {
        return Promise.reject(e);
    });
}

function netscriptRunNukeProgram(exp, workerScript, server) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    if (server.openPortCount < server.numOpenPortsRequired) {
        return Promise.reject(makeRuntimeRejectMsg(workerScript, "Not enough ports opened to use NUKE.exe virus"));
    }
    if (server.hasAdminRights) {
        workerScript.scriptRef.log("Already have root access to " + server.hostname);
    } else {
        server.hasAdminRights = true;
        workerScript.scriptRef.log("Executed NUKE.exe virus on " + server.hostname + " to gain root access");
    }
    return Promise.resolve(true);
}

function netscriptRunBrutesshProgram(exp, workerScript, server) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    if (!server.sshPortOpen) {
        workerScript.scriptRef.log("Executed BruteSSH.exe virus on " + server.hostname + " to open SSH port (22)");
        server.sshPortOpen = true; 
        ++server.openPortCount;
    } else {
        workerScript.scriptRef.log("SSH Port (22) already opened on " + server.hostname);
    }
    return Promise.resolve(true);
}

function netscriptRunFtpcrackProgram(exp, workerScript, server) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    if (!server.ftpPortOpen) {
        workerScript.scriptRef.log("Executed FTPCrack.exe virus on " + server.hostname + " to open FTP port (21)");
        server.ftpPortOpen = true; 
        ++server.openPortCount;
    } else {
        workerScript.scriptRef.log("FTP Port (21) already opened on " + server.hostname);
    }
    return Promise.resolve(true);
}

function netscriptRunRelaysmtpProgram(exp, workerScript, server) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    if (!server.smtpPortOpen) {
        workerScript.scriptRef.log("Executed relaySMTP.exe virus on " + server.hostname + " to open SMTP port (25)");
        server.smtpPortOpen = true; 
        ++server.openPortCount;
    } else {
        workerScript.scriptRef.log("SMTP Port (25) already opened on " + server.hostname);
    }
    return Promise.resolve(true);
}

function netscriptRunHttpwormProgram(exp, workerScript, server) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    if (!server.httpPortOpen) {
        workerScript.scriptRef.log("Executed HTTPWorm.exe virus on " + server.hostname + " to open HTTP port (25)");
        server.httpPortOpen = true; 
        ++server.openPortCount;
    } else {
        workerScript.scriptRef.log("HTTP Port (80) already opened on " + server.hostname);
    }
    return Promise.resolve(true);
}

function netscriptRunSqlinjectProgram(exp, workerScript, server) {
    var env = workerScript.env;
    if (env.stopFlag) {return Promise.reject(workerScript);}
    if (!server.sqlPortOpen) {
        workerScript.scriptRef.log("Executed SQLInject.exe virus on " + server.hostname + " to open SQL port (1433)");
        server.sqlPortOpen = true; 
        ++server.openPortCount;
    } else {
        workerScript.scriptRef.log("SQL Port (1433) already opened on " + server.hostname);
    }
    return Promise.resolve(true);
}