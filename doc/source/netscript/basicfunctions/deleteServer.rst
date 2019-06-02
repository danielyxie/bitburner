deleteServer() Netscript Function
=================================

.. js:function:: deleteServer(hostname)

    :param string hostname: Hostname of the server to delete
    :RAM cost: 2.25 GB

    Deletes one of your purchased servers, which is specified by its hostname.

    The *hostname* argument can be any data type, but it will be converted to a string. Whitespace is automatically removed from
    the string. This function will not delete a server that still has scripts running on it.

    Returns true if successful, and false otherwise.
