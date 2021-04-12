import * as numeral from 'numeral';
import 'numeral/locales/bg';
import 'numeral/locales/cs';
import 'numeral/locales/da-dk';
import 'numeral/locales/de';
import 'numeral/locales/en-au';
import 'numeral/locales/en-gb';
import 'numeral/locales/es';
import 'numeral/locales/fr';
import 'numeral/locales/hu';
import 'numeral/locales/it';
import 'numeral/locales/lv';
import 'numeral/locales/no';
import 'numeral/locales/pl';
import 'numeral/locales/ru';

/* eslint-disable class-methods-use-this */

class NumeralFormatter {
    // Default Locale
    defaultLocale: string = "en";

    constructor() {
        this.defaultLocale = 'en';
    }

    updateLocale(l: string): boolean {
        if (numeral.locale(l) == null) {
            console.warn(`Invalid locale for numeral: ${l}`);

            numeral.locale(this.defaultLocale);
            return false;
        }
        return true;
    }

    format(n: number, format: string): string {
        // numeraljs doesnt properly format numbers that are too big or too small
        if (Math.abs(n) < 1e-6) { n = 0; }
        const answer = numeral(n).format(format);
        if (answer === 'NaN') {
            return `${n}`;
        }
        return answer;
    }

    formatBigNumber(n: number): string {
        return this.format(n, "0.000a");
    }

    formatHp(n: number): string {
        return this.format(n, "0");
    }

    formatMoney(n: number): string {
        return this.format(n, "$0.000a");
    }

    formatSkill(n: number): string {
        return this.format(n, "0,0");
    }

    formatExp(n: number): string {
        return this.format(n, "0.000a");
    }

    formatHashes(n: number): string {
        return this.format(n, "0.000a");
    }

    formatReputation(n: number): string {
        return this.format(n, "0.000a");
    }

    formatFavor(n: number): string {
        return this.format(n, "0,0");
    }

    formatRAM(n: number): string {
        return this.format(n, "0.00")+"GB";
    }

    formatPercentage(n: number, decimalPlaces: number=2): string {
        const formatter: string = "0." + "0".repeat(decimalPlaces) + "%";
        return this.format(n, formatter);
    }

    formatServerSecurity(n: number, decimalPlaces: number=2): string {
        return this.format(n, "0,0.000");
    }

    formatRespect(n: number): string {
        return this.format(n, "0.00000a");
    }

    formatWanted(n: number): string {
        return this.format(n, "0.00000a");
    }

    formatMultiplier(n: number): string {
        return this.format(n, "0,0.00");
    }

    formatShock(n: number): string {
        return this.format(n, "0,0.000");
    }

    formatSync(n: number): string {
        return this.format(n, "0,0.000");
    }

    formatMemory(n: number): string {
        return this.format(n, "0");
    }

    formatPopulation(n: number): string {
        return this.format(n, "0.000a");
    }

    formatStamina(n: number): string {
        return this.format(n, "0.0");
    }

    formatShares(n: number): string {
        if (n < 1000) {
            return this.format(n, "0");
        }
        return this.format(n, "0.000a");
    }
}

export const numeralWrapper = new NumeralFormatter();
