/* Worker code, contains Netscript scripts that are actually running */
//TODO Need some way to stop scripts. Idea: Put a flag in the environment, we can setActive
//this flag from outside. If the evaluate() function sees that flag it rejects the current
// Promise. We can catch that rejection and stop the script.  
 
//TODO Tested For and while and generic call statements. Have not tested if statements 

/* Actual Worker Code */
function WorkerScript() {
	this.name 			= "";
	this.running 		= false;
	this.serverHostname = null;
	this.code 			= "";
	this.env 			= new Environment();
	this.timeout		= null;
}

//Array containing all scripts that are running across all servers, to easily run them all
var workerScripts 			= [];

//Loop through workerScripts and run every script that is not currently running
function runScriptsLoop() {
	for (var i = 0; i < workerScripts.length; i++) {
		if (workerScripts[i].running == false) {
			var ast = Parser(Tokenizer(InputStream(workerScripts[i].code)));
			
			console.log("Starting new script: " + workerScripts[i].name);
			console.log("AST of new script:");
			console.log(ast);
			
			workerScripts[i].running = true;
			evaluate(ast, workerScripts[i]);
		}
	}
	
	setTimeout(runScriptsLoop, 10000);
}

runScriptsLoop();