gymWorkout() Netscript Function
===============================

.. js:function:: gymWorkout(gymName, stat)
    :RAM cost: 2 GB

    :param string gymName:
        Name of gym. Not case-sensitive. You must be in the correct city for whatever gym you specify.

        * Crush Fitness Gym
        * Snap Fitness Gym
        * Iron Gym
        * Powerhouse Gym
        * Millenium Fitness Gym
    :param string stat:
        The stat you want to train. Not case-sensitive.

        * strength OR str
        * defense OR def
        * dexterity OR dex
        * agility OR agi

        If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

        This function will automatically set you to start working out at a gym to train a particular stat. If you are
        already in the middle of some "working" action (such as working at a company, for a faction, or on a program),
        then running this function will automatically cancel that action and give you your earnings.

        The cost and experience gains for all of these gyms are the same as if you were to manually visit these gyms and train

        This function will return true if you successfully start working out at the gym, and false otherwise.
