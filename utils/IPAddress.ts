import { AllServers }       from "../src/Server/AllServers";
import { getRandomByte }    from "./helpers/getRandomByte";

/* Functions to deal with manipulating IP addresses*/

//Generate a random IP address
//Will not return an IP address that already exists in the AllServers array
export function createRandomIp(): string {
	const ip: string = getRandomByte(99) + '.' +
			 		   getRandomByte(9) + '.' +
			 		   getRandomByte(9) + '.' +
		 	 		   getRandomByte(9);

    // If the Ip already exists, recurse to create a new one
    if (ipExists(ip)) {
        return createRandomIp();
    }

	return ip;
}

// Returns true if the IP already exists in one of the game's servers
export function ipExists(ip: string) {
	return (AllServers[ip] != null);
}
