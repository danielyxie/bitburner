write() Netscript Function
===========================

.. js:function:: write(port/fn, data="", mode="a")

    :param string/number port/fn: Port or text file/script that will be written to
    :param string data: Data to write
    :param string mode: Defines the write mode. Only valid when writing to text files or scripts.
    :RAM cost: 1 GB

    This function can be used to either write data to a port, a text file (.txt), or a script (.script, .js, .ns)

    If the first argument is a number between 1 and 20, then it specifies a port and this function will write *data* to that port. Read
    about how :ref:`netscript_ports` work here. The third argument, *mode*, is not used
    when writing to a port.

    If the first argument is a string, then it specifies the name of a text file or script and this function will write *data* to that text file/script. If the
    specified text file/script does not exist, then it will be created. The third argument *mode*, defines how the data will be written. If *mode*
    is set to "w", then the data is written in "write" mode which means that it will overwrite all existing data on the text file/script. If *mode* is set to
    any other value then the data will be written in "append" mode which means that the data will be added at the end of the file.
