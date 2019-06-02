
/**
 * Checks whether a IP Address string is valid.
 * @param ipaddress A string representing a potential IP Address
 */
export function isValidIPAddress(ipaddress: string) {
    const byteRange: string = "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    const regexStr: string = `^${byteRange}\.${byteRange}\.${byteRange}\.${byteRange}$`;
    const ipAddressRegex: RegExp = new RegExp(regexStr);

    return ipAddressRegex.test(ipaddress);
}
