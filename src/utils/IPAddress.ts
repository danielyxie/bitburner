import { getRandomByte } from "./helpers/getRandomByte";

/**
 * Generate a random IP address
 * Does not check to see if the IP already exists in the game
 */
export function createRandomIp(): string {
  const ip: string = getRandomByte(99) + "." + getRandomByte(9) + "." + getRandomByte(9) + "." + getRandomByte(9);

  return ip;
}
