.. _codingcontracts:

Coding Contracts
================
Coding Contracts are a mechanic that lets players earn rewards in
exchange for solving programming problems.

Coding Contracts are files with the ".cct" extensions. They can
be accessed through the :ref:`terminal`  or through scripts using
the :ref:`netscriptcodingcontractapi`

Each contract has a limited number of attempts. If you
provide the wrong answer too many times and exceed the
number of attempts, the contract will self destruct (delete itself)

Currently, Coding Contracts are randomly generated and
spawned over time. They can appear on any server (including your
home computer), except for your purchased servers.


Running in Terminal
^^^^^^^^^^^^^^^^^^^
To run a Coding Contract in the Terminal, simply use the
:ref:`run_terminal_command` command::

    $ run some-contract.cct

Doing this will bring up a popup. The popup will display
the contract's problem, the number of attempts remaining, and
an area to provide an answer.

Interacting through Scripts
^^^^^^^^^^^^^^^^^^^^^^^^^^^
See :ref:`netscriptcodingcontractapi`.

Submitting Solutions
^^^^^^^^^^^^^^^^^^^^
Different contract problem types will require different types of
solutions. Some may be numbers, others may be strings or arrays.
If a contract asks for a specific solution format, then
use that. Otherwise, follow these rules when submitting solutions:

* String-type solutions should **not** have quotation marks surrounding
  the string (unless specifically asked for). Only quotation
  marks that are part of the actual string solution should be included.
* Array-type solutions should be submitted with each element
  in the array separated by commas. Brackets are optional. For example,
  both of the following are valid solution formats::

    1,2,3
    [1,2,3]

  However, if the solution is a multidimensional array, then
  all arrays that are not the outer-most array DO require the brackets.
  For example, an array of arrays can be submitted as one of the following::

    [1,2],[3,4]
    [[1,2],[3,4]]

* Numeric solutions should be submitted normally, as expected

Rewards
^^^^^^^
There are currently four possible rewards for solving a Coding Contract:

* Faction Reputation for a specific Faction
* Faction Reputation for all Factions that you are a member of
* Company reputation for a specific Company
* Money

The 'amount' of reward varies based on the difficulty of the problem
posed by the Coding Contract. There is no way to know what a
Coding Contract's exact reward will be until it is solved.

Notes
^^^^^

* The *scp* Terminal command does not work on Coding Contracts

List of all Problem Types
^^^^^^^^^^^^^^^^^^^^^^^^^

The following is a list of all of the problem types that a Coding Contract can contain.
The list contains the name of (i.e. the value returned by
:js:func:`getContractType`) and a brief summary of the problem it poses.

