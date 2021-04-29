getRunningScript() Netscript Function
=====================================

.. js:function:: getRunningScript()

    :RAM cost: 0.3 GB
    :returns: Script object or null if not found

    The object has the following properties:

    .. code-block:: javascript

        {
            // Script arguments
            args

            // Script filename
            filename

            // This script's logs. An array of log entries
            logs

            // Flag indicating whether the logs have been updated since
            // the last time the UI was updated
            logUpd

            // Total amount of hacking experience earned from this script when offline
            offlineExpGained

            // Total amount of money made by this script when offline
            offlineMoneyMade

            // Number of seconds that the script has been running offline
            offlineRunningTime

            // Total amount of hacking experience earned from this script when online
            onlineExpGained

            // Total amount of money made by this script when online
            onlineMoneyMade

            // Number of seconds that this script has been running online
            onlineRunningTime

            // Process ID.
            pid

            // How much RAM this script uses for ONE thread
            ramUsage

            // IP of the server on which this script is running
            server

            // Number of threads that this script is running with
            threads
        }

    Examples:

    .. code-block:: javascript

        getRunningScript(); // get the current script.

.. js:function:: getRunningScript(pid)

    :RAM cost: 0.3 GB
    :param number pid: PID of the script
    :returns: Script object or null if not found

    Examples:

    .. code-block:: javascript

        getRunningScript(42); // get the script with pid 42.

.. js:function:: getRunningScript(fn, hostname[, args])

    :RAM cost: 0.3 GB
    :param number fn: filename of the target script
    :param number hostname: hostname of the server running the script
    :param number args: arguments to the script.
    :returns: Script object or null if not found

    Examples:

    .. code-block:: javascript

        getRunningScript("example.script", "home", "foodnstuff"); // get the script called "example.script" on "home" with argument "foodnstuff"
