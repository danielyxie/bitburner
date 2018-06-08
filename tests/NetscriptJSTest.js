import {executeJSScript} from "../src/NetscriptJSEvaluator.js";
import {WorkerScript}    from "../src/NetscriptWorker.js";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

console.info('asdf');

describe('NSJS ScriptStore', function() {
    it('should run an imported function', async function() {
        const s = { filename: "", code: "export function main() { return 2; }", args:[]};
        const worker = new WorkerScript(s);
        chai.expect(await executeJSScript([], s)).to.equal(2);
    });

    /*
    it('should handle recursive imports', async function() {
        const s1 = { filename: "s1.js", code: "export function iAmRecursiveImport(x) { return x + 2; }" };
        const s2 = { filename: "", code: `
            import {iAmRecursiveImport} from \"s1.js\";
            export function main() { return iAmRecursiveImport(3);
        }`};
        chai.expect(await executeJSScript([s1, s2], s2)).to.equal(5);
    });

    it (`should correctly reference the passed global env`, async function() {
        var [x, y] = [0, 0];
        var env = {
            updateX: function(value) { x = value; },
            updateY: function(value) { y = value; },
        };
        const s1 = {filename: "s1.js", code: "export function importedFn(x) { updateX(x); }"};
        const s2 = {filename: "s2.js", code: `
            import {importedFn} from "s1.js";
            export function main() { updateY(7); importedFn(3); }
        `}
        await executeJSScript(s2, [s1, s2], env);
        chai.expect(y).to.equal(7);
        chai.expect(x).to.equal(3);
    });

    it (`should throw on circular dep`, async function() {
        const s1 = {filename: "s1.js", code: "import \"s2.js\""};
        const s2 = {filename: "s2.js", code: `
            import * as s1 from "s1.js";
            export function main() {}
        `}
        executeJSScript(s2, [s1, s2]).should.eventually.throw();
    });*/
});
