tryWrite() Netscript Function
=============================

.. js:function:: tryWrite(port, data="")

    :RAM cost: 1 GB
    :param number port: Port to be written to
    :param string data: Data to try to write
    :returns: ``true`` if the data is successfully written to the port.

    Attempts to write data to the specified Netscript Port. If the port is full,
    the data will not be written. Otherwise, the data will be written normally.

    See :ref:`netscript_ports` for more details.
