Netscript Singularity Functions
===============================

The Singularity Functions are a special set of Netscript functions. These functions allow you to control
many additional aspects of the game through scripts, such as working for factions/companies, purchasing/installing Augmentations,
and creating programs.

The Singularity Functions are **not** immediately available to the player and must be unlocked later in the game.

**WARNING: This page contains spoilers for the game**.

The Singularity Functions are unlocked in BitNode-4. If you are in BitNode-4, then you will automatically have access to all of these functions.
You can use the Singularity Functions in other BitNodes if and only if you have the Source-File for BitNode-4 (aka Source-File 4). Each level of
Source-File 4 will open up additional Singularity Functions that you can use in other BitNodes. If your Source-File 4 is upgraded all the way to
level 3, then you will be able to access all of the Singularity Functions.

Note that Singularity Functions require a lot of RAM outside of BitNode-4 (their RAM costs are multiplied by 10 if you are not in BitNode-4)

universityCourse
----------------

.. js:function:: universityCourse(universityName, courseName)

    :param string universityName:
        Name of university. Not case-sensitive. You must be in the correct city for whatever university you specify.

        * Summit University
        * Rothman University
        * ZB Institute Of Technology
    :param string courseName:
        Name of course. Not case-sensitive.

        * Study Computer Science
        * Data Strucures
        * Networks
        * Algorithms
        * Management
        * Leadership

        If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

        This function will automatically set you to start taking a course at a university. If you are already in the middle of some
        "working" action (such as working at a company, for a faction, or on a program), then running this function will automatically
        cancel that action and give you your earnings.

        The cost and experience gains for all of these universities and classes are the same as if you were to manually visit and take these classes.

        This function will return true if you successfully start taking the course, and false otherwise.

gymWorkout
----------

.. js:function:: gymWorkout(gymName, stat)

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

travelToCity
------------

.. js:function:: travelToCity(cityName)

    :param string cityName:
        City to travel to. CASE-SENSITIVE.

        * Aevum
        * Chongqing
        * Sector-12
        * New Tokyo
        * Ishima
        * Volhaven

        If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

        This function allows the player to travel to any city. The cost for using this function is the same as the cost for traveling through the Travel Agency.

        This function will return true if you successfully travel to the specified city and false otherwise.

purchaseTor
-----------

.. js:function:: purchaseTor()

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

    This function allows you to automatically purchase a TOR router. The cost for purchasing a TOR router using this
    function is the same as if you were to manually purchase one.

    This function will return true if it successfully purchase a TOR router and false otherwise.

purchaseProgram
---------------

.. js:function:: purchaseProgram(programName)

    :param string programName: Name of program to purchase. Must include '.exe' extension. Not case-sensitive.

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

    This function allows you to automatically purchase programs. You MUST have a TOR router in order to use this function.
    The cost of purchasing programs using this function is the same as if you were purchasing them through the Dark Web using the
    Terminal *buy* command.

    Example::

        purchaseProgram("brutessh.exe");

    This function will return true if the specified program is purchased, and false otherwise.

getStats
--------

.. js:function:: getStats()

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to run this function.

    Returns an object with the Player's stats. The object has the following properties::

        {
            hacking
            strength
            defense
            dexterity
            agility
            charisma
            intelligence
        }

    Example::

        res = getStats();
        print('My charisma level is: ' + res.charisma);

getCharacterInformation
-----------------------

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to run this function.

    Returns an object with various information about your character. The object has the following properties::

        {
            bitnode:            Current BitNode number
            company:            Name of company
            jobTitle:           Name of job
            city:               Name of city you are currently in
            factions:           Array of factions you are currently a member of
            tor:                Boolean indicating whether or not you have a tor router

            //The following apply to when the character is performing
            //some type of working action, such as working for a company/faction
            timeWorked:         Timed worked in ms
            workHackExpGain:    Hacking experience earned so far from work
            workStrExpGain:     Str experience earned so far from work
            workDefExpGain:     Def experience earned so far from work
            workDexExpGain:     Dex experience earned so far from work
            workAgiExpGain:     Agi experience earned so far from work
            workChaExpGain:     Cha experience earned so far from work
            workRepGain:        Reputation earned so far from work, if applicable
            workMoneyGain:      Money earned so far from work, if applicable
        }

isBusy
------

.. js:function:: isBusy()

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to run this function.

    Returns a boolean indicating whether or not the player is currently performing an 'action'. These actions include
    working for a company/faction, studying at a univeristy, working out at a gym, creating a program, or committing a crime.

stopAction
----------

