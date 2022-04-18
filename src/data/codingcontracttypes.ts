import { getRandomInt } from "../utils/helpers/getRandomInt";
import { MinHeap } from "../utils/Heap";

// import { HammingEncode, HammingDecode } from "../utils/HammingCodeTools";
/* tslint:disable:completed-docs no-magic-numbers arrow-return-shorthand */

/* Function that generates a valid 'data' for a contract type */
export type GeneratorFunc = () => any;

/* Function that checks if the provided solution is the correct one */
export type SolverFunc = (data: any, answer: string) => boolean;

/* Function that returns a string with the problem's description.
   Requires the 'data' of a Contract as input */
export type DescriptionFunc = (data: any) => string;

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

function convert2DArrayToString(arr: any[][]): string {
  const components: string[] = [];
  arr.forEach((e: any) => {
    let s: string = e.toString();
    s = ["[", s, "]"].join("");
    components.push(s);
  });

  return components.join(",").replace(/\s/g, "");
}

export const codingContractTypesMetadata: ICodingContractTypeMetadata[] = [
  {
    desc: (n: number): string => {
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
    solver: (data: number, ans: string): boolean => {
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
    desc: (n: number[]): string => {
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
    solver: (data: number[], ans: string): boolean => {
      const nums: number[] = data.slice();
      for (let i = 1; i < nums.length; i++) {
        nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
      }

      return parseInt(ans, 10) === Math.max(...nums);
    },
  },
  {
    desc: (n: number): string => {
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
    solver: (data: number, ans: string): boolean => {
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
    desc: (data: [number, number[]]): string => {
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
    solver: (data: [number, number[]], ans: string): boolean => {
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
    desc: (n: number[][]): string => {
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
    solver: (data: number[][], ans: string): boolean => {
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

      const sanitizedPlayerAns: string = removeBracketsFromArrayString(ans).replace(/\s/g, "");
      const playerAns: any[] = sanitizedPlayerAns.split(",");
      for (let i = 0; i < playerAns.length; ++i) {
        playerAns[i] = parseInt(playerAns[i], 10);
      }
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
    desc: (arr: number[]): string => {
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
    solver: (data: number[], ans: string): boolean => {
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
    desc: (arr: number[]): string => {
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
    solver: (data: number[], ans: string): boolean => {
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
    desc: (arr: number[][]): string => {
      return [
        "Given the following array of array of numbers representing a list of",
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
    solver: (data: number[][], ans: string): boolean => {
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
    desc: (data: string): string => {
      return [
        "Given the following string containing only digits, return",
        "an array with all possible valid IP address combinations",
        "that can be created from the string:\n\n",
        `${data}\n\n`,
        "Note that an octet cannot begin with a '0' unless the number",
        "itself is actually 0. For example, '192.168.010.1' is not a valid IP.\n\n",
        "Examples:\n\n",
        "25525511135 -> [255.255.11.135, 255.255.111.35]\n",
        "1938718066 -> [193.87.180.66]",
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
    solver: (data: string, ans: string): boolean => {
      const ret: string[] = [];
      for (let a = 1; a <= 3; ++a) {
        for (let b = 1; b <= 3; ++b) {
          for (let c = 1; c <= 3; ++c) {
            for (let d = 1; d <= 3; ++d) {
              if (a + b + c + d === data.length) {
                const A: number = parseInt(data.substring(0, a), 10);
                const B: number = parseInt(data.substring(a, a + b), 10);
                const C: number = parseInt(data.substring(a + b, a + b + c), 10);
                const D: number = parseInt(data.substring(a + b + c, a + b + c + d), 10);
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
      const ansArr: string[] = sanitizedAns.split(",");
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
    desc: (data: number[]): string => {
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
    solver: (data: number[], ans: string): boolean => {
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
    desc: (data: number[]): string => {
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
    solver: (data: number[], ans: string): boolean => {
      let profit = 0;
      for (let p = 1; p < data.length; ++p) {
        profit += Math.max(data[p] - data[p - 1], 0);
      }

      return profit.toString() === ans;
    },
  },
  {
    desc: (data: number[]): string => {
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
    solver: (data: number[], ans: string): boolean => {
      let hold1: number = Number.MIN_SAFE_INTEGER;
      let hold2: number = Number.MIN_SAFE_INTEGER;
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
    desc: (data: any[]): string => {
      const k: number = data[0];
      const prices: number[] = data[1];
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
    gen: (): any[] => {
      const k: number = getRandomInt(2, 10);
      const len: number = getRandomInt(3, 50);
      const prices: number[] = [];
      prices.length = len;
      for (let i = 0; i < len; ++i) {
        prices[i] = getRandomInt(1, 200);
      }

      return [k, prices];
    },
    name: "Algorithmic Stock Trader IV",
    numTries: 10,
    solver: (data: any[], ans: string): boolean => {
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
    desc: (data: number[][]): string => {
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
    solver: (data: number[][], ans: string): boolean => {
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
    desc: (data: number[]): string => {
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
    solver: (data: number[], ans: string): boolean => {
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
    desc: (data: number[][]): string => {
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
    solver: (data: number[][], ans: string): boolean => {
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
    desc: (data: number[][]): string => {
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
    solver: (data: number[][], ans: string): boolean => {
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
    desc: (data: string): string => {
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
    solver: (data: string, ans: string): boolean => {
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
    desc: (data: any[]): string => {
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
    gen: (): any[] => {
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
    solver: (data: any[], ans: string): boolean => {
      const num: string = data[0];
      const target: number = data[1];

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
  } /*
  {
    name: "HammingCodes: Integer to encoded Binary",
    numTries: 10,
    difficulty: 5,
    desc: (n: number): string => {
      return [
        "You are given the following decimal Value: \n",
        `${n} \n`,
        "Convert it into a binary string and encode it as a 'Hamming-Code'. eg:\n ",
        "Value 8 will result into binary '1000', which will be encoded",
        "with the pattern 'pppdpddd', where p is a paritybit and d a databit,\n",
        "or '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.\n\n",
        "NOTE: You need an parity Bit on Index 0 as an 'overall'-paritybit. \n",
        "NOTE 2: You should watch the HammingCode-video from 3Blue1Brown, which explains the 'rule' of encoding,",
        "including the first Index parity-bit mentioned on the first note.\n\n",
        "Now the only one rule for this encoding:\n",
        " It's not allowed to add additional leading '0's to the binary value\n",
        "That means, the binary value has to be encoded as it is",
      ].join(" ");
    },
    gen: (): number => {
      return getRandomInt(Math.pow(2, 4), Math.pow(2, getRandomInt(1, 57)));
    },
    solver: (data: number, ans: string): boolean => {
      return ans === HammingEncode(data);
    },
  },
  {
    name: "HammingCodes: Encoded Binary to Integer",
    difficulty: 8,
    numTries: 10,
    desc: (n: string): string => {
      return [
        "You are given the following encoded binary String: \n",
        `'${n}' \n`,
        "Treat it as a Hammingcode with 1 'possible' error on an random Index.\n",
        "Find the 'possible' wrong bit, fix it and extract the decimal value, which is hidden inside the string.\n\n",
        "Note: The length of the binary string is dynamic, but it's encoding/decoding is following Hammings 'rule'\n",
        "Note 2: Index 0 is an 'overall' parity bit. Watch the Hammingcode-video from 3Blue1Brown for more information\n",
        "Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an altered Bit 😉\n",
        "Extranote for automation: return the decimal value as a string",
      ].join(" ");
    },
    gen: (): string => {
      const _alteredBit = Math.round(Math.random());
      const _buildArray: Array<string> = HammingEncode(
        getRandomInt(Math.pow(2, 4), Math.pow(2, getRandomInt(1, 57))),
      ).split("");
      if (_alteredBit) {
        const _randomIndex: number = getRandomInt(0, _buildArray.length - 1);
        _buildArray[_randomIndex] = _buildArray[_randomIndex] == "0" ? "1" : "0";
      }
      return _buildArray.join("");
    },
    solver: (data: string, ans: string): boolean => {
      return parseInt(ans, 10) === HammingDecode(data);
    },
  },*/,
];
