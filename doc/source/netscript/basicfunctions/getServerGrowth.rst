getServerGrowth() Netscript Function
====================================

.. js:function:: getServerGrowth(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server
    :RAM cost: 0.1 GB

    Returns the server's instrinsic "growth parameter". This growth parameter is a number
    between 1 and 100 that represents how quickly the server's money grows. This parameter affects the
    percentage by which the server's money is increased when using the *grow()* function. A higher
    growth parameter will result in a higher percentage increase from *grow()*.
