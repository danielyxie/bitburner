attempt() Netscript Function
============================

.. js:function:: attempt(answer, fn[, hostname/ip=current ip, opts={}])

    :param answer: Solution for the contract
    :param string fn: Filename of the contract
    :param string hostname/ip: Hostname or IP of the server containing the contract.
                               Optional. Defaults to current server if not provided
    :param object opts: Optional parameters for configuring function behavior. Properties:

        * returnReward (*boolean*) If truthy, then the function will return a string
          that states the contract's reward when it is successfully solved.

    Attempts to solve the Coding Contract with the provided solution.

    :returns: Boolean indicating whether the solution was correct. If the :code:`returnReward`
              option is configured, then the function will instead return a string. If the
              contract is successfully solved, the string will contain a description of the
              contract's reward. Otherwise, it will be an empty string.
