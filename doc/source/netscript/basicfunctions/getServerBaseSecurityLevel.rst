getServerBaseSecurityLevel() Netscript Function
===============================================

.. js:function:: getServerBaseSecurityLevel(hostname/ip)

    :param string hostname/ip: Hostname or IP of target server
    :RAM cost: 0.1 GB

    Returns the base security level of the target server. This is the security level that the server starts out with.
    This is different than *getServerSecurityLevel()* because *getServerSecurityLevel()* returns the current
    security level of a server, which can constantly change due to *hack()*, *grow()*, and *weaken()*, calls on that
    server. The base security level will stay the same until you reset by installing an Augmentation(s).
