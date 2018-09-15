Netscript Basic Functions
=========================

This page contains the complete documentation for all functions that are available in Netscript.
This includes information such as function signatures, what they do, and their return values.

At the end is also a section that describes how to define your own functions in Netscript.

hack
^^^^

.. js:function:: hack(hostname/ip)

    :param string hostname/ip: IP or hostname of the target server to hack
    :returns: The amount of money stolen if the hack is successful, and zero otherwise

    Function that is used to try and hack servers to steal money and gain hacking experience. The runtime for this command depends
    on your hacking level and the target server's security level. In order to hack a server you must first gain root access
    to that server and also have the required hacking level.

    A script can hack a server from anywhere. It does not need to be running on the same server to hack that server. For example,
    you can create a script that hacks the 'foodnstuff' server and run that script on any server in the game.

    A successful hack() on a server will raise that server's security level by 0.002.

    Example::

        hack("foodnstuff");
        hack("10.1.2.3");

grow
^^^^

.. js:function:: grow(hostname/ip)

    :param string hostname/ip: IP or hostname of the target server to grow
    :returns: The number by which the money on the server was multiplied for the growth

    Use your hacking skills to increase the amount of money available on a server. The runtime for this command depends on your hacking
    level and the target server's security level. When grow() completes, the money available on a target server will be increased by a
    certain, fixed percentage. This percentage is determined by the target server's growth rate (which varies between servers) and security level.
    Generally, higher-level servers have higher growth rates. The getServerGrowth() function can be used to obtain a server's growth rate.

    Like hack(), grow() can be called on any server, regardless of where the script is running. The grow() command requires
    root access to the target server, but there is no required hacking level to run the command. It also raises the security level
    of the target server by 0.004.

    Example::

        grow("foodnstuff");

weaken
^^^^^^

.. js:function:: weaken(hostname/ip)

    :param string hostname.ip: IP or hostname of the target server to weaken
    :returns: The amount by which the target server's security level was decreased. This is equivalent to 0.05 multiplied
              by the number of script threads

    Use your hacking skills to attack a server's security, lowering the server's security level. The runtime for this command
    depends on your hacking level and the target server's security level. This function lowers the security level of the target
    server by 0.05.

    Like hack() and grow(), weaken() can be called on any server, regardless of where the script is running. This command requires
    root access to the target server, but there is no required hacking level to run the command.

    Example::

        weaken("foodnstuff");

sleep
^^^^^

.. js:function:: sleep(n)

    :param number n: Number of milliseconds to sleep

    Suspends the script for n milliseconds.

print
^^^^^

.. js:function:: print(x)

    :param x: Value to be printed

    Prints a value or a variable to the script's logs.

tprint
^^^^^^

.. js:function:: tprint(x)

    :param x: Value to be printed

    Prints a value or a variable to the Terminal

clearLog
^^^^^^^^

.. js:function:: clearLog()

    Clears the script's logs

disableLog
^^^^^^^^^^

.. js:function:: disableLog(fn)

    :param string fn: Name of function for which to disable logging

    Disables logging for the given function. Logging can be disabled for
    all functions by passing 'ALL' as the argument.

    Note that this does not completely remove all logging functionality.
    This only stops a function from logging
    when the function is successful. If the function fails, it will still log the reason for failure.

    Notable functions that cannot have their logs disabled: run, exec, exit

enableLog
^^^^^^^^^

.. js:function:: enableLog(fn)

    :param string fn: Name of function for which to enable logging

    Re-enables logging for the given function. If 'ALL' is passed into this function
    as an argument, then it will revert the effects of disableLog('ALL')

isLogEnabled
^^^^^^^^^^^^

.. js:function:: isLogEnabled(fn)

    :param string fn: Name of function to check

    Returns a boolean indicating whether or not logging is enabled for that
    function (or 'ALL')

getScriptLogs
^^^^^^^^^^^^^

.. js:function:: getScriptLogs()

    Returns the script's logs. The logs are returned as an array, where each
    line is an element in the array. The most recently logged line is at the
    end of the array.

    Note that there is a maximum number of lines that a script stores in its logs.
    This is configurable in the game's options.

