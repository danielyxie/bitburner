getCityEstimatedPopulation() Netscript Function
===============================================

.. js:function:: getCityEstimatedPopulation(cityName)

    :RAM cost: 4 GB
    :param string cityName: Name of city. Case-sensitive
    :returns: Estimated number of Synthoids in the specified city, or -1 if an
        invalid city was specified.

    Example:

    .. code-block:: javascript

        bladeburner.getCityEstimatedPopulation("Sector-12"); // returns: 1240000