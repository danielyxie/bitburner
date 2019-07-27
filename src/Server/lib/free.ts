import { BaseServer } from "../BaseServer";
import { numeralWrapper } from "../../ui/numeralFormat";

export function free( server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){

    const ram = numeralWrapper.format(server.maxRam, '0.00');
    const used = numeralWrapper.format(server.ramUsed, '0.00');
    const avail = numeralWrapper.format(server.maxRam - server.ramUsed, '0.00');
    const maxLength = Math.max(ram.length, Math.max(used.length, avail.length));
    const usedPercent = numeralWrapper.format(server.ramUsed/server.maxRam*100, '0.00');

    out(`Total:     ${" ".repeat(maxLength-ram.length)}${ram} GB`);
    out(`Used:      ${" ".repeat(maxLength-used.length)}${used} GB (${usedPercent}%)`);
    out(`Available: ${" ".repeat(maxLength-avail.length)}${avail} GB`);

}

