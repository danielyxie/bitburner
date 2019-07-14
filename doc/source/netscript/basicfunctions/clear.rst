clear() Netscript Function
==========================

.. js:function:: clear(port/fn)

    :param string/number port/fn: Port or text file to clear
    :RAM cost: 1 GB

    This function is used to clear data in a :ref:`Netscript Port <netscript_ports>` or a text file.

    If the *port/fn* argument is a number between 1 and 20, then it specifies a port and will clear it (deleting all data from the underlying queue).

    If the *port/fn* argument is a string, then it specifies the name of a text file (.txt) and will delete all data from that text file.
