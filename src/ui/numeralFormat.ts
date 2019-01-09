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
        return numeral(n).format(format);
    }

    formatMoney(n: number): string {
        return this.format(n, "$0.000a");
    }

    formatBigNumber(n: number): string {
        return this.format(n, "0.000a");
    }
}

export const numeralWrapper = new NumeralFormatter();
