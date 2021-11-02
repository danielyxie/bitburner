.. _netscript_bladeburnerapi:

Netscript Bladeburner API
=========================
Netscript provides the following API for interacting with the game's Bladeburner mechanic.

The Bladeburner API is **not** immediately available to the player and must be unlocked
later in the game.

.. warning:: This page contains spoilers for the game

The Bladeburner API is unlocked in BitNode-7. If you are in BitNode-7, you will
automatically gain access to this API. Otherwise, you must have Source-File 7 in
order to use this API in other BitNodes.

**Bladeburner API functions must be accessed through the 'bladeburner' namespace**

In :ref:`netscript1`::

    bladeburner.getContractNames();
    bladeburner.startAction("general", "Training");

In :ref:`netscriptjs`::

    ns.bladeburner.getContractNames();
    ns.bladeburner.startAction("general", "Training");

.. toctree::
    :caption: Functions:

    getContractNames() <bladeburnerapi/getContractNames>
    getOperationNames() <bladeburnerapi/getOperationNames>
    getBlackOpNames() <bladeburnerapi/getBlackOpNames>
    getGeneralActionNames() <bladeburnerapi/getGeneralActionNames>
    getSkillNames() <bladeburnerapi/getSkillNames>
    startAction() <bladeburnerapi/startAction>
    stopBladeburnerAction() <bladeburnerapi/stopBladeburnerAction>
    getCurrentAction() <bladeburnerapi/getCurrentAction>
    getActionTime() <bladeburnerapi/getActionTime>
    getActionEstimatedSuccessChance() <bladeburnerapi/getActionEstimatedSuccessChance>
    getActionRepGain() <bladeburnerapi/getActionRepGain>
    getActionCountRemaining() <bladeburnerapi/getActionCountRemaining>
    getActionMaxLevel() <bladeburnerapi/getActionMaxLevel>
    getActionCurrentLevel() <bladeburnerapi/getActionCurrentLevel>
    getActionAutolevel() <bladeburnerapi/getActionAutolevel>
    setActionAutolevel() <bladeburnerapi/setActionAutolevel>
    setActionLevel() <bladeburnerapi/setActionLevel>
    getRank() <bladeburnerapi/getRank>
    getBlackOpRank() <bladeburnerapi/getBlackOpRank>
    getSkillPoints() <bladeburnerapi/getSkillPoints>
    getSkillLevel() <bladeburnerapi/getSkillLevel>
    getSkillUpgradeCost() <bladeburnerapi/getSkillUpgradeCost>
    upgradeSkill() <bladeburnerapi/upgradeSkill>
    getTeamSize() <bladeburnerapi/getTeamSize>
    setTeamSize() <bladeburnerapi/setTeamSize>
    getCityEstimatedPopulation() <bladeburnerapi/getCityEstimatedPopulation>
    getCityCommunities() <bladeburnerapi/getCityCommunities>
    getCityChaos() <bladeburnerapi/getCityChaos>
    getCity() <bladeburnerapi/getCity>
    switchCity() <bladeburnerapi/switchCity>
    getStamina() <bladeburnerapi/getStamina>
    joinBladeburnerFaction() <bladeburnerapi/joinBladeburnerFaction>
    joinBladeburnerDivision() <bladeburnerapi/joinBladeburnerDivision>
    getBonusTime() <bladeburnerapi/getBonusTime>


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

**General Actions (Training, Field Analysis, etc)**
    * general
    * general action
    * gen

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
        //If we're doing something else manually (without Simulacrum),
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
