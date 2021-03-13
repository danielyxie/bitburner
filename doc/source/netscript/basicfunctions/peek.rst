peek() Netscript Function
=========================

.. js:function:: peek(port)

    :RAM cost: 1 GB
    :param number port: Port to peek. Must be an integer between 1 and 20.
    :returns: First element on that port.

    This function is used to peek at the data from a port. It returns the first
    element in the specified port without removing that element. If the port is
    empty, the string "NULL PORT DATA" will be returned.

    Read about how :ref:`netscript_ports` work here
