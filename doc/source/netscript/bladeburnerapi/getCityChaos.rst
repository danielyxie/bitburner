getCityChaos() Netscript Function
=================================

.. js:function:: getCityChaos(cityName)

    :RAM cost: 4 GB
    :param string cityName: Name of city. Case-sensitive
    :returns: Chaos in the specified city, or -1 if an invalid city was specified.

    Example:

    .. code-block:: javascript

        bladeburner.getCityChaos("Sector-12"); // returns: 3800.1
