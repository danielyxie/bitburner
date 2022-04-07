// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jest, describe, expect, test } from "@jest/globals";

import { Script } from "../../../src/Script/Script";
import { Player } from "../../../src/Player";

jest.mock(`!!raw-loader!../NetscriptDefinitions.d.ts`, () => "", {
  virtual: true,
});

const code = `/** @param {NS} ns */
export async function main(ns) {
	ns.print(ns.getWeakenTime('n00dles'));
}`;

describe("Validate Save Script Works", function () {
  it("Save", function () {
    const server = "home";
    const filename = "test.js";
    const player = Player;
    const script = new Script();
    script.saveScript(player, filename, code, server, []);

    expect(script.filename).toEqual(filename);
    expect(script.code).toEqual(code);
    expect(script.server).toEqual(server);
  });
});
