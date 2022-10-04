import { Script } from "../../../src/Script/Script";

const code = `/** @param {NS} ns */
export async function main(ns) {
	ns.print(ns.getWeakenTime('n00dles'));
}`;

describe("Validate Save Script Works", function () {
  it("Save", function () {
    const server = "home";
    const filename = "test.js";
    const script = new Script();
    script.saveScript(filename, code, server, []);

    expect(script.filename).toEqual(filename);
    expect(script.code).toEqual(code);
    expect(script.server).toEqual(server);
  });
});
