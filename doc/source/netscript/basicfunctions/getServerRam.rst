getServerRam() Netscript Function
=================================

.. js:function:: getServerRam(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server
    :RAM cost: 0.1 GB

    Returns an array with two elements that gives information about a server's memory (RAM). The first
    element in the array is the amount of RAM that the server has total (in GB). The second element in
    the array is the amount of RAM that is currently being used on the server (in GB).

    Example::

        res = getServerRam("helios");
        totalRam = res[0];
        ramUsed = res[1];
