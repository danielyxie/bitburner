fileExists() Netscript Function
===============================

.. js:function:: fileExists(filename, [hostname/ip])

    :param string filename: Filename of file to check
    :param string hostname/ip:
        Hostname or IP of target server. This is optional. If it is not specified then the
        function will use the current server as the target server
    :RAM cost: 0.1 GB

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
