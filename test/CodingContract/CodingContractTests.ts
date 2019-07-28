import { CodingContract, CodingContractType } from "../../src/CodingContracts";

import { expect } from "chai";

/**

 Current Coding contracts have the following answer types:
 Integer
 Array of integers
 2D array of integers
 Array of strings
*/

console.log(`Beginning Coding Contract Tests`);

describe("Coding Contract Tests", function() {

    describe("CodingContract class", function() {

        describe("#parseAnswerFromInput()", function() {

            const parseAnswerFromInput = CodingContract.parseAnswerFromInput;

            it("should not alter integers", function() {
                expect(parseAnswerFromInput("100")).to.equal("100");
                expect(parseAnswerFromInput("0")).to.equal("0");
                expect(parseAnswerFromInput("-1")).to.equal("-1");
            });

            it("should correctly parse integer arrays and remove the surrounding brackets", function() {
                expect(parseAnswerFromInput("[1]")).to.equal("1");
                expect(parseAnswerFromInput("[1,2,3,4,5]")).to.equal("1,2,3,4,5");
                expect(parseAnswerFromInput("[1, 2, 3, 4, 5]")).to.equal("1,2,3,4,5");
                expect(parseAnswerFromInput("[ 1 ,  2 , 3, 4,5]")).to.equal("1,2,3,4,5");
                expect(parseAnswerFromInput("[]")).to.equal("");
            });

            it("should correctly parse 2D integer arrays and remove the surrounding brackets", function() {
                expect(parseAnswerFromInput(`[[]]`)).to.equal(`[]`);
                expect(parseAnswerFromInput(`[[1]]`)).to.equal(`[1]`);
                expect(parseAnswerFromInput(`[[1, 3]]`)).to.equal(`[1,3]`);
                expect(parseAnswerFromInput(`[[1,2],[3,4],[5,6]]`)).to.equal(`[1,2],[3,4],[5,6]`);
                expect(parseAnswerFromInput(`[[1, 2], [3, 4], [5, 6]]`)).to.equal(`[1,2],[3,4],[5,6]`);
                expect(parseAnswerFromInput(`[    [1 , 2], [   3, 4], [5  ,   6]]`)).to.equal(`[1,2],[3,4],[5,6]`);
            });

        });

    });




});
