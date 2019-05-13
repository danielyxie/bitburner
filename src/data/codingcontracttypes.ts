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

function removeQuotesFromString(str: string) {
    let strCpy: string = str;
    if (strCpy.startsWith('"') || strCpy.startsWith("'")) { strCpy = strCpy.slice(1); }
    if (strCpy.endsWith('"') || strCpy.endsWith("'")) { strCpy = strCpy.slice(0, -1); }

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
            while (Math.sqrt(n) > fac-1) {
                while (n % fac === 0) {
                    n = Math.round(n / fac);
                } else {
                    ++fac;
                }
            }

            return (n===1?(fac-1):n) === parseInt(ans, 10);
        },
    },
    {
        desc: (n: number[]) => {
            return ["Given the following integer array, find the contiguous subarray",
                    "(containing at least one number) which has the largest sum and return that sum.",
                    "'Sum' refers to the sum of all the numbers in the subarray.\n",
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
                    `How many different ways can the number ${n} be written as a sum of at least`,
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
            const m: number = getRandomInt(1, 15);
            const n: number = getRandomInt(1, 15);
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
                    arr[i] = getRandomInt(0, 10);
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
            return ["You are given the following array of stock prices (which are numbers)",
                    "where the i-th element represents the stock price on day i:\n\n",
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
            return ["You are given the following array of stock prices (which are numbers)",
                    "where the i-th element represents the stock price on day i:\n\n",
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
            return ["You are given the following array of stock prices (which are numbers)",
                    "where the i-th element represents the stock price on day i:\n\n",
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
    {
        desc: (data: any[]) => {
            const k: number = (<number>data[0]);
            const prices: number[] = (<number[]>data[1]);
            return ["You are given the following array with two elements:\n\n",
                    `[${k}, [${prices}]]\n\n`,
                    "The first element is an integer k. The second element is an",
                    "array of stock prices (which are numbers) where the i-th element",
                    "represents the stock price on day i.\n\n",
                    "Determine the maximum possible profit you can earn using at most",
                    "k transactions. A transaction is defined as buying and then selling",
                    "one share of the stock. Note that you cannot engage in multiple",
                    "transactions at once. In other words, you must sell the stock before",
                    "you can buy it again.\n\n",
                    "If no profit can be made, then the answer should be 0."].join(" ");
        },
        difficulty: 8,
        gen: () => {
            const k: number = getRandomInt(2, 10);
            const len: number = getRandomInt(1, 50);
            const prices: number[] = [];
            prices.length = len;
            for (let i = 0; i < len; ++i) {
                prices[i] = getRandomInt(1, 200);
            }

            return [k, prices];
        },
        name: "Algorithmic Stock Trader IV",
        numTries: 10,
        solver: (data: any[], ans: string) => {
            const k: number = (<number>data[0]);
            const prices: number[] = (<number[]>data[1]);

            const len = prices.length;
            if (len < 2) { return (parseInt(ans) === 0); }
            if (k > len / 2) {
                let res: number = 0;
                for (let i = 1; i < len; ++i) {
                    res += Math.max(prices[i] - prices[i-1], 0);
                }

                return (parseInt(ans) === res);
            }

            const hold: number[] = [];
            const rele: number[] = [];
            hold.length = k + 1;
            rele.length = k + 1;
            for (let i = 0; i <= k; ++i) {
                hold[i] = Number.MIN_SAFE_INTEGER;
                rele[i] = 0;
            }

            let cur: number;
            for (let i = 0; i < len; ++i) {
                cur = prices[i];
                for (let j = k; j > 0; --j) {
                    rele[j] = Math.max(rele[j], hold[j] + cur);
                    hold[j] = Math.max(hold[j], rele[j-1] - cur);
                }
            }

            return (parseInt(ans) === rele[k]);
        },
    },
    {
        desc: (data: number[][]) => {
            function createTriangleRecurse(data: number[][], level: number = 0): string {
                const numLevels: number = data.length;
                if (level >= numLevels) { return ""; }
                const numSpaces = numLevels - level + 1;

                let str: string = ["&nbsp;".repeat(numSpaces), "[", data[level].toString(), "]"].join("");
                if (level < numLevels - 1) {
                    str += ",";
                }

                return str + "\n" + createTriangleRecurse(data, level+1);
            }

            function createTriangle(data: number[][]) {
                return ["[\n", createTriangleRecurse(data), "]"].join("");
            }

            const triangle = createTriangle(data);

            return ["Given a triangle, find the minimum path sum from top to bottom. In each step",
                    "of the path, you may only move to adjacent numbers in the row below.",
                    "The triangle is represented as a 2D array of numbers:\n\n",
                    `${triangle}\n\n`,
                    "Example: If you are given the following triangle:\n\n" +
                    "[\n",
                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2],\n",
                    "&nbsp;&nbsp;&nbsp;&nbsp;[3,4],\n",
                    "&nbsp;&nbsp;&nbsp;[6,5,7],\n",
                    "&nbsp;&nbsp;[4,1,8,3]\n",
                    "]\n\n",
                    "The minimum path sum is 11 (2 -> 3 -> 5 -> 1)."].join(" ");
        },
        difficulty: 5,
        gen: () => {
            const triangle: number[][] = [];
            const levels: number = getRandomInt(1, 12);
            triangle.length = levels;

            for (let row = 0; row < levels; ++row) {
                triangle[row] = [];
                triangle[row].length = row + 1;
                for (let i = 0; i < triangle[row].length; ++i) {
                    triangle[row][i] = getRandomInt(1, 9);
                }
            }

            return triangle;
        },
        name: "Minimum Path Sum in a Triangle",
        numTries: 10,
        solver: (data: number[][], ans: string) => {
            let n: number = data.length;
            let dp: number[] = data[n-1].slice();
            for (let i = n-2; i > -1; --i) {
                for (let j = 0; j < data[i].length; ++j) {
                    dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j];
                }
            }

            return dp[0] === parseInt(ans);
        },
    },
    {
        desc: (data: number[]) => {
            const numRows = data[0];
            const numColumns  = data[1];
            return ["You are in a grid with",
                    `${numRows} rows and ${numColumns} columns, and you are`,
                    "positioned in the top-left corner of that grid. You are trying to",
                    "reach the bottom-right corner of the grid, but you can only",
                    "move down or right on each step. Determine how many",
                    "unique paths there are from start to finish.\n\n",
                    "NOTE: The data returned for this contract is an array",
                    "with the number of rows and columns:\n\n",
                    `[${numRows}, ${numColumns}]`].join(" ");
        },
        difficulty: 3,
        gen: () => {
            const numRows: number = getRandomInt(1, 14);
            const numColumns: number = getRandomInt(1, 14);

            return [numRows, numColumns];
        },
        name: "Unique Paths in a Grid I",
        numTries: 10,
        solver: (data: number[], ans: string) => {
            let n: number = data[0]; // Number of rows
            let m: number = data[1]; // Number of columns
            let currentRow: number[] = [];
            currentRow.length = n;

            for (let i = 0; i < n; i++) {
                currentRow[i] = 1;
            }
            for (let row = 1; row < m; row++) {
                for (let i = 1; i < n; i++) {
                    currentRow[i] += currentRow[i - 1];
                }
            }

            return parseInt(ans) === currentRow[n - 1];
        },
    },
    {
        desc: (data: number[][]) => {
            let gridString: string = "";
            for (const line of data) {
                gridString += `${line.toString()},\n`;
            }
            return ["You are located in the top-left corner of the following grid:\n\n",
                    `${gridString}\n`,
                    "You are trying reach the bottom-right corner of the grid, but you can only",
                    "move down or right on each step. Furthermore, there are obstacles on the grid",
                    "that you cannot move onto. These obstacles are denoted by '1', while empty",
                    "spaces are denoted by 0.\n\n",
                    "Determine how many unique paths there are from start to finish.\n\n",
                    "NOTE: The data returned for this contract is an 2D array of numbers representing the grid."].join(" ");
        },
        difficulty: 5,
        gen: () => {
            const numRows: number = getRandomInt(1, 12);
            const numColumns: number = getRandomInt(1, 12);

            const grid: number[][] = [];
            grid.length = numRows;
            for (let i = 0; i < numRows; ++i) {
                grid[i] = [];
                grid[i].length = numColumns;
                grid[i].fill(0);
            }

            for (let r = 0; r < numRows; ++r) {
                for (let c = 0; c < numColumns; ++c) {
                    if (r === 0 && c === 0) { continue; }
                    if (r === numRows - 1 && c === numColumns - 1) { continue; }

                    // 15% chance of an element being an obstacle
                    if (Math.random() < 0.15) {
                        grid[r][c] = 1;
                    }
                }
            }

            return grid;
        },
        name: "Unique Paths in a Grid II",
        numTries: 10,
        solver: (data: number[][], ans: string) => {
            let obstacleGrid: number[][] = [];
            obstacleGrid.length = data.length;
            for (let i = 0; i < obstacleGrid.length; ++i) {
                obstacleGrid[i] = data[i].slice();
            }

            for (let i = 0; i < obstacleGrid.length; i++) {
                for (let j = 0; j < obstacleGrid[0].length; j++) {
                    if (obstacleGrid[i][j] == 1) {
                        obstacleGrid[i][j] = 0;
                    } else if (i==0 && j==0) {
                        obstacleGrid[0][0] = 1;
                    } else {
                        obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i-1][j] : 0) + ( j > 0 ? obstacleGrid[i][j-1] : 0);
                    }

                }
            }

            return (obstacleGrid[obstacleGrid.length -1][obstacleGrid[0].length-1] === parseInt(ans));
        },
    },
    {
        desc: (data: string) => {
            return ["Given the following string:\n\n",
                    `${data}\n\n`,
                    "remove the minimum number of invalid parentheses in order to validate",
                    "the string. If there are multiple minimal ways to validate the string,",
                    "provide all of the possible results. The answer should be provided",
                    "as an array of strings. If it is impossible to validate the string",
                    "the result should be an array with only an empty string.\n\n",
                    "IMPORTANT: The string may contain letters, not just parentheses.",
                    `Examples:\n`,
                    `"()())()" -> ["()()()", "(())()"]\n`,
                    `"(a)())()" -> ["(a)()()", "(a())()"]\n`,
                    `")( -> [""]`].join(" ");
        },
        difficulty: 10,
        gen: () => {
            const len: number = getRandomInt(2, 20);
            let chars: string[] = [];
            chars.length = len;

            // 80% chance of the first parenthesis being (
            Math.random() < 0.8 ? chars[0] = "(" : chars[0] = ")";

            for (let i = 1; i < len; ++i) {
                const roll = Math.random();
                if (roll < 0.4) {
                    chars[i] = "(";
                } else if (roll < 0.8) {
                    chars[i] = ")";
                } else {
                    chars[i] = "a";
                }
            }

            return chars.join("");
        },
        name: "Sanitize Parentheses in Expression",
        numTries: 10,
        solver: (data: string, ans: string) => {
            let left = 0;
            let right = 0;
            let res: string[] = [];

            for (let i = 0; i < data.length; ++i) {
                if (data[i] === '(') {
                    ++left;
                } else if (data[i] === ')') {
                    (left > 0) ? --left : ++right;
                }
            }

            function dfs(pair: number, index: number, left: number, right: number, s: string, solution: string, res: string[]) {
                if (s.length === index) {
                    if (left === 0 && right === 0 && pair === 0) {
                        for(var i = 0; i < res.length; i++) {
                            if(res[i] === solution) { return; }
                        }
                        res.push(solution);
                    }
                    return;
                }

                if (s[index] === '(') {
                    if (left > 0) {
                        dfs(pair, index + 1, left - 1, right, s, solution, res);
                    }
                    dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
                } else if (s[index] === ')') {
                    if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
                    if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
                } else {
                    dfs(pair, index + 1, left, right, s, solution + s[index], res);
                }
            }

            dfs(0, 0, left, right, data, "", res);

            const sanitizedPlayerAns = removeBracketsFromArrayString(ans)
                                       .replace(/\s/g, "");

            const playerAnsArray: string[] = sanitizedPlayerAns.split(",");
            if (playerAnsArray.length !== res.length) { return false; }
            for (const resultInAnswer of res) {
                if (!playerAnsArray.includes(resultInAnswer)) { return false; }
            }

            return true;
        },
    },
    {
        desc: (data: any[]) => {
            const digits: string = data[0];
            const target: number = data[1];

            return ["You are given the following string which contains only digits between 0 and 9:\n\n",
                    `${digits}\n\n`,
                    `You are also given a target number of ${target}. Return all possible ways`,
                    "you can add the +, -, and * operators to the string such that it evaluates",
                    "to the target number.\n\n",
                    "The provided answer should be an array of strings containing the valid expressions.",
                    "The data provided by this problem is an array with two elements. The first element",
                    "is the string of digits, while the second element is the target number:\n\n",
                    `["${digits}", ${target}]\n\n`,
                    "Examples:\n\n",
                    `Input: digits = "123", target = 6\n`,
                    `Output: ["1+2+3", "1*2*3"]\n\n`,
                    `Input: digits = "105", target = 5\n`,
                    `Output: ["1*0+5", "10-5"]`].join(" ");
        },
        difficulty: 10,
        gen: () => {
            const numDigits = getRandomInt(4, 12);
            const digitsArray: string[] = [];
            digitsArray.length = numDigits;
            for (let i = 0; i < digitsArray.length; ++i) {
                if (i === 0) {
                    digitsArray[i] = String(getRandomInt(1, 9));
                } else {
                    digitsArray[i] = String(getRandomInt(0, 9));
                }
            }

            const target: number = getRandomInt(-100, 100);
            const digits: string = digitsArray.join("");

            return [digits, target];
        },
        name: "Find All Valid Math Expressions",
        numTries: 10,
        solver: (data: any[], ans: string) => {
            const num: string = data[0];
            const target: number = data[1];

            function helper(res: string[], path: string, num: string, target: number, pos: number, evaluated: number, multed: number) {
                if (pos === num.length) {
                    if (target === evaluated) {
                        res.push(path);
                    }
                    return;
                }

                for (let i = pos; i < num.length; ++i) {
                    if (i != pos && num[pos] == '0') { break; }
                    let cur = parseInt(num.substring(pos, i+1));

                    if (pos === 0) {
                        helper(res, path + cur, num, target, i + 1, cur, cur);
                    } else {
                        helper(res, path + "+" + cur, num, target, i + 1, evaluated + cur, cur);
                        helper(res, path + "-" + cur, num, target, i + 1, evaluated - cur, -cur);
                        helper(res, path + "*" + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
                    }
                }
            }

            const sanitizedPlayerAns: string = removeBracketsFromArrayString(ans);
            const sanitizedPlayerAnsArr: string[] = sanitizedPlayerAns.split(",");
            for (let i = 0; i < sanitizedPlayerAnsArr.length; ++i) {
                sanitizedPlayerAnsArr[i] = removeQuotesFromString(sanitizedPlayerAnsArr[i])
                                           .replace(/\s/g, "");;
            }

            if (num == null || num.length === 0) {
                if (sanitizedPlayerAnsArr.length === 0) { return true; }
                if (sanitizedPlayerAnsArr.length === 1 && sanitizedPlayerAnsArr[0] === "") { return true; }
                return false;
            }

            let result: string[] = [];
            helper(result, "", num, target, 0, 0, 0);

            for (const expr of result) {
                if (!sanitizedPlayerAnsArr.includes(expr)) {
                    return false;
                }
            }

            return true;
        },
    },
];
