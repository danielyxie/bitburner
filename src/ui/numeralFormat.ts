import numeral from "numeral";
import "numeral/locales/bg";
import "numeral/locales/cs";
import "numeral/locales/da-dk";
import "numeral/locales/de";
import "numeral/locales/en-au";
import "numeral/locales/en-gb";
import "numeral/locales/es";
import "numeral/locales/fr";
import "numeral/locales/hu";
import "numeral/locales/it";
import "numeral/locales/lv";
import "numeral/locales/no";
import "numeral/locales/pl";
import "numeral/locales/ru";

import { Settings } from "../Settings/Settings";


const extraFormats = [1e15, 1e18, 1e21, 1e24, 1e27, 1e30];
const extraNotations = ["q", "Q", "s", "S", "o", "n"];
const gigaMultiplier = { standard: 1e9, iec60027_2: 2 ** 30 };

class NumeralFormatter {
  // Default Locale
  defaultLocale = "en";

  constructor() {
    this.defaultLocale = "en";
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
    if (Math.abs(n) < 1e-6) {
      n = 0;
    }
    const answer = numeral(n).format(format);
    if (answer === "NaN") {
      return `${n}`;
    }
    return answer;
  }

  formatBigNumber(n: number): string {
    return this.format(n, "0.[000]a");
  }

  // TODO: leverage numeral.js to do it. This function also implies you can
  // use this format in some text field but you can't. ( "1t" will parse but
  // "1s" will not)
  formatReallyBigNumber(n: number, decimalPlaces = 3): string {
    const nAbs = Math.abs(n);
    if (n === Infinity) return "∞";
    for (let i = 0; i < extraFormats.length; i++) {
      if (extraFormats[i] < nAbs && nAbs <= extraFormats[i] * 1000) {
        return this.format(n / extraFormats[i], "0." + "0".repeat(decimalPlaces)) + extraNotations[i];
      }
    }
    if (nAbs < 1000) {
      return this.format(n, "0.[" + "0".repeat(decimalPlaces) + "]");
    }
    const str = this.format(n, "0.[" + "0".repeat(decimalPlaces) + "]a");
    if (str === "NaNt") return this.format(n, "0.[" + " ".repeat(decimalPlaces) + "]e+0");
    return str;
  }

  formatHp(n: number): string {
    if (n < 1e6) {
      return this.format(n, "0,0");
    }
    return this.formatReallyBigNumber(n);
  }

  formatMoney(n: number): string {
    return "$" + this.formatReallyBigNumber(n);
  }

  formatSkill(n: number): string {
    if (n < 1e15) {
      return this.format(n, "0,0");
    }
    return this.formatReallyBigNumber(n);
  }

  formatExp(n: number): string {
    return this.formatReallyBigNumber(n);
  }

  formatHashes(n: number): string {
    return this.formatReallyBigNumber(n);
  }

  formatReputation(n: number): string {
    return this.formatReallyBigNumber(n);
  }

  formatFavor(n: number): string {
    return this.format(n, "0,0");
  }

  formatSecurity(n: number): string {
    return n.toFixed(3);
  }

  formatRAM(n: number): string {
    if(Settings.UseIEC60027_2)
    {
      return this.format(n * gigaMultiplier.iec60027_2, "0.00ib");
    }
    return this.format(n * gigaMultiplier.standard, "0.00b");
  }

  formatPercentage(n: number, decimalPlaces = 2): string {
    const formatter: string = "0." + "0".repeat(decimalPlaces) + "%";
    return this.format(n, formatter);
  }

  formatServerSecurity(n: number): string {
    return this.format(n, "0,0.000");
  }

  formatRespect(n: number): string {
    return this.formatReallyBigNumber(n, 5);
  }

  formatWanted(n: number): string {
    return this.formatReallyBigNumber(n, 5);
  }

  formatMultiplier(n: number): string {
    return this.format(n, "0,0.00");
  }

  formatSleeveShock(n: number): string {
    return this.format(n, "0,0.000");
  }

  formatSleeveSynchro(n: number): string {
    return this.format(n, "0,0.000");
  }

  formatSleeveMemory(n: number): string {
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
    return this.formatReallyBigNumber(n);
  }

  formatInfiltrationSecurity(n: number): string {
    return this.formatReallyBigNumber(n);
  }

  formatThreads(n: number): string {
    return this.format(n, "0,0");
  }

  formatStaneksGiftHeat(n: number): string {
    return this.format(n, "0.000a");
  }

  formatStaneksGiftCharge(n: number): string {
    return this.format(n, "0.000a");
  }

  formatStaneksGiftPower(n: number): string {
    return this.format(n, "0.00");
  }

  parseCustomLargeNumber(str: string): number {
    const numericRegExp = new RegExp('^(\-?\\d+\\.?\\d*)([' + extraNotations.join("") + ']?)$');
    const match = str.match(numericRegExp);
    if (match == null) {
      return NaN;
    }
    const [, number, notation] = match;
    const notationIndex = extraNotations.indexOf(notation);
    if (notationIndex === -1) {
      return NaN;
    }
    return parseFloat(number) * extraFormats[notationIndex];
  }

  furthestFrom0(n1: number, n2 = 0, n3 = 0): number {
    if(isNaN(n1)) n1=0;
    if(isNaN(n2)) n2=0;
    if(isNaN(n3)) n3=0;
    const furthestAbsolute = Math.max(Math.abs(n1), Math.abs(n2), Math.abs(n3));
    switch(furthestAbsolute) {
      case Math.abs(n1): return n1;
      case Math.abs(n2): return n2;
      case Math.abs(n3): return n3;
    }
    return 0;
  }

  parseMoney(s: string): number {
    // numeral library does not handle formats like 1s (returns 1) and 1e10 (returns 110) well,
    // so if more then 1 return a valid number, return the one farthest from 0
    const numeralValue = numeral(s).value();
    const parsed = parseFloat(s);
    const selfParsed = this.parseCustomLargeNumber(s);
    // Check for one or more NaN values
    if (isNaN(parsed) && numeralValue === null && isNaN(selfParsed)) {    // 3x NaN
      return NaN;
    } else if (isNaN(parsed) && isNaN(selfParsed)) {                      // 2x NaN
      return numeralValue;
    } else if (numeralValue === null && isNaN(selfParsed)) {              // 2x NaN
      return parsed;
    } else if (isNaN(parsed) && numeralValue === null) {                  // 2x NaN
      return selfParsed;
    } else if (isNaN(parsed)) {                                           // 1x NaN
      return this.furthestFrom0(numeralValue, selfParsed);
    } else if (numeralValue === null) {                                   // 1x NaN
      return this.furthestFrom0(parsed, selfParsed);
    } else if (isNaN(selfParsed)) {                                       // 1x NaN
      return this.furthestFrom0(numeralValue, parsed);
    } else {                                                              // no NaN
      return this.furthestFrom0(numeralValue, parsed, selfParsed);
    }
  }
}

export const numeralWrapper = new NumeralFormatter();
