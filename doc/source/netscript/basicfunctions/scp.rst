scp() Netscript Function
========================

.. js:function:: scp(files[, source], destination)

    :RAM cost: 0.6 GB
    :param string/array files: Filename or an array of filenames of script/literature files to copy
    :param string source:
        Hostname of the source server, which is the server from which the file will be copied.
        This argument is optional and if it's omitted the source will be the current server.
    :param string destination: Hostname of the destination server, which is the server to which the file will be copied.
    :returns: ``true`` if the copy was a success.

    Copies a script or literature (.lit) file(s) to another server. The
    ``files`` argument can be either a string specifying a single file to copy,
    or an array of strings specifying multiple files to copy.

    If the ``files`` argument is an array then this function will return true if
    at least one of the files in the array is successfully copied.

    Example:

    .. code-block:: javascript

        //Copies "hack-template.script" from the current server to "foodnstuff"
        scp("hack-template.script", "foodnstuff"); // returns: true

        //Copies "foo.lit" from the helios server to the "home" computer
        scp("foo.lit", "helios", "home"); // returns: true

        //Tries to copy three files from "rothman-uni" to "home" computer
        files = ["foo1.lit", "foo2.script", "foo3.script"];
        scp(files, "rothman-uni", "home"); // returns: true
