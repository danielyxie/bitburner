import { sha256 } from "js-sha256";

/**
 * Computes a SHA-256 hash of a string synchronously
 * @param message The input string
 * @returns The SHA-256 hash in hex
 */
export function computeHash(message: string): string {
  const hash = sha256.create();
  hash.update(message);
  return hash.hex();
}
