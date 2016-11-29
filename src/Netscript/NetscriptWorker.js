/* Worker code, contains Netscript scripts that are actually running */
 
/* Actual Worker Code */
function WorkerScript() {
	this.name 		= "";
	this.running 	= false;
	this.server 	= null;
	this.code 		= "";
	this.env 		= new Environment();
	this.timeout	= null;
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
			
			evaluate(ast, workerScripts[i]);
			workerScripts[i].running = true;
		}
	}
	
	setTimeout(runScriptsLoop, 10000);
}

runScriptsLoop();