+------------------------------------+------------------------------------------------------------------------------------------+
| Name                               | Problem Summary                                                                          |
+====================================+==========================================================================================+
| Find Largest Prime Factor          | | Given a number, find its largest prime factor. A prime factor                          |
|                                    | | is a factor that is a prime number.                                                    |
+------------------------------------+------------------------------------------------------------------------------------------+
| Subarray with Maximum Sum          | | Given an array of integers, find the contiguous subarray (containing                   |
|                                    | | at least one number) which has the largest sum and return that sum.                    |
+------------------------------------+------------------------------------------------------------------------------------------+
| Total Ways to Sum                  | | Given a number, how many different ways can that number be written as                  |
|                                    | | a sum of at least two positive integers?                                               |
+------------------------------------+------------------------------------------------------------------------------------------+
| Spiralize Matrix                   | | Given an array of array of numbers representing a 2D matrix, return the                |
|                                    | | elements of that matrix in clockwise spiral order.                                     |
|                                    | |                                                                                        |
|                                    | | Example: The spiral order of                                                           |
|                                    | |                                                                                        |
|                                    | |  [1, 2, 3, 4]                                                                          |
|                                    | |  [5, 6, 7, 8]                                                                          |
|                                    | |  [9, 10, 11, 12]                                                                       |
|                                    | |                                                                                        |
|                                    | | is [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]                                             |
+------------------------------------+------------------------------------------------------------------------------------------+
| Array Jumping Game                 | | You are given an array of integers where each element represents the                   |
|                                    | | maximum possible jump distance from that position. For example, if you                 |
|                                    | | are at position i and your maximum jump length is n, then you can jump                 |
|                                    | | to any position from i to i+n.                                                         |
|                                    | |                                                                                        |
|                                    | | Assuming you are initially positioned at the start of the array, determine             |
|                                    | | whether you are able to reach the last index of the array EXACTLY.                     |
+------------------------------------+------------------------------------------------------------------------------------------+
| Merge Overlapping Intervals        | | Given an array of intervals, merge all overlapping intervals. An interval              |
|                                    | | is an array with two numbers, where the first number is always less than               |
|                                    | | the second (e.g. [1, 5]).                                                              |
|                                    | |                                                                                        |
|                                    | | The intervals must be returned in ASCENDING order.                                     |
|                                    | |                                                                                        |
|                                    | | Example:                                                                               |
|                                    | |  [[1, 3], [8, 10], [2, 6], [10, 16]]                                                   |
|                                    | | merges into [[1, 6], [8, 16]]                                                          |
+------------------------------------+------------------------------------------------------------------------------------------+
| Generate IP Addresses              | | Given a string containing only digits, return an array with all possible               |
|                                    | | valid IP address combinations that can be created from the string.                     |
|                                    | |                                                                                        |
|                                    | | An octet in the IP address cannot begin with '0' unless the number itself              |
|                                    | | is actually 0. For example, "192.168.010.1" is NOT a valid IP.                         |
|                                    | |                                                                                        |
|                                    | | Examples:                                                                              |
|                                    | |  25525511135 -> [255.255.11.135, 255.255.111.35]                                       |
|                                    | |  1938718066 -> [193.87.180.66]                                                         |
+------------------------------------+------------------------------------------------------------------------------------------+
| Algorithmic Stock Trader I         | | You are given an array of numbers representing stock prices, where the                 |
|                                    | | i-th element represents the stock price on day i.                                      |
|                                    | |                                                                                        |
|                                    | | Determine the maximum possible profit you can earn using at most one                   |
|                                    | | transaction (i.e. you can buy an sell the stock once).  If no profit                   |
|                                    | | can be made, then the answer should be 0. Note that you must buy the stock             |
|                                    | | before you can sell it.                                                                |
+------------------------------------+------------------------------------------------------------------------------------------+
| Algorithmic Stock Trader II        | | You are given an array of numbers representing stock prices, where the                 |
|                                    | | i-th element represents the stock price on day i.                                      |
|                                    | |                                                                                        |
|                                    | | Determine the maximum possible profit you can earn using as many transactions          |
|                                    | | as you'd like. A transaction is defined as buying and then selling one                 |
|                                    | | share of the stock. Note that you cannot engage in multiple transactions at            |
|                                    | | once. In other words, you must sell the stock before you buy it again. If no           |
|                                    | | profit can be made, then the answer should be 0.                                       |
+------------------------------------+------------------------------------------------------------------------------------------+
| Algorithmic Stock Trader III       | | You are given an array of numbers representing stock prices, where the                 |
|                                    | | i-th element represents the stock price on day i.                                      |
|                                    | |                                                                                        |
|                                    | | Determine the maximum possible profit you can earn using at most two                   |
|                                    | | transactions. A transaction is defined as buying and then selling one share            |
|                                    | | of the stock. Note that you cannot engage in multiple transactions at once.            |
|                                    | | In other words, you must sell the stock before you buy it again. If no profit          |
|                                    | | can be made, then the answer should be 0.                                              |
+------------------------------------+------------------------------------------------------------------------------------------+
| Algorithmic Stock Trader IV        | | You are given an array with two elements. The first element is an integer k.           |
|                                    | | The second element is an array of numbers representing stock prices, where the         |
|                                    | | i-th element represents the stock price on day i.                                      |
|                                    | |                                                                                        |
|                                    | | Determine the maximum possible profit you can earn using at most k transactions.       |
|                                    | | A transaction is defined as buying and then selling one share of the stock.            |
|                                    | | Note that you cannot engage in multiple transactions at once. In other words,          |
|                                    | | you must sell the stock before you can buy it. If no profit can be made, then          |
|                                    | | the answer should be 0.                                                                |
+------------------------------------+------------------------------------------------------------------------------------------+
| Minimum Path Sum in a Triangle     | | You are given a 2D array of numbers (array of array of numbers) that represents a      |
|                                    | | triangle (the first array has one element, and each array has one more element than    |
|                                    | | the one before it, forming a triangle). Find the minimum path sum from the top to the  |
|                                    | | bottom of the triangle. In each step of the path, you may only move to adjacent        |
|                                    | | numbers in the row below.                                                              |
+------------------------------------+------------------------------------------------------------------------------------------+
| Unique Paths in a Grid I           | | You are given an array with two numbers: [m, n]. These numbers represent a             |
|                                    | | m x n grid. Assume you are initially positioned in the top-left corner of that         |
|                                    | | grid and that you are trying to reach the bottom-right corner. On each step,           |
|                                    | | you may only move down or to the right.                                                |
|                                    | |                                                                                        |
|                                    |                                                                                          |
|                                    | | Determine how many unique paths there are from start to finish.                        |
+------------------------------------+------------------------------------------------------------------------------------------+
| Unique Paths in a Grid II          | | You are given a 2D array of numbers (array of array of numbers) representing           |
|                                    | | a grid. The 2D array contains 1's and 0's, where 1 represents an obstacle and          |
|                                    |                                                                                          |
|                                    | | 0 represents a free space.                                                             |
|                                    | |                                                                                        |
|                                    | | Assume you are initially positioned in top-left corner of that grid and that you       |
|                                    | | are trying to reach the bottom-right corner. In each step, you may only move down      |
|                                    | | or to the right. Furthermore, you cannot move onto spaces which have obstacles.        |
|                                    | |                                                                                        |
|                                    | | Determine how many unique paths there are from start to finish.                        |
+------------------------------------+------------------------------------------------------------------------------------------+
| Sanitize Parentheses in Expression | | Given a string with parentheses and letters, remove the minimum number of invalid      |
|                                    | | parentheses in order to validate the string. If there are multiple minimal ways        |
|                                    | | to validate the string, provide all of the possible results.                           |
|                                    | |                                                                                        |
|                                    | | The answer should be provided as an array of strings. If it is impossible to validate  |
|                                    | | the string, the result should be an array with only an empty string.                   |
|                                    | |                                                                                        |
|                                    | | Examples:                                                                              |
|                                    | |  ()())() -> ["()()()", "(())()"]                                                           |
|                                    | |  (a)())() -> ["(a)()()", "(a())()"]                                                        |
|                                    | |  )( -> [""]                                                                            |
+------------------------------------+------------------------------------------------------------------------------------------+
| Find All Valid Math Expressions    | | You are given a string which contains only digits between 0 and 9 as well as a target  |
|                                    | | number. Return all possible ways you can add the +, -, and * operators to the string   |
|                                    | | of digits such that it evaluates to the target number.                                 |
|                                    | |                                                                                        |
|                                    | | The answer should be provided as an array of strings containing the valid expressions. |
|                                    | |                                                                                        |
|                                    | | NOTE: Numbers in an expression cannot have leading 0's                                 |
|                                    | |                                                                                        |
|                                    | | Examples:                                                                              |
|                                    | |  Input: digits = "123", target = 6                                                     |
|                                    | |  Output: ["1+2+3", "1*2*3"]                                                                |
|                                    | |                                                                                        |
|                                    | |  Input: digits = "105", target = 5                                                     |
|                                    | |  Output: ["1*0+5", "10-5"]                                                                 |
+------------------------------------+------------------------------------------------------------------------------------------+
