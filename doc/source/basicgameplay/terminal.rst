.. _terminal:

Terminal
========
The Terminal is a console emulator program that lets you interface with all of the
Servers in the game. The Terminal can be accessed by clicking the 'Terminal' tab
on the navigation menu on the left-hand side of the game (you may need to expand
the 'Hacking' header in order to see the 'Terminal' tab). Alternatively, the :ref:`keyboard
shortcut <shortcuts>` Alt + t can be used to open the Terminal.

Configuration
-------------

The terminal has a configuration file called .fconf. To edit this file, go to
the terminal and enter::

    nano .fconf

Commands
--------

alias
^^^^^

    $ alias [-g] [name="value"]

Create or display aliases. An alias enables a replacement of a word with another
string. It can be used to abbreviate a commonly used command, or commonly used
parts of a command. The NAME of an alias defines the word that will be
replaced, while the VALUE defines what it will be replaced by. For example,
you could create the alias 'nuke' for the Terminal command 'run NUKE.exe'
using the following::

    $ alias nuke="run NUKE.exe"

Then, to run the NUKE.exe program you would just have to enter 'nuke' in
Terminal rather than the full command. It is important to note that 'default'
aliases will only be substituted for the first word of a Terminal command. For
example, if the following alias was set::

    $ alias worm="HTTPWorm.exe"

and then you tried to run the following terminal command::

    $ run worm

This would fail because the worm alias is not the first word of a Terminal
command. To allow an alias to be substituted anywhere in a Terminal command,
rather than just the first word, you must set it to be a global alias using the -g flag::

    $ alias -g worm="HTTPWorm.exe"

Now, the 'worm' alias will be substituted anytime it shows up as an individual word in
a Terminal command.

Entering just the command 'alias' without any arguments prints the list of all
defined aliases in the reusable form 'alias NAME=VALUE' on the Terminal.

The :ref:`unalias_terminal_command` Terminal command can be used to remove aliases.

.. _analyze_terminal_command:

analyze
^^^^^^^

Prints details and statistics about the current server. The information that is
printed includes basic server details such as the hostname, whether the player
has root access, what ports are opened/closed, and also hacking-related information
such as an estimated chance to successfully hack, an estimate of how much money is
available on the server, etc.

buy
^^^

    $ buy [-l/program]

Purchase a program through the Dark Web. Requires a TOR Router to use.

If this command is ran with the '-l' flag, it will display a list of all programs
that can be purchased through the Dark Web, as well as their costs.

Otherwise, the name of the program must be passed in as a parameter. This name
is NOT case-sensitive::

    $ buy brutessh.exe

Note that you do not need to be connected to the actual dark web server in order
to run this command. You can use this command at any time on the Terminal.

cat
^^^

    $ cat [filename]

Display a message (.msg), literature (.lit), or text (.txt) file::

    $ cat j1.msg
    $ cat foo.lit
    $ cat servers.txt

check
^^^^^

    $ check [script name] [args...]

Print the logs of the script specified by the script name and arguments to the Terminal.
Each argument must be separated by a space.
**Remember that a running script is uniquely identified both by its name and the arguments that are used to start it**. So,
if a script was ran with the following arguments::

    $ run foo.script 1 2 foodnstuff

Then to run the 'check' command on this script you would have to pass the same arguments in::

    $ check foo.script 1 2 foodnstuff

clear/cls
^^^^^^^^^


Clear the Terminal screen, deleting all of the text. Note that this does not
delete the user's command history, so using the up and down arrow keys is
still valid. Also note that this is permanent and there is no way to undo this.
Both 'clear' and 'cls' do the same thing::

    $ clear
    $ cls

connect
^^^^^^^

    $ connect [hostname/ip]

Connect to a remote server. The hostname or IP address of the remote server must
be given as the argument to this command. Note that only servers that are immediately
adjacent to the current server in the network can be connected to. To see which
servers can be connected to, use the 'scan' command.

download
^^^^^^^^

Downloads a script or text file to your computer (your real-life computer)::

    $ download masterScript.script
    $ download importantInfo.txt

You can also download all of your scripts/text files as a zip file using the following
Terminal commands::

    $ download *
    $ download *.script
    $ download *.txt

expr
^^^^

    $ expr [math expression]

