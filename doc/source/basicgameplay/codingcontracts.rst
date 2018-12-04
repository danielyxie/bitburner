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

* String-type solutions should not have quotation marks surrounding
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
