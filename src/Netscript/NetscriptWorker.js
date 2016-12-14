/* Worker code, contains Netscript scripts that are actually running */
//TODO Need some way to stop scripts. Idea: Put a flag in the environment, we can setActive
//this flag from outside. If the evaluate() function sees that flag it rejects the current
// Promise. We can catch that rejection and stop the script.  
 
//TODO Tested For and while and generic call statements. Have not tested if statements 

/* Actual Worker Code */
function WorkerScript() {
	this.name 			= "";
	this.running 		= false;
	this.serverIp 		= null;
	this.code 			= "";
	this.env 			= new Environment();
	this.output			= "";
}

//Array containing all scripts that are running across all servers, to easily run them all
var workerScripts 			= [];

//Loop through workerScripts and run every script that is not currently running
function runScriptsLoop() {
	//Run any scripts that haven't been started
	for (var i = 0; i < workerScripts.length; i++) {
		//If it isn't running, start the script
		if (workerScripts[i].running == false && workerScripts[i].env.stopFlag == false) {
			var ast = Parser(Tokenizer(InputStream(workerScripts[i].code)));
			
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
				console.log("Stopping script" + w.name + " because it was manually stopped (rejected)")
				w.running = false;
				w.env.stopFlag = true;
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
				
			//Delete script from workerScripts
			workerScripts.splice(i, 1);
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
	
	//Add script onto server's runningScripts
	server.runningScripts.push(filename);
	
	//Update server's ram usage
	server.ramUsed += script.ramUsage;
	
	//Create and add workerScripts
	var s = new WorkerScript();
	s.name 		= filename;
	s.code 		= script.code;
	s.serverIp 	= server.ip;
	workerScripts.push(s);
	console.log("Pushed script onto workerScripts");
	
}

runScriptsLoop();