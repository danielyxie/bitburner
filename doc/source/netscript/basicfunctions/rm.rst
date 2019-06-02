rm() Netscript Function
=======================

.. js:function:: rm(fn[, hostname/ip=current server])

    :param string fn: Filename of file to remove. Must include the extension
    :param string hostname/ip: Hostname or IP Address of the server on which to delete the file. Optional. Defaults to current server
    :returns: True if it successfully deletes the file, and false otherwise
    :RAM cost: 1 GB

    Removes the specified file from the current server. This function works for every file type except message (.msg) files.
