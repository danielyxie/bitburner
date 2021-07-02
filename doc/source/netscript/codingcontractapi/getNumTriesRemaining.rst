getNumTriesRemaining() Netscript Function
=========================================

.. js:function:: getNumTriesRemaining(filename[, hostname=current hostname])

    :RAM cost: 2 GB
    :param string filename: Filename of the contract
    :param string hostname: Hostname of the server containing the contract.
        Optional. Defaults to current server if not provided
    :returns: Number indicating how many attempts are remaining

    Get the number of tries remaining on the contract before it
    self-destructs.

    Example:

    .. code-block:: javascript

        codingcontract.getNumTriesRemaining("contract-123.cct", "home"); // returns: 5
