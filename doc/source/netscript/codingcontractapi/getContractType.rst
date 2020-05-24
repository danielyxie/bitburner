getContractType() Netscript Function
====================================

.. js:function:: getContractType(fn[, hostname/ip=current ip])

    :param string fn: Filename of the contract
    :param string hostname/ip: Hostname or IP of the server containing the contract.
                               Optional. Defaults to current server if not provided

    Returns a name describing the type of problem posed by the Coding Contract.
    (e.g. Find Largest Prime Factor, Total Ways to Sum, etc.)

    :returns: A string with the contract's problem type

    :RAM cost: 5 GB
