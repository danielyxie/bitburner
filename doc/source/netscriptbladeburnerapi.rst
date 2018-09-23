Netscript Bladeburner API
=========================
Netscript provides the following API for interacting with the game's Bladeburner mechanic.

The Bladeburner API is **not** immediately available to the player and must be unlocked
later in the game

**WARNING: This page contains spoilers for the game**

The Bladeburner API is unlocked in BitNode-7. If you are in BitNode-7, you will
automatically gain access to this API. Otherwise, you must have Source-File 7 in
order to use this API in other BitNodes

**Bladeburner API functions must be accessed through the 'bladeburner' namespace**

In :ref:`netscript1`::

    bladeburner.getContractNames();
    bladeburner.startAction("general", "Training");

In :ref:`netscriptjs`::

    ns.bladeburner.getContractNames();
    ns.bladeburner.startAction("general", "Training");

.. _bladeburner_action_types:

Bladeburner Action Types
------------------------

Several functions in the Bladeburner API require you to specify an action using
its type and name. The following are valid values when specifying the action's type:

**Contracts**
    * contract
    * contracts
    * contr

**Operations**
    * operation
    * operations
    * op
    * ops

**Black Ops**
    * blackoperation
    * black operation
    * black operations
    * black op
    * black ops
    * blackop
    * blackops

**General Actions (Training, Field Analysis, Recruitment)**
    * general
    * general action
    * gen

getContractNames
----------------

.. js:function:: getContractNames()

    Returns an array of strings containing the names of all Bladeburner contracts

getOperationNames
-----------------

.. js:function:: getOperationNames()

    Returns an array of strings containing the names of all Bladeburner operations

getBlackOpNames
---------------

.. js:function:: getBlackOpNames()

    Returns an array of strings containing the names of all Bladeburner Black Ops

getGeneralActionNames
---------------------

.. js:function:: getGeneralActionNames()

    Returns an array of strings containing the names of all general Bladeburner actions

getSkillNames
-------------

.. js:function:: getSkillNames()

    Returns an array of strings containing the names of all Bladeburner skills

startAction
-----------

.. js:function:: startAction(type, name)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Attempts to start the specified Bladeburner action. Returns true if the action
    was started successfully, and false otherwise.

stopBladeburnerAction
---------------------

.. js:function:: stopBladeburnerAction()

    Stops the current Bladeburner action

getCurrentAction
----------------

.. js:function:: getCurrentAction()

    Returns an object that represents the player's current Bladeburner action::

        {
            type: Type of Action
            name: Name of Action
        }

    If the player is not performing an action, the function will return an object
    with the 'type' property set to "Idle".

getActionTime
-------------

.. js:function:: getActionTime(type, name)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Returns the number of seconds it takes to complete the specified action

getActionEstimatedSuccessChance
-------------------------------

.. js:function:: getActionEstimatedSuccessChance(type, name)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Returns the estimated success chance for the specified action. This chance
    is returned as a decimal value, NOT a percentage (e.g. if you have an estimated
    success chance of 80%, then this function will return 0.80, NOT 80).

getActionCountRemaining
-----------------------

.. js:function:: getActionCountRemaining(type, name)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Returns the remaining count of the specified action.

    Note that this is meant to be used for Contracts and Operations.
    This function will return 'Infinity' for actions such as Training and Field Analysis.

getActionMaxLevel
-----------------

.. js:function:: getActionMaxLevel(type, name)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Returns the maximum level for this action.

    Returns -1 if an invalid action is specified.

getActionCurrentLevel
---------------------

.. js:function:: getActionCurrentLevel(type, name)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Returns the current level of this action.

    Returns -1 if an invalid action is specified.

getActionAutolevel
------------------

.. js:function:: getActionAutolevel(type, name)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Return a boolean indicating whether or not this action is currently set to autolevel.

    Returns false if an invalid action is specified.

setActionAutolevel
------------------

.. js:function:: setActionAutolevel(type, name, autoLevel)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :param boolean autoLevel: Whether or not to autolevel this action

    Enable/disable autoleveling for the specified action.

setActionLevel
--------------

.. js:function:: setActionLevel(type, name, level)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :param level int: Level to set this action to

    Set the level for the specified action.

getRank
-------

.. js:function:: getRank()

    Returns the player's Bladeburner Rank

getSkillPoints
--------------

.. js:function:: getSkillPoints()

    Returns the number of Bladeburner skill points you have

getSkillLevel
-------------

.. js:function:: getSkillLevel(skillName="")

    :param string skillName: Name of skill. Case-sensitive and must be an exact match

    This function returns your level in the specified skill.

    The function returns -1 if an invalid skill name is passed in

getSkillUpgradeCost
-------------------

