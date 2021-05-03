import { expect } from "chai";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";

describe("StringHelperFunctions Tests", function() {
    expect(convertTimeMsToTimeElapsedString(1000)).to.equal("1 seconds");
    expect(convertTimeMsToTimeElapsedString(5*60*1000+34*1000)).to.equal("5 minutes 34 seconds");
    expect(convertTimeMsToTimeElapsedString(2*60*60*24*1000+5*60*1000+34*1000)).to.equal("2 days 5 minutes 34 seconds");
    expect(convertTimeMsToTimeElapsedString(2*60*60*24*1000+5*60*1000+34*1000, true)).to.equal("2 days 5 minutes 34.000 seconds");
    expect(convertTimeMsToTimeElapsedString(2*60*60*24*1000+5*60*1000+34*1000+123, true)).to.equal("2 days 5 minutes 34.123 seconds");
    expect(convertTimeMsToTimeElapsedString(2*60*60*24*1000+5*60*1000+34*1000+123.888, true)).to.equal("2 days 5 minutes 34.123 seconds");
})