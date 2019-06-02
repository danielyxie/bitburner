getNodeStats() Netscript Function
=================================

.. warning:: This page contains spoilers for the game

.. js:function:: getNodeStats(i)

    :param number i: Index/Identifier of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`

    Returns an object containing a variety of stats about the specified Hacknet Node::

        {
            name:               Node's name ("hacknet-node-5"),
            level:              Node's level,
            ram:                Node's RAM,
            cores:              Node's number of cores,
            cache:              Cache level. Only applicable for Hacknet Servers
            production:         Node's production per second
            timeOnline:         Number of seconds since Node has been purchased,
            totalProduction:    Total amount that the Node has produced
        }

    .. note:: Note that for Hacknet Nodes, production refers to the amount of money the node generates.
              For Hacknet Servers (the upgraded version of Hacknet Nodes), production refers to the amount
              of hashes the node generates.
