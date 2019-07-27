if (commandArray.length !== 1) {
    postError("Incorrect usage of free command. Usage: free");
    return;
}
const ram = numeralWrapper.format(Player.getCurrentServer().maxRam, '0.00');
const used = numeralWrapper.format(Player.getCurrentServer().ramUsed, '0.00');
const avail = numeralWrapper.format(Player.getCurrentServer().maxRam - Player.getCurrentServer().ramUsed, '0.00');
const maxLength = Math.max(ram.length, Math.max(used.length, avail.length));
const usedPercent = numeralWrapper.format(Player.getCurrentServer().ramUsed/Player.getCurrentServer().maxRam*100, '0.00');

post(`Total:     ${" ".repeat(maxLength-ram.length)}${ram} GB`);
post(`Used:      ${" ".repeat(maxLength-used.length)}${used} GB (${usedPercent}%)`);
post(`Available: ${" ".repeat(maxLength-avail.length)}${avail} GB`);