scan
^^^^

.. js:function:: scan(hostname/ip[, hostnames=true])

    :param string hostname/ip: IP or hostname of the server to scan
    :param boolean: Optional boolean specifying whether the function should output hostnames (if true) or IP addresses (if false)

    Returns an array containing the hostnames or IPs of all servers that are one node way from the specified target server. The
    hostnames/IPs in the returned array are strings.

nuke
^^^^

.. js:function:: nuke(hostname/ip)

    :param string hostname/ip: IP or hostname of the target server

    Runs the NUKE.exe program on the target server. NUKE.exe must exist on your home computer.

    Example::

        nuke("foodnstuff");

brutessh
^^^^^^^^

.. js:function:: brutessh(hostname/ip)

    :param string hostname/ip: IP or hostname of the target server

    Runs the BruteSSH.exe program on the target server. BruteSSH.exe must exist on your home computer.

    Example::

        brutessh("foodnstuff");

ftpcrack
^^^^^^^^

.. js:function:: ftpcrack(hostname/ip)

    :param string hostname/ip: IP or hostname of the target server

    Runs the FTPCrack.exe program on the target server. FTPCrack.exe must exist on your home computer.

    Example::

        ftpcrack("foodnstuff");

relaysmtp
^^^^^^^^^

.. js:function:: relaysmtp(hostname/ip)

    :param string hostname/ip: IP or hostname of the target server

    Runs the relaySMTP.exe program on the target server. relaySMTP.exe must exist on your home computer.

    Example::

        relaysmtp("foodnstuff");

httpworm
^^^^^^^^

.. js:function:: httpworm(hostname/ip)

    :param string hostname/ip: IP or hostname of the target server

    Runs the HTTPWorm.exe program on the target server. HTTPWorm.exe must exist on your home computer.

    Example::

        httpworm("foodnstuff");

sqlinject
^^^^^^^^^

.. js:function:: sqlinject(hostname/ip)

    :param string hostname/ip: IP or hostname of the target server

    Runs the SQLInject.exe program on the target server. SQLInject.exe must exist on your home computer.

    Example::

        sqlinject("foodnstuff");

run
^^^

.. js:function:: run(script, [numThreads=1], [args...])

    :param string script: Filename of script to run
    :param number numThreads: Optional thread count for new script. Set to 1 by default. Will be rounded to nearest integer
    :param args...:
        Additional arguments to pass into the new script that is being run. Note that if any arguments are being
        passed into the new script, then the second argument *numThreads* must be filled in with a value.

    Run a script as a separate process. This function can only be used to run scripts located on the current server (the server
    running the script that calls this function).

    Returns true if the script is successfully started, and false otherwise. Requires a significant amount of RAM to run this
    command.

    The simplest way to use the *run* command is to call it with just the script name. The following example will run
    'foo.script' single-threaded with no arguments::

        run("foo.script");

    The following example will run 'foo.script' but with 5 threads instead of single-threaded::

        run("foo.script", 5);

    This next example will run 'foo.script' single-threaded, and will pass the string 'foodnstuff' into the script
    as an argument::

        run("foo.script", 1, 'foodnstuff');

exec
^^^^

.. js:function:: exec(script, hostname/ip, [numThreads=1], [args...])

    :param string script: Filename of script to execute
    :param string hostname/ip: IP or hostname of the 'target server' on which to execute the script
    :param number numThreads: Optional thread count for new script. Set to 1 by default. Will be rounded to nearest integer
    :param args...:
        Additional arguments to pass into the new script that is being run. Note that if any arguments are being
        passed into the new script, then the third argument *numThreads* must be filled in with a value.

    Run a script as a separate process on a specified server. This is similar to the *run* function except
    that it can be used to run a script on any server, instead of just the current server.

    Returns true if the script is successfully started, and false otherwise.

    The simplest way to use the *exec* command is to call it with just the script name and the target server.
    The following example will try to run *generic-hack.script* on the *foodnstuff* server::

        exec("generic-hack.script", "foodnstuff");

    The following example will try to run the script *generic-hack.script* on the *joesguns* server with 10 threads::

        exec("generic-hack.script", "joesguns", 10);

    This last example will try to run the script *foo.script* on the *foodnstuff* server with 5 threads. It will also pass
    the number 1 and the string "test" in as arguments to the script::

        exec("foo.script", "foodnstuff", 5, 1, "test");

