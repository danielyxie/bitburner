import { getRandomInt } from "./getRandomInt";

/**
 * Gets a random value in the range of a byte (0 - 255), or up to the maximum.
 * @param max The maximum value (up to 255).
 */
export function getRandomByte(max: number): number {
    // Technically 2^8 is 256, but the values are 0-255, not 1-256.
    const byteMaximum = 255;
    const upper: number = Math.max(Math.min(max, byteMaximum), 0);

    return getRandomInt(0, upper);
}
