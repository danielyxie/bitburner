.. _gameplay_scripts:

Scripts
=======
Scripts are programs that can be used to automate the hacking process
and almost every other part of the game. Scripts must be written
in the :ref:`netscript` language.

It is highly recommended that you have a basic background in programming
to start writing scripts. You by no means need to be an expert. All you
need is some familiarity with basic programming constructs like
for/while loops, conditionals (if/else), functions, variables, etc.
If you'd like to learn a little bit about programming, see
:ref:`netscriptlearntoprogram`.

Script Arguments
^^^^^^^^^^^^^^^^
When running a script, you can choose to pass arguments to that script.
The script's logic can access and act on these arguments. This allows
for flexibility in your scripts. For more details, see
:ref:`netscript_script_arguments`.

For information on how to run scripts with arguments, see
:ref:`gameplay_working_with_scripts_in_terminal` and
:ref:`gameplay_working_with_scripts_in_netscript` below.

Identifying a Script
^^^^^^^^^^^^^^^^^^^^
Many commands and functions act on an executing script
(i.e. a script that is running). Therefore, there must
be a way to specify which script you want those commands & functions
to act on.

**A script that is being executed is uniquely identified by both its
name and the arguments that it was run with.**

The arguments must be an **exact** match. This means that both
the order and type of the arguments matter.

Multithreading scripts
^^^^^^^^^^^^^^^^^^^^^^
A script can be run with multiple threads. This is also called multithreading.
The effect of multithreading is that every call to the
:js:func:`hack`, :js:func:`grow`, and :js:func:`weaken` Netscript functions
will have their results multiplied by the number of threads.
For example, if a normal single-threaded script
is able to hack $10,000, then running the same script with 5 threads would
yield $50,000.

(This is the **only** affect of running a script with multiple threads.
Scripts will not actually become multithreaded in the real-world
sense.)

When multithreading a script, the total RAM cost can be calculated by
simply multiplying the base RAM cost of the script with the number of
threads, where the base cost refers to the amount of RAM required to
run the script single-threaded. In the terminal, you can run the
:ref:`mem_terminal_command` Terminal command to see how much RAM a script
requires with `n` threads::

    $ mem [scriptname] -t n

.. _gameplay_working_with_scripts_in_terminal:

Working with Scripts in Terminal
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Running a script requires RAM. The more complex a script is, the more
RAM it requires to run. Scripts can be run on any server you have root
access to.

Here are some :ref:`terminal` commands that are useful when working
with scripts:

**check [script] [args...]**

Prints the logs of the script specified by the name and arguments to
Terminal. Arguments should be separated by a space. Remember that scripts
are uniquely identified by their arguments as well as their name. For
example, if you ran a script `foo.script` with the argument `foodnstuff`
then in order to 'check' it you must also add the `foodnstuff` argument
to the check command::

    $ check foo.script foodnstuff

**free**

Shows the current server's RAM usage and availability

**kill [script] [args...]**

Stops a script that is running with the specified script name and
arguments. Arguments should be separated by a space. Remember that
scripts are uniquely identified by their arguments as well as
their name. For example, if you ran a script `foo.script` with
the argument 1 and 2, then just typing "`kill foo.script`" will
not work. You have to use::

    $ kill foo.script 1 2

**mem [script] [-t] [n]**

Check how much RAM a script requires to run with n threads

**nano [script]**

Create/Edit a script. The name of the script must end with a valid
extension: .script, .js, or .ns

**ps**

Displays all scripts that are actively running on the current server

**rm [script]**

Delete a script from the server. This is permanent

**run [script] [-t] [n] [args...]**

Run a script with n threads and the specified arguments. Each argument should
be separated by a space. Both the arguments and thread specification are
optional. If neither are specified, then the script will be run single-threaded
with no arguments.

Examples:

Run 'foo.script' single-threaded with no arguments::

    $ run foo.script

Run 'foo.script' with 10 threads and no arguments::

    $ run foo.script -t 10

Run 'foo.script' single-threaded with three arguments: [foodnstuff, sigma-cosmetics, 10]::

    $ run foo.script foodnstuff sigma-cosmetics 10

Run 'foo.script' with 50 threads and a single argument: [foodnstuff]::

    $ run foo.script -t 50 foodnstuff


**tail [script] [args...]**

Displays the logs of the script specified by the name and arguments. Note that scripts are uniquely identified by their arguments as well as their name. For example, if you ran a script 'foo.script' with the argument 'foodnstuff' then in order to 'tail' it you must also add the 'foodnstuff' argument to the tail command as so:  tail foo.script foodnstuff

**top**

Displays all active scripts and their RAM usage

.. _gameplay_working_with_scripts_in_netscript:

Working with Scripts in Netscript
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
TODO/Coming Soon...

Notes about how Scripts Work Offline
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The scripts that you write and execute are interpreted in Javascript.
For this reason, it is not possible for these scripts to run while
offline (when the game is closed). It is important to note that for
this reason, conditionals such as if/else statements and certain
commands such as purchaseHacknetNode() or nuke() will not work while
the game is offline.

However, Scripts WILL continue to generate money and hacking exp
for you while the game is offline. This offline production is based
off of the scripts' production while the game is online.

grow() and weaken() are two Netscript commands that will also be
applied when the game is offline, although at a slower rate compared
to if the game was open. This is done by having each script keep
track of the rate at which the grow() and weaken() commands are called
when the game is online. These calculated rates are used to determine
how many times these function calls would be made while the game is
offline.

Also, note that because of the way the Netscript interpreter is
implemented, whenever you reload or re-open the game all of the
scripts that you are running will start running from the BEGINNING
of the code. The game does not keep track of where exactly the
execution of a script is when it saves/loads.
