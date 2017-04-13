/* Worker code, contains Netscript scripts that are actually running */  
 
//TODO Tested For and while and generic call statements. Have not tested if statements 

/* Actual Worker Code */
function WorkerScript(script) {
	this.name 			= "";
	this.running 		= false;
	this.serverIp 		= null;
	this.code 			= "";
	this.env 			= new Environment();
	this.output			= "";
	this.ramUsage		= 0;
	this.scriptRef		= script;
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
			} catch (e) {
				post("Syntax error in " + workerScript[i].name + ": " + e);
				continue;
			}
			
			console.log("Starting new script: " + workerScripts[i].name);
			console.log("AST of new script:");
			console.log(ast);
			
			workerScripts[i].running = true;
			var p = evaluate(ast, workerScripts[i]);
			//Once the code finishes (either resolved or rejected, doesnt matter), set its
			//running status to false
			p.then(function(w) {
				console.log("Stopping script " + w.name + " because it finished running naturally");
				w.running = false;
				w.env.stopFlag = true;
			}, function(w) {
				if (w instanceof Error) {
					//Error text format: |serverip|scriptname|error message
					var errorText = w.toString();
                    if (Engine.Debug) {
                        console.log("Error in script: " + errorText);
                    }
					var errorTextArray = errorText.split("|");
					if (errorTextArray.length != 4) {
						console.log("ERROR: Something wrong with Error text in evaluator...");
						console.log("Error text: " + errorText);
					}
					var serverIp = errorTextArray[1];
					var scriptName = errorTextArray[2];
					var errorMsg = errorTextArray[3];
					
					//Post error message to terminal
					//TODO Only post this if you're on the machine the script is running on?
					post("Script runtime error: " + errorMsg);
                    dialogBoxCreate("Script runtime error: ", "Server Ip: " + serverIp, "Script name: " + scriptName, errorMsg);
					
					//Find the corresponding workerscript and set its flags to kill it
					for (var i = 0; i < workerScripts.length; ++i) {
						if (workerScripts[i].serverIp == serverIp && workerScripts[i].name == scriptName) {
							workerScripts[i].running = false;
							workerScripts[i].env.stopFlag = true;
							return;
						}
					}
					
				} else {
					console.log("Stopping script" + w.name + " because it was manually stopped (rejected)")
					w.running = false;
					w.env.stopFlag = true;
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
				if (AllServers[ip].runningScripts[j] == name) {
					AllServers[ip].runningScripts.splice(j, 1);
					break;
				}
			}
			
			//Free RAM
			AllServers[ip].ramUsed -= workerScripts[i].ramUsage;
				
			//Delete script from workerScripts
			workerScripts.splice(i, 1);
			
			//Delete script from Active Scripts
			Engine.deleteActiveScriptsItem(i);
		}
	}
	
	setTimeout(runScriptsLoop, 10000);
}

//Queues a script to be killed by settings its stop flag to true. Then, the code will reject
//all of its promises recursively, and when it does so it will no longer be running.
//The runScriptsLoop() will then delete the script from worker scripts
function killWorkerScript(scriptName, serverIp) {
	console.log("killWorkerScript called for script " + scriptName + " on server " + serverIp);
	for (var i = 0; i < workerScripts.length; i++) {
		if (workerScripts[i].name == scriptName && workerScripts[i].serverIp == serverIp) {
			workerScripts[i].env.stopFlag = true;
		}
	}
}

//Queues a script to be run 
function addWorkerScript(script, server) {
	var filename = script.filename;
	
	//Update server's ram usage
	server.ramUsed += script.ramUsage;
	
	//Create the WorkerScript
	var s = new WorkerScript(script);
	s.name 		= filename;
	s.code 		= script.code;
	s.serverIp 	= server.ip;
	s.ramUsage 	= script.ramUsage;
	
	//Add the WorkerScript to the Active Scripts list
	Engine.addActiveScriptsItem(s);
	
	//Add the WorkerScript
	workerScripts.push(s);
	console.log("Pushed script onto workerScripts");
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