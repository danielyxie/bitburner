attempt() Netscript Function
============================

.. js:function:: attempt(answer, fn[, hostname/ip=current ip])

    :param answer: Solution for the contract
    :param string fn: Filename of the contract
    :param string hostname/ip: Hostname or IP of the server containing the contract.
                               Optional. Defaults to current server if not provided

    Attempts to solve the Coding Contract with the provided solution.

    :returns: Boolean indicating whether the solution was correct
