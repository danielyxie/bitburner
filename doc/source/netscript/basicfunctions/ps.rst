ps() Netscript Function
=======================

.. js:function:: ps(hostname/ip=current ip)

    :param string ip: Hostname or IP address of the target server.
                      If not specified, it will be the current server's IP by default
    :RAM cost: 0.2 GB

    Returns an array with general information about all scripts running on the specified
    target server. The information for each server is given in an object with
    the following structure::

        {
            filename:   Script name,
            threads:    Number of threads script is running with,
            args:       Script's arguments
        }

    Example usage (using :ref:`netscriptjs`)::

        export async function main(ns) {
            const ps = ns.ps("home");
            for (let i = 0; i < ps.length; ++i) {
                ns.tprint(ps[i].filename + ' ' + ps[i].threads);
                ns.tprint(ps[i].args);
            }
        }
