getServerRam() Netscript Function
=================================

.. js:function:: getServerRam(hostname)

    .. warning:: This function is deprecated. It still functions, but new
                 scripts should prefer :doc:`getServerMaxRam<getServerMaxRam>`
                 and :doc:`getServerUsedRam<getServerUsedRam>` instead.

    :RAM cost: 0.1 GB
    :param string hostname: Hostname of target server.
    :returns: An array of 2 numbers; the first number is the total RAM, and the
        second is the used RAM.

    Returns an array with two elements that gives information about a server's memory (RAM). The first
    element in the array is the amount of RAM that the server has total (in GB). The second element in
    the array is the amount of RAM that is currently being used on the server (in GB).

    Example:

    .. code-block:: javascript

        res = getServerRam("helios"); // returns: [5, 10]
        totalRam = res[0];
        ramUsed = res[1];
