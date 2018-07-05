import {AllServers}                     from "../src/Server";
import {getRandomByte}                  from "./helpers/getRandomByte";

/* Functions to deal with manipulating IP addresses*/

//Generate a random IP address
//Will not return an IP address that already exists in the AllServers array
function createRandomIp() {
	var ip = getRandomByte(99) + '.' +
			 getRandomByte(9) + '.' +
			 getRandomByte(9) + '.' +
		 	 getRandomByte(9);

    //If the Ip already exists, recurse to create a new one
    if (ipExists(ip)) {
        return createRandomIp();
    }
	return ip;
}

//Returns true if the IP already exists in one of the game's servers
function ipExists(ip) {
    for (var property in AllServers) {
        if (AllServers.hasOwnProperty(property)) {
            if (property == ip) {
                return true;
            }
        }
    }
    return false;
}

function isValidIPAddress(ipaddress) {
	if (/^(25[0-6]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-6]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-6]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-6]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
	{
		return true;
	}
	return false;
}

export {createRandomIp, ipExists, isValidIPAddress};
