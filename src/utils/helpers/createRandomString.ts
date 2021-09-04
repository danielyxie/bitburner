// Function that generates a random gibberish string of length n
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function createRandomString(n: number): string {
  let str = "";

  for (let i = 0; i < n; ++i) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
}
