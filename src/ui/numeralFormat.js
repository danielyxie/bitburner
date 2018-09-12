import numeral from "numeral";
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

class NumeralFormatter {
    updateLocale(l) {
        if (numeral.locale(l) == null) {
            console.warn(`Invalid locale for numeral: ${l}`);

            let defaultValue = 'en';
            numeral.locale(defaultValue);
            return false;
        }
        return true;
    }

    format(n, format) {
        return numeral(n).format(format);
    }
}

export const numeralWrapper = new NumeralFormatter();
