// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jest, describe, expect, test } from "@jest/globals";
import { convertTimeMsToTimeElapsedString } from "../../src/utils/StringHelperFunctions";

describe("StringHelperFunctions Tests", function () {
  it("transforms strings", () => {
    expect(convertTimeMsToTimeElapsedString(1000)).toEqual("1 seconds");
    expect(convertTimeMsToTimeElapsedString(5 * 60 * 1000 + 34 * 1000)).toEqual("5 minutes 34 seconds");
    expect(convertTimeMsToTimeElapsedString(2 * 60 * 60 * 24 * 1000 + 5 * 60 * 1000 + 34 * 1000)).toEqual(
      "2 days 5 minutes 34 seconds",
    );
    expect(convertTimeMsToTimeElapsedString(2 * 60 * 60 * 24 * 1000 + 5 * 60 * 1000 + 34 * 1000, true)).toEqual(
      "2 days 5 minutes 34.000 seconds",
    );
    expect(convertTimeMsToTimeElapsedString(2 * 60 * 60 * 24 * 1000 + 5 * 60 * 1000 + 34 * 1000 + 123, true)).toEqual(
      "2 days 5 minutes 34.123 seconds",
    );
    expect(
      convertTimeMsToTimeElapsedString(2 * 60 * 60 * 24 * 1000 + 5 * 60 * 1000 + 34 * 1000 + 123.888, true),
    ).toEqual("2 days 5 minutes 34.123 seconds");
  });
});
