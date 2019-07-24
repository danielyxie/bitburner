import { Company } from "./Company";
import { CompanyPosition } from "./CompanyPosition";

/**
 * Returns a string with the given CompanyPosition's stat requirements
 */

export function getJobRequirementText(company: Company, pos: CompanyPosition, tooltiptext: boolean = false): string {
    let reqText: string = "";
    const offset: number = company.jobStatReqOffset;
    const reqHacking: number = pos.requiredHacking > 0       ? pos.requiredHacking + offset   : 0;
    const reqStrength: number = pos.requiredStrength > 0     ? pos.requiredStrength + offset  : 0;
    const reqDefense: number = pos.requiredDefense > 0       ? pos.requiredDefense + offset   : 0;
    const reqDexterity: number = pos.requiredDexterity > 0   ? pos.requiredDexterity + offset : 0;
    const reqAgility: number = pos.requiredDexterity > 0     ? pos.requiredDexterity + offset : 0;
    const reqCharisma: number = pos.requiredCharisma > 0     ? pos.requiredCharisma + offset  : 0;
    const reqRep: number = pos.requiredReputation;
    if (tooltiptext) {
        reqText = "Requires:<br>";
        reqText += (reqHacking.toString() +       " hacking<br>");
        reqText += (reqStrength.toString() +      " strength<br>");
        reqText += (reqDefense.toString() +       " defense<br>");
        reqText += (reqDexterity.toString() +     " dexterity<br>");
        reqText += (reqAgility.toString() +       " agility<br>");
        reqText += (reqCharisma.toString() +      " charisma<br>");
        reqText += (reqRep.toString() +           " reputation");
    } else {
        reqText = "(Requires ";
        if (reqHacking > 0)     {reqText += (reqHacking +       " hacking, "); }
        if (reqStrength > 0)    {reqText += (reqStrength +      " strength, "); }
        if (reqDefense > 0)     {reqText += (reqDefense +       " defense, "); }
        if (reqDexterity > 0)   {reqText += (reqDexterity +     " dexterity, "); }
        if (reqAgility > 0)     {reqText += (reqAgility +       " agility, "); }
        if (reqCharisma > 0)    {reqText += (reqCharisma +      " charisma, "); }
        if (reqRep > 1)         {reqText += (reqRep +           " reputation, "); }
        reqText = reqText.substring(0, reqText.length - 2);
        reqText += ")";
    }
    return reqText;
}