spawn
^^^^^

.. js:function:: spawn(script, numThreads, [args...])

    :param string script: Filename of script to execute
    :param number numThreads: Number of threads to spawn new script with. Will be rounded to nearest integer
    :param args...:
        Additional arguments to pass into the new script that is being run.

    Terminates the current script, and then after a delay of about 20 seconds it will execute the newly-specified script.
    The purpose of this function is to execute a new script without being constrained by the RAM usage of the current one.
    This function can only be used to run scripts on the local server.

    Because this function immediately terminates the script, it does not have a return value.

    The following example will execute the script 'foo.script' with 10 threads and the arguments 'foodnstuff' and 90::

        spawn('foo.script', 10, 'foodnstuff', 90);

kill
^^^^

.. js:function:: kill(script, hostname/ip, [args...])

    :param string script: Filename of the script to kill
    :param string hostname/ip: IP or hostname of the server on which to kill the script
    :param args...: Arguments to identify which script to kill

    Kills the script on the target server specified by the script's name and arguments. Remember that scripts
    are uniquely identified by both their name and arguments. For example, if *foo.script* is run with the argument 1, then this
    is not the same as *foo.script* run with the argument 2, even though they have the same code.

    If this function successfully kills the specified script, then it will return true. Otherwise, it will return false.

    Examples:

    The following example will try to kill a script named *foo.script* on the *foodnstuff* server that was ran with no arguments::

        kill("foo.script", "foodnstuff");

    The following will try to kill a script named *foo.script* on the current server that was ran with no arguments::

        kill("foo.script", getHostname());

    The following will try to kill a script named *foo.script* on the current server that was ran with the arguments 1 and "foodnstuff"::

        kill("foo.script", getHostname(), 1, "foodnstuff");

killall
^^^^^^^

.. js:function:: killall(hostname/ip)

    :param string hostname/ip: IP or hostname of the server on which to kill all scripts

    Kills all running scripts on the specified server. This function returns true if any scripts were killed, and
    false otherwise. In other words, it will return true if there are any scripts running on the target server.


exit
^^^^

.. js:function:: exit()

    Terminates the current script immediately

scp
^^^

.. js:function:: scp(files, [source], destination)

    :param string/array files: Filename or an array of filenames of script/literature files to copy
    :param string source:
        Hostname or IP of the source server, which is the server from which the file will be copied.
        This argument is optional and if it's omitted the source will be the current server.
    :param string destination: Hostname or IP of the destination server, which is the server to which the file will be copied.

    Copies a script or literature (.lit) file(s) to another server. The *files* argument can be either a string specifying a
    single file to copy, or an array of strings specifying multiple files to copy.

    Returns true if the script/literature file is successfully copied over and false otherwise. If the *files* argument is an array
    then this function will return true if at least one of the files in the array is successfully copied.

    Examples::

        //Copies hack-template.script from the current server to foodnstuff
        scp("hack-template.script", "foodnstuff");

        //Copies foo.lit from the helios server to the home computer
        scp("foo.lit", "helios", "home");

        //Tries to copy three files from rothman-uni to home computer
        files = ["foo1.lit", "foo2.script", "foo3.script"];
        scp(files, "rothman-uni", "home");

ls
^^

.. js:function:: ls(hostname/ip, [grep])

    :param string hostname/ip: Hostname or IP of the target server
    :param string grep: a substring to search for in the filename

    Returns an array with the filenames of all files on the specified server (as strings). The returned array
    is sorted in alphabetic order

ps
^^

