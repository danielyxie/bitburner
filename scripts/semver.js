/* eslint-disable max-lines */
/* eslint-disable func-style */
/* eslint-disable function-paren-newline */
/* eslint-disable max-statements */
/* eslint-disable no-param-reassign */
/* eslint-disable complexity */
/* eslint-disable max-params */
/* eslint-disable max-depth */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable arrow-body-style */
/* eslint-disable init-declarations */

// This is a heavily stripped down/reformatted version of https://github.com/npm/node-semver/blob/v5.5.1/semver.js
// Originally licensed under ISC (https://github.com/npm/node-semver/blob/v5.5.1/LICENSE)
// Copyright (c) Isaac Z. Schlueter and Contributors

const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;

// The actual regexps go on re
/**
 * @type {RegExp[]}
 */
const re = [];

/**
 * @type {string[]}
 */
const src = [];
const NUMERICIDENTIFIER = 0;
const NUMERICIDENTIFIERLOOSE = 1;
const NONNUMERICIDENTIFIER = 2;
const MAINVERSION = 3;
const MAINVERSIONLOOSE = 4;
const PRERELEASEIDENTIFIER = 5;
const PRERELEASEIDENTIFIERLOOSE = 6;
const PRERELEASE = 7;
const PRERELEASELOOSE = 8;
const BUILDIDENTIFIER = 9;
const BUILD = 10;
const FULL = 11;
const LOOSE = 12;
const GTLT = 13;
const XRANGEIDENTIFIERLOOSE = 14;
const XRANGEIDENTIFIER = 15;
const XRANGEPLAIN = 16;
const XRANGEPLAINLOOSE = 17;
const XRANGE = 18;
const XRANGELOOSE = 19;
const COERCE = 20;
const LONETILDE = 21;
const TILDETRIM = 22;
const TILDE = 23;
const TILDELOOSE = 24;
const LONECARET = 25;
const CARET = 26;
const CARETLOOSE = 27;
const CARETTRIM = 28;
const COMPARATORLOOSE = 29;
const COMPARATOR = 30;
const COMPARATORTRIM = 31;
const HYPHENRANGE = 32;
const HYPHENRANGELOOSE = 33;
const STAR = 34;

