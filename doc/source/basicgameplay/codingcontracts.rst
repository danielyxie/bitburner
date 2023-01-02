.. _codingcontracts:

Coding Contracts
================
Coding Contracts are a mechanic that lets players earn rewards in
exchange for solving programming problems.

Coding Contracts are files with the ".cct" extensions. They can
be accessed through the :ref:`terminal`  or through scripts using
the `Coding Contract API <https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.codingcontract.md>`_

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
See the `Coding Contract API <https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.codingcontract.md>`_.
Interacting with Coding Contracts via the Terminal can be tedious the more
contracts you solve. Consider using the API to automate various aspects of
your solution. For example, some contracts have long solutions while others
have even longer solutions. You might want to use the API to automate the
process of submitting your solution rather than copy and paste a long
solution into an answer box.

However, using the API comes at a cost. Like most functions in other APIs,
each function in the Coding Contract API has a RAM cost. Depending on which
function you use, the initial RAM on your home server might not be enough
to allow you to use various API functions. Plan on upgrading the RAM on your
home server if you want to use the Coding Contract API.

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

+-----------------------------------------+------------------------------------------------------------------------------------------+
| Name                                    | Problem Summary                                                                          |
+=========================================+==========================================================================================+
| Find Largest Prime Factor               | | Given a number, find its largest prime factor. A prime factor                          |
|                                         | | is a factor that is a prime number.                                                    |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Subarray with Maximum Sum               | | Given an array of integers, find the contiguous subarray (containing                   |
|                                         | | at least one number) which has the largest sum and return that sum.                    |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Total Ways to Sum                       | | Given a number, how many different distinct ways can that number be written as         |
|                                         | | a sum of at least two positive integers?                                               |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Total Ways to Sum II                    | | You are given an array with two elements. The first element is an integer n.           |
|                                         | | The second element is an array of numbers representing the set of available integers.  |
|                                         | | How many different distinct ways can that number n be written as                       |
|                                         | | a sum of integers contained in the given set?                                          |
|                                         | | You may use each integer in the set zero or more times.                                |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Spiralize Matrix                        | | Given an array of array of numbers representing a 2D matrix, return the                |
|                                         | | elements of that matrix in clockwise spiral order.                                     |
|                                         | |                                                                                        |
|                                         | | Example: The spiral order of                                                           |
|                                         | |                                                                                        |
|                                         | |  [1, 2, 3, 4]                                                                          |
|                                         | |  [5, 6, 7, 8]                                                                          |
|                                         | |  [9, 10, 11, 12]                                                                       |
|                                         | |                                                                                        |
|                                         | | is [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]                                             |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Array Jumping Game                      | | You are given an array of integers where each element represents the                   |
|                                         | | maximum possible jump distance from that position. For example, if you                 |
|                                         | | are at position i and your maximum jump length is n, then you can jump                 |
|                                         | | to any position from i to i+n.                                                         |
|                                         | |                                                                                        |
|                                         | | Assuming you are initially positioned at the start of the array, determine             |
|                                         | | whether you are able to reach the last index of the array.                             |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Array Jumping Game II                   | | You are given an array of integers where each element represents the                   |
|                                         | | maximum possible jump distance from that position. For example, if you                 |
|                                         | | are at position i and your maximum jump length is n, then you can jump                 |
|                                         | | to any position from i to i+n.                                                         |
|                                         | |                                                                                        |
|                                         | | Assuming you are initially positioned at the start of the array, determine             |
|                                         | | the minimum number of jumps to reach the end of the array.                             |
|                                         | |                                                                                        |
|                                         | | If it's impossible to reach the end, then the answer should be 0.                      |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Merge Overlapping Intervals             | | Given an array of intervals, merge all overlapping intervals. An interval              |
|                                         | | is an array with two numbers, where the first number is always less than               |
|                                         | | the second (e.g. [1, 5]).                                                              |
|                                         | |                                                                                        |
|                                         | | The intervals must be returned in ASCENDING order.                                     |
|                                         | |                                                                                        |
|                                         | | Example:                                                                               |
|                                         | |  [[1, 3], [8, 10], [2, 6], [10, 16]]                                                   |
|                                         | | merges into [[1, 6], [8, 16]]                                                          |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Generate IP Addresses                   | | Given a string containing only digits, return an array with all possible               |
|                                         | | valid IP address combinations that can be created from the string.                     |
|                                         | |                                                                                        |
|                                         | | An octet in the IP address cannot begin with '0' unless the number itself              |
|                                         | | is actually 0. For example, "192.168.010.1" is NOT a valid IP.                         |
|                                         | |                                                                                        |
|                                         | | Examples:                                                                              |
|                                         | |  25525511135 -> [255.255.11.135, 255.255.111.35]                                       |
|                                         | |  1938718066 -> [193.87.180.66]                                                         |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Algorithmic Stock Trader I              | | You are given an array of numbers representing stock prices, where the                 |
|                                         | | i-th element represents the stock price on day i.                                      |
|                                         | |                                                                                        |
|                                         | | Determine the maximum possible profit you can earn using at most one                   |
|                                         | | transaction (i.e. you can buy an sell the stock once).  If no profit                   |
|                                         | | can be made, then the answer should be 0. Note that you must buy the stock             |
|                                         | | before you can sell it.                                                                |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Algorithmic Stock Trader II             | | You are given an array of numbers representing stock prices, where the                 |
|                                         | | i-th element represents the stock price on day i.                                      |
|                                         | |                                                                                        |
|                                         | | Determine the maximum possible profit you can earn using as many transactions          |
|                                         | | as you'd like. A transaction is defined as buying and then selling one                 |
|                                         | | share of the stock. Note that you cannot engage in multiple transactions at            |
|                                         | | once. In other words, you must sell the stock before you buy it again. If no           |
|                                         | | profit can be made, then the answer should be 0.                                       |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Algorithmic Stock Trader III            | | You are given an array of numbers representing stock prices, where the                 |
|                                         | | i-th element represents the stock price on day i.                                      |
|                                         | |                                                                                        |
|                                         | | Determine the maximum possible profit you can earn using at most two                   |
|                                         | | transactions. A transaction is defined as buying and then selling one share            |
|                                         | | of the stock. Note that you cannot engage in multiple transactions at once.            |
|                                         | | In other words, you must sell the stock before you buy it again. If no profit          |
|                                         | | can be made, then the answer should be 0.                                              |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Algorithmic Stock Trader IV             | | You are given an array with two elements. The first element is an integer k.           |
|                                         | | The second element is an array of numbers representing stock prices, where the         |
|                                         | | i-th element represents the stock price on day i.                                      |
|                                         | |                                                                                        |
|                                         | | Determine the maximum possible profit you can earn using at most k transactions.       |
|                                         | | A transaction is defined as buying and then selling one share of the stock.            |
|                                         | | Note that you cannot engage in multiple transactions at once. In other words,          |
|                                         | | you must sell the stock before you can buy it. If no profit can be made, then          |
|                                         | | the answer should be 0.                                                                |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Minimum Path Sum in a Triangle          | | You are given a 2D array of numbers (array of array of numbers) that represents a      |
|                                         | | triangle (the first array has one element, and each array has one more element than    |
|                                         | | the one before it, forming a triangle). Find the minimum path sum from the top to the  |
|                                         | | bottom of the triangle. In each step of the path, you may only move to adjacent        |
|                                         | | numbers in the row below.                                                              |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Unique Paths in a Grid I                | | You are given an array with two numbers: [m, n]. These numbers represent a             |
|                                         | | m x n grid. Assume you are initially positioned in the top-left corner of that         |
|                                         | | grid and that you are trying to reach the bottom-right corner. On each step,           |
|                                         | | you may only move down or to the right.                                                |
|                                         | |                                                                                        |
|                                         | |                                                                                        |
|                                         | | Determine how many unique paths there are from start to finish.                        |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Unique Paths in a Grid II               | | You are given a 2D array of numbers (array of array of numbers) representing           |
|                                         | | a grid. The 2D array contains 1's and 0's, where 1 represents an obstacle and          |
|                                         | |                                                                                        |
|                                         | | 0 represents a free space.                                                             |
|                                         | |                                                                                        |
|                                         | | Assume you are initially positioned in top-left corner of that grid and that you       |
|                                         | | are trying to reach the bottom-right corner. In each step, you may only move down      |
|                                         | | or to the right. Furthermore, you cannot move onto spaces which have obstacles.        |
|                                         | |                                                                                        |
|                                         | | Determine how many unique paths there are from start to finish.                        |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Shortest Path in a Grid                 | | You are given a 2D array of numbers (array of array of numbers) representing           |
|                                         | | a grid. The 2D array contains 1's and 0's, where 1 represents an obstacle and          |
|                                         | | 0 represents a free space.                                                             |
|                                         | |                                                                                        |
|                                         | | Assume you are initially positioned in top-left corner of that grid and that you       |
|                                         | | are trying to reach the bottom-right corner. In each step, you may move to the up,     |
|                                         | | down, left or right. Furthermore, you cannot move onto spaces which have obstacles.    |
|                                         | |                                                                                        |
|                                         | | Determine if paths exist from start to destination, and find the shortest one.         |
|                                         | |                                                                                        |
|                                         | | Examples:                                                                              |
|                                         | |  [[0,1,0,0,0],                                                                         |
|                                         | |   [0,0,0,1,0]] -> "DRRURRD"                                                            |
|                                         | |  [[0,1],                                                                               |
|                                         | |   [1,0]]       -> ""                                                                   |
|                                         | |                                                                                        |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Sanitize Parentheses in Expression      | | Given a string with parentheses and letters, remove the minimum number of invalid      |
|                                         | | parentheses in order to validate the string. If there are multiple minimal ways        |
|                                         | | to validate the string, provide all of the possible results.                           |
|                                         | |                                                                                        |
|                                         | | The answer should be provided as an array of strings. If it is impossible to validate  |
|                                         | | the string, the result should be an array with only an empty string.                   |
|                                         | |                                                                                        |
|                                         | | Examples:                                                                              |
|                                         | |  ()())() -> [()()(), (())()]                                                           |
|                                         | |  (a)())() -> [(a)()(), (a())()]                                                        |
|                                         | |  )( -> [""]                                                                            |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Find All Valid Math Expressions         | | You are given a string which contains only digits between 0 and 9 as well as a target  |
|                                         | | number. Return all possible ways you can add the +, -, and * operators to the string   |
|                                         | | of digits such that it evaluates to the target number.                                 |
|                                         | |                                                                                        |
|                                         | | The answer should be provided as an array of strings containing the valid expressions. |
|                                         | |                                                                                        |
|                                         | | NOTE: Numbers in an expression cannot have leading 0's                                 |
|                                         | | NOTE: The order of evaluation expects script operator precedence                       |
|                                         | |                                                                                        |
|                                         | | Examples:                                                                              |
|                                         | |  Input: digits = "123", target = 6                                                     |
|                                         | |  Output: [1+2+3, 1*2*3]                                                                |
|                                         | |                                                                                        |
|                                         | |  Input: digits = "105", target = 5                                                     |
|                                         | |  Output: [1*0+5, 10-5]                                                                 |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| HammingCodes: Integer to Encoded Binary | | You are given a decimal value.                                                         |
|                                         | | Convert it into a binary string and encode it as a 'Hamming-Code'. eg:                 |
|                                         | | Value 8 will result into binary '1000', which will be encoded                          |
|                                         | | with the pattern 'pppdpddd', where p is a paritybit and d a databit. The encoding of   |
|                                         | | 8 is 11110000. As another example, '10101' (Value 21) will result into (pppdpdddpd)    |
|                                         | | '1001101011'.                                                                          |
|                                         | | NOTE: You need an parity Bit on Index 0 as an 'overall'-paritybit.                     |
|                                         | | NOTE 2: You should watch the HammingCode-video from 3Blue1Brown, which                 |
|                                         | | explains the 'rule' of encoding,                                                       |
|                                         | | including the first Index parity-bit mentioned on the first note.                      |
|                                         | | Now the only one rule for this encoding:                                               |
|                                         | |  It's not allowed to add additional leading '0's to the binary value                   |
|                                         | | That means, the binary value has to be encoded as it is                                |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| HammingCodes: Encoded Binary to Integer | | You are given an encoded binary string.                                                |
|                                         | | Treat it as a Hammingcode with 1 'possible' error on an random Index.                  |
|                                         | | Find the 'possible' wrong bit, fix it and extract the decimal value, which is          |
|                                         | | hidden inside the string.\n\n",                                                        |
|                                         | | Note: The length of the binary string is dynamic, but its encoding/decoding is         |
|                                         | | following Hammings 'rule'\n",                                                          |
|                                         | | Note 2: Index 0 is an 'overall' parity bit. Watch the Hammingcode-video from           |
|                                         | | 3Blue1Brown for more information\n",                                                   |
|                                         | | Note 3: There's a ~55% chance for an altered Bit. So... MAYBE                          |
|                                         | | there is an altered Bit 😉\n",                                                         |
|                                         | | Extranote for automation: return the decimal value as a string",                       |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Proper 2-Coloring of a Graph            | | You are given data, representing a graph. Note that "graph", as used here, refers to   |
|                                         | | the field of graph theory, and has no relation to statistics or plotting.              |
|                                         | |                                                                                        |
|                                         | | The first element of the data represents the number of vertices in the graph. Each     |
|                                         | | vertex is a unique number between 0 and ${data[0] - 1}. The next element of the data   |
|                                         | | represents the edges of the graph.                                                     |
|                                         | |                                                                                        |
|                                         | | Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v].     |
|                                         | | Note that an edge [u,v] is the same as an edge [v,u], as order does not matter.        |
|                                         | |                                                                                        |
|                                         | | You must construct a 2-coloring of the graph, meaning that you have to assign each     |
|                                         | | vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have  |
|                                         | | the same color. Submit your answer in the form of an array, where element i            |
|                                         | | represents the color of vertex i. If it is impossible to construct a 2-coloring of     |
|                                         | | the given graph, instead submit an empty array.                                        |
|                                         | |                                                                                        |
|                                         | | Examples:                                                                              |
|                                         | |                                                                                        |
|                                         | | Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]                                           |
|                                         | | Output: [0, 0, 1, 1]                                                                   |
|                                         | |                                                                                        |
|                                         | | Input: [3, [[0, 1], [0, 2], [1, 2]]]                                                   |
|                                         | | Output: []                                                                             |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Compression I: RLE Compression          | | Run-length encoding (RLE) is a data compression technique which encodes data as a      |
|                                         | | series of runs of a repeated single character. Runs are encoded as a length, followed  |
|                                         | | by the character itself. Lengths are encoded as a single ASCII digit; runs of 10       |
|                                         | | characters or more are encoded by splitting them into multiple runs.                   |
|                                         | |                                                                                        |
|                                         | | You are given a string as input. Encode it using run-length encoding with the minimum  |
|                                         | | possible output length.                                                                |
|                                         | |                                                                                        |
|                                         | | Examples:                                                                              |
|                                         | |  aaaaabccc            ->  5a1b3c                                                       |
|                                         | |  aAaAaA               ->  1a1A1a1A1a1A                                                 |
|                                         | |  111112333            ->  511233                                                       |
|                                         | |  zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)                                    |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Compression II: LZ Decompression        | | Lempel-Ziv (LZ) compression is a data compression technique which encodes data using   |
|                                         | | references to earlier parts of the data. In this variant of LZ, data is encoded in two |
|                                         | | types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit     |
|                                         | | from 1 - 9, followed by the chunk data, which is either:                               |
|                                         | |                                                                                        |
|                                         | |  1. Exactly L characters, which are to be copied directly into the uncompressed data.  |
|                                         | |  2. A reference to an earlier part of the uncompressed data. To do this, the length    |
|                                         | |     is followed by a second ASCII digit X: each of the L output characters is a copy   |
|                                         | |     of the character X places before it in the uncompressed data.                      |
|                                         | |                                                                                        |
|                                         | | For both chunk types, a length of 0 instead means the chunk ends immediately, and the  |
|                                         | | next character is the start of a new chunk. The two chunk types alternate, starting    |
|                                         | | with type 1, and the final chunk may be of either type.                                |
|                                         | |                                                                                        |
|                                         | | You are given an LZ-encoded string. Decode it and output the original string.          |
|                                         | |                                                                                        |
|                                         | | Example: decoding '5aaabb450723abb' chunk-by-chunk                                     |
|                                         | |  5aaabb           ->  aaabb                                                            |
|                                         | |  5aaabb45         ->  aaabbaaab                                                        |
|                                         | |  5aaabb450        ->  aaabbaaab                                                        |
|                                         | |  5aaabb45072      ->  aaabbaaababababa                                                 |
|                                         | |  5aaabb450723abb  ->  aaabbaaababababaabb                                              |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Compression III: LZ Compression         | | Lempel-Ziv (LZ) compression is a data compression technique which encodes data using   |
|                                         | | references to earlier parts of the data. In this variant of LZ, data is encoded in two |
|                                         | | types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit     |
|                                         | | from 1 - 9, followed by the chunk data, which is either:                               |
|                                         | |                                                                                        |
|                                         | |  1. Exactly L characters, which are to be copied directly into the uncompressed data.  |
|                                         | |  2. A reference to an earlier part of the uncompressed data. To do this, the length    |
|                                         | |     is followed by a second ASCII digit X: each of the L output characters is a copy   |
|                                         | |     of the character X places before it in the uncompressed data.                      |
|                                         | |                                                                                        |
|                                         | | For both chunk types, a length of 0 instead means the chunk ends immediately, and the  |
|                                         | | next character is the start of a new chunk. The two chunk types alternate, starting    |
|                                         | | with type 1, and the final chunk may be of either type.                                |
|                                         | |                                                                                        |
|                                         | | You are given a string as input. Encode it using Lempel-Ziv encoding with the minimum  |
|                                         | | possible output length.                                                                |
|                                         | |                                                                                        |
|                                         | | Examples (some have other possible encodings of minimal length):                       |
|                                         | |  abracadabra     ->  7abracad47                                                        |
|                                         | |  mississippi     ->  4miss433ppi                                                       |
|                                         | |  aAAaAAaAaAA     ->  3aAA53035                                                         |
|                                         | |  2718281828      ->  627182844                                                         |
|                                         | |  abcdefghijk     ->  9abcdefghi02jk                                                    |
|                                         | |  aaaaaaaaaaaa    ->  3aaa91                                                            |
|                                         | |  aaaaaaaaaaaaa   ->  1a91031                                                           |
|                                         | |  aaaaaaaaaaaaaa  ->  1a91041                                                           |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Encryption I: Caesar Cipher             | | Caesar cipher is one of the simplest encryption technique.  It is a type of            |
|                                         | | substitution cipher in which each letter in the plaintext is replaced by a letter some |
|                                         | | fixed number of positions down the alphabet. For example, with a left shift of 3, D    |
|                                         | | would be replaced by A, E would become B, and A would become X (because of rotation).  |
|                                         | | You are given an array with two elements. The first element is the plaintext, the      |
|                                         | | second element is the left shift value. Return the ciphertext as uppercase string.     |
|                                         | | Spaces remains the same.                                                               |
+-----------------------------------------+------------------------------------------------------------------------------------------+
| Encryption II: Vigenère Cipher          | | Vigenère cipher is a type of polyalphabetic substitution. It uses the Vigenère square  |
|                                         | | to encrypt and decrypt plaintext with a keyword.                                       |
|                                         | |   Vignenère square:                                                                    |
|                                         | |          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z                           |
|                                         | |        +----------------------------------------------------                           |
|                                         | |      A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z                           |
|                                         | |      B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A                           |
|                                         | |      C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B                           |
|                                         | |      D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C                           |
|                                         | |      E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D                           |
|                                         | |                   ...                                                                  |
|                                         | |      Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X                           |
|                                         | |      Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y                           |
|                                         | | For encryption each letter of the plaintext is paired with the corresponding letter of |
|                                         | | a repeating keyword. For example, the plaintext DASHBOARD is encrypted with the        |
|                                         | | keyword LINUX:                                                                         |
|                                         | |   Plaintext: DASHBOARD                                                                 |
|                                         | |   Keyword:   LINUXLINU                                                                 |
|                                         | | So, the first letter D is paired with the first letter of the key L. Therefore, row D  |
|                                         | | and column L of the Vigenère square are used to get the first cipher letter O. This    |
|                                         | | must be repeated for the whole ciphertext.                                             |
|                                         | | You are given an array with two elements. The first element is the plaintext, the      |
|                                         | | second element is the keyword. Return the ciphertext as uppercase string.              |
+-----------------------------------------+------------------------------------------------------------------------------------------+
