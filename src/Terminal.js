//Terminal
var post = function(input) {
    $("#terminal-input").before('<tr class="posted"><td style="color: #66ff33;">' + input + '</td></tr>');
	window.scrollTo(0, document.body.scrollHeight);
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

var Terminal.executeCommand = function(command) {
    var commandArray = command.split();
    
    if (commandArray.length == 0) {
        return;
    }
    
    switch (commandArray[0]) {
		case "analyze":
			//TODO Analyze the system for ports
			break;
		case "clear":
		case "cls":
			//TODO
			break;	
		case "connect":
			//TODO Disconnect from current server in terminal and connect to new one..maybe rename this to telnet?
			break;
		case "df":
			//TODO
			break;
		case "hack":
			//TODO Hack the current PC (usually for money)
			//You can't hack your home pc or servers you purchased
			if (Player.currentServer.purchasedByPlayer) {
				post("Cannot hack your own machines! You are currently connected to your home PC or one of your purchased servers");
			} else {
				
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
			//TODO Displays available network connections using TCP
		case "ps":
			//TODO
			break;
		case "rm":
			//TODO
			break;
		case "run":
			//TODO
			break;
		case "scan":
			//TODO
			break;
		case "scp":
			//TODO
			break;
		default:
			
    }
}

var Terminal.runProgram = function(programName) {
	
}
