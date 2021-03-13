read() Netscript Function
=========================

.. js:function:: read(portOrFilename)

    :RAM cost: 1 GB
    :param string/number portOrFilename: Port or text file to read from.

    This function is used to read data from a port, a text file (.txt), or a
    script (.script, .js, .ns).

    If the argument ``portOrFilename`` is a number between 1 and 20, then it
    specifies a port and it will read data from that port. Read about how
    :ref:`netscript_ports` work here. A port is a serialized queue. This
    function will remove the first element from that queue and return it. If the
    queue is empty, then the string "NULL PORT DATA" will be returned.

    If the argument ``portOrFilename`` is a string, then it specifies the name
    of a text file or script and this function will return the data in the
    specified text file/script. If the text file does not exist, an empty string
    will be returned.