.. js:function:: getSkillUpgradeCost(skillName="")

    :param string skillName: Name of skill. Case-sensitive and must be an exact match

    This function returns the number of skill points needed to upgrade the
    specified skill.

    The function returns -1 if an invalid skill name is passed in.

upgradeSkill
------------

.. js:function:: upgradeSkill(skillName)

    :param string skillName: Name of Skill to be upgraded. Case-sensitive and must be an exact match

    Attempts to upgrade the specified Bladeburner skill. Returns true if the
    skill is successfully upgraded, and false otherwise

getTeamSize
-----------

.. js:function:: getTeamSize(type, name)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match

    Returns the number of Bladeburner team members you have assigned to the
    specified action.

    Setting a team is only applicable for Operations and BlackOps. This function
    will return 0 for other action types.

setTeamSize
-----------

.. js:function:: setTeamSize(type, name, size)

    :param string type: Type of action. See :ref:`bladeburner_action_types`
    :param string name: Name of action. Must be an exact match
    :param int size: Number of team members to set. Will be converted using Math.round()

    Set the team size for the specified Bladeburner action.

    Returns the team size that was set, or -1 if the function failed.

getCityEstimatedPopulation
--------------------------

.. js:function:: getCityEstimatedPopulation(cityName)

    :param string cityName: Name of city. Case-sensitive

    Returns the estimated number of Synthoids in the specified city, or -1
    if an invalid city was specified.

getCityEstimatedCommunities
---------------------------

.. js:function:: getCityEstimatedCommunities(cityName)

    :param string cityName: Name of city. Case-sensitive

    Returns the estimated number of Synthoid communities in the specified city,
    or -1 if an invalid city was specified.

getCityChaos
------------

.. js:function:: getCityChaos(cityName)

    :param string cityName: Name of city. Case-sensitive

    Returns the chaos in the specified city, or -1 if an invalid city was specified

switchCity
----------

.. js:function:: switchCity(cityName)

    :param string cityName: Name of city

    Attempts to switch to the specified city (for Bladeburner only).

    Returns true if successful, and false otherwise

getStamina
----------

.. js:function:: getStamina()

    Returns an array with two elements:

        [Current stamina, Max stamina]

    Example usage::

        function getStaminaPercentage() {
            let res = bladeburner.getStamina();
            return res[0] / res[1];
        }

joinBladeburnerFaction
----------------------

.. js:function:: joinBladeburnerFaction()

    Attempts to join the Bladeburner faction.

    Returns true if you successfully join the Bladeburner faction, or if
    you are already a member.

    Returns false otherwise.

joinBladeburnerDivision
-----------------------

.. js:function:: joinBladeburnerDivision()

    Attempts to join the Bladeburner division.

    Returns true if you successfully join the Bladeburner division, or if you
    are already a member.

    Returns false otherwise

getBonusTime
------------

.. js:function:: getBonusTime()

    Returns the amount of accumulated "bonus time" (seconds) for the Bladeburner mechanic.

    "Bonus time" is accumulated when the game is offline or if the game is
    inactive in the browser.

    "Bonus time" makes the game progress faster, up to 5x the normal speed.
    For example, if an action takes 30 seconds to complete but you've accumulated
    over 30 seconds in bonus time, then the action will only take 6 seconds
    in real life to complete.

Examples
--------

**Basic example usage**::

    tprint(bladeburner.getContractNames());
    tprint(bladeburner.getOperationNames());
    tprint(bladeburner.getBlackOpNames());
    tprint(bladeburner.getGeneralActionNames());
    tprint(bladeburner.getSkillNames());
    tprint(bladeburner.getActionTime("contract", "Tracking"));
    tprint("Rank: " + bladeburner.getRank());
    tprint("Skill Points: " + bladeburner.getSkillPoints());
    tprint("Cloak Skill Level: " + bladeburner.getSkillLevel("Cloak"));
    tprint("Trying to upgradeSkill: " + bladeburner.upgradeSkill("Cloak"));
    tprint("Skill Points remaining: " + bladeburner.getSkillPoints());

    tprint("Trying to switch to a nonexistent city: " + bladeburner.switchCity("lskgns"));

    var chongqing = "Chongqing";
    tprint("Trying to switch to Chongqing: " + bladeburner.switchCity(chongqing));
    tprint("Chongqing chaos: " + bladeburner.getCityChaos(chongqing));
    tprint("Chongqing estimated pop: " + bladeburner.getCityEstimatedPopulation(chongqing));
    tprint("Chonqging estimated communities: " + bladeburner.getCityEstimatedCommunities(chongqing));

