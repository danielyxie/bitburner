import { getRandomInt } from "../../utils/helpers/getRandomInt";

/* tslint:disable:completed-docs no-magic-numbers arrow-return-shorthand */

/* Function that generates a valid 'data' for a contract type */
export type GeneratorFunc = () => any;

/* Function that checks if the provided solution is the correct one */
export type SolverFunc = (data: any, answer: string) => boolean;

/* Function that returns a string with the problem's description.
   Requires the 'data' of a Contract as input */
export type DescriptionFunc = (data: any) => string;

export interface ICodingContractTypeMetadata {
    desc: DescriptionFunc;
    difficulty: number;
    gen: GeneratorFunc;
    name: string;
    numTries: number;
    solver: SolverFunc;
}

/* Helper functions for Coding Contract implementations */
function removeBracketsFromArrayString(str: string) {
    let strCpy: string = str;
    if (strCpy.startsWith("[")) { strCpy = strCpy.slice(1); }
    if (strCpy.endsWith("]")) { strCpy = strCpy.slice(0, -1); }

    return strCpy;
}

function convert2DArrayToString(arr: any[][]) {
    const components: string[] = [];
    arr.forEach((e: any) => {
        let s: string = e.toString();
        s = ["[", s, "]"].join("");
        components.push(s);
    });

    return components.join(",")
                     .replace(/\s/g, "");
}

