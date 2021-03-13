rm() Netscript Function
=======================

.. js:function:: rm(filename[, hostname=current server])

    :RAM cost: 1 GB
    :param string filename: Filename of file to remove. Must include the extension.
    :param string hostname: Hostname address of the server on which to delete
        the file. Optional. Defaults to current server
    :returns: ``true`` if it successfully deletes the file.

    Removes the specified file from the current server. This function works for
    every file type except ``.msg`` files.
