prompt() Netscript Function
===========================

.. js:function:: prompt(txt)

    :RAM cost: 0 GB
    :param string txt: Text to appear in the prompt dialog box.
    :returns: ``true`` if the player clicks "Yes".

    Prompts the player with a dialog box with two options: "Yes" and "No". This
    function will return true if the player click "Yes" and false if the player
    clicks "No". The script's execution is halted until the player selects one
    of the options.

    Example:

    .. code-block:: javascript

        cost = getPurchasedServerCost(8192);
        answer = prompt("Buy a server for $"+cost);
        if(answer) {
            purchaseServer("my server", 8192);
        }