.. js:function:: ps(hostname/ip=current ip)

    :param string ip: Hostname or IP address of the target server.
                      If not specified, it will be the current server's IP by default

    Returns an array with general information about all scripts running on the specified
    target server. The information for each server is given in an object with
    the following structure::

        {
            filename:   Script name,
            threads:    Number of threads script is running with,
            args:       Script's arguments
        }

    Example usage (using :doc:`netscriptjs`)::

        export async function main(ns) {
            const ps = ns.ps("home");
            for (let i = 0; i < ps.length; ++i) {
                ns.tprint(ps[i].filename + ' ' + ps[i].threads);
                ns.tprint(ps[i].args);
            }
        }

hasRootAccess
^^^^^^^^^^^^^

.. js:function:: hasRootAccess(hostname/ip)

    :param string hostname/ip: Hostname or IP of the target server

    Returns a boolean indicating whether or not the player has root access to the specified target server.

    Example::

        if (hasRootAccess("foodnstuff") == false) {
            nuke("foodnstuff");
        }

getHostname
^^^^^^^^^^^

.. js:function:: getHostname()

    Returns a string with the hostname of the server that the script is running on

getHackingLevel
^^^^^^^^^^^^^^^

.. js:function:: getHackingLevel()

    Returns the player's current hacking level

getHackingMultipliers
^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getHackingMultipliers()

    Returns an object containing the Player's hacking related multipliers. These multipliers are
    returned in fractional forms, not percentages (e.g. 1.5 instead of 150%). The object has the following structure::

        {
            chance: Player's hacking chance multiplier,
            speed: Player's hacking speed multiplier,
            money: Player's hacking money stolen multiplier,
            growth: Player's hacking growth multiplier
        }

    Example of how this can be used::

        mults = getHackingMultipliers();
        print(mults.chance);
        print(mults.growth);

getHacknetMultipliers
^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getHacknetMultipliers()

    Returns an object containing the Player's hacknet related multipliers. These multipliers are
    returned in fractional forms, not percentages (e.g. 1.5 instead of 150%). The object has the following structure::

        {
            production: Player's hacknet production multiplier,
            purchaseCost: Player's hacknet purchase cost multiplier,
            ramCost: Player's hacknet ram cost multiplier,
            coreCost: Player's hacknet core cost multiplier,
            levelCost: Player's hacknet level cost multiplier
        }

    Example of how this can be used::

        mults = getHacknetMultipliers();
        print(mults.production);
        print(mults.purchaseCost);



