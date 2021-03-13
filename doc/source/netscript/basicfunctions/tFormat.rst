tFormat() Netscript Function
============================

.. js:function:: tFormat(milliseconds)

    :RAM cost: 0 GB
    :param number milliseconds: Amount of milliseconds to format.
    :returns: milliseconds in the "D M H S" format

    Example:

    .. code-block:: javascript

        tFormat(3000);      // returns: "3 seconds"
        tFormat(10000000);  // returns: "2 hours 46 minutes 40 seconds"
