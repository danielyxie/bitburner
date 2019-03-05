scan() Netscript Function
=========================

.. js:function:: scan(hostname/ip=current ip[, hostnames=true])

    :param string hostname/ip: IP or hostname of the server to scan
    :param boolean: Optional boolean specifying whether the function should output hostnames (if true) or IP addresses (if false)
    :RAM cost: 0.2 GB

    Returns an array containing the hostnames or IPs of all servers that are one node way from the specified target server. The
    hostnames/IPs in the returned array are strings.
