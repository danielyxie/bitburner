import { formatNumber } from "../../utils/StringHelperFunctions";

export class DarkWebItem {
    program: string;
    price: number;
    description: string;

    constructor(program: string, price: number, description: string) {
        this.program = program;
        this.price = price;
        this.description = description;
    }

    // Formats the item to print out to terminal (e.g. BruteSSH.exe -$500,000 - Opens up SSH Ports)
    toString(): string {
        return [this.program, "$" + formatNumber(this.price, 0), this.description].join(" - ");
    }
}
