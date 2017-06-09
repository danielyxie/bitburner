/* DarkWeb.js */
//Posts a "help" message if connected to DarkWeb
checkIfConnectedToDarkweb = function() {
    if (SpecialServerIps.hasOwnProperty("Darkweb Server")) {
        var darkwebIp =  SpecialServerIps["Darkweb Server"];
        if (!isValidIPAddress(darkwebIp)) {return;}
        if (darkwebIp == Player.getCurrentServer().ip) {
            post("You are now connected to the dark web. From the dark web you can purchase illegal items. " +
                 "Use the 'buy -l' command to display a list of all the items you can buy. Use 'buy [item-name] " + 
                 "to purchase an item");
        }
    }
    
}

//Handler for dark web commands. The terminal's executeCommand() function will pass
//dark web-specific commands into this. It will pass in the raw split command array
//rather than the command string
executeDarkwebTerminalCommand = function(commandArray) {
    if (commandArray.length == 0) {return;}
    switch (commandArray[0]) {
        case "buy":
            if (commandArray.length != 2) {
                post("Incorrect number of arguments. Usage: ");
                post("buy -l");
                post("buy [item name]");
            }
            var arg = commandArray[1];
            if (arg == "-l") {
                listAllDarkwebItems();
            } else {
                buyDarkwebItem(arg);
            }
            break;
        default:
            post("Command not found");
            break;
    }
}

listAllDarkwebItems = function() {
    for (var item in DarkWebItems) {
		if (DarkWebItems.hasOwnProperty(item)) {
            post(DarkWebItems[item]);
		}
	}
}

buyDarkwebItem = function(itemName) {
    if (itemName.toLowerCase() == Programs.BruteSSHProgram.toLowerCase()) {
        var price = parseDarkwebItemPrice(DarkWebItems.BruteSSHProgram);
        if (price > 0 && Player.money >= price) {
            Player.loseMoney(price);
            Player.getHomeComputer().programs.push(Programs.BruteSSHProgram);
            post("You have purchased the BruteSSH.exe program. The new program " + 
                 "can be found on your home computer.");
        } else {
            post("Not enough money to purchase " + itemName);
        }
    } else if (itemName.toLowerCase() == Programs.FTPCrackProgram.toLowerCase()) {
        var price = parseDarkwebItemPrice(DarkWebItems.FTPCrackProgram);
        if (price > 0 && Player.money >= price) {
            Player.loseMoney(price);
            Player.getHomeComputer().programs.push(Programs.FTPCrackProgram);
            post("You have purchased the FTPCrack.exe program. The new program " + 
                 "can be found on your home computer.");
        } else {
            post("Not enough money to purchase " + itemName);
        }
    } else if (itemName.toLowerCase() == Programs.RelaySMTPProgram.toLowerCase()) {
        var price = parseDarkwebItemPrice(DarkWebItems.RelaySMTPProgram);
        if (price > 0 && Player.money >= price) {
            Player.loseMoney(price);
            Player.getHomeComputer().programs.push(Programs.RelaySMTPProgram);
            post("You have purchased the relaySMTP.exe program. The new program " + 
                 "can be found on your home computer.");
        } else {
            post("Not enough money to purchase " + itemName);
        }
    } else if (itemName.toLowerCase() == Programs.HTTPWormProgram.toLowerCase()) {
        var price = parseDarkwebItemPrice(DarkWebItems.HTTPWormProgram);
        if (price > 0 && Player.money >= price) {
            Player.loseMoney(price);
            Player.getHomeComputer().programs.push(Programs.HTTPWormProgram);
            post("You have purchased the HTTPWorm.exe program. The new program " + 
                 "can be found on your home computer.");
        } else {
            post("Not enough money to purchase " + itemName);
        }
    } else if (itemName.toLowerCase() == Programs.SQLInjectProgram.toLowerCase()) {
        var price = parseDarkwebItemPrice(DarkWebItems.SQLInjectProgram);
        if (price > 0 && Player.money >= price) {
            Player.loseMoney(price);
            Player.getHomeComputer().programs.push(Programs.SQLInjectProgram);
            post("You have purchased the SQLInject.exe program. The new program " + 
                 "can be found on your home computer.");
        } else {
            post("Not enough money to purchase " + itemName);
        }
    } else if (itemName.toLowerCase() == Programs.DeepscanV1.toLowerCase()) {
        var price = parseDarkwebItemPrice(DarkWebItems.DeepScanV1Program);
        if (price > 0 && Player.money >= price) {
            Player.loseMoney(price);
            Player.getHomeComputer().programs.push(Programs.DeepscanV1);
            post("You have purchased the DeepscanV1.exe program. The new program " + 
                 "can be found on your home computer.");
        } else {
            post("Not enough money to purchase " + itemName);
        }
    } else if (itemName.toLowerCase() == Programs.DeepscanV2.toLowerCase()) {
        var price = parseDarkwebItemPrice(DarkWebItems.DeepScanV2Program);
        if (price > 0 && Player.money >= price) {
            Player.loseMoney(price);
            Player.getHomeComputer().programs.push(Programs.DeepscanV2);
            post("You have purchased the DeepscanV2.exe program. The new program " + 
                 "can be found on your home computer.");
        } else {
            post("Not enough money to purchase " + itemName);
        }
    } else {
        post("Unrecognized item");
    }
}

parseDarkwebItemPrice = function(itemDesc) {
    var split = itemDesc.split(" - ");
    if (split.length == 3) {
        var priceString = split[1];
        //Check for errors
        if (priceString.length == 0 || priceString.charAt(0) != '$') {
            return -1;
        }
        //Remove dollar sign and commas
        priceString = priceString.slice(1);
        priceString = priceString.replace(/,/g, '');
        
        //Convert string to numeric
        var price = parseFloat(priceString);
        if (isNaN(price)) {return -1;}
        else {return price;}
    } else {
        return -1;
    }
}

DarkWebItems = {
    BruteSSHProgram:    Programs.BruteSSHProgram + " - $500,000 - Opens up SSH Ports",
    FTPCrackProgram:    Programs.FTPCrackProgram + " - $1,500,000 - Opens up FTP Ports",
    RelaySMTPProgram:   Programs.RelaySMTPProgram + " - $5,000,000 - Opens up SMTP Ports",
    HTTPWormProgram:    Programs.HTTPWormProgram + " - $30,000,000 - Opens up HTTP Ports",
    SQLInjectProgram:   Programs.SQLInjectProgram + " - $250,000,000 - Opens up SQL Ports",
    DeepScanV1Program:  Programs.DeepscanV1 + " - $500,000 - Enables 'scan-analyze' with a depth up to 5",
    DeepScanV2Program:  Programs.DeepscanV2 + " - $25,000,000 - Enables 'scan-analyze' with a depth up to 10",
}