getServerMoneyAvailable
^^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getServerMoneyAvailable(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns the amount of money available on a server. **Running this function on the home computer will return
    the player's money.**

    Example::

        getServerMoneyAvailable("foodnstuff");
        getServerMoneyAvailable("home"); //Returns player's money

getServerMaxMoney
^^^^^^^^^^^^^^^^^

.. js:function:: getServerMaxMoney(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns the maximum amount of money that can be available on a server

getServerGrowth
^^^^^^^^^^^^^^^

.. js:function:: getServerGrowth(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns the server's instrinsic "growth parameter". This growth parameter is a number
    between 1 and 100 that represents how quickly the server's money grows. This parameter affects the
    percentage by which the server's money is increased when using the *grow()* function. A higher
    growth parameter will result in a higher percentage increase from *grow()*.

getServerSecurityLevel
^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getServerSecurityLevel(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns the security level of the target server. A server's security level is denoted by a number, typically
    between 1 and 100 (but it can go above 100).

getServerBaseSecurityLevel
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getServerBaseSecurityLevel(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns the base security level of the target server. This is the security level that the server starts out with.
    This is different than *getServerSecurityLevel()* because *getServerSecurityLevel()* returns the current
    security level of a server, which can constantly change due to *hack()*, *grow()*, and *weaken()*, calls on that
    server. The base security level will stay the same until you reset by installing an Augmentation(s).

getServerMinSecurityLevel
^^^^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getServerMinSecurityLevel(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns the minimum security level of the target server

getServerRequiredHackingLevel
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getServerRequiredHackingLevel(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns the required hacking level of the target server

getServerNumPortsRequired
^^^^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getServerNumPortsRequired(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns the number of open ports required to successfully run NUKE.exe on the specified server.

getServerRam
^^^^^^^^^^^^

.. js:function:: getServerRam(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns an array with two elements that gives information about a server's memory (RAM). The first
    element in the array is the amount of RAM that the server has total (in GB). The second element in
    the array is the amount of RAM that is currently being used on the server (in GB).

    Example::

        res = getServerRam("helios");
        totalRam = res[0];
        ramUsed = res[1];

serverExists
^^^^^^^^^^^^

.. js:function:: serverExists(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server

    Returns a boolean denoting whether or not the specified server exists

fileExists
^^^^^^^^^^

.. js:function:: fileExists(filename, [hostname/ip])

    :param string filename: Filename of file to check
    :param string hostname/ip:
        Hostname or IP of target server. This is optional. If it is not specified then the
        function will use the current server as the target server

    Returns a boolean indicating whether the specified file exists on the target server. The filename
    for scripts is case-sensitive, but for other types of files it is not. For example, *fileExists("brutessh.exe")*
    will work fine, even though the actual program is named "BruteSSH.exe".

    If the *hostname/ip* argument is omitted, then the function will search through the current server (the server
    running the script that calls this function) for the file.

    Examples::

        fileExists("foo.script", "foodnstuff");
        fileExists("ftpcrack.exe");

    The first example above will return true if the script named *foo.script* exists on the *foodnstuff* server, and false otherwise.
    The second example above will return true if the current server contains the *FTPCrack.exe* program, and false otherwise.

isRunning
^^^^^^^^^

.. js:function:: isRunning(filename, hostname/ip, [args...])

    :param string filename: Filename of script to check. This is case-sensitive.
    :param string hostname/ip: Hostname or IP of target server
    :param args...: Arguments to specify/identify which scripts to search for

    Returns a boolean indicating whether the specified script is running on the target server. Remember that a script is
    uniquely identified by both its name and its arguments.

    **Examples:**

    In this first example below, the function call will return true if there is a script named *foo.script* with no arguments
    running on the *foodnstuff* server, and false otherwise::

        isRunning("foo.script", "foodnstuff");

    In this second example below, the function call will return true if there is a script named *foo.script* with no arguments
    running on the current server, and false otherwise::

        isRunning("foo.script", getHostname());

    In this next example below, the function call will return true if there is a script named *foo.script* running with the arguments
    1, 5, and "test" (in that order) on the *joesguns* server, and false otherwise::

        isRunning("foo.script", "joesguns", 1, 5, "test");

getNextHacknetNodeCost
^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getNextHacknetNodeCost()

    Deprecated (no longer usable). See :doc:`netscripthacknetnodeapi`

purchaseHacknetNode
^^^^^^^^^^^^^^^^^^^

.. js:function:: purchaseHacknetNode()

    Deprecated (no longer usable). See :doc:`netscripthacknetnodeapi`

getPurchasedServerCost
^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getPurchasedServerCost(ram)

    :param number ram: Amount of RAM of a potential purchased server. Must be a power of 2 (2, 4, 8, 16, etc.). Maximum value of 1048576 (2^20)

    Returns the cost to purchase a server with the specified amount of *ram*.

    Examples::

        for (i = 1; i <= 20; i++) {
            tprint(i + " -- " + getPurchasedServerCost(Math.pow(2, i)));
        }

purchaseServer
^^^^^^^^^^^^^^

.. js:function:: purchaseServer(hostname, ram)

    :param string hostname: Hostname of the purchased server
    :param number ram: Amount of RAM of the purchased server. Must be a power of 2 (2, 4, 8, 16, etc.). Maximum value of 1048576 (2^20)

    Purchased a server with the specified hostname and amount of RAM.

    The *hostname* argument can be any data type, but it will be converted to a string and have whitespace removed. Anything that resolves to an empty string will
    cause the function to fail. If there is already a server with the specified hostname, then the function will automatically append
    a number at the end of the *hostname* argument value until it finds a unique hostname. For example, if the script calls
    *purchaseServer("foo", 4)* but a server named "foo" already exists, the it will automatically change the hostname to "foo-0". If there is already
    a server with the hostname "foo-0", then it will change the hostname to "foo-1", and so on.

    Note that there is a maximum limit to the amount of servers you can purchase.

    Returns the hostname of the newly purchased server as a string. If the function fails to purchase a server, then it will return an
    empty string. The function will fail if the arguments passed in are invalid, if the player does not have enough money to purchase
    the specified server, or if the player has exceeded the maximum amount of servers.

    Example::

        ram = 64;
        hn = "pserv-";
        for (i = 0; i < 5; ++i) {
            purchaseServer(hn + i, ram);
        }

deleteServer
^^^^^^^^^^^^

.. js:function:: deleteServer(hostname)

    :param string hostname: Hostname of the server to delete

    Deletes one of your purchased servers, which is specified by its hostname.

    The *hostname* argument can be any data type, but it will be converted to a string. Whitespace is automatically removed from
    the string. This function will not delete a server that still has scripts running on it.

    Returns true if successful, and false otherwise.

getPurchasedServers
^^^^^^^^^^^^^^^^^^^

.. js:function:: getPurchasedServers([hostname=true])

    :param boolean hostname:
        Specifies whether hostnames or IP addresses should be returned. If it's true then hostnames will be returned, and if false
        then IPs will be returned. If this argument is omitted then it is true by default

    Returns an array with either the hostnames or IPs of all of the servers you have purchased.

getPurchasedServerLimit
^^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getPurchasedServerLimit()

    Returns the maximum number of servers you can purchase

getPurchasedServerMaxRam
^^^^^^^^^^^^^^^^^^^^^^^^

.. js:function:: getPurchasedServerMaxRam()

    Returns the maximum RAM that a purchased server can have

write
^^^^^

.. js:function:: write(port/fn, data="", mode="a")

    :param string/number port/fn: Port or text file that will be written to
    :param string data: Data to write
    :param string mode: Defines the write mode. Only valid when writing to text files.

    This function can be used to either write data to a port or to a text file (.txt).

    If the first argument is a number between 1 and 10, then it specifies a port and this function will write *data* to that port. Read
    about how `Netscript Ports work here <http://bitburner.wikia.com/wiki/Netscript_Ports>`_. The third argument, *mode*, is not used
    when writing to a port.

    If the first argument is a string, then it specifies the name of a text file (.txt) and this function will write *data* to that text file. If the
    specified text file does not exist, then it will be created. The third argument *mode*, defines how the data will be written to the text file. If *mode*
    is set to "w", then the data is written in "write" mode which means that it will overwrite all existing data on the text file. If *mode* is set to
    any other value then the data will be written in "append" mode which means that the data will be added at the end of the text file.

tryWrite
^^^^^^^^

.. js:function:: tryWrite(port, data="")

    :param number port: Port to be written to
    :param string data: Data to try to write
    :returns: True if the data is successfully written to the port, and false otherwise

    Attempts to write data to the specified Netscript Port. If the port is full, the data will
    not be written. Otherwise, the data will be written normally

read
^^^^

.. js:function:: read(port/fn)

    :param string/number port/fn: Port or text file to read from

    This function is used to read data from a port or from a text file (.txt).

    If the argument *port/fn* is a number between 1 and 10, then it specifies a port and it will read data from that port. Read
    about how `Netscript Ports work here <http://bitburner.wikia.com/wiki/Netscript_Ports>`_. A port is a serialized queue. This function
    will remove the first element from that queue and return it. If the queue is empty, then the string "NULL PORT DATA" will be returned.

    If the argument *port/fn* is a string, then it specifies the name of a text file (.txt) and this function will return the data in the specified text file. If
    the text file does not exist, an empty string will be returned.

peek
^^^^

.. js:function:: peek(port)

    :param number port: Port to peek. Must be an integer between 1 and 10

    This function is used to peek at the data from a port. It returns the first element in the specified port
    without removing that element. If the port is empty, the string "NULL PORT DATA" will be returned.

    Read about how `Netscript Ports work here <http://bitburner.wikia.com/wiki/Netscript_Ports>`_.

clear
^^^^^

.. js:function:: clear(port/fn)

    :param string/number port/fn: Port or text file to clear

    This function is used to clear data in a `Netscript Ports <http://bitburner.wikia.com/wiki/Netscript_Ports>`_ or a text file.

    If the *port/fn* argument is a number between 1 and 10, then it specifies a port and will clear it (deleting all data from the underlying queue).

    If the *port/fn* argument is a string, then it specifies the name of a text file (.txt) and will delete all data from that text file.

getPortHandle
^^^^^^^^^^^^^

.. js:function:: getPortHandle(port)

    :param number port: Port number

    Get a handle to a Netscript Port. See more details here: :ref:`netscript_ports`

    **WARNING:** Port Handles only work in :ref:`netscriptjs`. They will not work in :ref:`netscript1`.

rm
^^

.. js:function:: rm(fn)

    :param string fn: Filename of file to remove. Must include the extension
    :returns: True if it successfully deletes the file, and false otherwise

    Removes the specified file from the current server. This function works for every file type except message (.msg) files.

scriptRunning
^^^^^^^^^^^^^

.. js:function:: scriptRunning(scriptname, hostname/ip)

    :param string scriptname: Filename of script to check. This is case-sensitive.
    :param string hostname/ip: Hostname or IP of target server

    Returns a boolean indicating whether any instance of the specified script is running on the target server, regardless of
    its arguments.

    This is different than the *isRunning()* function because it does not try to identify a specific instance of a running script
    by its arguments.

    **Examples:**

    The example below will return true if there is any script named *foo.script* running on the *foodnstuff* server, and false otherwise::

        scriptRunning("foo.script", "foodnstuff");

    The example below will return true if there is any script named "foo.script" running on the current server, and false otherwise::

        scriptRunning("foo.script", getHostname());

scriptKill
^^^^^^^^^^

.. js:function:: scriptKill(scriptname, hostname/ip)

    :param string scriptname: Filename of script to kill. This is case-sensitive.
    :param string hostname/ip: Hostname or IP of target server

    Kills all scripts with the specified filename on the target server specified by *hostname/ip*, regardless of arguments. Returns
    true if one or more scripts were successfully killed, and false if none were.

getScriptName
^^^^^^^^^^^^^

.. js:function:: getScriptName()

    Returns the current script name

getScriptRam
^^^^^^^^^^^^

.. js:function:: getScriptRam(scriptname[, hostname/ip])

    :param string scriptname: Filename of script. This is case-sensitive.
    :param string hostname/ip: Hostname or IP of target server the script is located on. This is optional, If it is not specified then the function will se the current server as the target server.

    Returns the amount of RAM required to run the specified script on the target server. Returns
    0 if the script does not exist.

getHackTime
^^^^^^^^^^^

.. js:function:: getHackTime(hostname/ip[, hackLvl=current level])

    :param string hostname/ip: Hostname or IP of target server
    :param number hackLvl: Optional hacking level for the calculation. Defaults to player's current hacking level

    Returns the amount of time in seconds it takes to execute the *hack()* Netscript function on the target server.

    The function takes in an optional *hackLvl* parameter that can be specified
    to see what the hack time would be at different hacking levels.

getGrowTime
^^^^^^^^^^^

.. js:function:: getGrowTime(hostname/ip[, hackLvl=current level])

    :param string hostname/ip: Hostname or IP of target server
    :param number hackLvl: Optional hacking level for the calculation. Defaults to player's current hacking level

    Returns the amount of time in seconds it takes to execute the *grow()* Netscript function on the target server.

    The function takes in an optional *hackLvl* parameter that can be specified
    to see what the grow time would be at different hacking levels.

getWeakenTime
^^^^^^^^^^^^^

.. js:function:: getWeakenTime(hostname/ip[, hackLvl=current level])

    :param string hostname/ip: Hostname or IP of target server
    :param number hackLvl: Optional hacking level for the calculation. Defaults to player's current hacking level

    Returns the amount of time in seconds it takes to execute the *weaken()* Netscript function on the target server.

    The function takes in an optional *hackLvl* parameter that can be specified
    to see what the weaken time would be at different hacking levels.

getScriptIncome
^^^^^^^^^^^^^^^

.. js:function:: getScriptIncome([scriptname], [hostname/ip], [args...])

    :param string scriptname: Filename of script
    :param string hostname/ip: Server on which script is running
    :param args...: Arguments that the script is running with

    Returns the amount of income the specified script generates while online (when the game is open, does not apply for offline income).
    Remember that a script is uniquely identified by both its name and its arguments. So for example if you ran a script with the arguments
    "foodnstuff" and "5" then in order to use this function to get that script's income you must specify those same arguments in the same order
    in this function call.

    This function can also be called with no arguments. If called with no arguments, then this function will return an array of two values. The
    first value is the total income ($ / second) of all of your active scripts (scripts that are currently running on any server). The second value
    is the total income ($ / second) that you've earned from scripts since you last installed Augmentations.

getScriptExpGain
^^^^^^^^^^^^^^^^

.. js:function:: getScriptExpGain([scriptname], [hostname/ip], [args...])

    :param string scriptname: Filename of script
    :param string hostname/ip: Server on which script is running
    :param args...: Arguments that the script is running with

    Returns the amount of hacking experience the specified script generates while online (when the game is open, does not apply for offline experience gains).
    Remember that a script is uniquely identified by both its name and its arguments.

    This function can also return the total experience gain rate of all of your active scripts by running the function with no arguments.

getTimeSinceLastAug
^^^^^^^^^^^^^^^^^^^

.. js:function:: getTimeSinceLastAug()

    Returns the amount of time in milliseconds that have passed since you last installed Augmentations

sprintf
^^^^^^^

.. js:function:: sprintf()

    See `this link <https://github.com/alexei/sprintf.js>`_ for details.

vsprintf
^^^^^^^^

.. js:function:: vsprintf()

    See `this link <https://github.com/alexei/sprintf.js>`_ for details.

prompt
^^^^^^

.. js:function:: prompt(txt)

    :param string txt: Text to appear in the prompt dialog box

    Prompts the player with a dialog box with two options: "Yes" and "No". This function will return true if the player click "Yes" and
    false if the player clicks "No". The script's execution is halted until the player selects one of the options.


Defining your own Functions
---------------------------

Note that the following information is only applicable for Netscript 1.0.
:doc:`netscriptjs` allows you to define your functions using native Javascript
techniques.

You can define your own functions in Netscript 1.0 using the following syntax::

    function name(args...) {
        function code here...
        return some_value
    }

Functions should have some return value. Here is an example of defining and using a function::

    function sum(values) {
        res = 0;
        for (i = 0; i < values.length; ++i) {
            res += values[i];
        }
        return res;
    }

    print(sum([1, 2, 3, 4, 5]));    //Prints 15
    print(sum([1, 10]));            //Prints 11

For those with experience in other languages, especially Javascript, it may be important to note that
function declarations are not hoisted and must be declared BEFORE you use them.
For example, the following will cause an error saying `variable hello not defined`::

    print(hello());

    function hello() {
        return "world";
    }

The following will work fine::

    function hello() {
        return "world";
    }

    print(hello());     //Prints out "world"

**Note about variable scope in functions:**

Functions can access "global" variables declared outside of the function's scope. However, they cannot change the value of any "global" variables.
Any changes to "global" variables will only be applied locally to the function.

The following example shows that any change to a "global" variable
from inside a function only applies in the function's local scope::

    function foo() {
        i = 5;
        return "foo";
    }

    i = 0;
    print(i);   //Prints 0
    foo();
    print(i);   //Prints 0

Furthermore, this also means that any variable that is first defined inside a
function will NOT be accessible outside of the function as shown in the following example::

    function sum(values) {
        res = 0;
        for (i = 0; i < values.length; ++i) {
            res += values[i];
        }
        return res;
    }
    print(res);

results in the following runtime error::

    Script runtime error:
    Server Ip: 75.7.4.1
    Script name: test.script
    Args:[]
    variable res not defined


**Other Notes about creating your own functions:**

Defining a function does not create a Javascript function object in the underlying game code. This means that you cannot use any function
you create in functions such as `Array.sort() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort>`_ (not yet at least, I'll try to make it work in the future).