Evaluate a mathematical expression. The expression is evaluated in JavaScript,
and therefore all JavaScript operators should be supported.

Examples::

    $ expr 5.6 * 10 - 123
    $ expr 3 ** 3


Evalutes a

free
^^^^

Display's the memory usage on the current machine. Print the amount of RAM that
is available on the current server as well as how much of it is being used.

hack
^^^^

Attempt to hack the current server. Requires root access in order to be run.

Related: Hacking Mechanics (TODO Add link here when page gets made)

help
^^^^

    $ help [command]

Display Terminal help information. Without arguments, 'help' prints a list of all
valid Terminal commands and a brief description of their functionality. You can
also pass the name of a Terminal command as an argument to 'help' to print more
detailed information about the Terminal command. Examples::

    $ help alias
    $ help scan-analyze


home
^^^^

Connect to your home computer. This will work no matter what server you are currently connected to.

hostname
^^^^^^^^

Prints the hostname of the server you are currently connected to.

ifconfig
^^^^^^^^

Prints the IP address of the server you are currently connected to.

kill
^^^^

    $ kill [script name] [args...]

Kill the script specified by the script name and arguments. Each argument must
be separated by a space. Remember that a running script is uniquely identified
by both its name and the arguments that are used to start it. So, if a script
was ran with the following arguments::

    $ run foo.script 50e3 sigma-cosmetics

Then to kill this script the same arguments would have to be used::

    $ kill foo.script 50e3 sigma-cosmetics

Note that after issuing the 'kill' command for a script, it may take a few seconds for
the script to actually stop running.

killall
^^^^^^^

Kills all scripts on the current server.

ls
^^

    $ ls [| grep pattern]

Prints files on the current server to the Terminal screen.

If this command is run with no arguments, then it prints all files on the current
server to the Terminal screen. The files will be displayed in alphabetical
order.

The '| grep pattern' is an optional parameter that can be used to only display files
whose filenames match the specified pattern. For example, if you wanted to only display
files with the .script extension, you could use::

    $ ls | grep .script

Alternatively, if you wanted to display all files with the word *purchase* in the filename,
you could use::

    $ ls | grep purchase


lscpu
^^^^^

Prints the number of CPU cores the current server has.

.. _mem_terminal_command:

mem
^^^

    $ mem [script name] [-t] [num threads]

Displays the amount of RAM needed to run the specified script with a single
thread. The command can also be used to print the amount of RAM needed to run
a script with multiple threads using the '-t' flag. If the '-t' flag is
specified, then an argument for the number of threads must be passed in
afterwards. Examples::

    $ mem foo.script
    $ mem foo.script -t 50

The first example above will print the amount of RAM needed to run 'foo.script'
with a single thread. The second example above will print the amount of RAM needed
to run 'foo.script' with 50 threads.

nano
^^^^

    $ nano [filename]

Opens up the specified file in the Text Editor. Only scripts (.script, .ns, .js) and
text files (.txt) can be edited. If the file does not already exist, then a new
empty file will be created.

ps
^^

Prints all scripts that are currently running on the current server.

rm
^^

    $ rm [filename]

Removes the specified file from the current server. This works for every file type
except literature files (.lit).

**WARNING: This is permanent and cannot be undone**


.. _run_terminal_command:

run
^^^

    $ run [file name] [-t] [num threads] [args...]

Execute a program, script, or :ref:`codingcontracts`.

The '[-t]', '[num threads]', and '[args...]' arguments are only valid when
running a script. The '-t' flag is used to indicate that the script should
be run with the specified number of threads. If the flag is omitted, then
the script will be run with a single thread by default. If the '-t' flag is
used, then it MUST come immediately after the script name, and the
[num threads] argument MUST come immediately afterwards.

[args...] represents a variable number of arguments that will be passed into
the script. See the documentation about script arguments. Each specified
argument must be separated by a space.

**Examples**

Run a program::

    $ run BruteSSH.exe

Run *foo.script* with 50 threads and the arguments [1e3, 0.5, foodnstuff]::

    $ run foo.script -t 50 1e3 0.5 foodnstuff

Run a Coding Contract::

    $ run foo-contract.cct

scan
^^^^

