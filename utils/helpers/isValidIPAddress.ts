/**
 * Checks whether a IP Address string is valid.
 * @param ipaddress A string representing a potential IP Address
 */
export function isValidIPAddress(ipaddress: string): boolean {
  const byteRange = "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
  const regexStr = `^${byteRange}\.${byteRange}\.${byteRange}\.${byteRange}$`;
  const ipAddressRegex = new RegExp(regexStr);

  return ipAddressRegex.test(ipaddress);
}
