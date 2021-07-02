getDescription() Netscript Function
===================================

.. js:function:: getDescription(filename[, hostname=current hostname])

    :RAM cost: 5 GB
    :param string filename: Filename of the contract
    :param string hostname: Hostname of the server containing the contract.
        Optional. Defaults to current server if not provided
    :returns: A string with the contract's text description

    Get the full text description for the problem posed by the Coding Contract.

    Example:

    .. code-block:: javascript

        codingcontract.getDescription("contract-123.cct", "home");
