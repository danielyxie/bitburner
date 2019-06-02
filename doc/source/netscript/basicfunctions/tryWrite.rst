tryWrite() Netscript Function
=============================

.. js:function:: tryWrite(port, data="")

    :param number port: Port to be written to
    :param string data: Data to try to write
    :returns: True if the data is successfully written to the port, and false otherwise
    :RAM cost: 1 GB

    Attempts to write data to the specified Netscript Port. If the port is full, the data will
    not be written. Otherwise, the data will be written normally
