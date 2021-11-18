autocomplete() Netscript Function
=================================

.. warning:: This feature is not officially supported yet and the API might change. It is also only supported in ns2

.. js:function:: autocomplete(data, args)

    :RAM cost: 0 GB
    :param Object data: general data about the game you might want to autocomplete.
    :param string[] args: current arguments. Minus `run script.ns`

    data is an object with the following properties::

        {
            servers: list of all servers in the game.
            txts:    list of all text files on the current server.
            scripts: list of all scripts on the current server.
            flags:   the same flags function as passed with ns. Calling this function adds all the flags as autocomplete arguments
        }
    
    This function is special as it must be declared as a top level function like `main`.

    Example:

    .. code-block:: javascript

        export function autocomplete(data, args) {
            return [...data.servers]; // This script autocompletes the list of servers.
            return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
            return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
        }

    Terminal:

    .. code-block:: bash

        $ run demo.ns mega\t
        // results in
        $ run demo.ns megacorp
