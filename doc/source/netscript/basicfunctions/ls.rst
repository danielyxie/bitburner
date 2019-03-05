ls() Netscript Function
=======================

.. js:function:: ls(hostname/ip, [grep])

    :param string hostname/ip: Hostname or IP of the target server
    :param string grep: a substring to search for in the filename
    :RAM cost: 0 GB

    Returns an array with the filenames of all files on the specified server (as strings). The returned array
    is sorted in alphabetic order