.. js:function:: stopAction()

    If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to run this function.
    This function is used to end whatever 'action' the player is currently performing. The player
    will receive whatever money/experience/etc. he has earned from that action.

    The actions that can be stopped with this function are:

    * Studying at a university
    * Working for a company/faction
    * Creating a program
    * Committing a Crime

    This function will return true if the player's action was ended. It will return false if the player was not
    performing an action when this function was called.

upgradeHomeRam
--------------

.. js:function:: upgradeHomeRam()

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will upgrade amount of RAM on the player's home computer. The cost is the same as if you were to do it manually.

    This function will return true if the player's home computer RAM is successfully upgraded, and false otherwise.

getUpgradeHomeRamCost
---------------------

.. js:function:: getUpgradeHomeRamCost()

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    Returns the cost of upgrading the player's home computer RAM.

workForCompany
--------------

.. js:function:: workForCompany()

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will automatically set you to start working at the company at which you are employed.
    If you are already in the middle of some "working" action (such as working for a faction, training at
    a gym, or creating a program), then running this function will automatically cancel that action and give you your earnings.

    This function will return true if the player starts working, and false otherwise.

    Note that when you are working for a company, you will not actually receive your earnings
    (reputation, money, experience) until you FINISH the action. This can be an issue if, for example,
    you only want to work until you get 100,000 company reputation. One small hack to get around this is to
    continuously restart the action to receive your earnings::

        while (getCompanyRep(COMPANY HERE) < VALUE) {
            workForCompany();
            sleep(60000);
        }

    This way, your company reputation will be updated every minute.

applyToCompany
--------------

.. js:function:: applyToCompany(companyName, field)

    :param string companyName: Name of company to apply to. CASE-SENSITIVE.
    :param string field:
        Field to which you want to apply. Not case-sensitive

        * software
        * software consultant
        * it
        * security engineer
        * network engineer
        * business
        * business consultant
        * security
        * agent
        * employee
        * part-time employee
        * waiter
        * part-time waiter

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will automatically try to apply to the specified company for a position in the specified
    field. This function can also be used to apply for promotions by specifying the company and field you
    are already employed at.

    This function will return true if you successfully get a job/promotion, and false otherwise. Note that
    if you are trying to use this function to apply for a promotion and you don't get one, it will return false.

getCompanyRep
-------------

.. js:function:: getCompanyRep(companyName)

    :param string companyName: Name of the company. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will return the amount of reputation you have at the specified company.
    If the company passed in as an argument is invalid, -1 will be returned.

getCompanyFavor
---------------

.. js:function:: getCompanyFavor(companyName)

    :param string companyName: Name of the company. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will return the amount of favor you have at the specified company.
    If the company passed in as an argument is invalid, -1 will be returned.
    
getCompanyFavorGain
-------------------

.. js:function:: getCompanyFavorGain(companyName)

    :param string companyName: Name of the company. CASE-SENSITIVE
    
    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.
    
    This function will return the amount of favor you will gain for the specified company 
    when you reset by installing Augmentations.

checkFactionInvitations
-----------------------

.. js:function:: checkFactionInvitations()

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    Returns an array with the name of all Factions you currently have oustanding invitations from.

joinFaction
-----------

.. js:function:: joinFaction(name)

    :param string name: Name of faction to join. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will automatically accept an invitation from a faction and join it.

workForFaction
--------------

.. js:function:: workForFaction(factionName, workType)

    :param string factionName: Name of faction to work for. CASE-SENSITIVE
    :param string workType:
        Type of work to perform for the faction

        * hacking/hacking contracts/hackingcontracts
        * field/fieldwork/field work
        * security/securitywork/security work

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function will automatically set you to start working for the specified faction.
    Obviously, you must be a member of the faction or else this function will fail. If you are already in
    the middle of some "working" action (such as working for a company, training at a gym, or creating a program),
    then running this function will automatically cancel that action and give you your earnings.

    This function will return true if you successfully start working for the specified faction, and false otherwise.

    Note that when you are working for a faction, you will not actually receive your earnings (reputation, experience)
    until you FINISH the action. This can be an issue if, for example, you only want to work until you get 100,000 faction
    reputation. One small hack to get around this is to continuously restart the action to receive your earnings::

        while (getFactionRep(FACTION NAME) < VALUE) {
            workForFaction(FACNAME, WORKTYPE);
            sleep(60000);
        }

    This way, your faction reputation will be updated every minute.

getFactionRep
-------------

.. js:function:: getFactionRep(factionName)

    :param string factionName: Name of faction. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function returns the amount of reputation you have for the specified faction.

getFactionFavor
---------------

.. js:function:: getFactionFavor(factionName)

    :param string factionName: Name of faction. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.

    This function returns the amount of favor you have for the specified faction.
    
getFactionFavorGain
-------------------

