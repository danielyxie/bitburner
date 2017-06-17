/* Worker code, contains Netscript scripts that are actually running */  
 
//TODO Tested For and while and generic call statements. Have not tested if statements 

/* Actual Worker Code */
function WorkerScript(runningScriptObj) {
	this.name 			= runningScriptObj.filename;
	this.running 		= false;
	this.serverIp 		= null;
	this.code 			= runningScriptObj.scriptRef.code;
	this.env 			= new Environment();
	this.output			= "";
	this.ramUsage		= 0;
	this.scriptRef		= runningScriptObj;
    this.errorMessage   = "";
    this.args           = runningScriptObj.args;
}

//Returns the server on which the workerScript is running
WorkerScript.prototype.getServer = function() {
	return AllServers[this.serverIp];
}

//Array containing all scripts that are running across all servers, to easily run them all
var workerScripts 			= [];

//Loop through workerScripts and run every script that is not currently running
function runScriptsLoop() {
	//Run any scripts that haven't been started
	for (var i = 0; i < workerScripts.length; i++) {
		//If it isn't running, start the script
		if (workerScripts[i].running == false && workerScripts[i].env.stopFlag == false) {
			try {
				var ast = Parser(Tokenizer(InputStream(workerScripts[i].code)));
                //console.log(ast);
			} catch (e) {
                console.log("Error parsing script: " + workerScripts[i].name);
                dialogBoxCreate("Syntax ERROR in " + workerScripts[i].name + ":<br>" +  e);
                workerScripts[i].env.stopFlag = true;
				continue;
			}
						
			workerScripts[i].running = true;
			var p = evaluate(ast, workerScripts[i]);
			//Once the code finishes (either resolved or rejected, doesnt matter), set its
			//running status to false
			p.then(function(w) {
				console.log("Stopping script " + w.name + " because it finished running naturally");
				w.running = false;
				w.env.stopFlag = true;
                w.scriptRef.log("Script finished running");
			}, function(w) {
				if (w instanceof Error) {
                    dialogBoxCreate("Script runtime unknown error. This is a bug please contact game developer");
					console.log("ERROR: Evaluating workerscript returns an Error. THIS SHOULDN'T HAPPEN");
                    return;
                } else if (w instanceof WorkerScript) {
                    if (isScriptErrorMessage(w.errorMessage)) {
                        var errorTextArray = w.errorMessage.split("|");
                        if (errorTextArray.length != 4) {
                            console.log("ERROR: Something wrong with Error text in evaluator...");
                            console.log("Error text: " + errorText);
                            return;
                        }
                        var serverIp = errorTextArray[1];
                        var scriptName = errorTextArray[2];
                        var errorMsg = errorTextArray[3];
					
                        dialogBoxCreate("Script runtime error: <br>Server Ip: " + serverIp + 
                                        "<br>Script name: " + scriptName + 
                                        "<br>Args:" + printArray(w.args) + "<br>" + errorMsg);
                        w.scriptRef.log("Script crashed with runtime error");
                    } else {
                        w.scriptRef.log("Script killed");
                    }
					w.running = false;
					w.env.stopFlag = true;
                    
				} else if (isScriptErrorMessage(w)) {
                    dialogBoxCreate("Script runtime unknown error. This is a bug please contact game developer");
					console.log("ERROR: Evaluating workerscript returns only error message rather than WorkerScript object. THIS SHOULDN'T HAPPEN");
                    return;
                } else {
                    dialogBoxCreate("An unknown script died for an unknown reason. This is a bug please contact game dev");
                }
			});
		}
	}
	
	//Delete any scripts that finished or have been killed. Loop backwards bc removing
	//items fucks up the indexing
	for (var i = workerScripts.length - 1; i >= 0; i--) {
		if (workerScripts[i].running == false && workerScripts[i].env.stopFlag == true) {
			console.log("Deleting script: " + workerScripts[i].name);
			//Delete script from the runningScripts array on its host serverIp 
			var ip = workerScripts[i].serverIp;
			var name = workerScripts[i].name;
			for (var j = 0; j < AllServers[ip].runningScripts.length; j++) {
				if (AllServers[ip].runningScripts[j].filename == name &&
                    compareArrays(AllServers[ip].runningScripts[j].args, workerScripts[i].args)) {
					AllServers[ip].runningScripts.splice(j, 1);
					break;
				}
			}
            
			//Free RAM
			AllServers[ip].ramUsed -= workerScripts[i].ramUsage;
            
            //Delete script from Active Scripts
			deleteActiveScriptsItem(workerScripts[i]);
				
			//Delete script from workerScripts
			workerScripts.splice(i, 1);
		}
	}
	
	setTimeout(runScriptsLoop, 10000);
}

//Queues a script to be killed by settings its stop flag to true. Then, the code will reject
//all of its promises recursively, and when it does so it will no longer be running.
//The runScriptsLoop() will then delete the script from worker scripts
function killWorkerScript(runningScriptObj, serverIp) {
	for (var i = 0; i < workerScripts.length; i++) {
		if (workerScripts[i].name == runningScriptObj.filename && workerScripts[i].serverIp == serverIp &&
            compareArrays(workerScripts[i].args, runningScriptObj.args)) {
			workerScripts[i].env.stopFlag = true;
            return true;
		}
	}
    return false;
}

//Queues a script to be run 
function addWorkerScript(runningScriptObj, server) {
	var filename = runningScriptObj.filename;
	
	//Update server's ram usage
    var threads = 1;
    if (runningScriptObj.threads && !isNaN(runningScriptObj.threads)) {
        threads = runningScriptObj.threads;
    } else {
        runningScriptObj.threads = 1;
    }
    var ramUsage = runningScriptObj.scriptRef.ramUsage * threads * Math.pow(1.02, threads-1);
	server.ramUsed += ramUsage;
	
	//Create the WorkerScript
	var s = new WorkerScript(runningScriptObj);
	s.serverIp 	= server.ip;
	s.ramUsage 	= ramUsage;
	
	//Add the WorkerScript to the Active Scripts list
	addActiveScriptsItem(s);
	
	//Add the WorkerScript
	workerScripts.push(s);
	return;
}

//Updates the online running time stat of all running scripts
function updateOnlineScriptTimes(numCycles = 1) {
	var time = (numCycles * Engine._idleSpeed) / 1000; //seconds
	for (var i = 0; i < workerScripts.length; ++i) {
		workerScripts[i].scriptRef.onlineRunningTime += time;
	}
}

runScriptsLoop();