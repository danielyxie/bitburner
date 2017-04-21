/* Functions to deal with manipulating IP addresses*/

//Generate a random IP address
//Will not return an IP address that already exists in the AllServers array
createRandomIp = function() {
	var ip = createRandomByte() +'.' +
			 createRandomByte() +'.' +
			 createRandomByte() +'.' +
		 	 createRandomByte();
             
    //If the Ip already exists, recurse to create a new one
    if (ipExists(ip)) {
        return createRandomIp();
    }
	return ip;
}

//Returns true if the IP already exists in one of the game's servers
ipExists = function(ip) {
    for (var property in AllServers) {
        if (AllServers.hasOwnProperty(property)) {
            if (property == ip) {
                return true;
            }
        }
    }
    return false;
}

createRandomByte = function() {
	return Math.round(Math.random()*256);
}

isValidIPAddress = function(ipaddress) {  
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
	{  
		return true;
	}  
	console.log("Invalid IP address");  
	return false  ;
}  