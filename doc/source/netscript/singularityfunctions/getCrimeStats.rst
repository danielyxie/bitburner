getCrimeStats() Netscript Function
===================================

.. js:function:: getCrimeStats(crime)

    :RAM cost: 5 GB

    :param string crime:
        Name of crime. Not case-sensitive. This argument is fairlyn lenient in terms of what inputs it accepts.
        Check the documentation for the *commitCrime()* function for a list of example inputs.

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    :return The stats of the crime

    {
        "difficulty": 0.2,
        "karma": 0.25,
        "kills": 0,
        "money": 36000,
        "name": "Mug",
        "time": 4000,
        "type": "mug someone",
        "hacking_success_weight": 0,
        "strength_success_weight": 1.5,
        "defense_success_weight": 0.5,
        "dexterity_success_weight": 1.5,
        "agility_success_weight": 0.5,
        "charisma_success_weight": 0,
        "hacking_exp": 0,
        "strength_exp": 3,
        "defense_exp": 3,
        "dexterity_exp": 3,
        "agility_exp": 3,
        "charisma_exp": 0,
        "intelligence_exp": 0
    }
