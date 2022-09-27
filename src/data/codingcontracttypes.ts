import { getRandomInt } from "../utils/helpers/getRandomInt";
import { MinHeap } from "../utils/Heap";

import { comprGenChar, comprLZGenerate, comprLZEncode, comprLZDecode } from "../utils/CompressionContracts";
import { HammingEncode, HammingDecode, HammingEncodeProperly } from "../utils/HammingCodeTools";
/* tslint:disable:completed-docs no-magic-numbers arrow-return-shorthand */

/* Function that generates a valid 'data' for a contract type */
export type GeneratorFunc = () => unknown;

/* Function that checks if the provided solution is the correct one */
export type SolverFunc = (data: unknown, answer: string) => boolean;

/* Function that returns a string with the problem's description.
   Requires the 'data' of a Contract as input */
export type DescriptionFunc = (data: unknown) => string;

interface ICodingContractTypeMetadata {
  desc: DescriptionFunc;
  difficulty: number;
  gen: GeneratorFunc;
  name: string;
  numTries: number;
  solver: SolverFunc;
}

/* Helper functions for Coding Contract implementations */
function removeBracketsFromArrayString(str: string): string {
  let strCpy: string = str;
  if (strCpy.startsWith("[")) {
    strCpy = strCpy.slice(1);
  }
  if (strCpy.endsWith("]")) {
    strCpy = strCpy.slice(0, -1);
  }

  return strCpy;
}

function removeQuotesFromString(str: string): string {
  let strCpy: string = str;
  if (strCpy.startsWith('"') || strCpy.startsWith("'")) {
    strCpy = strCpy.slice(1);
  }
  if (strCpy.endsWith('"') || strCpy.endsWith("'")) {
    strCpy = strCpy.slice(0, -1);
  }

  return strCpy;
}

function convert2DArrayToString(arr: unknown[][]): string {
  const components: string[] = [];
  arr.forEach((e: unknown) => {
    let s = String(e);
    s = ["[", s, "]"].join("");
    components.push(s);
  });

  return components.join(",").replace(/\s/g, "");
}

