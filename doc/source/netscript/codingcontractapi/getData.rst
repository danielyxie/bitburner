getData() Netscript Function
============================

.. js:function:: getData(filename[, hostname=current hostname])

    :param string filename: Filename of the contract
    :param string hostname: Hostname of the server containing the contract.
        Optional. Defaults to current server if not provided
    :returns: The specified contract's data. Different data type depending on 
        contract type.

    Get the data associated with the specific Coding Contract. Note that this is
    not the same as the contract's description. This is just the data that
    the contract wants you to act on in order to solve

    Example:

    .. code-block:: javascript

        data = codingcontract.getData("contract-123.cct", "home");
        answer = solve(data);
        codingcontract.attempt(answer, "contract-123.cct", "home");