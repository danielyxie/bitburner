deleteServer() Netscript Function
=================================

.. js:function:: deleteServer(hostname)

    :RAM cost: 2.25 GB
    :param string hostname: Hostname of the server to delete.
    :returns: ``true`` if successful, ``false`` otherwise.

    Deletes the specified purchased server.

    The ``hostname`` argument can be any data type, but it will be converted to
    a string. Whitespace is automatically removed from the string. This function
    will not delete a server that still has scripts running on it.
