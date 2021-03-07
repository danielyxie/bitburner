getNumTriesRemaining() Netscript Function
=========================================

.. js:function:: getNumTriesRemaining(fn[, hostname/ip=current ip])

    :param string fn: Filename of the contract
    :param string hostname/ip: Hostname or IP of the server containing the contract.
                               Optional. Defaults to current server if not provided

    Get the number of tries remaining on the contract before it
    self-destructs.

    :returns: Number indicating how many attempts are remaining

    :RAM cost: 2 GB
