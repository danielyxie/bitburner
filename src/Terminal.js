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
            $('input[class=terminal-input]').val("");
            
            //Execute command function here
		}
	}
});

var executeCommand = function(command) {
    var commandArray = command.split();
    
    if (commandArray.length == 0) {
        return;
    }
    
    switch (commandArray[0]) {
        case 
    }
}