export const codingContractTypesMetadata: ICodingContractTypeMetadata[] = [
    {
        desc: (n: number) => {
            return ["A prime factor is a factor that is a prime number.",
                    `What is the largest prime factor of ${n}?`].join(" ");
        },
        difficulty: 1,
        gen: () => {
            return getRandomInt(500, 1e9);
        },
        name: "Find Largest Prime Factor",
        numTries: 10,
        solver: (data: number, ans: string) => {
            let fac: number = 2;
            let n: number = data;
            while (n > fac) {
                if (n % fac === 0) {
                    n = Math.round(n / fac);
                    fac = 2;
                } else {
                    ++fac;
                }
            }

            return fac === parseInt(ans, 10);
        },
    },
    {
        desc: (n: number[]) => {
            return ["Given the following integer array, find the contiguous subarray",
                    "(containing at least one number) which has the largest sum and return that sum.",
                    "'Sum' refers to the sum of all the numbers in the subarray.",
                    `${n.toString()}`].join(" ");
        },
        difficulty: 1,
        gen: () => {
            const len: number = getRandomInt(5, 40);
            const arr: number[] = [];
            arr.length = len;
            for (let i: number = 0; i < len; ++i) {
                arr[i] = getRandomInt(-10, 10);
            }

            return arr;
        },
        name: "Subarray with Maximum Sum",
        numTries: 10,
        solver: (data: number[], ans: string) => {
            const nums: number[] = data.slice();
            for (let i: number = 1; i < nums.length; i++) {
                nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
            }

            return parseInt(ans, 10) === Math.max(...nums);
        },
    },
    {
        desc: (n: number) => {
            return ["It is possible write four as a sum in exactly four different ways:\n\n",
                    "    3 + 1\n",
                    "    2 + 2\n",
                    "    2 + 1 + 1\n",
                    "    1 + 1 + 1 + 1\n\n",
                    `How many different ways can ${n} be written as a sum of at least`,
                    "two positive integers?"].join(" ");
        },
        difficulty: 1.5,
        gen: () => {
            return getRandomInt(8, 100);
        },
        name: "Total Ways to Sum",
        numTries: 10,
        solver: (data: number, ans: string) => {
            const ways: number[] = [1];
            ways.length = data + 1;
            ways.fill(0, 1);
            for (let i: number = 1; i < data; ++i) {
                for (let j: number = i; j <= data; ++j) {
                    ways[j] += ways[j - i];
                }
            }

            return ways[data] === parseInt(ans, 10);
        },
    },
    {
        desc: (n: number[][]) => {
            let d: string = ["Given the following array of array of numbers representing a 2D matrix,",
                             "return the elements of the matrix as an array in spiral order:\n\n"].join(" ");
            for (const line of n) {
                d += `${line.toString()},\n`;
            }
            d += ["\nHere is an example of what spiral order should be:",
                  "\nExample:",
                  "    [\n",
                  "        [1, 2, 3],\n",
                  "        [4, 5, 6],\n",
                  "        [7, 8, 9]\n",
                  "    ] should result in [1, 2, 3, 6, 9, 8 ,7, 4, 5]\n\n",
                  "Note that the matrix will not always be square:\n",
                  "    [\n",
                  "        [1, 2, 3, 4]\n",
                  "        [5, 6, 7, 8]\n",
                  "        [9, 10, 11, 12]\n",
                  "    ] should result in [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7"].join(" ");

            return d;
        },
        difficulty: 2,
        gen: () => {
            const m: number = getRandomInt(1, 10);
            const n: number = getRandomInt(1, 10);
            const matrix: number[][] = [];
            matrix.length = m;
            for (let i: number = 0; i < m; ++i) {
                matrix[i] = [];
                matrix[i].length = n;
            }

            for (let i: number = 0; i < m; ++i) {
                for (let j: number = 0; j < n; ++j) {
                    matrix[i][j] = getRandomInt(1, 50);
                }
            }

            return matrix;
        },
        name: "Spiralize Matrix",
        numTries: 10,
        solver: (data: number[][], ans: string) => {
            const spiral: number[] = [];
            const m: number = data.length;
            const n: number = data[0].length;
            let u: number = 0;
            let d: number = m - 1;
            let l: number = 0;
            let r: number = n - 1;
            let k: number = 0;
            while (true) {
                // Up
                for (let col: number = l; col <= r; col++) {
                    spiral[k] = data[u][col];
                    ++k;
                }
                if (++u > d) { break; }

                // Right
                for (let row: number = u; row <= d; row++) {
                    spiral[k] = data[row][r];
                    ++k;
                }
                if (--r < l) { break; }

                // Down
                for (let col: number = r; col >= l; col--) {
                    spiral[k] = data[d][col];
                    ++k;
                }
                if (--d < u) { break; }

                // Left
                for (let row: number = d; row >= u; row--) {
                    spiral[k] = data[row][l];
                    ++k;
                }
                if (++l > r) { break; }
            }

            const sanitizedPlayerAns: string = removeBracketsFromArrayString(ans)
                                               .replace(/\s/g, "");
            const playerAns: any[] = sanitizedPlayerAns.split(",");
            for (let i: number = 0; i < playerAns.length; ++i) {
                playerAns[i] = parseInt(playerAns[i], 10);
            }
            if (spiral.length !== playerAns.length) { return false; }
            for (let i: number = 0; i < spiral.length; ++i) {
                if (spiral[i] !== playerAns[i]) {
                    return false;
                }
            }

            return true;
        },
    },
    {
        desc: (arr: number[]) => {
            return ["You are given the following array of integers:\n\n",
                    `${arr}\n\n`,
                    "Each element in the array represents your MAXIMUM jump length",
                    "at that position. This means that if you are at position i and your",
                    "maximum jump length is n, you can jump to any position from",
                    "i to i+n.",
                    "\n\nAssuming you are initially positioned",
                    "at the start of the array, determine whether you are",
                    "able to reach the last index exactly.\n\n",
                    "Your answer should be submitted as 1 or 0, representing true and false respectively"].join(" ");
        },
        difficulty: 2.5,
        gen: () => {
            const len: number = getRandomInt(1, 25);
            const arr: number[] = [];
            arr.length = len;
            for (let i: number = 0; i < arr.length; ++i) {
                if (Math.random() < 0.2) {
                    arr[i] = 0; // 20% chance of being 0
                } else {
                    arr[i] = getRandomInt(0, 24);
                }
            }

            return arr;
        },
        name: "Array Jumping Game",
        numTries: 1,
        solver: (data: number[], ans: string) => {
            const n: number = data.length;
            let i: number = 0;
            for (let reach: number = 0; i < n && i <= reach; ++i) {
                reach = Math.max(i + data[i], reach);
            }
            const solution: boolean = (i === n);

            if (ans === "1" && solution) { return true; }
            if (ans === "0" && !solution) { return true; }

            return false;
        },
    },
    {
        desc: (arr: number[][]) => {
            return ["Given the following array of array of numbers representing a list of",
                    "intervals, merge all overlapping intervals.\n\n",
                    `[${convert2DArrayToString(arr)}]\n\n`,
                    "Example:\n\n",
                    "[[1, 3], [8, 10], [2, 6], [10, 16]]\n\n",
                    "would merge into [[1, 6], [8, 16]].\n\n",
                    "The intervals must be returned in ASCENDING order.",
                    "You can assume that in an interval, the first number will always be",
                    "smaller than the second."].join(" ");
        },
        difficulty: 3,
        gen: () => {
            const intervals: number[][] = [];
            const numIntervals: number = getRandomInt(1, 20);
            for (let i: number = 0; i < numIntervals; ++i) {
                const start: number = getRandomInt(1, 25);
                const end: number = start + getRandomInt(1, 10);
                intervals.push([start, end]);
            }

            return intervals;
        },
        name: "Merge Overlapping Intervals",
        numTries: 15,
        solver: (data: number[][], ans: string) => {
            const intervals: number[][] = data.slice();
            intervals.sort((a: number[], b: number[]) => {
                return a[0] - b[0];
            });

            const result: number[][] = [];
            let start: number = intervals[0][0];
            let end: number = intervals[0][1];
            for (const interval of intervals) {
                if (interval[0] <= end) {
                    end = Math.max(end, interval[1]);
                } else {
                    result.push([start, end]);
                    start = interval[0];
                    end = interval[1];
                }
            }
            result.push([start, end]);

            const sanitizedResult: string = convert2DArrayToString(result);
            const sanitizedAns: string = ans.replace(/\s/g, "");

            return (sanitizedResult === sanitizedAns ||
                    sanitizedResult === removeBracketsFromArrayString(sanitizedAns));
        },
    },
    {
        desc: (data: string) => {
            return ["Given the following string containing only digits, return",
                    "an array with all possible valid IP address combinations",
                    "that can be created from the string:\n\n",
                    `${data}\n\n`,
                    "Note that an octet cannot begin with a '0' unless the number",
                    "itself is actually 0. For example, '192.168.010.1' is not a valid IP.\n\n",
                    "Examples:\n\n",
                    "25525511135 -> [255.255.11.135, 255.255.111.35]\n",
                    "1938718066 -> [193.87.180.66]"].join(" ");
        },
        difficulty: 3,
        gen: () => {
            let str: string = "";
            for (let i: number = 0; i < 4; ++i) {
                const num: number = getRandomInt(0, 255);
                const convNum: string = num.toString();
                str += convNum;
            }

            return str;
        },
        name: "Generate IP Addresses",
        numTries: 10,
        solver: (data: string, ans: string) => {
            const ret: string[] = [];
            for (let a: number = 1; a <= 3; ++a) {
                for (let b: number = 1; b <= 3; ++b) {
                    for (let c: number = 1; c <= 3; ++c) {
                        for (let d: number = 1; d <= 3; ++d) {
                            if (a + b + c + d === data.length) {
                                const A: number = parseInt(data.substring(0, a), 10);
                                const B: number = parseInt(data.substring(a, a + b), 10);
                                const C: number = parseInt(data.substring(a + b, a + b + c), 10);
                                const D: number = parseInt(data.substring(a + b + c, a + b + c + d), 10);
                                if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
                                    const ip: string = [A.toString(), ".",
                                                        B.toString(), ".",
                                                        C.toString(), ".",
                                                        D.toString()].join("");
                                    if (ip.length === data.length + 3) {
                                        ret.push(ip);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            const sanitizedAns: string = removeBracketsFromArrayString(ans)
                                         .replace(/\s/g, "");
            const ansArr: string[] = sanitizedAns.split(",");
            if (ansArr.length !== ret.length) { return false; }
            for (const ipInAns of ansArr) {
                if (!ret.includes(ipInAns)) { return false; }
            }

            return true;
        },
    },
    {
        desc: (data: number[]) => {
            return ["You are given the following array of stock prices where the i-th element",
                    "represents the stock price on day i:\n\n",
                    `${data}\n\n`,
                    "Determine the maximum possible profit you can earn using at most",
                    "one transaction (i.e. you can only buy and sell the stock once). If no profit can be made",
                    "then the answer should be 0. Note",
                    "that you have to buy the stock before you can sell it"].join(" ");
        },
        difficulty: 1,
        gen: () => {
            const len: number = getRandomInt(1, 50);
            const arr: number[] = [];
            arr.length = len;
            for (let i: number = 0; i < len; ++i) {
                arr[i] = getRandomInt(1, 200);
            }

            return arr;
        },
        name: "Algorithmic Stock Trader I",
        numTries: 5,
        solver: (data: number[], ans: string) => {
            let maxCur: number = 0;
            let maxSoFar: number = 0;
            for (let i: number = 1; i < data.length; ++i) {
                maxCur = Math.max(0, maxCur += data[i] - data[i - 1]);
                maxSoFar = Math.max(maxCur, maxSoFar);
            }

            return maxSoFar.toString() === ans;
        },
    },
    {
        desc: (data: number[]) => {
            return ["You are given the following array of stock prices where the i-th element",
                    "represents the stock price on day i:\n\n",
                    `${data}\n\n`,
                    "Determine the maximum possible profit you can earn using as many",
                    "transactions as you'd like. A transaction is defined as buying",
                    "and then selling one share of the stock. Note that you cannot",
                    "engage in multiple transactions at once. In other words, you",
                    "must sell the stock before you buy it again.\n\n",
                    "If no profit can be made, then the answer should be 0"].join(" ");
        },
        difficulty: 2,
        gen: () => {
            const len: number = getRandomInt(1, 50);
            const arr: number[] = [];
            arr.length = len;
            for (let i: number = 0; i < len; ++i) {
                arr[i] = getRandomInt(1, 200);
            }

            return arr;
        },
        name: "Algorithmic Stock Trader II",
        numTries: 10,
        solver: (data: number[], ans: string) => {
            let profit: number = 0;
            for (let p: number = 1; p < data.length; ++p) {
                profit += Math.max(data[p] - data[p - 1], 0);
            }

            return profit.toString() === ans;
        },
    },
    {
        desc: (data: number[]) => {
            return ["You are given the following array of stock prices where the i-th element",
                    "represents the stock price on day i:\n\n",
                    `${data}\n\n`,
                    "Determine the maximum possible profit you can earn using at most",
                    "two transactions. A transaction is defined as buying",
                    "and then selling one share of the stock. Note that you cannot",
                    "engage in multiple transactions at once. In other words, you",
                    "must sell the stock before you buy it again.\n\n",
                    "If no profit can be made, then the answer should be 0"].join(" ");
        },
        difficulty: 5,
        gen: () => {
            const len: number = getRandomInt(1, 50);
            const arr: number[] = [];
            arr.length = len;
            for (let i: number = 0; i < len; ++i) {
                arr[i] = getRandomInt(1, 200);
            }

            return arr;
        },
        name: "Algorithmic Stock Trader III",
        numTries: 10,
        solver: (data: number[], ans: string) => {
            let hold1: number = Number.MIN_SAFE_INTEGER;
            let hold2: number = Number.MIN_SAFE_INTEGER;
            let release1: number = 0;
            let release2: number = 0;
            for (const price of data) {
                release2    = Math.max(release2, hold2 + price);
                hold2       = Math.max(hold2, release1 - price);
                release1    = Math.max(release1, hold1 + price);
                hold1       = Math.max(hold1, price * -1);
            }

            return release2.toString() === ans;
        },
    },
];
