clear() Netscript Function
==========================

.. js:function:: clear(portOrFilename)

    :RAM cost: 1 GB

    :param string/number portOrFilename: Port or text file to clear.

    This function is used to clear data in a :ref:`Netscript Port <netscript_ports>` or a text file.

    If the ``portOrFilename`` argument is a number between 1 and 20, then it
    specifies a port and will clear it (deleting all data from the underlying queue).

    If the ``portOrFilename`` argument is a string, then it specifies the name
    of a text file (.txt) and will delete all data from that text file.
