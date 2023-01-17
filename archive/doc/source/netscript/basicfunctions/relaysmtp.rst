relaysmtp() Netscript Function
==============================

.. js:function:: relaysmtp(hostname)

    :RAM cost: 0.05 GB
    :param string hostname: Hostname of the target server.

    Runs the ``relaySMTP.exe`` program on the target server. ``relaySMTP.exe``
    must exist on your home computer.

    Example:

    .. code-block:: javascript

        relaysmtp("foodnstuff");
