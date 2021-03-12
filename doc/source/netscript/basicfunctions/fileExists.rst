fileExists() Netscript Function
===============================

.. js:function:: fileExists(filename[, hostname])

    :RAM cost: 0.1 GB

    :param string filename: Filename of file to check.
    :param string hostname:
        Hostname of target server. This is optional. If it is not specified then
        the function will use the current server as the target server.
    :returns: ``true`` if the file exists, ``false`` if it doesn't.

    The filename for scripts is case-sensitive, but for other types of files it
    is not. For example, ``fileExists("brutessh.exe")`` will work fine, even
    though the actual program is named ``BruteSSH.exe``.

    If the ``hostname`` argument is omitted, then the function will search
    through the server running the script that calls this function for the file.

    Examples:

    .. code-block:: javascript

        fileExists("foo.script", "foodnstuff"); // returns: false
        fileExists("ftpcrack.exe"); // returns: true

    The first example above will return true if the script named ``foo.script`` exists on the ``foodnstuff`` server, and false otherwise.
    The second example above will return true if the current server contains the ``FTPCrack.exe`` program, and false otherwise.