Prints all immediately-available network connections. This will print a list
of all servers that you can currently connect to using the 'connect' Terminal command.

scan-analyze
^^^^^^^^^^^^

    $ scan-analyze [depth]

Prints detailed information about all servers up to *[depth]* nodes away on the
network. Calling 'scan-analyze 1' will display information for the same servers
that are shown by the 'scan' Terminal command. This command also shows the
relative paths to reach each server.

By default, the maximum depth that can be specified for 'scan-analyze' is 3.
However, once you have the *DeepscanV1.exe* and *DeepscanV2.exe* programs, you can
execute 'scan-analyze' with a depth up to 5 and 10, respectively.

The information 'scan-analyze' displays about each server includes whether or
not you have root access to it, its required hacking level, the number of open
ports required to run NUKE.exe on it, and how much RAM it has.

scp
^^^

    $ scp [script name] [target server]

Copies the specified script from the current server to the target server.
The second argument passed in must be the hostname or IP of the target server.

sudov
^^^^^

Prints whether or not you have root access to the current server.

tail
^^^^

    $ tail [script name] [args...]

Displays dynamic logs for the script specified by the script name and arguments.
Each argument must be separated by a space. Remember that a running script is
uniquely identified by both its name and the arguments that were used to run
it. So, if a script was ran with the following arguments::

    $ run foo.script 10 50000

Then in order to check its logs with 'tail' the same arguments must be used::

    $ tail foo.script 10 50000

theme
^^^^^

    $ theme [preset] | [#background #text #highlight]

Change the color of the game's user interface

This command can be called with a preset theme. Currently, the supported presets are:

* default
* muted
* solarized

However, you can also specify your own color scheme using hex values.
To do so, you must specify three hex color values for the background
color, the text color, and the highlight color. These hex values must
be preceded by a pound sign (#) and must be either 3 or 6 digits. Example::

    $ theme #ffffff #385 #235012

A color picker such as Google's can be used to get your desired hex color values

top
^^^

Prints a list of all scripts running on the current server as well as their
thread count and how much RAM they are using in total.

.. _unalias_terminal_command:

unalias
^^^^^^^

    $ unalias "[alias name]"

Deletes the specified alias. Note that the double quotation marks are required.

As an example, if an alias was declared using::

    $ alias r="run"

Then it could be removed using::

    $ unalias "r"

It is not necessary to differentiate between global and non-global aliases when using 'unalias'

wget
^^^^

    $ wget [url] [target file]

Retrieves data from a url and downloads it to a file on the current server.
The data can only be downloaded to a script (.script, .ns, .js) or a text file
(.txt). If the target file already exists, it will be overwritten by this command.

Note that will not be possible to download data from many websites because they
do not allow cross-origin origin sharing (CORS). This includes websites such
as gist and pastebin. One notable site it will work on is rawgithub. Example::

    $ wget https://raw.githubusercontent.com/danielyxie/bitburner/master/README.md game_readme.txt

Argument Parsing
----------------
When evaluating a terminal command, arguments are initially parsed based on whitespace (usually spaces).
Each whitespace character signifies the end of an argument, and potentially the start
of new one. For most terminal commands, this is all you need to know.

When running scripts, however, it is important to know in more detail how arguments are parsed.
There are two main points:

1. Quotation marks can be used to wrap a single argument and force it to be parsed as
   a string. Any whitespace inside the quotation marks will not cause a new argument
   to be parsed.
2. Anything that can represent a number is automatically cast to a number, unless its
   surrounded by quotation marks.

Here's an example to show how these rules work. Consider the following script `argType.script`::

    tprint("Number of args: " + args.length);
    for (var i = 0; i < args.length; ++i) {
        tprint(typeof args[i]);
    }

Then if we run the following terminal command::

    $ run argType.script 123 1e3 "5" "this is a single argument"

We'll see the following in the Terminal::

    Running script with 1 thread(s) and args: [123, 1000, "5", "this is a single argument"].
    May take a few seconds to start up the process...
    argType.script: Number of args: 4
    argType.script: number
    argType.script: number
    argType.script: string
    argType.script: string

Chaining Commands
-----------------
You can run multiple Terminal commands at once by separating each command
with a semicolon (;).

Example::

    $ run foo.script; tail foo.script