export const codingContractTypesMetadata: ICodingContractTypeMetadata[] = [
  {
    desc: (n: unknown): string => {
      return ["A prime factor is a factor that is a prime number.", `What is the largest prime factor of ${n}?`].join(
        " ",
      );
    },
    difficulty: 1,
    gen: (): number => {
      return getRandomInt(500, 1e9);
    },
    name: "Find Largest Prime Factor",
    numTries: 10,
    solver: (data: unknown, ans: string): boolean => {
      if (typeof data !== "number") throw new Error("solver expected number");
      let fac = 2;
      let n: number = data;
      while (n > (fac - 1) * (fac - 1)) {
        while (n % fac === 0) {
          n = Math.round(n / fac);
        }
        ++fac;
      }

      return (n === 1 ? fac - 1 : n) === parseInt(ans, 10);
    },
  },
  {
    desc: (_n: unknown): string => {
      const n = _n as number[];
      return [
        "Given the following integer array, find the contiguous subarray",
        "(containing at least one number) which has the largest sum and return that sum.",
        "'Sum' refers to the sum of all the numbers in the subarray.\n",
        `${n.toString()}`,
      ].join(" ");
    },
    difficulty: 1,
    gen: (): number[] => {
      const len: number = getRandomInt(5, 40);
      const arr: number[] = [];
      arr.length = len;
      for (let i = 0; i < len; ++i) {
        arr[i] = getRandomInt(-10, 10);
      }

      return arr;
    },
    name: "Subarray with Maximum Sum",
    numTries: 10,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[];
      const nums: number[] = data.slice();
      for (let i = 1; i < nums.length; i++) {
        nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
      }

      return parseInt(ans, 10) === Math.max(...nums);
    },
  },
  {
    desc: (n: unknown): string => {
      if (typeof n !== "number") throw new Error("solver expected number");
      return [
        "It is possible write four as a sum in exactly four different ways:\n\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;3 + 1\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;2 + 2\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;2 + 1 + 1\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;1 + 1 + 1 + 1\n\n",
        `How many different distinct ways can the number ${n} be written as a sum of at least`,
        "two positive integers?",
      ].join(" ");
    },
    difficulty: 1.5,
    gen: (): number => {
      return getRandomInt(8, 100);
    },
    name: "Total Ways to Sum",
    numTries: 10,
    solver: (data: unknown, ans: string): boolean => {
      if (typeof data !== "number") throw new Error("solver expected number");
      const ways: number[] = [1];
      ways.length = data + 1;
      ways.fill(0, 1);
      for (let i = 1; i < data; ++i) {
        for (let j: number = i; j <= data; ++j) {
          ways[j] += ways[j - i];
        }
      }

      return ways[data] === parseInt(ans, 10);
    },
  },
  {
    desc: (_data: unknown): string => {
      const data = _data as [number, number[]];
      const n: number = data[0];
      const s: number[] = data[1];
      return [
        `How many different distinct ways can the number ${n} be written`,
        "as a sum of integers contained in the set:\n\n",
        `[${s}]?\n\n`,
        "You may use each integer in the set zero or more times.",
      ].join(" ");
    },
    difficulty: 2,
    gen: (): [number, number[]] => {
      const n: number = getRandomInt(12, 200);
      const maxLen: number = getRandomInt(8, 12);
      const s: number[] = [];
      // Bias towards small numbers is intentional to have much bigger answers in general
      // to force people better optimize their solutions
      for (let i = 1; i <= n; i++) {
        if (s.length == maxLen) {
          break;
        }
        if (Math.random() < 0.6 || n - i < maxLen - s.length) {
          s.push(i);
        }
      }
      return [n, s];
    },
    name: "Total Ways to Sum II",
    numTries: 10,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as [number, number[]];
      // https://www.geeksforgeeks.org/coin-change-dp-7/?ref=lbp
      const n = data[0];
      const s = data[1];
      const ways: number[] = [1];
      ways.length = n + 1;
      ways.fill(0, 1);
      for (let i = 0; i < s.length; i++) {
        for (let j = s[i]; j <= n; j++) {
          ways[j] += ways[j - s[i]];
        }
      }
      return ways[n] === parseInt(ans, 10);
    },
  },
  {
    desc: (_n: unknown): string => {
      const n = _n as number[][];
      let d: string = [
        "Given the following array of arrays of numbers representing a 2D matrix,",
        "return the elements of the matrix as an array in spiral order:\n\n",
      ].join(" ");
      // for (const line of n) {
      //   d += `${line.toString()},\n`;
      // }
      d += "&nbsp;&nbsp;&nbsp;&nbsp;[\n";
      d += n
        .map(
          (line: number[]) =>
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[" +
            line.map((x: number) => `${x}`.padStart(2, " ")).join(",") +
            "]",
        )
        .join("\n");
      d += "\n&nbsp;&nbsp;&nbsp;&nbsp;]\n";
      d += [
        "\nHere is an example of what spiral order should be:\n\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;[\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, 2, 3]\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4, 5, 6]\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[7, 8, 9]\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;]\n\n",
        "Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]\n\n",
        "Note that the matrix will not always be square:\n\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;[\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1,&nbsp;&nbsp;2,&nbsp;&nbsp;3,&nbsp;&nbsp;4]\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5,&nbsp;&nbsp;6,&nbsp;&nbsp;7,&nbsp;&nbsp;8]\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[9,&nbsp;10,&nbsp;11,&nbsp;12]\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;]\n\n",
        "Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]",
      ].join(" ");

      return d;
    },
    difficulty: 2,
    gen: (): number[][] => {
      const m: number = getRandomInt(1, 15);
      const n: number = getRandomInt(1, 15);
      const matrix: number[][] = [];
      matrix.length = m;
      for (let i = 0; i < m; ++i) {
        matrix[i] = [];
        matrix[i].length = n;
      }

      for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
          matrix[i][j] = getRandomInt(1, 50);
        }
      }

      return matrix;
    },
    name: "Spiralize Matrix",
    numTries: 10,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[][];
      const spiral: number[] = [];
      const m: number = data.length;
      const n: number = data[0].length;
      let u = 0;
      let d: number = m - 1;
      let l = 0;
      let r: number = n - 1;
      let k = 0;
      while (true) {
        // Up
        for (let col: number = l; col <= r; col++) {
          spiral[k] = data[u][col];
          ++k;
        }
        if (++u > d) {
          break;
        }

        // Right
        for (let row: number = u; row <= d; row++) {
          spiral[k] = data[row][r];
          ++k;
        }
        if (--r < l) {
          break;
        }

        // Down
        for (let col: number = r; col >= l; col--) {
          spiral[k] = data[d][col];
          ++k;
        }
        if (--d < u) {
          break;
        }

        // Left
        for (let row: number = d; row >= u; row--) {
          spiral[k] = data[row][l];
          ++k;
        }
        if (++l > r) {
          break;
        }
      }

      const sanitizedPlayerAns = removeBracketsFromArrayString(ans).replace(/\s/g, "");
      const playerAns = sanitizedPlayerAns.split(",").map((s) => parseInt(s));
      if (spiral.length !== playerAns.length) {
        return false;
      }
      for (let i = 0; i < spiral.length; ++i) {
        if (spiral[i] !== playerAns[i]) {
          return false;
        }
      }

      return true;
    },
  },
  {
    desc: (_arr: unknown): string => {
      const arr = _arr as number[];
      return [
        "You are given the following array of integers:\n\n",
        `${arr}\n\n`,
        "Each element in the array represents your MAXIMUM jump length",
        "at that position. This means that if you are at position i and your",
        "maximum jump length is n, you can jump to any position from",
        "i to i+n.",
        "\n\nAssuming you are initially positioned",
        "at the start of the array, determine whether you are",
        "able to reach the last index.\n\n",
        "Your answer should be submitted as 1 or 0, representing true and false respectively",
      ].join(" ");
    },
    difficulty: 2.5,
    gen: (): number[] => {
      const len: number = getRandomInt(3, 25);
      const arr: number[] = [];
      arr.length = len;
      for (let i = 0; i < arr.length; ++i) {
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
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[];
      const n: number = data.length;
      let i = 0;
      for (let reach = 0; i < n && i <= reach; ++i) {
        reach = Math.max(i + data[i], reach);
      }
      const solution: boolean = i === n;
      return (ans === "1" && solution) || (ans === "0" && !solution);
    },
  },
  {
    desc: (_arr: unknown): string => {
      const arr = _arr as number[];
      return [
        "You are given the following array of integers:\n\n",
        `${arr}\n\n`,
        "Each element in the array represents your MAXIMUM jump length",
        "at that position. This means that if you are at position i and your",
        "maximum jump length is n, you can jump to any position from",
        "i to i+n.",
        "\n\nAssuming you are initially positioned",
        "at the start of the array, determine the minimum number of",
        "jumps to reach the end of the array.\n\n",
        "If it's impossible to reach the end, then the answer should be 0.",
      ].join(" ");
    },
    difficulty: 3,
    gen: (): number[] => {
      const len: number = getRandomInt(3, 25);
      const arr: number[] = [];
      arr.length = len;
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < 10; j++) {
          if (Math.random() <= j / 10 + 0.1) {
            arr[i] = j;
            break;
          }
        }
      }

      return arr;
    },
    name: "Array Jumping Game II",
    numTries: 3,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[];
      const n: number = data.length;
      let reach = 0;
      let jumps = 0;
      let lastJump = -1;
      while (reach < n - 1) {
        let jumpedFrom = -1;
        for (let i = reach; i > lastJump; i--) {
          if (i + data[i] > reach) {
            reach = i + data[i];
            jumpedFrom = i;
          }
        }
        if (jumpedFrom === -1) {
          jumps = 0;
          break;
        }
        lastJump = jumpedFrom;
        jumps++;
      }
      return jumps === parseInt(ans, 10);
    },
  },
  {
    desc: (_arr: unknown): string => {
      const arr = _arr as number[][];
      return [
        "Given the following array of arrays of numbers representing a list of",
        "intervals, merge all overlapping intervals.\n\n",
        `[${convert2DArrayToString(arr)}]\n\n`,
        "Example:\n\n",
        "[[1, 3], [8, 10], [2, 6], [10, 16]]\n\n",
        "would merge into [[1, 6], [8, 16]].\n\n",
        "The intervals must be returned in ASCENDING order.",
        "You can assume that in an interval, the first number will always be",
        "smaller than the second.",
      ].join(" ");
    },
    difficulty: 3,
    gen: (): number[][] => {
      const intervals: number[][] = [];
      const numIntervals: number = getRandomInt(3, 20);
      for (let i = 0; i < numIntervals; ++i) {
        const start: number = getRandomInt(1, 25);
        const end: number = start + getRandomInt(1, 10);
        intervals.push([start, end]);
      }

      return intervals;
    },
    name: "Merge Overlapping Intervals",
    numTries: 15,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[][];
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

      return sanitizedResult === sanitizedAns || sanitizedResult === removeBracketsFromArrayString(sanitizedAns);
    },
  },
  {
    desc: (data: unknown): string => {
      return [
        "Given the following string containing only digits, return",
        "an array with all possible valid IP address combinations",
        "that can be created from the string:\n\n",
        `${data}\n\n`,
        "Note that an octet cannot begin with a '0' unless the number",
        "itself is actually 0. For example, '192.168.010.1' is not a valid IP.\n\n",
        "Examples:\n\n",
        "25525511135 -> [\"255.255.11.135\", \"255.255.111.35\"]\n",
        "1938718066 -> [\"193.87.180.66\"]",
      ].join(" ");
    },
    difficulty: 3,
    gen: (): string => {
      let str = "";
      for (let i = 0; i < 4; ++i) {
        const num: number = getRandomInt(0, 255);
        const convNum: string = num.toString();
        str += convNum;
      }

      return str;
    },
    name: "Generate IP Addresses",
    numTries: 10,
    solver: (data: unknown, ans: string): boolean => {
      if (typeof data !== "string") throw new Error("solver expected string");
      const ret: string[] = [];
      for (let a = 1; a <= 3; ++a) {
        for (let b = 1; b <= 3; ++b) {
          for (let c = 1; c <= 3; ++c) {
            for (let d = 1; d <= 3; ++d) {
              if (a + b + c + d === data.length) {
                const A = parseInt(data.substring(0, a), 10);
                const B = parseInt(data.substring(a, a + b), 10);
                const C = parseInt(data.substring(a + b, a + b + c), 10);
                const D = parseInt(data.substring(a + b + c, a + b + c + d), 10);
                if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
                  const ip: string = [A.toString(), ".", B.toString(), ".", C.toString(), ".", D.toString()].join("");
                  if (ip.length === data.length + 3) {
                    ret.push(ip);
                  }
                }
              }
            }
          }
        }
      }

      const sanitizedAns: string = removeBracketsFromArrayString(ans).replace(/\s/g, "");
      const ansArr: string[] = sanitizedAns.split(",").map((ip) => ip.replace(/^"|"$/g, ""));
      if (ansArr.length !== ret.length) {
        return false;
      }
      for (const ipInAns of ansArr) {
        if (!ret.includes(ipInAns)) {
          return false;
        }
      }

      return true;
    },
  },
  {
    desc: (_data: unknown): string => {
      const data = _data as number[];
      return [
        "You are given the following array of stock prices (which are numbers)",
        "where the i-th element represents the stock price on day i:\n\n",
        `${data}\n\n`,
        "Determine the maximum possible profit you can earn using at most",
        "one transaction (i.e. you can only buy and sell the stock once). If no profit can be made",
        "then the answer should be 0. Note",
        "that you have to buy the stock before you can sell it",
      ].join(" ");
    },
    difficulty: 1,
    gen: (): number[] => {
      const len: number = getRandomInt(3, 50);
      const arr: number[] = [];
      arr.length = len;
      for (let i = 0; i < len; ++i) {
        arr[i] = getRandomInt(1, 200);
      }

      return arr;
    },
    name: "Algorithmic Stock Trader I",
    numTries: 5,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[];
      let maxCur = 0;
      let maxSoFar = 0;
      for (let i = 1; i < data.length; ++i) {
        maxCur = Math.max(0, (maxCur += data[i] - data[i - 1]));
        maxSoFar = Math.max(maxCur, maxSoFar);
      }

      return maxSoFar.toString() === ans;
    },
  },
  {
    desc: (_data: unknown): string => {
      const data = _data as number[];
      return [
        "You are given the following array of stock prices (which are numbers)",
        "where the i-th element represents the stock price on day i:\n\n",
        `${data}\n\n`,
        "Determine the maximum possible profit you can earn using as many",
        "transactions as you'd like. A transaction is defined as buying",
        "and then selling one share of the stock. Note that you cannot",
        "engage in multiple transactions at once. In other words, you",
        "must sell the stock before you buy it again.\n\n",
        "If no profit can be made, then the answer should be 0",
      ].join(" ");
    },
    difficulty: 2,
    gen: (): number[] => {
      const len: number = getRandomInt(3, 50);
      const arr: number[] = [];
      arr.length = len;
      for (let i = 0; i < len; ++i) {
        arr[i] = getRandomInt(1, 200);
      }

      return arr;
    },
    name: "Algorithmic Stock Trader II",
    numTries: 10,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[];
      let profit = 0;
      for (let p = 1; p < data.length; ++p) {
        profit += Math.max(data[p] - data[p - 1], 0);
      }

      return profit.toString() === ans;
    },
  },
  {
    desc: (_data: unknown): string => {
      const data = _data as number[];
      return [
        "You are given the following array of stock prices (which are numbers)",
        "where the i-th element represents the stock price on day i:\n\n",
        `${data}\n\n`,
        "Determine the maximum possible profit you can earn using at most",
        "two transactions. A transaction is defined as buying",
        "and then selling one share of the stock. Note that you cannot",
        "engage in multiple transactions at once. In other words, you",
        "must sell the stock before you buy it again.\n\n",
        "If no profit can be made, then the answer should be 0",
      ].join(" ");
    },
    difficulty: 5,
    gen: (): number[] => {
      const len: number = getRandomInt(3, 50);
      const arr: number[] = [];
      arr.length = len;
      for (let i = 0; i < len; ++i) {
        arr[i] = getRandomInt(1, 200);
      }

      return arr;
    },
    name: "Algorithmic Stock Trader III",
    numTries: 10,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[];
      let hold1 = Number.MIN_SAFE_INTEGER;
      let hold2 = Number.MIN_SAFE_INTEGER;
      let release1 = 0;
      let release2 = 0;
      for (const price of data) {
        release2 = Math.max(release2, hold2 + price);
        hold2 = Math.max(hold2, release1 - price);
        release1 = Math.max(release1, hold1 + price);
        hold1 = Math.max(hold1, price * -1);
      }

      return release2.toString() === ans;
    },
  },
  {
    desc: (_data: unknown): string => {
      const data = _data as [number, number[]];
      const k = data[0];
      const prices = data[1];
      return [
        "You are given the following array with two elements:\n\n",
        `[${k}, [${prices}]]\n\n`,
        "The first element is an integer k. The second element is an",
        "array of stock prices (which are numbers) where the i-th element",
        "represents the stock price on day i.\n\n",
        "Determine the maximum possible profit you can earn using at most",
        "k transactions. A transaction is defined as buying and then selling",
        "one share of the stock. Note that you cannot engage in multiple",
        "transactions at once. In other words, you must sell the stock before",
        "you can buy it again.\n\n",
        "If no profit can be made, then the answer should be 0.",
      ].join(" ");
    },
    difficulty: 8,
    gen: (): [number, number[]] => {
      const k = getRandomInt(2, 10);
      const len = getRandomInt(3, 50);
      const prices: number[] = [];
      prices.length = len;
      for (let i = 0; i < len; ++i) {
        prices[i] = getRandomInt(1, 200);
      }

      return [k, prices];
    },
    name: "Algorithmic Stock Trader IV",
    numTries: 10,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as [number, number[]];
      const k: number = data[0];
      const prices: number[] = data[1];

      const len = prices.length;
      if (len < 2) {
        return parseInt(ans) === 0;
      }
      if (k > len / 2) {
        let res = 0;
        for (let i = 1; i < len; ++i) {
          res += Math.max(prices[i] - prices[i - 1], 0);
        }

        return parseInt(ans) === res;
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
          hold[j] = Math.max(hold[j], rele[j - 1] - cur);
        }
      }

      return parseInt(ans) === rele[k];
    },
  },
  {
    desc: (_data: unknown): string => {
      const data = _data as number[][];
      function createTriangleRecurse(data: number[][], level = 0): string {
        const numLevels: number = data.length;
        if (level >= numLevels) {
          return "";
        }
        const numSpaces = numLevels - level + 1;

        let str: string = ["&nbsp;".repeat(numSpaces), "[", data[level].toString(), "]"].join("");
        if (level < numLevels - 1) {
          str += ",";
        }

        return str + "\n" + createTriangleRecurse(data, level + 1);
      }

      function createTriangle(data: number[][]): string {
        return ["[\n", createTriangleRecurse(data), "]"].join("");
      }

      const triangle = createTriangle(data);

      return [
        "Given a triangle, find the minimum path sum from top to bottom. In each step",
        "of the path, you may only move to adjacent numbers in the row below.",
        "The triangle is represented as a 2D array of numbers:\n\n",
        `${triangle}\n\n`,
        "Example: If you are given the following triangle:\n\n[\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2],\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;[3,4],\n",
        "&nbsp;&nbsp;&nbsp;[6,5,7],\n",
        "&nbsp;&nbsp;[4,1,8,3]\n",
        "]\n\n",
        "The minimum path sum is 11 (2 -> 3 -> 5 -> 1).",
      ].join(" ");
    },
    difficulty: 5,
    gen: (): number[][] => {
      const triangle: number[][] = [];
      const levels: number = getRandomInt(3, 12);
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
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[][];
      const n: number = data.length;
      const dp: number[] = data[n - 1].slice();
      for (let i = n - 2; i > -1; --i) {
        for (let j = 0; j < data[i].length; ++j) {
          dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j];
        }
      }

      return dp[0] === parseInt(ans);
    },
  },
  {
    desc: (_data: unknown): string => {
      const data = _data as number[];
      const numRows = data[0];
      const numColumns = data[1];
      return [
        "You are in a grid with",
        `${numRows} rows and ${numColumns} columns, and you are`,
        "positioned in the top-left corner of that grid. You are trying to",
        "reach the bottom-right corner of the grid, but you can only",
        "move down or right on each step. Determine how many",
        "unique paths there are from start to finish.\n\n",
        "NOTE: The data returned for this contract is an array",
        "with the number of rows and columns:\n\n",
        `[${numRows}, ${numColumns}]`,
      ].join(" ");
    },
    difficulty: 3,
    gen: (): number[] => {
      const numRows: number = getRandomInt(2, 14);
      const numColumns: number = getRandomInt(2, 14);

      return [numRows, numColumns];
    },
    name: "Unique Paths in a Grid I",
    numTries: 10,
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[];
      const n: number = data[0]; // Number of rows
      const m: number = data[1]; // Number of columns
      const currentRow: number[] = [];
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
    desc: (_data: unknown): string => {
      const data = _data as number[][];
      let gridString = "";
      for (const line of data) {
        gridString += `${line.toString()},\n`;
      }
      return [
        "You are located in the top-left corner of the following grid:\n\n",
        `${gridString}\n`,
        "You are trying reach the bottom-right corner of the grid, but you can only",
        "move down or right on each step. Furthermore, there are obstacles on the grid",
        "that you cannot move onto. These obstacles are denoted by '1', while empty",
        "spaces are denoted by 0.\n\n",
        "Determine how many unique paths there are from start to finish.\n\n",
        "NOTE: The data returned for this contract is an 2D array of numbers representing the grid.",
      ].join(" ");
    },
    difficulty: 5,
    gen: (): number[][] => {
      const numRows: number = getRandomInt(2, 12);
      const numColumns: number = getRandomInt(2, 12);

      const grid: number[][] = [];
      grid.length = numRows;
      for (let i = 0; i < numRows; ++i) {
        grid[i] = [];
        grid[i].length = numColumns;
        grid[i].fill(0);
      }

      for (let r = 0; r < numRows; ++r) {
        for (let c = 0; c < numColumns; ++c) {
          if (r === 0 && c === 0) {
            continue;
          }
          if (r === numRows - 1 && c === numColumns - 1) {
            continue;
          }

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
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[][];
      const obstacleGrid: number[][] = [];
      obstacleGrid.length = data.length;
      for (let i = 0; i < obstacleGrid.length; ++i) {
        obstacleGrid[i] = data[i].slice();
      }

      for (let i = 0; i < obstacleGrid.length; i++) {
        for (let j = 0; j < obstacleGrid[0].length; j++) {
          if (obstacleGrid[i][j] == 1) {
            obstacleGrid[i][j] = 0;
          } else if (i == 0 && j == 0) {
            obstacleGrid[0][0] = 1;
          } else {
            obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0);
          }
        }
      }

      return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1] === parseInt(ans);
    },
  },
  {
    name: "Shortest Path in a Grid",
    desc: (_data: unknown): string => {
      const data = _data as number[][];
      return [
        "You are located in the top-left corner of the following grid:\n\n",
        `&nbsp;&nbsp;[${data.map((line) => "[" + line + "]").join(",\n&nbsp;&nbsp;&nbsp;")}]\n\n`,
        "You are trying to find the shortest path to the bottom-right corner of the grid,",
        "but there are obstacles on the grid that you cannot move onto.",
        "These obstacles are denoted by '1', while empty spaces are denoted by 0.\n\n",
        "Determine the shortest path from start to finish, if one exists.",
        "The answer should be given as a string of UDLR characters, indicating the moves along the path\n\n",
        "NOTE: If there are multiple equally short paths, any of them is accepted as answer.",
        "If there is no path, the answer should be an empty string.\n",
        "NOTE: The data returned for this contract is an 2D array of numbers representing the grid.\n\n",
        "Examples:\n\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;[[0,1,0,0,0],\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0,0,0,1,0]]\n",
        "\n",
        "Answer: 'DRRURRD'\n\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;[[0,1],\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1,0]]\n",
        "\n",
        "Answer: ''\n\n",
      ].join(" ");
    },
    difficulty: 7,
    numTries: 10,
    gen: (): number[][] => {
      const height = getRandomInt(6, 12);
      const width = getRandomInt(6, 12);
      const dstY = height - 1;
      const dstX = width - 1;
      const minPathLength = dstY + dstX; // Math.abs(dstY - srcY) + Math.abs(dstX - srcX)

      const grid: number[][] = new Array(height);
      for (let y = 0; y < height; y++) grid[y] = new Array(width).fill(0);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (y == 0 && x == 0) continue; // Don't block start
          if (y == dstY && x == dstX) continue; // Don't block destination

          // Generate more obstacles the farther a position is from start and destination.
          // Raw distance factor peaks at 50% at half-way mark. Rescale to 40% max.
          // Obstacle chance range of [15%, 40%] produces ~78% solvable puzzles
          const distanceFactor = (Math.min(y + x, dstY - y + dstX - x) / minPathLength) * 0.8;
          if (Math.random() < Math.max(0.15, distanceFactor)) grid[y][x] = 1;
        }
      }

      return grid;
    },
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as number[][];
      const width = data[0].length;
      const height = data.length;
      const dstY = height - 1;
      const dstX = width - 1;

      const distance: [number][] = new Array(height);
      //const prev: [[number, number] | undefined][] = new Array(height);
      const queue = new MinHeap<[number, number]>();

      for (let y = 0; y < height; y++) {
        distance[y] = new Array(width).fill(Infinity) as [number];
        //prev[y] = new Array(width).fill(undefined) as [undefined];
      }

      function validPosition(y: number, x: number): boolean {
        return y >= 0 && y < height && x >= 0 && x < width && data[y][x] == 0;
      }

      // List in-bounds and passable neighbors
      function* neighbors(y: number, x: number): Generator<[number, number]> {
        if (validPosition(y - 1, x)) yield [y - 1, x]; // Up
        if (validPosition(y + 1, x)) yield [y + 1, x]; // Down
        if (validPosition(y, x - 1)) yield [y, x - 1]; // Left
        if (validPosition(y, x + 1)) yield [y, x + 1]; // Right
      }

      // Prepare starting point
      distance[0][0] = 0;
      queue.push([0, 0], 0);

      // Take next-nearest position and expand potential paths from there
      while (queue.size > 0) {
        const [y, x] = queue.pop() as [number, number];
        for (const [yN, xN] of neighbors(y, x)) {
          const d = distance[y][x] + 1;
          if (d < distance[yN][xN]) {
            if (distance[yN][xN] == Infinity)
              // Not reached previously
              queue.push([yN, xN], d);
            // Found a shorter path
            else queue.changeWeight(([yQ, xQ]) => yQ == yN && xQ == xN, d);
            //prev[yN][xN] = [y, x];
            distance[yN][xN] = d;
          }
        }
      }

      // No path at all?
      if (distance[dstY][dstX] == Infinity) return ans == "";

      // There is a solution, require that the answer path is as short as the shortest
      // path we found
      if (ans.length > distance[dstY][dstX]) return false;

      // Further verify that the answer path is a valid path
      let ansX = 0;
      let ansY = 0;
      for (const direction of ans) {
        switch (direction) {
          case "U":
            ansY -= 1;
            break;
          case "D":
            ansY += 1;
            break;
          case "L":
            ansX -= 1;
            break;
          case "R":
            ansX += 1;
            break;
          default:
            return false; // Invalid character
        }
        if (!validPosition(ansY, ansX)) return false;
      }

      // Path was valid, finally verify that the answer path brought us to the end coordinates
      return ansY == dstY && ansX == dstX;
    },
  },
  {
    desc: (data: unknown): string => {
      return [
        "Given the following string:\n\n",
        `${data}\n\n`,
        "remove the minimum number of invalid parentheses in order to validate",
        "the string. If there are multiple minimal ways to validate the string,",
        "provide all of the possible results. The answer should be provided",
        "as an array of strings. If it is impossible to validate the string",
        "the result should be an array with only an empty string.\n\n",
        "IMPORTANT: The string may contain letters, not just parentheses.",
        `Examples:\n`,
        `"()())()" -> [()()(), (())()]\n`,
        `"(a)())()" -> [(a)()(), (a())()]\n`,
        `")(" -> [""]`,
      ].join(" ");
    },
    difficulty: 10,
    gen: (): string => {
      const len: number = getRandomInt(6, 20);
      const chars: string[] = [];
      chars.length = len;

      // 80% chance of the first parenthesis being (
      Math.random() < 0.8 ? (chars[0] = "(") : (chars[0] = ")");

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
    solver: (data: unknown, ans: string): boolean => {
      if (typeof data !== "string") throw new Error("solver expected string");
      let left = 0;
      let right = 0;
      const res: string[] = [];

      for (let i = 0; i < data.length; ++i) {
        if (data[i] === "(") {
          ++left;
        } else if (data[i] === ")") {
          left > 0 ? --left : ++right;
        }
      }

      function dfs(
        pair: number,
        index: number,
        left: number,
        right: number,
        s: string,
        solution: string,
        res: string[],
      ): void {
        if (s.length === index) {
          if (left === 0 && right === 0 && pair === 0) {
            for (let i = 0; i < res.length; i++) {
              if (res[i] === solution) {
                return;
              }
            }
            res.push(solution);
          }
          return;
        }

        if (s[index] === "(") {
          if (left > 0) {
            dfs(pair, index + 1, left - 1, right, s, solution, res);
          }
          dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
        } else if (s[index] === ")") {
          if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
          if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
        } else {
          dfs(pair, index + 1, left, right, s, solution + s[index], res);
        }
      }

      dfs(0, 0, left, right, data, "", res);

      const sanitizedPlayerAns: string = removeBracketsFromArrayString(ans);
      const sanitizedPlayerAnsArr: string[] = sanitizedPlayerAns.split(",");
      for (let i = 0; i < sanitizedPlayerAnsArr.length; ++i) {
        sanitizedPlayerAnsArr[i] = removeQuotesFromString(sanitizedPlayerAnsArr[i]).replace(/\s/g, "");
      }

      if (sanitizedPlayerAnsArr.length !== res.length) {
        return false;
      }
      for (const resultInAnswer of res) {
        if (!sanitizedPlayerAnsArr.includes(resultInAnswer)) {
          return false;
        }
      }

      return true;
    },
  },
  {
    desc: (_data: unknown): string => {
      const data = _data as [string, number];
      const digits: string = data[0];
      const target: number = data[1];

      return [
        "You are given the following string which contains only digits between 0 and 9:\n\n",
        `${digits}\n\n`,
        `You are also given a target number of ${target}. Return all possible ways`,
        "you can add the +(add), -(subtract), and *(multiply) operators to the string such",
        "that it evaluates to the target number. (Normal order of operations applies.)\n\n",
        "The provided answer should be an array of strings containing the valid expressions.",
        "The data provided by this problem is an array with two elements. The first element",
        "is the string of digits, while the second element is the target number:\n\n",
        `["${digits}", ${target}]\n\n`,
        "NOTE: The order of evaluation expects script operator precedence",
        "NOTE: Numbers in the expression cannot have leading 0's. In other words,",
        `"1+01" is not a valid expression`,
        "Examples:\n\n",
        `Input: digits = "123", target = 6\n`,
        `Output: [1+2+3, 1*2*3]\n\n`,
        `Input: digits = "105", target = 5\n`,
        `Output: [1*0+5, 10-5]`,
      ].join(" ");
    },
    difficulty: 10,
    gen: (): [string, number] => {
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
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as [string, number];
      const num = data[0];
      const target = data[1];

      function helper(
        res: string[],
        path: string,
        num: string,
        target: number,
        pos: number,
        evaluated: number,
        multed: number,
      ): void {
        if (pos === num.length) {
          if (target === evaluated) {
            res.push(path);
          }
          return;
        }

        for (let i = pos; i < num.length; ++i) {
          if (i != pos && num[pos] == "0") {
            break;
          }
          const cur = parseInt(num.substring(pos, i + 1));

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
        sanitizedPlayerAnsArr[i] = removeQuotesFromString(sanitizedPlayerAnsArr[i]).replace(/\s/g, "");
      }

      if (num == null || num.length === 0) {
        if (sanitizedPlayerAnsArr.length === 0) {
          return true;
        }
        if (sanitizedPlayerAnsArr.length === 1 && sanitizedPlayerAnsArr[0] === "") {
          return true;
        }
        return false;
      }

      const result: string[] = [];
      helper(result, "", num, target, 0, 0, 0);

      for (const expr of result) {
        if (!sanitizedPlayerAnsArr.includes(expr)) {
          return false;
        }
      }

      return true;
    },
  },
  {
    name: "HammingCodes: Integer to Encoded Binary",
    numTries: 10,
    difficulty: 5,
    desc: (n: unknown): string => {
      return [
        "You are given the following decimal Value: \n",
        `${n} \n`,
        "Convert it to a binary representation and encode it as an 'extended Hamming code'. Eg:\n ",
        "Value 8 is expressed in binary as '1000', which will be encoded",
        "with the pattern 'pppdpddd', where p is a parity bit and d a data bit,\n",
        "or '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.\n",
        "The answer should be given as a string containing only 1s and 0s.\n",
        "NOTE: the endianness of the data bits is reversed in relation to the endianness of the parity bits.\n",
        "NOTE: The bit at index zero is the overall parity bit, this should be set last.\n",
        "NOTE 2: You should watch the Hamming Code video from 3Blue1Brown, which explains the 'rule' of encoding,",
        "including the first index parity bit mentioned in the previous note.\n\n",
        "Extra rule for encoding:\n",
        "There should be no leading zeros in the 'data bit' section",
      ].join(" ");
    },
    gen: (): number => {
      return getRandomInt(Math.pow(2, 4), Math.pow(2, getRandomInt(1, 57)));
    },
    solver: (data: unknown, ans: string): boolean => {
      if (typeof data !== "number") throw new Error("solver expected number");
      return ans === HammingEncode(data);
    },
  },
  {
    name: "HammingCodes: Encoded Binary to Integer",
    difficulty: 8,
    numTries: 10,
    desc: (n: unknown): string => {
      return [
        "You are given the following encoded binary string: \n",
        `'${n}' \n\n`,
        "Treat it as an extended Hamming code with 1 'possible' error at a random index.\n",
        "Find the 'possible' wrong bit, fix it and extract the decimal value, which is hidden inside the string.\n\n",
        "Note: The length of the binary string is dynamic, but it's encoding/decoding follows Hamming's 'rule'\n",
        "Note 2: Index 0 is an 'overall' parity bit. Watch the Hamming code video from 3Blue1Brown for more information\n",
        "Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an altered Bit 😉\n",
        "Note: The endianness of the encoded decimal value is reversed in relation to the endianness of the Hamming code. Where",
        "the Hamming code is expressed as little-endian (LSB at index 0), the decimal value encoded in it is expressed as big-endian",
        "(MSB at index 0).\n",
        "Extra note for automation: return the decimal value as a string",
      ].join(" ");
    },
    gen: (): string => {
      const _alteredBit = Math.round(Math.random());
      const _buildArray: Array<string> = HammingEncodeProperly(
        getRandomInt(Math.pow(2, 4), Math.pow(2, getRandomInt(1, 57))),
      ).split("");
      if (_alteredBit) {
        const _randomIndex: number = getRandomInt(0, _buildArray.length - 1);
        _buildArray[_randomIndex] = _buildArray[_randomIndex] == "0" ? "1" : "0";
      }
      return _buildArray.join("");
    },
    solver: (data: unknown, ans: string): boolean => {
      if (typeof data !== "string") throw new Error("solver expected string");
      return parseInt(ans, 10) === HammingDecode(data);
    },
  },
  {
    name: "Proper 2-Coloring of a Graph",
    difficulty: 7,
    numTries: 5,
    desc: (_data: unknown): string => {
      const data = _data as [number, [number, number][]];
      return [
        `You are given the following data, representing a graph:\n`,
        `${JSON.stringify(data)}\n`,
        `Note that "graph", as used here, refers to the field of graph theory, and has`,
        `no relation to statistics or plotting.`,
        `The first element of the data represents the number of vertices in the graph.`,
        `Each vertex is a unique number between 0 and ${data[0] - 1}.`,
        `The next element of the data represents the edges of the graph.`,
        `Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v].`,
        `Note that an edge [u,v] is the same as an edge [v,u], as order does not matter.`,
        `You must construct a 2-coloring of the graph, meaning that you have to assign each`,
        `vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have`,
        `the same color. Submit your answer in the form of an array, where element i`,
        `represents the color of vertex i. If it is impossible to construct a 2-coloring of`,
        `the given graph, instead submit an empty array.\n\n`,
        `Examples:\n\n`,
        `Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]\n`,
        `Output: [0, 0, 1, 1]\n\n`,
        `Input: [3, [[0, 1], [0, 2], [1, 2]]]\n`,
        `Output: []`,
      ].join(" ");
    },
    gen: (): [number, [number, number][]] => {
      //Generate two partite sets
      const n = Math.floor(Math.random() * 5) + 3;
      const m = Math.floor(Math.random() * 5) + 3;

      //50% chance of spawning any given valid edge in the bipartite graph
      const edges: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          if (Math.random() > 0.5) {
            edges.push([i, n + j]);
          }
        }
      }

      //Add an edge at random with no regard to partite sets
      let a = Math.floor(Math.random() * (n + m));
      let b = Math.floor(Math.random() * (n + m));
      if (a > b) [a, b] = [b, a]; //Enforce lower numbers come first
      if (a != b && !edges.includes([a, b])) {
        edges.push([a, b]);
      }

      //Randomize array in-place using Durstenfeld shuffle algorithm.
      function shuffle<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }

      //Replace instances of the original vertex names in-place
      const vertexShuffler = Array.from(Array(n + m).keys());
      shuffle(vertexShuffler);
      for (let i = 0; i < edges.length; i++) {
        edges[i] = [vertexShuffler[edges[i][0]], vertexShuffler[edges[i][1]]];
        if (edges[i][0] > edges[i][1]) {
          //Enforce lower numbers come first
          [edges[i][0], edges[i][1]] = [edges[i][1], edges[i][0]];
        }
      }

      //Shuffle the order of the edges themselves, as well
      shuffle(edges);

      return [n + m, edges];
    },
    solver: (_data: unknown, ans: string): boolean => {
      const data = _data as [number, [number, number][]];

      //Sanitize player input
      const sanitizedPlayerAns: string = removeBracketsFromArrayString(ans);

      //Case where the player believes there is no solution.
      //Attempt to construct one to check if this is correct.
      if (sanitizedPlayerAns === "") {
        //Helper function to get neighbourhood of a vertex
        function neighbourhood(vertex: number): number[] {
          const adjLeft = data[1].filter(([a]) => a == vertex).map(([, b]) => b);
          const adjRight = data[1].filter(([, b]) => b == vertex).map(([a]) => a);
          return adjLeft.concat(adjRight);
        }

        //Verify that there is no solution by attempting to create a proper 2-coloring.
        const coloring: (number | undefined)[] = Array(data[0]).fill(undefined);
        while (coloring.some((val) => val === undefined)) {
          //Color a vertex in the graph
          const initialVertex: number = coloring.findIndex((val) => val === undefined);
          coloring[initialVertex] = 0;
          const frontier: number[] = [initialVertex];

          //Propogate the coloring throughout the component containing v greedily
          while (frontier.length > 0) {
            const v: number = frontier.pop() || 0;
            const neighbors: number[] = neighbourhood(v);

            //For each vertex u adjacent to v
            for (const id in neighbors) {
              const u: number = neighbors[id];

              //Set the color of u to the opposite of v's color if it is new,
              //then add u to the frontier to continue the algorithm.
              if (coloring[u] === undefined) {
                if (coloring[v] === 0) coloring[u] = 1;
                else coloring[u] = 0;

                frontier.push(u);
              }

              //Assert u,v do not have the same color
              else if (coloring[u] === coloring[v]) {
                //If u,v do have the same color, no proper 2-coloring exists, meaning
                //the player was correct to say there is no proper 2-coloring of the graph.
                return true;
              }
            }
          }
        }

        //If this code is reached, there exists a proper 2-coloring of the input
        //graph, and thus the player was incorrect in submitting no answer.
        return false;
      }

      //Solution provided case
      const sanitizedPlayerAnsArr: string[] = sanitizedPlayerAns.split(",");
      const coloring: number[] = sanitizedPlayerAnsArr.map((val) => parseInt(val));
      if (coloring.length == data[0]) {
        const edges = data[1];
        const validColors = [0, 1];
        //Check that the provided solution is a proper 2-coloring
        return edges.every(([a, b]) => {
          const aColor = coloring[a];
          const bColor = coloring[b];
          return (
            validColors.includes(aColor) && //Enforce the first endpoint is color 0 or 1
            validColors.includes(bColor) && //Enforce the second endpoint is color 0 or 1
            aColor != bColor //Enforce the endpoints are different colors
          );
        });
      }

      //Return false if the coloring is the wrong size
      else return false;
    },
  },
  {
    name: "Compression I: RLE Compression",
    difficulty: 2,
    numTries: 10,
    desc: (plaintext: unknown): string => {
      return [
        "Run-length encoding (RLE) is a data compression technique which encodes data as a series of runs of",
        "a repeated single character. Runs are encoded as a length, followed by the character itself. Lengths",
        "are encoded as a single ASCII digit; runs of 10 characters or more are encoded by splitting them",
        "into multiple runs.\n\n",
        "You are given the following input string:\n",
        `&nbsp; &nbsp; ${plaintext}\n`,
        "Encode it using run-length encoding with the minimum possible output length.\n\n",
        "Examples:\n",
        "&nbsp; &nbsp; aaaaabccc &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;-> &nbsp;5a1b3c\n",
        "&nbsp; &nbsp; aAaAaA &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -> &nbsp;1a1A1a1A1a1A\n",
        "&nbsp; &nbsp; 111112333 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;-> &nbsp;511233\n",
        "&nbsp; &nbsp; zzzzzzzzzzzzzzzzzzz &nbsp;-> &nbsp;9z9z1z &nbsp;(or 9z8z2z, etc.)\n",
      ].join(" ");
    },
    gen: (): string => {
      const length = 50 + Math.floor(25 * (Math.random() + Math.random()));
      let plain = "";

      while (plain.length < length) {
        const r = Math.random();

        let n = 1;
        if (r < 0.3) {
          n = 1;
        } else if (r < 0.6) {
          n = 2;
        } else if (r < 0.9) {
          n = Math.floor(10 * Math.random());
        } else {
          n = 10 + Math.floor(5 * Math.random());
        }

        const c = comprGenChar();
        plain += c.repeat(n);
      }

      return plain.substring(0, length);
    },
    solver: (plain: unknown, ans: string): boolean => {
      if (typeof plain !== "string") throw new Error("solver expected string");
      if (ans.length % 2 !== 0) {
        return false;
      }

      let ans_plain = "";
      for (let i = 0; i + 1 < ans.length; i += 2) {
        const length = ans.charCodeAt(i) - 0x30;
        if (length < 0 || length > 9) {
          return false;
        }

        ans_plain += ans[i + 1].repeat(length);
      }
      if (ans_plain !== plain) {
        return false;
      }

      let length = 0;
      for (let i = 0; i < plain.length; ) {
        let run_length = 1;
        while (i + run_length < plain.length && plain[i + run_length] === plain[i]) {
          ++run_length;
        }
        i += run_length;

        while (run_length > 0) {
          run_length -= 9;
          length += 2;
        }
      }

      return ans.length <= length;
    },
  },
  {
    name: "Compression II: LZ Decompression",
    difficulty: 4,
    numTries: 10,
    desc: (compressed: unknown): string => {
      return [
        "Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to",
        "earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk",
        "begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data,",
        "which is either:\n\n",
        "1. Exactly L characters, which are to be copied directly into the uncompressed data.\n",
        "2. A reference to an earlier part of the uncompressed data. To do this, the length is followed",
        "by a second ASCII digit X: each of the L output characters is a copy of the character X",
        "places before it in the uncompressed data.\n\n",
        "For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character",
        "is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final",
        "chunk may be of either type.\n\n",
        "You are given the following LZ-encoded string:\n",
        `&nbsp; &nbsp; ${compressed}\n`,
        "Decode it and output the original string.\n\n",
        "Example: decoding '5aaabb450723abb' chunk-by-chunk\n",
        "&nbsp; &nbsp; 5aaabb &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -> &nbsp;aaabb\n",
        "&nbsp; &nbsp; 5aaabb45 &nbsp; &nbsp; &nbsp; &nbsp; -> &nbsp;aaabbaaab\n",
        "&nbsp; &nbsp; 5aaabb450 &nbsp; &nbsp; &nbsp; &nbsp;-> &nbsp;aaabbaaab\n",
        "&nbsp; &nbsp; 5aaabb45072 &nbsp; &nbsp; &nbsp;-> &nbsp;aaabbaaababababa\n",
        "&nbsp; &nbsp; 5aaabb450723abb &nbsp;-> &nbsp;aaabbaaababababaabb",
      ].join(" ");
    },
    gen: (): string => {
      return comprLZEncode(comprLZGenerate());
    },
    solver: (compr: unknown, ans: string): boolean => {
      if (typeof compr !== "string") throw new Error("solver expected string");
      return ans === comprLZDecode(compr);
    },
  },
  {
    name: "Compression III: LZ Compression",
    difficulty: 10,
    numTries: 10,
    desc: (plaintext: unknown): string => {
      return [
        "Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to",
        "earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk",
        "begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data,",
        "which is either:\n\n",
        "1. Exactly L characters, which are to be copied directly into the uncompressed data.\n",
        "2. A reference to an earlier part of the uncompressed data. To do this, the length is followed",
        "by a second ASCII digit X: each of the L output characters is a copy of the character X",
        "places before it in the uncompressed data.\n\n",
        "For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character",
        "is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final",
        "chunk may be of either type.\n\n",
        "You are given the following input string:\n",
        `&nbsp; &nbsp; ${plaintext}\n`,
        "Encode it using Lempel-Ziv encoding with the minimum possible output length.\n\n",
        "Examples (some have other possible encodings of minimal length):\n",
        "&nbsp; &nbsp; abracadabra &nbsp; &nbsp; -> &nbsp;7abracad47\n",
        "&nbsp; &nbsp; mississippi &nbsp; &nbsp; -> &nbsp;4miss433ppi\n",
        "&nbsp; &nbsp; aAAaAAaAaAA &nbsp; &nbsp; -> &nbsp;3aAA53035\n",
        "&nbsp; &nbsp; 2718281828 &nbsp; &nbsp; &nbsp;-> &nbsp;627182844\n",
        "&nbsp; &nbsp; abcdefghijk &nbsp; &nbsp; -> &nbsp;9abcdefghi02jk\n",
        "&nbsp; &nbsp; aaaaaaaaaaaa &nbsp; &nbsp;-> &nbsp;3aaa91\n",
        "&nbsp; &nbsp; aaaaaaaaaaaaa &nbsp; -> &nbsp;1a91031\n",
        "&nbsp; &nbsp; aaaaaaaaaaaaaa &nbsp;-> &nbsp;1a91041",
      ].join(" ");
    },
    gen: (): string => {
      return comprLZGenerate();
    },
    solver: (plain: unknown, ans: string): boolean => {
      if (typeof plain !== "string") throw new Error("solver expected string");
      return comprLZDecode(ans) === plain && ans.length <= comprLZEncode(plain).length;
    },
  },
  {
    desc: (_data: unknown): string => {
      if (!Array.isArray(_data)) throw new Error("data should be array of string");
      const data = _data as [string, number];
      return [
        "Caesar cipher is one of the simplest encryption technique.",
        "It is a type of substitution cipher in which each letter in the plaintext ",
        "is replaced by a letter some fixed number of positions down the alphabet.",
        "For example, with a left shift of 3, D would be replaced by A, ",
        "E would become B, and A would become X (because of rotation).\n\n",
        "You are given an array with two elements:\n",
        `&nbsp;&nbsp;["${data[0]}", ${data[1]}]\n`,
        "The first element is the plaintext, the second element is the left shift value.\n\n",
        "Return the ciphertext as uppercase string. Spaces remains the same.",
      ].join(" ");
    },
    difficulty: 1,
    gen: (): [string, number] => {
      // return [plaintext, shift value]
      const words = [
        "ARRAY",
        "CACHE",
        "CLOUD",
        "DEBUG",
        "EMAIL",
        "ENTER",
        "FLASH",
        "FRAME",
        "INBOX",
        "LINUX",
        "LOGIC",
        "LOGIN",
        "MACRO",
        "MEDIA",
        "MODEM",
        "MOUSE",
        "PASTE",
        "POPUP",
        "PRINT",
        "QUEUE",
        "SHELL",
        "SHIFT",
        "TABLE",
        "TRASH",
        "VIRUS",
      ];
      return [
        words
          .sort(() => Math.random() - 0.5)
          .slice(0, 5)
          .join(" "),
        Math.floor(Math.random() * 25 + 1),
      ];
    },
    name: "Encryption I: Caesar Cipher",
    numTries: 10,
    solver: (_data: unknown, ans: string): boolean => {
      if (!Array.isArray(_data)) throw new Error("data should be array of string");
      const data = _data as [string, number];
      // data = [plaintext, shift value]
      // build char array, shifting via map and join to final results
      const cipher = [...data[0]]
        .map((a) => (a === " " ? a : String.fromCharCode(((a.charCodeAt(0) - 65 - data[1] + 26) % 26) + 65)))
        .join("");
      return cipher === ans;
    },
  },
  {
    desc: (_data: unknown): string => {
      if (!Array.isArray(_data)) throw new Error("data should be array of string");
      const data = _data as [string, string];
      return [
        "Vigenère cipher is a type of polyalphabetic substitution. It uses ",
        "the Vigenère square to encrypt and decrypt plaintext with a keyword.\n\n",
        "&nbsp;&nbsp;Vignenère square:\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A B C D E F G H I J K L M N O P Q R S T U V W X Y Z \n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; +----------------------------------------------------\n",
        "&nbsp;&nbsp;&nbsp;&nbsp; A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z \n",
        "&nbsp;&nbsp;&nbsp;&nbsp; B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A \n",
        "&nbsp;&nbsp;&nbsp;&nbsp; C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B\n",
        "&nbsp;&nbsp;&nbsp;&nbsp; D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C\n",
        "&nbsp;&nbsp;&nbsp;&nbsp; E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D\n",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...\n",
        "&nbsp;&nbsp;&nbsp;&nbsp; Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X\n",
        "&nbsp;&nbsp;&nbsp;&nbsp; Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y\n\n",
        "For encryption each letter of the plaintext is paired with the corresponding letter of a repeating keyword.",
        "For example, the plaintext DASHBOARD is encrypted with the keyword LINUX:\n",
        "&nbsp;&nbsp; Plaintext: DASHBOARD\n",
        "&nbsp;&nbsp; Keyword:&nbsp;&nbsp;&nbsp;LINUXLINU\n",
        "So, the first letter D is paired with the first letter of the key L. Therefore, row D and column L of the ",
        "Vigenère square are used to get the first cipher letter O. This must be repeated for the whole ciphertext.\n\n",
        "You are given an array with two elements:\n",
        `&nbsp;&nbsp;["${data[0]}", "${data[1]}"]\n`,
        "The first element is the plaintext, the second element is the keyword.\n\n",
        "Return the ciphertext as uppercase string.",
      ].join(" ");
    },
    difficulty: 2,
    gen: (): [string, string] => {
      // return [plaintext, keyword]
      const words = [
        "ARRAY",
        "CACHE",
        "CLOUD",
        "DEBUG",
        "EMAIL",
        "ENTER",
        "FLASH",
        "FRAME",
        "INBOX",
        "LINUX",
        "LOGIC",
        "LOGIN",
        "MACRO",
        "MEDIA",
        "MODEM",
        "MOUSE",
        "PASTE",
        "POPUP",
        "PRINT",
        "QUEUE",
        "SHELL",
        "SHIFT",
        "TABLE",
        "TRASH",
        "VIRUS",
      ];
      const keys = [
        "ALGORITHM",
        "BANDWIDTH",
        "BLOGGER",
        "BOOKMARK",
        "BROADBAND",
        "BROWSER",
        "CAPTCHA",
        "CLIPBOARD",
        "COMPUTING",
        "COMMAND",
        "COMPILE",
        "COMPRESS",
        "COMPUTER",
        "CONFIGURE",
        "DASHBOARD",
        "DATABASE",
        "DESKTOP",
        "DIGITAL",
        "DOCUMENT",
        "DOWNLOAD",
        "DYNAMIC",
        "EMOTICON",
        "ENCRYPT",
        "EXABYTE",
        "FIREWALL",
        "FIRMWARE",
        "FLAMING",
        "FLOWCHART",
        "FREEWARE",
        "GIGABYTE",
        "GRAPHICS",
        "HARDWARE",
        "HYPERLINK",
        "HYPERTEXT",
        "INTEGER",
        "INTERFACE",
        "INTERNET",
        "ITERATION",
        "JOYSTICK",
        "JUNKMAIL",
        "KEYBOARD",
        "KEYWORD",
        "LURKING",
        "MACINTOSH",
        "MAINFRAME",
        "MALWARE",
        "MONITOR",
        "NETWORK",
        "NOTEBOOK",
        "COMPUTER",
        "OFFLINE",
        "OPERATING",
        "PASSWORD",
        "PHISHING",
        "PLATFORM",
        "PODCAST",
        "PRINTER",
        "PRIVACY",
        "PROCESS",
        "PROGRAM",
        "PROTOCOL",
        "REALTIME",
        "RESTORE",
        "RUNTIME",
        "SCANNER",
        "SECURITY",
        "SHAREWARE",
        "SNAPSHOT",
        "SOFTWARE",
        "SPAMMER",
        "SPYWARE",
        "STORAGE",
        "TERMINAL",
        "TEMPLATE",
        "TERABYTE",
        "TOOLBAR",
        "TYPEFACE",
        "USERNAME",
        "UTILITY",
        "VERSION",
        "VIRTUAL",
        "WEBMASTER",
        "WEBSITE",
        "WINDOWS",
        "WIRELESS",
        "PROCESSOR",
      ];
      return [
        words
          .sort(() => Math.random() - 0.5)
          .slice(0, 5)
          .join(""),
        keys.sort(() => Math.random() - 0.5)[0],
      ];
    },
    name: "Encryption II: Vigenère Cipher",
    numTries: 10,
    solver: (_data: unknown, ans: string): boolean => {
      if (!Array.isArray(_data)) throw new Error("data should be array of string");
      const data = _data as [string, string];
      // data = [plaintext, keyword]
      // build char array, shifting via map and corresponding keyword letter and join to final results
      const cipher = [...data[0]]
        .map((a, i) => {
          return a === " "
            ? a
            : String.fromCharCode(((a.charCodeAt(0) - 2 * 65 + data[1].charCodeAt(i % data[1].length)) % 26) + 65);
        })
        .join("");
      return cipher === ans;
    },
  },
];
