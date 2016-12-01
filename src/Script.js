/* Script.js
 *  Script object
 */

//Define commands in script editor (ctrl x to close, etc.)
$(document).keydown(function(e) {
	if (Engine.currentPage == Engine.Page.ScriptEditor) {
        if (e.keyCode == 88 && e.ctrlKey) {			
			var filename = document.getElementById("script-editor-filename").value;
			
			if (checkValidFilename(filename) == false) {
				postScriptEditorStatus("Script filename can contain only alphanumerics, hyphens, and underscores");
				return;
			}
			
			filename += ".script";
			
			//If the current script matches one thats currently running, throw an error
			for (var i = 0; i < Player.getCurrentServer().runningScripts.length; i++) {
				if (filename == Player.getCurrentServer().runningScripts[i].filename) {
					postScriptEditorStatus("Cannot write to script that is currently running!");
					return;
				}
			}
			
			//If the current script already exists on the server, overwrite it
			for (var i = 0; i < Player.getCurrentServer().scripts.length; i++) {
				if (filename == Player.getCurrentServer().scripts[i].filename) {
					Player.getCurrentServer().scripts[i].saveScript();
					Engine.loadTerminalContent();
					return;
				}
			}
			
			//If the current script does NOT exist, create a new one
			var script = new Script();
			script.saveScript();
			Player.getCurrentServer().scripts.push(script);
			Engine.loadTerminalContent();
        }
	}
});

//Checks that the string contains only valid characters for a filename, which are alphanumeric,
// underscores and hyphens
function checkValidFilename(filename) {
	var regex = /^[a-zA-Z0-9_-]+$/;
	
	if (filename.match(regex)) {
		return true;
	}
	return false;
}

var ScriptEditorLastStatus = null;
function postScriptEditorStatus(text) {
	document.getElementById("script-editor-status").innerHTML = text;
	
	clearTimeout(ScriptEditorLastStatus);
	ScriptEditorLastStatus = setTimeout(function() {
		document.getElementById("script-editor-status").innerHTML = "";
	}, 3000);
}

function Script() {    
	this.filename 	= "";
    this.code       = "";
    this.ramUsage   = 0;
	this.server 	= null;	//IP of server this script is on
    
    /* Properties to calculate offline progress. Only applies for infinitely looping scripts */
    
    //Time it takes to execute one iteration of the entire script
    //Each function takes 1 second, plus hacking time plus and sleep commands
    this.executionTimeMillis    = 0;
    
    //Number of instructions ("lines") in the code. Any call ending in a ; 
    //is considered one instruction. Used to calculate executionTime
    this.numInstructions        = 0;
    
    //Which servers are hacked in one iteration of the script. May contain duplicates
    this.serversHacked          = [];
};

//Execute the next function in the Script's function queue
Script.prototype.executeNext = function() {
    if (this.functionQueue.length <= 0) {return;}
    
    //Shift the next element off ths function queue and then execute it
    (this.functionQueue.shift())();
}

//Get the script data from the Script Editor and save it to the object
Script.prototype.saveScript = function() {
	if (Engine.currentPage == Engine.Page.ScriptEditor) {
		//Update code and filename
		var code = document.getElementById("script-editor-text").value;
		this.code = code;
		
		var filename = document.getElementById("script-editor-filename").value + ".script";
		this.filename = filename;
		
		//Server
		this.server = Player.currentServer;
		
		//TODO Calculate/update number of instructions, ram usage, execution time, etc. 
	}
}