.. js:function:: getFactionFavorGain(factionName)

    :param string factionName: Name of faction. CASE-SENSITIVE
    
    If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function.
    
    This function returns the amount of favor you will gain for the specified faction when you reset by installing Augmentations.

createProgram
-------------

.. js:function:: createProgram(programName)

    :param string programName: Name of program to create. Not case-sensitive

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function will automatically set you to start working on creating the specified program. If you are
    already in the middle of some "working" action (such as working for a company, training at a gym, or taking a course),
    then running this function will automatically cancel that action and give you your earnings.

    Example:

        createProgram("relaysmtp.exe");

        Note that creating a program using this function has the same hacking level requirements as it normally would. These level requirements are:

        * BruteSSH.exe: 50
        * FTPCrack.exe: 100
        * relaySMTP.exe: 250
        * HTTPWorm.exe: 500
        * SQLInject.exe: 750
        * DeepscanV1.exe: 75
        * DeepscanV2.exe: 400
        * ServerProfiler.exe: 75
        * AutoLink.exe: 25

        This function returns true if you successfully start working on the specified program, and false otherwise.

commitCrime
-----------

.. js:function:: commitCrime(crime)

    :param string crime:
        Name of crime to attempt. Not case-sensitive. This argument is fairly lenient in terms of what inputs it accepts.
        Here is a list of valid inputs for all of the crimes:

        * shoplift
        * rob store
        * mug
        * larceny
        * deal drugs
        * bond forgery
        * traffick arms
        * homicide
        * grand theft auto
        * kidnap
        * assassinate
        * heist

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function is used to automatically attempt to commit crimes. If you are already in the middle of some 'working' action
    (such as working for a company or training at a gym), then running this function will automatically cancel that action and give you your earnings.

    Note that crimes committed using this function will have all of their earnings halved (this applied for both money and experience!)

    This function returns the number of seconds it takes to attempt the specified crime (e.g It takes 60 seconds to attempt the 'Rob Store' crime,
    so running *commitCrime('rob store')* will return 60).

    Warning: I do not recommend using the time returned from this function to try and schedule your crime attempts.
    Instead, I would use the isBusy() Singularity function to check whether you have finished attempting a crime.
    This is because although the game sets a certain crime to be X amount of seconds, there is no guarantee that your
    browser will follow that time limit.

getCrimeChance
--------------

.. js:function:: getCrimeChance(crime)

    :param string crime:
        Name of crime. Not case-sensitive. This argument is fairlyn lenient in terms of what inputs it accepts.
        Check the documentation for the *commitCrime()* function for a list of example inputs.

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function returns your chance of success at commiting the specified crime. The chance is returned as a decimal (i.e. 60% would be returned as 0.6).

getOwnedAugmentations
---------------------

.. js:function:: getOwnedAugmentations(purchased=false)

    :param boolean purchase:
        Specifies whether the returned array should include Augmentations you have purchased but not yet installed.
        By default, this argument is false which means that the return value will NOT have the purchased Augmentations.

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function returns an array containing the names (as strings) of all Augmentations you have.

getOwnedSourceFiles
-------------------

.. js:function:: getOwnedSourceFiles()

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    Returns an array of source files
    [{n: 1, lvl: 3}, {n: 4, lvl: 3}]


getAugmentationsFromFaction
---------------------------

.. js:function:: getAugmentationsFromFaction(facName)

    :param string facName: Name of faction. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    Returns an array containing the names (as strings) of all Augmentations that are available from the specified faction.

getAugmentationCost
-------------------

.. js:function:: getAugmentationCost(augName)

    :param string augName: Name of Augmentation. CASE-SENSITIVE

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function returns an array with two elements that gives the cost for the specified Augmentation.
    The first element in the returned array is the reputation requirement of the Augmentation, and the second element is the money cost.

    If an invalid Augmentation name is passed in for the *augName* argument, this function will return the array [-1, -1].

purchaseAugmentation
--------------------

.. js:function:: purchaseAugmentation(factionName, augName)

    :param string factionName: Name of faction to purchase Augmentation from. CASE-SENSITIVE
    :param string augName: Name of Augmentation to purchase. CASE-SENSITIVE


    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function will try to purchase the specified Augmentation through the given Faction.

    This function will return true if the Augmentation is successfully purchased, and false otherwise.

installAugmentations
--------------------

.. js:function:: installAugmentations(cbScript)

    :param string cbScript:
        Optional callback script. This is a script that will automatically be run after Augmentations are installed (after the reset).
        This script will be run with no arguments and 1 thread. It must be located on your home computer.

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function will automatically install your Augmentations, resetting the game as usual.

    It will return true if successful, and false otherwise.