**Bladeburner handler example**. Note that this avoids the need of using the *bladeburner* namespace
identifier by attaching the Bladeburner API functions to an object::

    const FIELD_ANALYSIS_INTERVAL = 10; //Number of minutes between field analysis states
    const FIELD_ANALYSIS_DURATION = 5;  //Duration in minutes

    function BladeburnerHandler(ns, params) {
        //Netscript environment becomes part of the instance
        this.ns = ns;

        //Netscript bladeburner API becomes part of this instance
        for (var bladeburnerFn in ns.bladeburner) {
            this[bladeburnerFn] = ns.bladeburner[bladeburnerFn];
        }

        this.fieldAnalysis = {
            inProgress:         params.startFieldAnalysis ? true : false,
            cyclesRemaining:    params.startFieldAnalysis ? FIELD_ANALYSIS_DURATION : 0,
            cyclesSince:        params.startFieldAnalysis ? FIELD_ANALYSIS_INTERVAL : 0,
        }
    }



    BladeburnerHandler.prototype.getStaminaPercentage = function() {
        var res = this.getStamina();
        return 100 * (res[0] / res[1]);
    }

    BladeburnerHandler.prototype.hasSimulacrum = function() {
        var augs = this.ns.getOwnedAugmentations();
        return augs.includes("The Blade's Simulacrum");
    }

    BladeburnerHandler.prototype.handle = function() {
        //If we're doing something else manually (without Simlacrum),
        //it overrides Bladeburner stuff
        if (!this.hasSimulacrum() && this.ns.isBusy()) {
            this.ns.print("Idling bc player is busy with some other action");
            return;
        }

        if (this.fieldAnalysis.inProgress) {
            --(this.fieldAnalysis.cyclesRemaining);
            if (this.fieldAnalysis.cyclesRemaining < 0) {
                this.fieldAnalysis.inProgress = false;
                this.fieldAnalysis.cyclesSince = 0;
                return this.handle();
            } else {
                this.startAction("general", "Field Analysis");
                this.ns.print("handler is doing field analyis for " +
                              (this.fieldAnalysis.cyclesRemaining+1) + " more mins");
                return 31; //Field Analysis Time + 1
            }
        } else {
            ++(this.fieldAnalysis.cyclesSince);
            if (this.fieldAnalysis.cyclesSince > FIELD_ANALYSIS_INTERVAL) {
                this.fieldAnalysis.inProgress = true;
                this.fieldAnalysis.cyclesRemaining = FIELD_ANALYSIS_DURATION;
                return this.handle();
            }
        }

        this.stopBladeburnerAction();

        var staminaPerc = this.getStaminaPercentage();
        if (staminaPerc < 55) {
            this.ns.print("handler is starting training due to low stamina percentage");
            this.startAction("general", "Training");
            return 31; //Training time + 1
        } else {
            var action = this.chooseAction();
            this.ns.print("handler chose " + action.name + " " + action.type + " through chooseAction()");
            this.startAction(action.type, action.name);
            return (this.getActionTime(action.type, action.name) + 1);
        }
    }

    BladeburnerHandler.prototype.chooseAction = function() {
        //Array of all Operations
        var ops = this.getOperationNames();

        //Sort Operations in order of increasing success chance
        ops.sort((a, b)=>{
            return this.getActionEstimatedSuccessChance("operation", a) -
                   this.getActionEstimatedSuccessChance("operation", b);
        });

        //Loop through until you find one with 99+% success chance
        for (let i = 0; i < ops.length; ++i) {
            let successChance   = this.getActionEstimatedSuccessChance("operation", ops[i]);
            let count           = this.getActionCountRemaining("operation", ops[i]);
            if (successChance >= 0.99 && count > 10) {
                return {type: "operation", name: ops[i]};
            }
        }

        //Repeat for Contracts
        var contracts = this.getContractNames();
        contracts.sort((a, b)=>{
            return this.getActionEstimatedSuccessChance("contract", a) -
                   this.getActionEstimatedSuccessChance("contract", b);
        });

        for (let i = 0; i < contracts.length; ++i) {
            let successChance   = this.getActionEstimatedSuccessChance("contract", contracts[i]);
            let count           = this.getActionCountRemaining("contract", contracts[i]);
            if (successChance >= 0.80 && count > 10) {
                return {type: "contract", name: contracts[i]};
            }
        }

        return {type:"general", name:"Training"};
    }


    BladeburnerHandler.prototype.process = async function() {
        await this.ns.sleep(this.handle() * 1000);
    }

    export async function main(ns) {
        //Check if Bladeburner is available. This'll throw a runtime error if it's not
        ns.bladeburner.getContractNames();

        var startFieldAnalysis = true;
        if (ns.args.length >= 1 && ns.args[0] == "false") {
            startFieldAnalysis = false;
        }

        var handler = new BladeburnerHandler(ns, {
            startFieldAnalysis: startFieldAnalysis
        });
        while(true) {
            await handler.process();
        }
    }
