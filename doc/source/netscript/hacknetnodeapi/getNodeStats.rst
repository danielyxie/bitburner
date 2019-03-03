getNodeStats() Netscript Function
=================================

.. js:function:: getNodeStats(i)

    :param number i: Index/Identifier of Hacknet Node. :ref:`See here for details <netscript_hacknetnodeapi_referencingahacknetnode>`

    Returns an object containing a variety of stats about the specified Hacknet Node::

        {
            name:               Node's name ("hacknet-node-5"),
            level:              Node's level,
            ram:                Node's RAM,
            cores:              Node's number of cores,
            production:         Node's money earned per second,
            timeOnline:         Number of seconds since Node has been purchased,
            totalProduction:    Total number of money Node has produced
        }