// The following Regular Expressions can be used for tokenizing, validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
/* eslint-disable operator-linebreak */
src[NUMERICIDENTIFIER] = "0|[1-9]\\d*";
src[NUMERICIDENTIFIERLOOSE] = "[0-9]+";

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or more letters, digits, or hyphens.
src[NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";

// ## Main Version
// Three dot-separated numeric identifiers.
src[
    MAINVERSION
] = `(${src[NUMERICIDENTIFIER]})\\.(${src[NUMERICIDENTIFIER]})\\.(${src[NUMERICIDENTIFIER]})`;
src[
    MAINVERSIONLOOSE
] = `(${src[NUMERICIDENTIFIERLOOSE]})\\.(${src[NUMERICIDENTIFIERLOOSE]})\\.(${src[NUMERICIDENTIFIERLOOSE]})`;

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
src[
    PRERELEASEIDENTIFIER
] = `(?:${src[NUMERICIDENTIFIER]}|${src[NONNUMERICIDENTIFIER]})`;
src[
    PRERELEASEIDENTIFIERLOOSE
] = `(?:${src[NUMERICIDENTIFIERLOOSE]}|${src[NONNUMERICIDENTIFIER]})`;

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version identifiers.
src[
    PRERELEASE
] = `(?:-(${src[PRERELEASEIDENTIFIER]}(?:\\.${src[PRERELEASEIDENTIFIER]})*))`;
src[
    PRERELEASELOOSE
] = `(?:-?(${src[PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[PRERELEASEIDENTIFIERLOOSE]})*))`;

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
src[BUILDIDENTIFIER] = "[0-9A-Za-z-]+";

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata identifiers.
src[BUILD] = `(?:\\+(${src[BUILDIDENTIFIER]}(?:\\.${src[BUILDIDENTIFIER]})*))`;

// ## Full Version String
// A main version, followed optionally by a pre-release version and build metadata.

// Note that the only major, minor, patch, and pre-release sections of the version string are capturing groups.
// The build metadata is not a capturing group, because it should not ever be used in version comparison.
const FULLPLAIN = `v?${src[MAINVERSION]}${src[PRERELEASE]}?${src[BUILD]}?`;
src[FULL] = `^${FULLPLAIN}$`;

// Like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// Also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty common in the npm registry.
const LOOSEPLAIN = `[v=\\s]*${src[MAINVERSIONLOOSE]}${src[PRERELEASELOOSE]}?${src[BUILD]}?`;
src[LOOSE] = `^${LOOSEPLAIN}$`;
src[GTLT] = "((?:<|>)?=?)";

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
src[XRANGEIDENTIFIERLOOSE] = `${src[NUMERICIDENTIFIERLOOSE]}|x|X|\\*`;
src[XRANGEIDENTIFIER] = `${src[NUMERICIDENTIFIER]}|x|X|\\*`;

/* eslint-disable-next-line max-len */
src[
    XRANGEPLAIN
] = `[v=\\s]*(${src[XRANGEIDENTIFIER]})(?:\\.(${src[XRANGEIDENTIFIER]})(?:\\.(${src[XRANGEIDENTIFIER]})(?:${src[PRERELEASE]})?${src[BUILD]}?)?)?`;

/* eslint-disable-next-line max-len */
src[XRANGEPLAINLOOSE] =
  `[v=\\s]*(${src[XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[XRANGEIDENTIFIERLOOSE]})` +
  `(?:\\.(${src[XRANGEIDENTIFIERLOOSE]})(?:${src[PRERELEASELOOSE]})?${src[BUILD]}?)?)?`;

src[XRANGE] = `^${src[GTLT]}\\s*${src[XRANGEPLAIN]}$`;
src[XRANGELOOSE] = `^${src[GTLT]}\\s*${src[XRANGEPLAINLOOSE]}$`;

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
/* eslint-disable-next-line max-len */
src[
    COERCE
] = `(?:^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:$|[^\\d])`;

// Tilde ranges.
// Meaning is "reasonably at or greater than"
src[LONETILDE] = "(?:~>?)";

src[TILDETRIM] = `(\\s*)${src[LONETILDE]}\\s+`;
re[TILDETRIM] = new RegExp(src[TILDETRIM], "g");
const tildeTrimReplace = "$1~";

src[TILDE] = `^${src[LONETILDE]}${src[XRANGEPLAIN]}$`;
src[TILDELOOSE] = `^${src[LONETILDE]}${src[XRANGEPLAINLOOSE]}$`;

// Caret ranges.
// Meaning is "at least and backwards compatible with"
src[LONECARET] = "(?:\\^)";
src[CARETTRIM] = `(\\s*)${src[LONECARET]}\\s+`;
re[CARETTRIM] = new RegExp(src[CARETTRIM], "g");
const caretTrimReplace = "$1^";
src[CARET] = `^${src[LONECARET]}${src[XRANGEPLAIN]}$`;
src[CARETLOOSE] = `^${src[LONECARET]}${src[XRANGEPLAINLOOSE]}$`;

// A simple gt/lt/eq thing, or just "" to indicate "any version"
src[COMPARATORLOOSE] = `^${src[GTLT]}\\s*(${LOOSEPLAIN})$|^$`;

src[COMPARATOR] = `^${src[GTLT]}\\s*(${FULLPLAIN})$|^$`;

// An expression to strip any whitespace between the gtlt and the thing it modifies, so that `> 1.2.3` ==> `>1.2.3`
src[
    COMPARATORTRIM
] = `(\\s*)${src[GTLT]}\\s*(${LOOSEPLAIN}|${src[XRANGEPLAIN]})`;

// This one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], "g");
const comparatorTrimReplace = "$1$2$3";

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be checked against either the strict or loose comparator form later.
src[
    HYPHENRANGE
] = `^\\s*(${src[XRANGEPLAIN]})\\s+-\\s+(${src[XRANGEPLAIN]})\\s*$`;

src[
    HYPHENRANGELOOSE
] = `^\\s*(${src[XRANGEPLAINLOOSE]})\\s+-\\s+(${src[XRANGEPLAINLOOSE]})\\s*$`;

// Star ranges basically just allow anything at all.
src[STAR] = "(<|>)?=?\\s*\\*";
/* eslint-enable operator-linebreak */

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (let idx = 0; idx <= STAR; idx++) {
    if (!re[idx]) {
        re[idx] = new RegExp(src[idx]);
    }
}

const ANY = {};
const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";

function compareIdentifiers(left, right) {
    const numeric = /^[0-9]+$/;
    const leftIsNumeric = numeric.test(left);
    const rightIsNumeric = numeric.test(right);
    if (leftIsNumeric && !rightIsNumeric) {
        return -1;
    }

    if (rightIsNumeric && !leftIsNumeric) {
        return 1;
    }

    if (leftIsNumeric && rightIsNumeric) {
        left = Number(left);
        right = Number(right);
    }

    if (left < right) {
        return -1;
    }

    if (left > right) {
        return 1;
    }

    return 0;
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) {
    if (isX(fM)) {
        from = "";
    } else if (isX(fm)) {
        from = `>=${fM}.0.0`;
    } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0`;
    } else {
        from = `>=${from}`;
    }

    if (isX(tM)) {
        to = "";
    } else if (isX(tm)) {
        to = `<${Number(tM) + 1}.0.0`;
    } else if (isX(tp)) {
        to = `<${tM}.${Number(tm) + 1}.0`;
    } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else {
        to = `<=${to}`;
    }

    return `${from} ${to}`.trim();
}

function replaceTilde(comp, loose) {
    const regex = loose ? re[TILDELOOSE] : re[TILDE];

    return comp.replace(regex, function (match, major, minor, patch, prerelease) {
        let ret;

        if (isX(major)) {
            ret = "";
        } else if (isX(minor)) {
            ret = `>=${major}.0.0 <${Number(major) + 1}.0.0`;
        } else if (isX(patch)) {
            // ~1.2 == >=1.2.0 <1.3.0
            ret = `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0`;
        } else if (prerelease) {
            if (prerelease.charAt(0) !== "-") {
                prerelease = `-${prerelease}`;
            }
            ret = `>=${major}.${minor}.${patch}${prerelease} <${major}.${
                Number(minor) + 1
            }.0`;
        } else {
            // ~1.2.3 == >=1.2.3 <1.3.0
            ret = `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0`;
        }

        return ret;
    });
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, loose) {
    return comp
        .trim()
        .split(/\s+/)
        .map((comp1) => replaceTilde(comp1, loose))
        .join(" ");
}

function replaceCaret(comp, loose) {
    const regex = loose ? re[CARETLOOSE] : re[CARET];

    return comp.replace(regex, function (match, major, minor, patch, prerelease) {
        let ret;

        if (isX(major)) {
            ret = "";
        } else if (isX(minor)) {
            ret = `>=${major}.0.0 <${Number(major) + 1}.0.0`;
        } else if (isX(patch)) {
            if (major === "0") {
                ret = `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0`;
            } else {
                ret = `>=${major}.${minor}.0 <${Number(major) + 1}.0.0`;
            }
        } else if (prerelease) {
            if (prerelease.charAt(0) !== "-") {
                prerelease = `-${prerelease}`;
            }
            if (major === "0") {
                if (minor === "0") {
                    ret = `>=${major}.${minor}.${patch}${prerelease} <${major}.${minor}.${
                        Number(patch) + 1
                    }`;
                } else {
                    ret = `>=${major}.${minor}.${patch}${prerelease} <${major}.${
                        Number(minor) + 1
                    }.0`;
                }
            } else {
                ret = `>=${major}.${minor}.${patch}${prerelease} <${
                    Number(major) + 1
                }.0.0`;
            }
        } else if (major === "0") {
            if (minor === "0") {
                ret = `>=${major}.${minor}.${patch} <${major}.${minor}.${
                    Number(patch) + 1
                }`;
            } else {
                ret = `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0`;
            }
        } else {
            ret = `>=${major}.${minor}.${patch} <${Number(major) + 1}.0.0`;
        }

        return ret;
    });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, loose) {
    return comp
        .trim()
        .split(/\s+/)
        .map((comp1) => replaceCaret(comp1, loose))
        .join(" ");
}

function replaceXRange(comp, loose) {
    comp = comp.trim();
    const regex = loose ? re[XRANGELOOSE] : re[XRANGE];

    return comp.replace(regex, function (ret, operator, major, minor, patch) {
        const xM = isX(major);
        const xm = xM || isX(minor);
        const xp = xm || isX(patch);
        const anyX = xp;

        if (operator === "=" && anyX) {
            operator = "";
        }

        if (xM) {
            if (operator === ">" || operator === "<") {
                // Nothing is allowed
                ret = "<0.0.0";
            } else {
                // Nothing is forbidden
                ret = "*";
            }
        } else if (operator && anyX) {
            // Replace X with 0
            if (xm) {
                minor = 0;
            }
            if (xp) {
                patch = 0;
            }

            if (operator === ">") {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                // >1.2.3 => >= 1.2.4
                operator = ">=";
                if (xm) {
                    major = Number(major) + 1;
                    minor = 0;
                    patch = 0;
                } else if (xp) {
                    minor = Number(minor) + 1;
                    patch = 0;
                }
            } else if (operator === "<=") {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should pass. Similarly, <=7.x is actually <8.0.0, etc.
                operator = "<";
                if (xm) {
                    major = Number(major) + 1;
                } else {
                    minor = Number(minor) + 1;
                }
            }

            ret = `${operator}${major}.${minor}.${patch}`;
        } else if (xm) {
            ret = `>=${major}.0.0 <${Number(major) + 1}.0.0`;
        } else if (xp) {
            ret = `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0`;
        }

        return ret;
    });
}

function replaceXRanges(comp, loose) {
    return comp
        .split(/\s+/)
        .map((comp1) => replaceXRange(comp1, loose))
        .join(" ");
}

// Because * is AND-ed with everything else in the comparator, and '' means "any version", just remove the *s entirely.
function replaceStars(comp) {
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[STAR], "");
}

// Comprised of xranges, tildes, stars, and gtlt's at this point.
// Already replaced the hyphen ranges turn into a set of JUST comparators.
function parseComparator(comp, loose) {
    comp = replaceCarets(comp, loose);
    comp = replaceTildes(comp, loose);
    comp = replaceXRanges(comp, loose);
    comp = replaceStars(comp, loose);

    return comp;
}

class SemVer {

    /**
   * A semantic version.
   * @param {string} version The version.
   * @param {boolean} loose If this is a loose representation of a version.
   * @returns {SemVer} a new instance.
   */
    constructor(version, loose) {
        if (version instanceof SemVer) {
            if (version.loose === loose) {
                return version;
            }
            version = version.version;
        } else if (typeof version !== "string") {
            throw new TypeError(`Invalid Version: ${version}`);
        }
        if (version.length > MAX_LENGTH) {
            throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        if (!(this instanceof SemVer)) {
            return new SemVer(version, loose);
        }
        this.loose = loose;
        const matches = version.trim().match(loose ? re[LOOSE] : re[FULL]);
        if (!matches) {
            throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        // These are actually numbers
        this.major = Number(matches[1]);
        this.minor = Number(matches[2]);
        this.patch = Number(matches[3]);
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError("Invalid patch version");
        }
        // Numberify any prerelease numeric ids
        if (matches[4]) {
            this.prerelease = matches[4].split(".").map((id) => {
                if ((/^[0-9]+$/).test(id)) {
                    const num = Number(id);
                    if (num >= 0 && num < MAX_SAFE_INTEGER) {
                        return num;
                    }
                }

                return id;
            });
        } else {
            this.prerelease = [];
        }
        this.build = matches[5] ? matches[5].split(".") : [];
        this.format();
    }

    format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
            this.version += `-${this.prerelease.join(".")}`;
        }

        return this.version;
    }

    toString() {
        return this.version;
    }

    /**
   * Comares the current instance against another instance.
   * @param {SemVer} other The SemVer to comare to.
   * @returns {0|1|-1} A comparable value for sorting.
   */
    compare(other) {
        return this.compareMain(other) || this.comparePre(other);
    }

    compareMain(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.loose);
        }

        return (
            compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch)
        );
    }

    comparePre(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.loose);
        }
        // NOT having a prerelease is > having one
        if (this.prerelease.length && !other.prerelease.length) {
            return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
        }
        let idx = 0;
        do {
            const thisPrelease = this.prerelease[idx];
            const otherPrelease = other.prerelease[idx];
            const thisPreleaseIsUndefined = typeof thisPrelease === "undefined";
            const otherPreleaseIsUndefined = typeof otherPrelease === "undefined";
            if (thisPreleaseIsUndefined && otherPreleaseIsUndefined) {
                return 0;
            } else if (otherPreleaseIsUndefined) {
                return 1;
            } else if (thisPreleaseIsUndefined) {
                return -1;
            } else if (thisPrelease === otherPrelease) {
                continue;
            } else {
                return compareIdentifiers(thisPrelease, otherPrelease);
            }
        } while ((idx += 1) > 0);

        // Should not hit this point, but assume equal ranking.
        return 0;
    }
}

const compare = (leftVersion, rightVersion, loose) => new SemVer(leftVersion, loose).compare(new SemVer(rightVersion, loose));
const gt = (leftVersion, rightVersion, loose) => compare(leftVersion, rightVersion, loose) > 0;
const lt = (leftVersion, rightVersion, loose) => compare(leftVersion, rightVersion, loose) < 0;
const eq = (leftVersion, rightVersion, loose) => compare(leftVersion, rightVersion, loose) === 0;
const neq = (leftVersion, rightVersion, loose) => compare(leftVersion, rightVersion, loose) !== 0;
const gte = (leftVersion, rightVersion, loose) => compare(leftVersion, rightVersion, loose) >= 0;
const lte = (leftVersion, rightVersion, loose) => compare(leftVersion, rightVersion, loose) <= 0;

function cmp(left, op, right, loose) {
    let ret;
    switch (op) {
        case "===":
            if (typeof left === "object") {
                left = left.version;
            }
            if (typeof right === "object") {
                right = right.version;
            }
            ret = left === right;
            break;
        case "!==":
            if (typeof left === "object") {
                left = left.version;
            }
            if (typeof right === "object") {
                right = right.version;
            }
            ret = left !== right;
            break;
        case "":
        case "=":
        case "==":
            ret = eq(left, right, loose);
            break;
        case "!=":
            ret = neq(left, right, loose);
            break;
        case ">":
            ret = gt(left, right, loose);
            break;
        case ">=":
            ret = gte(left, right, loose);
            break;
        case "<":
            ret = lt(left, right, loose);
            break;
        case "<=":
            ret = lte(left, right, loose);
            break;
        default:
            throw new TypeError(`Invalid operator: ${op}`);
    }

    return ret;
}

function testSet(set, version) {
    for (let idx = 0; idx < set.length; idx++) {
        if (!set[idx].test(version)) {
            return false;
        }
    }

    if (version.prerelease.length) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed, even though it's within the range set by the comparators.
        for (let idx = 0; idx < set.length; idx++) {
            if (set[idx].semver !== ANY) {
                if (set[idx].semver.prerelease.length > 0) {
                    const allowed = set[idx].semver;
                    if (
                        allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch
                    ) {
                        return true;
                    }
                }
            }
        }

        // Version has a -pre, but it's not one of the ones we like.
        return false;
    }

    return true;
}
class Comparator {
    constructor(comp, loose) {
        if (comp instanceof Comparator) {
            if (comp.loose === loose) {
                return comp;
            }
            comp = comp.value;
        }
        if (!(this instanceof Comparator)) {
            return new Comparator(comp, loose);
        }
        this.loose = loose;
        this.parse(comp);
        if (this.semver === ANY) {
            this.value = "";
        } else {
            this.value = this.operator + this.semver.version;
        }
    }

    parse(comp) {
        const regex = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
        const matches = comp.match(regex);
        if (!matches) {
            throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = matches[1];
        if (this.operator === "=") {
            this.operator = "";
        }
        // If it literally is just '>' or '' then allow anything.
        if (matches[2]) {
            this.semver = new SemVer(matches[2], this.loose);
        } else {
            this.semver = ANY;
        }
    }

    toString() {
        return this.value;
    }

    test(version) {
        if (this.semver === ANY) {
            return true;
        }
        if (typeof version === "string") {
            version = new SemVer(version, this.loose);
        }

        return cmp(version, this.operator, this.semver, this.loose);
    }
}

/**
 * A range object.
 * @param {Range|Comparator|string} range the value to parse to a Range.
 * @param {any} loose whether the range is explicit or a loose value.
 * @returns {Range} the Range instace.
 */
class Range {
    constructor(range, loose) {
        if (range instanceof Range) {
            if (range.loose === loose) {
                return range;
            }

            return new Range(range.raw, loose);
        }
        if (range instanceof Comparator) {
            return new Range(range.value, loose);
        }
        if (!(this instanceof Range)) {
            return new Range(range, loose);
        }
        this.loose = loose;
        // First, split based on boolean or ||
        /**
     * @type {string}
     */
        this.raw = range;
        // Throw out any that are not relevant for whatever reason
        const hasLength = (item) => item.length;
        this.set = this.raw
            .split(/\s*\|\|\s*/)
            .map(function (range1) {
                return this.parseRange(range1.trim());
            }, this)
            .filter(hasLength);
        if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${range}`);
        }
        this.format();
    }

    format() {
        this.range = this.set
            .map((comps) => comps.join(" ").trim())
            .join("||")
            .trim();

        return this.range;
    }

    toString() {
        return this.range;
    }

    parseRange(range) {
        const loose = this.loose;
        range = range.trim();
        // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
        const hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
        range = range.replace(hr, hyphenReplace);
        // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
        range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
        // `~ 1.2.3` => `~1.2.3`
        range = range.replace(re[TILDETRIM], tildeTrimReplace);
        // `^ 1.2.3` => `^1.2.3`
        range = range.replace(re[CARETTRIM], caretTrimReplace);
        // Normalize spaces
        range = range.split(/\s+/).join(" ");
        // At this point, the range is completely trimmed and ready to be split into comparators.
        const compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
        let set = range
            .split(" ")
            .map((comp) => parseComparator(comp, loose))
            .join(" ")
            .split(/\s+/);
        if (loose) {
            // In loose mode, throw out any that are not valid comparators
            set = set.filter((comp) => Boolean(comp.match(compRe)));
        }
        set = set.map((comp) => new Comparator(comp, loose));

        return set;
    }

    // If ANY of the sets match ALL of its comparators, then pass
    test(version) {
        if (!version) {
            return false;
        }
        if (typeof version === "string") {
            version = new SemVer(version, this.loose);
        }
        for (let idx = 0; idx < this.set.length; idx++) {
            if (testSet(this.set[idx], version)) {
                return true;
            }
        }

        return false;
    }
}

/**
 * Checks if the provided version can satisfy the provided range.
 * @param {string} version The specific version.
 * @param {string} range The range expression.
 * @param {any} loose If the range is a loose expression.
 * @returns {boolean} Whether the versions successfully satisfies the range.
 */
function satisfies(version, range, loose) {
    try {
        const rangeObj = new Range(range, loose);

        return rangeObj.test(version);
    } catch (er) {
        return false;
    }
}

module.exports.satisfies = satisfies;
