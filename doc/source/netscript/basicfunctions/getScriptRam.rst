getScriptRam() Netscript Function
===========================

.. js:function:: getScriptRam(scriptname[, hostname/ip])

    :param string scriptname: Filename of script. This is case-sensitive.
    :param string hostname/ip: Hostname or IP of target server the script is located on. This is optional, If it is not specified then the function will set the current server as the target server.
    :RAM cost: 0.1 GB

    Returns the amount of RAM required to run the specified script on the target server. Returns
    0 if the script does not exist.
