//Terminal
var post = function(input) {
    $("#terminal-input").before('<tr class="posted"><td style="color: #66ff33;">' + input + '</td></tr>');
	window.scrollTo(0, document.body.scrollHeight);
}

var postNetburnerText = function() {
	post("Netburner v1.0");
}

//command is checked on enter key press
$(document).keyup(function(event) {
    if (event.keyCode == 13) {
		var command = $('input[class=terminal-input]').val();
		if (command.length > 0) {
			post("> " + command);
            
			//TODO Do i have to switch the order of these two?
            Terminal.executeCommand(command);
			$('input[class=terminal-input]').val("");
		}
	}
});

var Terminal = {
	executeCommand:  function(command) {
		var commandArray = command.split(" ");
		
		if (commandArray.length == 0) {
			return;
		}
		
		switch (commandArray[0]) {
			case "analyze":
				//TODO Analyze the system for ports
				break;
			case "clear":
			case "cls":
				console.log("cls/clear terminal command called");
				$("#terminal tr:not(:last)").remove();
				postNetburnerText();
				break;	
			case "connect":
            case "telnet":
				//Disconnect from current server in terminal and connect to new one..maybe rename this to telnet?
                if (commandArray.length != 2) {
                    post("Incorrect usage of connect/telnet command. Usage: connect/telnet [ip]");
                    return;
                }
                
                var ip = commandArray[1];
                
                for (var i = 0; i < Player.currentServer.serversOnNetwork.length; i++) {
                    if (Player.currentServer.serversOnNetwork[i].ip == ip || Player.currentServer.serversOnNetwork[i].hostname == ip) {
                        Player.currentServer.isConnectedTo = false;
                        Player.currentServer = Player.currentServer.serversOnNetwork[i];
                        post("Connected to " + ip);
                        return;
                    }
                }
                
                post("Host not found"); 
				break;
			case "df":
				console.log("df terminal command called");
                post("Total: " + Player.currentServer.maxRam.toString() + " GB");
                post("Used: " + Player.currentServer.ramUsed.toString() + " GB");
                post("Available: " + (Player.currentServer.maxRam - Player.currentServer.ramUsed).toString() + " GB");
				break;
			case "hack":
				//TODO Hack the current PC (usually for money)
				//You can't hack your home pc or servers you purchased
				if (Player.currentServer.purchasedByPlayer) {
					post("Cannot hack your own machines! You are currently connected to your home PC or one of your purchased servers");
				} else if (Player.currentServer.hasAdminRights == false ) {
					post("You do not have admin rights for this machine! Cannot hack");
				} else if (Player.currentServer.requiredHackingSkill > Player.hacking_skill) {
					post("Your hacking skill is not high enough to attempt hacking this machine");
				} else {
					var hackResult = Player.currentServer.hack();
				}
				break;
			case "help":
				//TODO
				break;
			case "hostname":
				//Print the hostname of current system
				post(Player.currentServer.hostname);
				break;
			case "ifconfig":
				//Print the IP address of the current system
				post(Player.currentServer.ip);
				break;
			case "kill":
				//TODO
				break;
			case "ls":
				//TODO
				break;
			case "netstat":
			case "scan":
                if (commandArray.length != 1) {
                    post("Incorrect usage of netstat/scan command. Usage: netstat/scan");
                    return;
                }
				//Displays available network connections using TCP
                console.log("netstat/scan terminal command called");
                post("Hostname               IP");
                for (var i = 0; i < Player.currentServer.serversOnNetwork.length; i++) {
                    post(Player.currentServer.serversOnNetwork[i].hostname + " " + Player.currentServer.serversOnNetwork[i].ip);
                }
			case "ps":
				//TODO
				break;
			case "rm":
				//TODO
				break;
			case "run":
				//TODO
				break;
			case "scp":
				//TODO
				break;
			default:
				post("Command not found");
		}
	},
	
	runProgram: function(programName) {
	
	}
};



