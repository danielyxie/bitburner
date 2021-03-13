getContractType() Netscript Function
====================================

.. js:function:: getContractType(filename[, hostname=current hostname])

    :RAM cost: 5 GB
    :param string filename: Filename of the contract
    :param string hostname: Hostname of the server containing the contract.
        Optional. Defaults to current server if not provided
    :returns: A string with the contract's problem type

    Describes the type of problem posed by the Coding Contract.
    (e.g. Find Largest Prime Factor, Total Ways to Sum, etc.)

    Example:

    .. code-block:: javascript

        codingcontract.getContractType("contract-123.cct", "home");
