getData() Netscript Function
============================

.. js:function:: getData(fn[, hostname/ip=current ip])

    :param string fn: Filename of the contract
    :param string hostname/ip: Hostname or IP of the server containing the contract.
                               Optional. Defaults to current server if not provided

    Get the data associated with the specific Coding Contract. Note that this is
    not the same as the contract's description. This is just the data that
    the contract wants you to act on in order to solve

    :returns: The specified contract's data
