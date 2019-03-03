read() Netscript Function
=========================

.. js:function:: read(port/fn)

    :param string/number port/fn: Port or text file to read from
    :RAM cost: 1 GB

    This function is used to read data from a port, a text file (.txt), or a script (.script, .js, .ns)

    If the argument *port/fn* is a number between 1 and 20, then it specifies a port and it will read data from that port. Read
    about how :ref:`netscript_ports` work here. A port is a serialized queue. This function
    will remove the first element from that queue and return it. If the queue is empty, then the string "NULL PORT DATA" will be returned.

    If the argument *port/fn* is a string, then it specifies the name of a text file or script and this function will return the data in the specified text file/script. If
    the text file does not exist, an empty string will be returned.
