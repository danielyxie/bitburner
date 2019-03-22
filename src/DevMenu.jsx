import { AugmentationNames }            from "./Augmentation/data/AugmentationNames";
import { CodingContractTypes }          from "./CodingContracts";
import { generateContract,
         generateRandomContract,
         generateRandomContractOnHome } from "./CodingContractGenerator";
import { Companies }                    from "./Company/Companies";
import { Company }                      from "./Company/Company";
import { Programs }                     from "./Programs/Programs";
import { Factions }                     from "./Faction/Factions";
import { Player }                       from "./Player";
import { PlayerOwnedSourceFile }        from "./SourceFile/PlayerOwnedSourceFile";
import { AllServers }                   from "./Server/AllServers";
import { GetServerByHostname }          from "./Server/ServerHelpers";
import { hackWorldDaemon }              from "./RedPill";
import { StockMarket,
         SymbolToStockMap }             from "./StockMarket/StockMarket";
import { Stock }                        from "./StockMarket/Stock";
import { Terminal }                     from "./Terminal";

import { numeralWrapper }               from "./ui/numeralFormat";

import { dialogBoxCreate }              from "../utils/DialogBox";
import { exceptionAlert }               from "../utils/helpers/exceptionAlert";
import { createElement }                from "../utils/uiHelpers/createElement";
import { createOptionElement }          from "../utils/uiHelpers/createOptionElement";
import { getSelectText }                from "../utils/uiHelpers/getSelectData";
import { removeElementById }            from "../utils/uiHelpers/removeElementById";

import React from "react";
import ReactDOM                                         from "react-dom";

const Component = React.Component;

const validSFN = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12];

class DevMenuComponent extends Component {
    constructor(props) {
        super(props);
        this.setSF = this.setSF.bind(this);
        this.setAllSF = this.setAllSF.bind(this);
        this.processStocks = this.processStocks.bind(this);
        this.setStockPrice = this.setStockPrice.bind(this);
        this.viewStockCaps = this.viewStockCaps.bind(this);
    }

    addMoney(n) {
        return function() {
            Player.gainMoney(n);
        }
    }

    upgradeRam() {
        Player.getHomeComputer().maxRam *= 2;
    }

    b1tflum3() {
        hackWorldDaemon(Player.bitNodeN, true);
    }

    hackW0r1dD43m0n() {
        hackWorldDaemon(Player.bitNodeN);
    }

    modifyExp(stat, modifier) {
        return function() {
            let field = null;
            let exp = 0;
            switch(stat) {
            case "hacking":
                field = document.getElementById('dev-hacking-exp');
                exp = parseInt(field.value);
                if(exp) {
                    Player.gainHackingExp(exp*modifier);
                }
                break;
            case "strength":
                field = document.getElementById('dev-strength-exp');
                exp = parseInt(field.value);
                if(exp) {
                    Player.gainStrengthExp(exp*modifier);
                }
                break;
            case "defense":
                field = document.getElementById('dev-defense-exp');
                exp = parseInt(field.value);
                if(exp) {
                    Player.gainDefenseExp(exp*modifier);
                }
                break;
            case "dexterity":
                field = document.getElementById('dev-dexterity-exp');
                exp = parseInt(field.value);
                if(exp) {
                    Player.gainDexterityExp(exp*modifier);
                }
                break;
            case "agility":
                field = document.getElementById('dev-agility-exp');
                exp = parseInt(field.value);
                if(exp) {
                    Player.gainAgilityExp(exp*modifier);
                }
                break;
            case "charisma":
                field = document.getElementById('dev-charisma-exp');
                exp = parseInt(field.value);
                if(exp) {
                    Player.gainCharismaExp(exp*modifier);
                }
                break;
            case "intelligence":
                field = document.getElementById('dev-intelligence-exp');
                exp = parseInt(field.value);
                if(exp) {
                    Player.gainIntelligenceExp(exp*modifier);
                }
                break;
            }
            Player.updateSkillLevels();
        }
    }

    tonsOfExp() {
        Player.gainHackingExp(1e27);
        Player.gainStrengthExp(1e27);
        Player.gainDefenseExp(1e27);
        Player.gainDexterityExp(1e27);
        Player.gainAgilityExp(1e27);
        Player.gainCharismaExp(1e27);
        Player.gainIntelligenceExp(1e27);
        Player.updateSkillLevels();
    }

    resetAllExp() {
        Player.hacking_exp = 0;
        Player.strength_exp = 0;
        Player.defense_exp = 0;
        Player.dexterity_exp = 0;
        Player.agility_exp = 0;
        Player.charisma_exp = 0;
        Player.intelligence_exp = 0;
        Player.updateSkillLevels();
    }

    resetExperience(stat) {
        return function() {
            switch(stat) {
            case "hacking":
                Player.hacking_exp = 0;
                break;
            case "strength":
                Player.strength_exp = 0;
                break;
            case "defense":
                Player.defense_exp = 0;
                break;
            case "dexterity":
                Player.dexterity_exp = 0;
                break;
            case "agility":
                Player.agility_exp = 0;
                break;
            case "charisma":
                Player.charisma_exp = 0;
                break;
            case "intelligence":
                Player.intelligence_exp = 0;
                break;
            }
            Player.updateSkillLevels();
        }
    }

    enableIntelligence() {
        if(Player.intelligence === 0) {
            Player.intelligence = 1;
            Player.updateSkillLevels();
        }
    }

    disableIntelligence() {
        Player.intelligence_exp = 0;
        Player.intelligence = 0;
        Player.updateSkillLevels();
    }

    factionNames() {
        for (const i in Factions) {
            factionsDropdown.options[factionsDropdown.options.length] = new Option(Factions[i].name, Factions[i].name);
        }
        return 
    }

    receiveInvite() {
        const factionsDropdown = document.getElementById('factions-dropdown');
        const facName = factionsDropdown.options[factionsDropdown.selectedIndex].value;
        Player.receiveInvite(facName);
    }

    receiveAllInvites() {
        for (const i in Factions) {
            Player.receiveInvite(Factions[i].name);
        }
    }

    modifyRep(modifier) {
        return function() {
            const field = document.getElementById('dev-faction-rep');
            const factionsDropdown = document.getElementById('factions-dropdown');
            const facName = factionsDropdown.options[factionsDropdown.selectedIndex].value;
            const fac = Factions[facName];
            const rep = parseFloat(field.value);
            if (fac != null && !isNaN(rep)) {
                fac.playerReputation += rep*modifier;
            }
        }
    }

    resetRep() {
        const factionsDropdown = document.getElementById('factions-dropdown');
        const facName = factionsDropdown.options[factionsDropdown.selectedIndex].value;
        const fac = Factions[facName];
        if (fac != null) {
            fac.playerReputation = 0;
        }
    }

    modifyFactionFavor(modifier) {
        return function() {
            const field = document.getElementById('dev-faction-favor');
            const factionsDropdown = document.getElementById('factions-dropdown');
            const facName = factionsDropdown.options[factionsDropdown.selectedIndex].value;
            const fac = Factions[facName];
            const rep = parseFloat(field.value);
            if (fac != null && !isNaN(rep)) {
                fac.favor += rep*modifier;
            }
        }
    }

    resetFactionFavor() {
        const factionsDropdown = document.getElementById('factions-dropdown');
        const facName = factionsDropdown.options[factionsDropdown.selectedIndex].value;
        const fac = Factions[facName];
        if (fac != null) {
            fac.favor = 0;
        }
    }

    tonsOfRep() {
        for (const i in Factions) {
            Factions[i].playerReputation = 1e27;
        }
    }

    resetAllRep() {
        for (const i in Factions) {
            Factions[i].playerReputation = 0;
        }
    }

    tonsOfFactionFavor() {
        for (const i in Factions) {
            Factions[i].favor = 1e27;
        }
    }

    resetAllFactionFavor() {
        for (const i in Factions) {
            Factions[i].favor = 0;
        }
    }

    queueAug() {
        const augsDropdown = document.getElementById('dev-augs-dropdown');
        const augName = augsDropdown.options[augsDropdown.selectedIndex].value;
        Player.queueAugmentation(augName);
    }

    queueAllAugs() {
        for (const i in AugmentationNames) {
            const augName = AugmentationNames[i];
            Player.queueAugmentation(augName);
        }
    }

    setSF(sfN, sfLvl) {
        return function() {
            if (sfLvl === 0) {
                Player.sourceFiles = Player.sourceFiles.filter((sf) => sf.n !== sfN);
                return;
            }

            if(!Player.sourceFiles.some((sf) => sf.n === sfN)) {
                Player.sourceFiles.push(new PlayerOwnedSourceFile(sfN, sfLvl));
                return;
            }

            for(let i = 0; i < Player.sourceFiles.length; i++) {
                if (Player.sourceFiles[i].n === sfN) {
                    Player.sourceFiles[i].lvl = sfLvl;
                }
            }
        }
    }

    setAllSF(sfLvl) {
        const component = this;
        return function(){
            for (let i = 0; i < validSFN.length; i++) {
                component.setSF(validSFN[i], sfLvl)();
            }
        }
    }

    addProgram() {
        const programDropdown = document.getElementById('dev-programs-dropdown');
        const program = programDropdown.options[programDropdown.selectedIndex].value;
        if(!Player.hasProgram(program)) {
            Player.getHomeComputer().programs.push(program);
        }
    }

    addAllPrograms() {
        for (const i in Programs) {
            if(!Player.hasProgram(Programs[i].name)) {
                Player.getHomeComputer().programs.push(Programs[i].name);
            }
        }
    }

    rootServer() {
        const serverDropdown = document.getElementById('dev-servers-dropdown');
        const serverName = serverDropdown.options[serverDropdown.selectedIndex].value;

        const server = GetServerByHostname(serverName);

        server.hasAdminRights = true;
        server.sshPortOpen    = true;
        server.ftpPortOpen    = true;
        server.smtpPortOpen   = true;
        server.httpPortOpen   = true;
        server.sqlPortOpen    = true;
        server.openPortCount  = 5;
    }

    rootAllServers() {
        for (const i in AllServers) {
            AllServers[i].hasAdminRights = true;
            AllServers[i].sshPortOpen    = true;
            AllServers[i].ftpPortOpen    = true;
            AllServers[i].smtpPortOpen   = true;
            AllServers[i].httpPortOpen   = true;
            AllServers[i].sqlPortOpen    = true;
            AllServers[i].openPortCount  = 5;
        }
    }

    minSecurity() {
        const serverDropdown = document.getElementById('dev-servers-dropdown');
        const serverName = serverDropdown.options[serverDropdown.selectedIndex].value;

        const server = GetServerByHostname(serverName);
        server.hackDifficulty = server.minDifficulty;
    }

    minAllSecurity() {
        for (const i in AllServers) {
            AllServers[i].hackDifficulty = AllServers[i].minDifficulty;
        }
    }

    maxMoney() {
        const serverDropdown = document.getElementById('dev-servers-dropdown');
        const serverName = serverDropdown.options[serverDropdown.selectedIndex].value;

        const server = GetServerByHostname(serverName);
        server.moneyAvailable = server.moneyMax;
    }

    maxAllMoney() {
        for (const i in AllServers) {
            AllServers[i].moneyAvailable = AllServers[i].moneyMax;
        }
    }

    modifyCompanyRep(modifier) {
        return function() {
            const field = document.getElementById('dev-company-rep');
            const companyDropdown = document.getElementById('dev-companies-dropdown');
            const companyName = companyDropdown.options[companyDropdown.selectedIndex].value;
            const company = Companies[companyName];
            const rep = parseFloat(field.value);
            if (company != null && !isNaN(rep)) {
                company.playerReputation += rep*modifier;
            }
        }
    }

    resetCompanyRep() {
        const companyDropdown = document.getElementById('dev-companies-dropdown');
        const companyName = companyDropdown.options[companyDropdown.selectedIndex].value;
        const company = Companies[companyName];
        company.playerReputation = 0;
    }

    modifyCompanyFavor(modifier) {
        return function() {
            const field = document.getElementById('dev-company-favor');
            const companyDropdown = document.getElementById('dev-companies-dropdown');
            const companyName = companyDropdown.options[companyDropdown.selectedIndex].value;
            const company = Companies[companyName];
            const rep = parseFloat(field.value);
            if (company != null && !isNaN(rep)) {
                company.favor += rep*modifier;
                console.log(company.favor);
            }
        }
    }

    resetCompanyFavor() {
        const companyDropdown = document.getElementById('dev-companies-dropdown');
        const companyName = companyDropdown.options[companyDropdown.selectedIndex].value;
        const company = Companies[companyName];
        company.favor = 0;
    }

    tonsOfRepCompanies() {
        for (const c in Companies) {
            Companies[c].playerReputation = 1e12;
        }
    }

    resetAllRepCompanies() {
        for (const c in Companies) {
            Companies[c].playerReputation = 0;
        }
    }

    tonsOfFavorCompanies() {
        for (const c in Companies) {
            Companies[c].favor = 1e12;
        }
    }

    resetAllFavorCompanies() {
        for (const c in Companies) {
            Companies[c].favor = 0;
        }
    }

    modifyBladeburnerRank(modify) {
        return function() {
            const field = document.getElementById('dev-bladeburner-rank');
            const rank = parseInt(field.value);
            if (!!Player.bladeburner) {
                Player.bladeburner.changeRank(rank*modify);
            }
        }
    }

    resetBladeburnerRank() {
        Player.bladeburner.rank = 0;
        Player.bladeburner.maxRank = 0;
    }

    addTonsBladeburnerRank() {
        if (!!Player.bladeburner) {
            Player.bladeburner.changeRank(1e12);
        }
    }

    modifyBladeburnerCycles(modify) {
        return function() {
            if (!!Player.bladeburner) {
                const field = document.getElementById('dev-bladeburner-cycles');
                const cycles = parseInt(field.value);
                Player.bladeburner.storedCycles += cycles*modify;
            }
        }
    }

    resetBladeburnerCycles() {
        if (!!Player.bladeburner) {
            Player.bladeburner.storedCycles = 0;
        }
    }

    addTonsBladeburnerCycles() {
        if (!!Player.bladeburner) {
            Player.bladeburner.storedCycles += 1e12;
        }
    }

    addTonsGangCycles() {
        if (!!Player.gang) {
            Player.gang.storedCycles = 1e12;
        }
    }

    modifyGangCycles(modify) {
        return function() {
            if (!!Player.gang) {
                const field = document.getElementById('dev-gang-cycles');
                const cycles = parseInt(field.value);
                Player.gang.storedCycles += cycles*modify;
            }
        }
    }

    resetGangCycles() {
        if (!!Player.gang) {
            Player.gang.storedCycles = 0;
        }
    }

    addTonsCorporationCycles() {
        if (!!Player.corporation) {
            Player.corporation.storedCycles = 1e12;
        }
    }

    modifyCorporationCycles(modify) {
        return function() {
            if (!!Player.corporation) {
                const field = document.getElementById('dev-corporation-cycles');
                const cycles = parseInt(field.value);
                Player.corporation.storedCycles += cycles*modify;
            }
        }
    }

    resetCorporationCycles() {
        if (!!Player.corporation) {
            Player.corporation.storedCycles = 0;
        }
    }

    specificContract() {
        const contractDropdown = document.getElementById('contract-types-dropdown');
        const contractType = contractDropdown.options[contractDropdown.selectedIndex].value;
        generateContract({
            problemType: contractType,
            server: "home",
        });
    }

    processStocks(cb) {
        const inputSymbols = document.getElementById('dev-stock-symbol').value.toString().replace(/\s/g, '');

        let match = function(symbol) { return true; }

        if (inputSymbols !== '' && inputSymbols !== 'all') {
            match = function(symbol) {
                return inputSymbols.split(',').includes(symbol);
            };
        }

        for (const name in StockMarket) {
            if (StockMarket.hasOwnProperty(name)) {
                const stock = StockMarket[name];
                if (stock instanceof Stock && match(stock.symbol)) {
                    cb(stock);
                }
            }
        }
    }

    setStockPrice() {
        const price = parseFloat(document.getElementById('dev-stock-price').value);

        if (!isNaN(price)) {
            this.processStocks((stock) => {
                stock.price = price;
            });
        }
    }

    viewStockCaps() {
        let text = "";
        this.processStocks((stock) => {
            text += `${stock.symbol}: ${numeralWrapper.format(stock.cap, '$0.000a')}<br>`;
        });
        dialogBoxCreate(text);
    }

    sleeveMaxAllShock() {
        for (let i = 0; i < Player.sleeves.length; ++i) {
            Player.sleeves[i].shock = 0;
        }
    }
    sleeveClearAllShock() {
        for (let i = 0; i < Player.sleeves.length; ++i) {
            Player.sleeves[i].shock = 100;
        }
    }
    sleeveMaxAllSync() {
        for (let i = 0; i < Player.sleeves.length; ++i) {
            Player.sleeves[i].sync = 100;
        }
    }
    sleeveClearAllSync() {
        for (let i = 0; i < Player.sleeves.length; ++i) {
            Player.sleeves[i].sync = 0;
        }
    }

    render() {
        let factions = [];
        for (const i in Factions) {
            factions.push(<option key={Factions[i].name} value={Factions[i].name}>{Factions[i].name}</option>);
        }

        let augs = [];
        for (const i in AugmentationNames) {
            augs.push(<option key={AugmentationNames[i]} value={AugmentationNames[i]}>{AugmentationNames[i]}</option>);
        }

        let programs = [];
        for (const i in Programs) {
            programs.push(<option key={Programs[i].name} value={Programs[i].name}>{Programs[i].name}</option>);
        }

        let sourceFiles = [];
        validSFN.forEach( i => sourceFiles.push(
<tr key={'sf-'+i}>
    <td><span className="text">SF-{i}:</span></td>
    <td>
        <button className="std-button touch-right" onClick={this.setSF(i, 0)}>0</button>
        <button className="std-button touch-sides" onClick={this.setSF(i, 1)}>1</button>
        <button className="std-button touch-sides" onClick={this.setSF(i, 2)}>2</button>
        <button className="std-button touch-left" onClick={this.setSF(i, 3)}>3</button>
    </td>
</tr>
));



        let servers = [];
        for (const i in AllServers) {
            const hn = AllServers[i].hostname;
            servers.push(<option key={hn} value={hn}>{hn}</option>);
        }

        let companies = [];
        for (const c in Companies) {
            const name = Companies[c].name;
            companies.push(<option key={name} value={name}>{name}</option>);
        }

        const contractTypes = [];
        const contractTypeNames = Object.keys(CodingContractTypes)
        for (let i = 0; i < contractTypeNames.length; i++) {
            const name = contractTypeNames[i];
            contractTypes.push(<option key={name} value={name}>{name}</option>);
        }


        return (
<div className="col">
    <div className="row">
        <h2>Generic</h2>
    </div>
    <div className="row">
            <button className="std-button" onClick={this.addMoney(1e12)}>Add $1t</button>
            <button className="std-button" onClick={this.addMoney(1e15)}>Add $1000t</button>
            <button className="std-button" onClick={this.upgradeRam}>Upgrade Home Computer's RAM</button>
    </div>
    <div className="row">
        <button className="std-button" onClick={this.b1tflum3}>Run bit_flum3.exe</button>
        <button className="std-button" onClick={this.hackW0r1dD43m0n}>Hack w0rld_d34m0n</button>
    </div>
    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Experience / Stats</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text text-center">All:</span></td>
                        <td><button className="std-button tooltip" onClick={this.tonsOfExp}>Tons of exp<span className="tooltiptext">Sometimes you just need a ton of experience in every stat</span></button></td>
                        <td><button className="std-button tooltip" onClick={this.resetAllExp}>Reset<span className="tooltiptext">Sometimes you just need a ton of experience in every stat</span></button></td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Hacking:</span>
                        </td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyExp('hacking', 1)}>+</button>
                            <input id="dev-hacking-exp" className="text-input exp-input" type="number" placeholder="+/- hacking exp" />
                            <button className="std-button remove-exp-button" onClick={this.modifyExp('hacking', -1)}>-</button>
                        </td>
                        <td>
                            <button className="std-button" onClick={this.resetExperience('hacking')}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Strength:</span>
                        </td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyExp('strength', 1)}>+</button>
                            <input id="dev-strength-exp" className="text-input exp-input" type="number" placeholder="+/- strength exp" />
                            <button className="std-button remove-exp-button" onClick={this.modifyExp('strength', -1)}>-</button>
                        </td>
                        <td>
                            <button className="std-button" onClick={this.resetExperience('strength')}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Defense:</span>
                        </td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyExp('defense', 1)}>+</button>
                            <input id="dev-defense-exp" className="text-input exp-input" type="number" placeholder="+/- defense exp" />
                            <button className="std-button remove-exp-button" onClick={this.modifyExp('defense', -1)}>-</button>
                        </td>
                        <td>
                            <button className="std-button" onClick={this.resetExperience('defense')}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Dexterity:</span>
                        </td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyExp('dexterity', 1)}>+</button>
                            <input id="dev-dexterity-exp" className="text-input exp-input" type="number" placeholder="+/- dexterity exp" />
                            <button className="std-button remove-exp-button" onClick={this.modifyExp('dexterity', -1)}>-</button>
                        </td>
                        <td>
                            <button className="std-button" onClick={this.resetExperience('dexterity')}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Agility:</span>
                        </td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyExp('agility', 1)}>+</button>
                            <input id="dev-agility-exp" className="text-input exp-input" type="number" placeholder="+/- agility exp" />
                            <button className="std-button remove-exp-button" onClick={this.modifyExp('agility', -1)}>-</button>
                        </td>
                        <td>
                            <button className="std-button" onClick={this.resetExperience('agility')}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Charisma:</span>
                        </td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyExp('charisma', 1)}>+</button>
                            <input id="dev-charisma-exp" className="text-input exp-input" type="number" placeholder="+/- charisma exp" />
                            <button className="std-button remove-exp-button" onClick={this.modifyExp('charisma', -1)}>-</button>
                        </td>
                        <td>
                            <button className="std-button" onClick={this.resetExperience('charisma')}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Intelligence:</span>
                        </td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyExp('intelligence', 1)}>+</button>
                            <input id="dev-intelligence-exp" className="text-input exp-input" type="number" placeholder="+/- intelligence exp" />
                            <button className="std-button remove-exp-button" onClick={this.modifyExp('intelligence', -1)}>-</button>
                        </td>
                        <td>
                            <button className="std-button" onClick={this.resetExperience('intelligence')}>Reset</button>
                        </td>
                        <td>
                            <button className="std-button" onClick={this.enableIntelligence}>Enable</button>
                        </td>
                        <td>
                            <button className="std-button" onClick={this.disableIntelligence}>Disable</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Factions</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text">Faction:</span></td>
                        <td><select id="factions-dropdown" className="dropdown exp-input">
                            {factions}
                        </select></td>
                    </tr>
                    <tr>
                        <td><span className="text">Invites:</span></td>
                        <td><button className="std-button" onClick={this.receiveInvite}>Receive invite from faction</button></td>
                        <td><button className="std-button" onClick={this.receiveAllInvites}>Receive all Invites</button></td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text">Reputation:</span>
                        </td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyRep(1)}>+</button>
                            <input id="dev-faction-rep" className="text-input exp-input" type="number" placeholder="+/- reputation" />
                            <button className="std-button remove-exp-button" onClick={this.modifyRep(-1)}>-</button>
                        </td>
                        <td>
                        <button className="std-button remove-exp-button" onClick={this.resetRep}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text">Favor:</span>
                        </td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyFactionFavor(1)}>+</button>
                            <input id="dev-faction-favor" className="text-input exp-input" type="number" placeholder="+/- favor" />
                            <button className="std-button remove-exp-button" onClick={this.modifyFactionFavor(-1)}>-</button>
                        </td>
                        <td>
                        <button className="std-button remove-exp-button" onClick={this.resetFactionFavor}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td><span className="text">All Reputation:</span></td>
                        <td>
                            <button className="std-button" onClick={this.tonsOfRep}>Tons</button>
                            <button className="std-button" onClick={this.resetAllRep}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td><span className="text">All Favor:</span></td>
                        <td>
                            <button className="std-button" onClick={this.tonsOfFactionFavor}>Tons</button>
                            <button className="std-button" onClick={this.resetAllFactionFavor}>Reset</button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Augmentations</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text">Aug:</span></td>
                        <td><select id="dev-augs-dropdown" className="dropdown">{augs}</select></td>
                    </tr>
                    <tr>
                        <td><span className="text">Queue:</span></td>
                        <td><button className="std-button" onClick={this.queueAug}>One</button>
                        <button className="std-button" onClick={this.queueAllAugs}>All</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Source-Files</h2>
            </div>
            <table>
                <tbody>
                    <tr key={'sf-all'}>
                        <td><span className="text">All:</span></td>
                        <td>
                            <button className="std-button touch-right" onClick={this.setAllSF(0)}>0</button>
                            <button className="std-button touch-sides" onClick={this.setAllSF(1)}>1</button>
                            <button className="std-button touch-sides" onClick={this.setAllSF(2)}>2</button>
                            <button className="std-button touch-left" onClick={this.setAllSF(3)}>3</button>
                        </td>
                    </tr>
                    {sourceFiles}
                </tbody>
            </table>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Programs</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text">Program:</span></td>
                        <td><select id="dev-programs-dropdown" className="dropdown">{programs}</select></td>
                    </tr>
                    <tr>
                        <td><span className="text">Add:</span></td>
                        <td>
                            <button className="std-button" onClick={this.addProgram}>One</button>
                            <button className="std-button" onClick={this.addAllPrograms}>All</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Servers</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text">Server:</span></td>
                        <td colSpan="2"><select id="dev-servers-dropdown" className="dropdown">{servers}</select></td>
                    </tr>
                    <tr>
                        <td><span className="text">Root:</span></td>
                        <td><button className="std-button" onClick={this.rootServer}>Root one</button></td>
                        <td><button className="std-button" onClick={this.rootAllServers}>Root all</button></td>
                    </tr>
                    <tr>
                        <td><span className="text">Security:</span></td>
                        <td><button className="std-button" onClick={this.minSecurity}>Min one</button></td>
                        <td><button className="std-button" onClick={this.minAllSecurity}>Min all</button></td>
                    </tr>
                    <tr>
                        <td><span className="text">Money:</span></td>
                        <td><button className="std-button" onClick={this.maxMoney}>Max one</button></td>
                        <td><button className="std-button" onClick={this.maxAllMoney}>Max all</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Companies</h2>
            </div>
            <table>
                <tbody>
                    <tr>    
                        <td><span className="text">Company:</span></td>
                        <td colSpan="3"><select id="dev-companies-dropdown" className="dropdown">{companies}</select></td>
                    </tr>
                    <tr>
                        <td><span className="text">Reputation:</span></td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyCompanyRep(1)}>+</button>
                            <input id="dev-company-rep" className="text-input exp-input" type="number" placeholder="+/- reputation" />
                            <button className="std-button remove-exp-button" onClick={this.modifyCompanyRep(-1)}>-</button>
                        </td>
                        <td>
                            <button className="std-button remove-exp-button" onClick={this.resetCompanyRep}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td><span className="text">Favor:</span></td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyCompanyFavor(1)}>+</button>
                            <input id="dev-company-favor" className="text-input exp-input" type="number" placeholder="+/- favor" />
                            <button className="std-button remove-exp-button" onClick={this.modifyCompanyFavor(-1)}>-</button>
                        </td>
                        <td>
                            <button className="std-button remove-exp-button" onClick={this.resetCompanyFavor}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td><span className="text">All Reputation:</span></td>
                        <td>
                            <button className="std-button" onClick={this.tonsOfRepCompanies}>Tons</button>
                            <button className="std-button" onClick={this.resetAllRepCompanies}>Reset</button>
                        </td>
                    </tr>
                    <tr>
                        <td><span className="text">All Favor:</span></td>
                        <td>
                            <button className="std-button" onClick={this.tonsOfFavorCompanies}>Tons</button>
                            <button className="std-button" onClick={this.resetAllFavorCompanies}>Reset</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Bladeburner</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text">Rank:</span></td>
                        <td><button className="std-button" onClick={this.addTonsBladeburnerRank}>Tons</button></td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyBladeburnerRank(1)}>+</button>
                            <input id="dev-bladeburner-rank" className="text-input exp-input" type="number" placeholder="+/- rank" />
                            <button className="std-button remove-exp-button" onClick={this.modifyBladeburnerRank(-1)}>-</button>
                        </td>
                        <td><button className="std-button" onClick={this.resetBladeburnerRank}>Reset</button></td>
                    </tr>
                    <tr>
                        <td><span className="text">Cycles:</span></td>
                        <td><button className="std-button" onClick={this.addTonsBladeburnerCycles}>Tons</button></td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyBladeburnerCycles(1)}>+</button>
                            <input id="dev-bladeburner-cycles" className="text-input exp-input" type="number" placeholder="+/- cycles" />
                            <button className="std-button remove-exp-button" onClick={this.modifyBladeburnerCycles(-1)}>-</button>
                        </td>
                        <td><button className="std-button" onClick={this.resetBladeburnerCycles}>Reset</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Gang</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text">Cycles:</span></td>
                        <td><button className="std-button" onClick={this.addTonsGangCycles}>Tons</button></td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyGangCycles(1)}>+</button>
                            <input id="dev-gang-cycles" className="text-input exp-input" type="number" placeholder="+/- cycles" />
                            <button className="std-button remove-exp-button" onClick={this.modifyGangCycles(-1)}>-</button>
                        </td>
                        <td><button className="std-button" onClick={this.resetGangCycles}>Reset</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Corporation</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text">Cycles:</span></td>
                        <td><button className="std-button" onClick={this.addTonsCorporationCycles}>Tons</button></td>
                        <td>
                            <button className="std-button add-exp-button" onClick={this.modifyCorporationCycles(1)}>+</button>
                            <input id="dev-corporation-cycles" className="text-input exp-input" type="number" placeholder="+/- cycles" />
                            <button className="std-button remove-exp-button" onClick={this.modifyCorporationCycles(-1)}>-</button>
                        </td>
                        <td><button className="std-button" onClick={this.resetCorporationCycles}>Reset</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Coding Contracts</h2>
            </div>

            <table>
            <tbody>
                <tr>
                    <td>
                        <button className="std-button" onClick={generateRandomContract}>Generate Random Contract</button>
                        <button className="std-button" onClick={generateRandomContractOnHome}>Generate Random Contract on Home Comp</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <select id="contract-types-dropdown" className="dropdown">
                            {contractTypes}
                        </select>
                        <button className="std-button" onClick={this.specificContract}>Generate Specified Contract Type on Home Comp</button>
                        
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>


    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Stock Market</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text">Symbol:</span></td>
                        <td><input id="dev-stock-symbol" className="text-input" type="text" placeholder="symbol/'all'" /></td>
                    </tr>
                    <tr>
                        <td><span className="text">Price:</span></td>
                        <td>
                            <input id="dev-stock-price" className="text-input" type="number" placeholder="$$$" />
                            <button className="std-button" onClick={this.setStockPrice}>Set</button>
                        </td>
                    </tr>
                    <tr>
                        <td><span className="text">Caps:</span></td>
                        <td><button className="std-button" onClick={this.viewStockCaps}>View stock caps</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    <div className="row">
        <div className="col">
            <div className="row">
                <h2>Sleeves</h2>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td><span className="text">Shock:</span></td>
                        <td><button className="std-button" onClick={this.sleeveMaxAllShock}>Max all</button></td>
                        <td><button className="std-button" onClick={this.sleeveClearAllShock}>Clear all</button></td>
                    </tr>
                    <tr>
                        <td><span className="text">Sync:</span></td>
                        <td><button className="std-button" onClick={this.sleeveMaxAllSync}>Max all</button></td>
                        <td><button className="std-button" onClick={this.sleeveClearAllSync}>Clear all</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</div>
        );
    }
}


const devMenuContainerId = "dev-menu-container";

export function createDevMenu() {
    if (process.env.NODE_ENV !== "development") {
        throw new Error("Cannot create Dev Menu because you are not in a dev build");
    }

    const devMenuText = createElement("h1", {
        display: "block",
        innerText: "Development Menu - Only meant to be used for testing/debugging",
    });

    // Generic
    const genericHeader = createElement("h2", {
        display: "block",
        innerText: "Generic"
    });

    const addMoney = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.gainMoney(1e15);
        },
        display: "block",
        innerText: "Add $1000t",
    });

    const addMoney2 = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.gainMoney(1e12);
        },
        display: "block",
        innerText: "Add $1t",
    })

    const addRam = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.getHomeComputer().maxRam *= 2;
        },
        display: "block",
        innerText: "Double Home Computer RAM",
    });

    const triggerBitflume = createElement("button", {
        class: "std-button",
        clickListener: () => {
            hackWorldDaemon(Player.bitNodeN, true);
        },
        innerText: "Trigger BitFlume",
    });

    const destroyCurrentBitnode = createElement("button", {
        class: "std-button",
        clickListener: () => {
            hackWorldDaemon(Player.bitNodeN);
        },
        innerText: "Destroy Current BitNode",
        tooltip: "Will grant Source-File for the BitNode",
    });

    // Experience / stats
    const statsHeader = createElement("h2", {
        display: "block",
        innerText: "Experience/Stats"
    });

    const statsHackingExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- hacking exp",
        type: "number",
    });
    const statsHackingExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsHackingExpInput.value);
            Player.gainHackingExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Hacking Exp",
    });

    const statsStrengthExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- strength exp",
        type: "number",
    });
    const statsStrengthExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsStrengthExpInput.value);
            Player.gainStrengthExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Strength Exp",
    });

    const statsDefenseExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- defense exp",
        type: "number",
    });
    const statsDefenseExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsDefenseExpInput.value);
            Player.gainDefenseExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Defense Exp",
    });

    const statsDexterityExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- dexterity exp",
        type: "number",
    });
    const statsDexterityExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsDexterityExpInput.value);
            Player.gainDexterityExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Dexterity Exp",
    });

    const statsAgilityExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- agility exp",
        type: "number",
    });
    const statsAgilityExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsAgilityExpInput.value);
            Player.gainAgilityExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Agility Exp",
    });

    const statsCharismaExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- charisma exp",
        type: "number",
    });
    const statsCharismaExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsCharismaExpInput.value);
            Player.gainCharismaExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Charisma Exp",
    });

    const statsIntelligenceExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- intelligence exp",
        type: "number",
    });
    const statsIntelligenceExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsIntelligenceExpInput.value);
            Player.gainIntelligenceExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Intelligence Exp",
    });

    const statsEnableIntelligenceButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.intelligence = 1;
        },
        innerText: "Enable Intelligence"
    });

    const statsDisableIntelligenceButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.intelligence = 0;
        },
        innerText: "Disable Intelligence"
    });

    // Factions
    const factionsHeader = createElement("h2", {innerText: "Factions"});

    const factionsDropdown = createElement("select", {
        class: "dropdown",
        margin: "5px",
    });
    for (const i in Factions) {
        factionsDropdown.options[factionsDropdown.options.length] = new Option(Factions[i].name, Factions[i].name);
    }

    const factionsAddButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const facName = factionsDropdown.options[factionsDropdown.selectedIndex].value;
            Player.receiveInvite(facName);
        },
        innerText: "Receive Invite to Faction",
    });

    const factionsReputationInput = createElement("input", {
        placeholder: "Rep to add to faction",
        type: "number",
    });

    const factionsReputationButton = createElement("button", {
        class: "std-button",
        innerText: "Add rep to faction",
        clickListener: () => {
            const facName = getSelectText(factionsDropdown);
            const fac = Factions[facName];
            const rep = parseFloat(factionsReputationInput.value);
            if (fac != null && !isNaN(rep)) {
                fac.playerReputation += rep;
            }
        },
    });

    // Augmentations
    const augmentationsHeader = createElement("h2", {innerText: "Augmentations"});

    const augmentationsDropdown = createElement("select", {
        class: "dropdown",
        margin: "5px",
    });
    for (const i in AugmentationNames) {
        const augName = AugmentationNames[i];
        augmentationsDropdown.options[augmentationsDropdown.options.length] = new Option(augName, augName);
    }

    const augmentationsQueueButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.queueAugmentation(augmentationsDropdown.options[augmentationsDropdown.selectedIndex].value);
        },
        innerText: "Queue Augmentation",
    });

    const giveAllAugmentationsButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            for (const i in AugmentationNames) {
                const augName = AugmentationNames[i];
                Player.queueAugmentation(augName);
            }
        },
        display: "block",
        innerText: "Queue All Augmentations",
    });

    // Source Files
    const sourceFilesHeader = createElement("h2", { innerText: "Source-Files" });

    const removeSourceFileDropdown = createElement("select", {
        class: "dropdown",
        margin: "5px",
    });
    for (let i = 0; i < 24; ++i) {
        removeSourceFileDropdown.add(createOptionElement(String(i)));
    }

    const removeSourceFileButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const numToRemove = parseInt(getSelectText(removeSourceFileDropdown));
            for (let i = 0; i < Player.sourceFiles.length; ++i) {
                if (Player.sourceFiles[i].n === numToRemove) {
                    Player.sourceFiles.splice(i, 1);
                    hackWorldDaemon(Player.bitNodeN, true);
                    return;
                }
            }
        },
        innerText: "Remove Source File and Trigger Bitflume",
    });

    // Programs
    const programsHeader = createElement("h2", {innerText: "Programs"});

    const programsAddDropdown = createElement("select", {
        class: "dropdown",
        margin: "5px",
    });
    for (const i in Programs) {
        const progName = Programs[i].name;
        programsAddDropdown.options[programsAddDropdown.options.length] = new Option(progName, progName);
    }

    const programsAddButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const program = programsAddDropdown.options[programsAddDropdown.selectedIndex].value;
            if(!Player.hasProgram(program)) {
                Player.getHomeComputer().programs.push(program);
            }
        },
        innerText: "Add Program",
    })

    // Servers
    const serversHeader = createElement("h2", {innerText: "Servers"});

    const serversOpenAll = createElement("button", {
        class: "std-button",
        clickListener: () => {
            for (const i in AllServers) {
                AllServers[i].hasAdminRights = true;
                AllServers[i].sshPortOpen    = true;
                AllServers[i].ftpPortOpen    = true;
                AllServers[i].smtpPortOpen   = true;
                AllServers[i].httpPortOpen   = true;
                AllServers[i].sqlPortOpen    = true;
                AllServers[i].openPortCount  = 5;
            }
        },
        display: "block",
        innerText: "Get Admin Rights to all servers",
    });

    const serversMinSecurityAll = createElement("button", {
        class: "std-button",
        clickListener: () => {
            for (const i in AllServers) {
                AllServers[i].hackDifficulty = AllServers[i].minDifficulty;
            }
        },
        display: "block",
        innerText: "Set all servers to min security",
    });

    const serversMaxMoneyAll = createElement("button", {
        class: "std-button",
        clickListener: () => {
            for (const i in AllServers) {
                AllServers[i].moneyAvailable = AllServers[i].moneyMax;
            }
        },
        display: "block",
        innerText: "Set all servers to max money",
    });

    const serversConnectToDropdown = createElement("select", {class: "dropdown"});
    for (const i in AllServers) {
        const hn = AllServers[i].hostname;
        serversConnectToDropdown.options[serversConnectToDropdown.options.length] = new Option(hn, hn);
    }

    const serversConnectToButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const host = serversConnectToDropdown.options[serversConnectToDropdown.selectedIndex].value;
            Terminal.connectToServer(host);
        },
        innerText: "Connect to server",
    });

    // Companies
    const companiesHeader = createElement("h2", { innerText: "Companies" });

    const companiesDropdown = createElement("select", {
        class: "dropdown",
        margin: "5px",
    });
    for (const c in Companies) {
        companiesDropdown.add(createOptionElement(Companies[c].name));
    }

    const companyReputationInput = createElement("input", {
        margin: "5px",
        placeholder: "Rep to add to company",
        type: "number",
    });

    const companyReputationButton = createElement("button", {
        class: "std-button",
        innerText: "Add rep to company",
        clickListener: () => {
            const compName = getSelectText(companiesDropdown);
            const company = Companies[compName];
            const rep = parseFloat(companyReputationInput.value);
            if (company != null && !isNaN(rep)) {
                company.playerReputation += rep;
            } else {
                console.warn(`Invalid input for Dev Menu Company Rep. Company Name: ${compName}. Rep: ${rep}`);
            }
        }
    });

    // Bladeburner
    const bladeburnerHeader = createElement("h2", {innerText: "Bladeburner"});

    const bladeburnerGainRankInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "Rank to gain (or negative to lose rank)",
        type: "number",
    });

    const bladeburnerGainRankButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            try {
                const rank = parseInt(bladeburnerGainRankInput.value);
                Player.bladeburner.changeRank(rank);
            } catch(e) {
                exceptionAlert(`Failed to change Bladeburner Rank in dev menu: ${e}`);
            }
        },
        innerText: "Gain Bladeburner Rank",
    });

    const bladeburnerStoredCyclesInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "# Cycles to Add",
        type: "number",
    });

    const bladeburnerStoredCyclesButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            try {
                const cycles = parseInt(bladeburnerStoredCyclesInput.value);
                Player.bladeburner.storedCycles += cycles;
            } catch(e) {
                exceptionAlert(`Failed to add cycles to Bladeburner in dev menu: ${e}`);
            }
        },
        innerText: "Add Cycles to Bladeburner mechanic",
    });

    // Gang
    const gangHeader = createElement("h2", {innerText: "Gang"});

    const gangStoredCyclesInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "# Cycles to add",
        type: "number",
    });

    const gangAddStoredCycles = createElement("button", {
        class: "std-button",
        clickListener: () => {
            try {
                const cycles = parseInt(gangStoredCyclesInput.value);
                Player.gang.storedCycles += cycles;
            } catch(e) {
                exceptionAlert(`Failed to add stored cycles to gang mechanic: ${e}`);
            }
        },
        innerText: "Add cycles to Gang mechanic",
    });

    // Corporation
    const corpHeader = createElement("h2", { innerText: "Corporation" });

    const corpStoredCyclesInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "# Cycles to Add",
        type: "number",
    });

    const corpStoredCyclesButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            try {
                const cycles = parseInt(bladeburnerStoredCyclesInput.value);
                Player.corporation.storeCycles(cycles);
            } catch(e) {
                exceptionAlert(`Failed to add cycles to Bladeburner in dev menu: ${e}`);
            }
        },
        innerText: "Add Cycles to Corporation mechanic",
    });

    // Coding Contracts
    const contractsHeader = createElement("h2", {innerText: "Coding Contracts"});

    const generateRandomContractBtn = createElement("button", {
        class: "std-button",
        clickListener: () => {
            generateRandomContract();
        },
        innerText: "Generate Random Contract",
    });

    const generateRandomContractOnHomeBtn = createElement("button", {
        class: "std-button",
        clickListener: () => {
            generateRandomContractOnHome();
        },
        innerText: "Generate Random Contract on Home Comp",
    });

    const generateContractWithTypeSelector = createElement("select", { margin: "5px" });
    const contractTypes = Object.keys(CodingContractTypes);
    for (let i = 0; i < contractTypes.length; ++i) {
        generateContractWithTypeSelector.add(createOptionElement(contractTypes[i]));
    }

    const generateContractWithTypeBtn = createElement("button", {
        class: "std-button",
        clickListener: () => {
            generateContract({
                problemType: getSelectText(generateContractWithTypeSelector),
                server: "home",
            });
        },
        innerText: "Generate Specified Contract Type on Home Comp",
    });

    // Stock Market
    const stockmarketHeader = createElement("h2", {innerText: "Stock Market"});

    const stockInput = createElement("input", {
        class: "text-input",
        display: "block",
        placeholder: "Stock symbol(s), or 'all'",
    });

    function processStocks(cb) {
        const input = stockInput.value.toString().replace(/\s/g, '');

        // Empty input, or "all", will process all stocks
        if (input === "" || input.toLowerCase() === "all") {
            for (const name in StockMarket) {
                if (StockMarket.hasOwnProperty(name)) {
                    const stock = StockMarket[name];
                    if (stock instanceof Stock) {
                        cb(stock);
                    }
                }
            }
            return;
        }

        const stockSymbols = input.split(",");
        for (let i = 0; i < stockSymbols.length; ++i) {
            const stock = SymbolToStockMap[stockSymbols];
            if (stock instanceof Stock) {
                cb(stock);
            }
        }
    }

    const stockPriceChangeInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "Price to change stock(s) to",
        type: "number",
    });

    const stockPriceChangeBtn = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const price = parseInt(stockPriceChangeInput.value);
            if (isNaN(price)) { return; }

            processStocks((stock) => {
                stock.price = price;
            });
            dialogBoxCreate(`Stock Prices changed to ${price}`);
        },
        innerText: "Change Stock Price(s)",
    });

    const stockViewPriceCapBtn = createElement("button", {
        class: "std-button",
        clickListener: () => {
            let text = "";
            processStocks((stock) => {
                text += `${stock.symbol}: ${numeralWrapper.format(stock.cap, '$0.000a')}<br>`;
            });
            dialogBoxCreate(text);
        },
        innerText: "View Stock Price Caps",
    });

    // Sleeves
    const sleevesHeader = createElement("h2", { innerText: "Sleeves" });

    const sleevesRemoveAllShockRecovery = createElement("button", {
        class: "std-button",
        display: "block",
        innerText: "Set Shock Recovery of All Sleeves to 0",
        clickListener: () => {
            for (let i = 0; i < Player.sleeves.length; ++i) {
                Player.sleeves[i].shock = 100;
            }
        }
    });

    // Add everything to container, then append to main menu
    const devMenuContainer = createElement("div", {
        class: "generic-menupage-container",
        id: devMenuContainerId,
    });

    devMenuContainer.appendChild(devMenuText);
    /*devMenuContainer.appendChild(genericHeader);
    devMenuContainer.appendChild(addMoney);
    devMenuContainer.appendChild(addMoney2);
    devMenuContainer.appendChild(addRam);
    devMenuContainer.appendChild(triggerBitflume);
    devMenuContainer.appendChild(destroyCurrentBitnode);
    devMenuContainer.appendChild(statsHeader);
    devMenuContainer.appendChild(statsHackingExpInput);
    devMenuContainer.appendChild(statsHackingExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsStrengthExpInput);
    devMenuContainer.appendChild(statsStrengthExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsDefenseExpInput);
    devMenuContainer.appendChild(statsDefenseExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsDexterityExpInput);
    devMenuContainer.appendChild(statsDexterityExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsAgilityExpInput);
    devMenuContainer.appendChild(statsAgilityExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsCharismaExpInput);
    devMenuContainer.appendChild(statsCharismaExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsIntelligenceExpInput);
    devMenuContainer.appendChild(statsIntelligenceExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsEnableIntelligenceButton);
    devMenuContainer.appendChild(statsDisableIntelligenceButton);
    devMenuContainer.appendChild(factionsHeader);
    devMenuContainer.appendChild(factionsDropdown);
    devMenuContainer.appendChild(factionsAddButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(factionsReputationInput);
    devMenuContainer.appendChild(factionsReputationButton);
    devMenuContainer.appendChild(augmentationsHeader);
    devMenuContainer.appendChild(augmentationsDropdown);
    devMenuContainer.appendChild(augmentationsQueueButton);
    devMenuContainer.appendChild(giveAllAugmentationsButton);
    devMenuContainer.appendChild(sourceFilesHeader);
    devMenuContainer.appendChild(removeSourceFileDropdown);
    devMenuContainer.appendChild(removeSourceFileButton);
    devMenuContainer.appendChild(programsHeader);
    devMenuContainer.appendChild(programsAddDropdown);
    devMenuContainer.appendChild(programsAddButton);
    devMenuContainer.appendChild(serversHeader);
    devMenuContainer.appendChild(serversOpenAll);
    devMenuContainer.appendChild(serversMinSecurityAll);
    devMenuContainer.appendChild(serversMaxMoneyAll);
    devMenuContainer.appendChild(serversConnectToDropdown);
    devMenuContainer.appendChild(serversConnectToButton);
    devMenuContainer.appendChild(companiesHeader);
    devMenuContainer.appendChild(companiesDropdown);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(companyReputationInput);
    devMenuContainer.appendChild(companyReputationButton);
    devMenuContainer.appendChild(bladeburnerHeader);
    devMenuContainer.appendChild(bladeburnerGainRankInput);
    devMenuContainer.appendChild(bladeburnerGainRankButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(bladeburnerStoredCyclesInput);
    devMenuContainer.appendChild(bladeburnerStoredCyclesButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(gangHeader);
    devMenuContainer.appendChild(gangStoredCyclesInput);
    devMenuContainer.appendChild(gangAddStoredCycles);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(corpHeader);
    devMenuContainer.appendChild(corpStoredCyclesInput);
    devMenuContainer.appendChild(corpStoredCyclesButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(contractsHeader);
    devMenuContainer.appendChild(generateRandomContractBtn);
    devMenuContainer.appendChild(generateRandomContractOnHomeBtn);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(generateContractWithTypeSelector);
    devMenuContainer.appendChild(generateContractWithTypeBtn);
    devMenuContainer.appendChild(stockmarketHeader);
    devMenuContainer.appendChild(stockInput);
    devMenuContainer.appendChild(stockPriceChangeInput);
    devMenuContainer.appendChild(stockPriceChangeBtn);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(stockViewPriceCapBtn);
    devMenuContainer.appendChild(sleevesHeader);
    devMenuContainer.appendChild(sleevesRemoveAllShockRecovery);*/

   const entireGameContainer = document.getElementById("entire-game-container");
   if (entireGameContainer == null) {
       throw new Error("Could not find entire-game-container DOM element");
   }
   entireGameContainer.appendChild(devMenuContainer);

   //react
    devMenuContainer.appendChild(createElement("div", {
        id: "react-dev-menu",
    }));
    ReactDOM.render(<DevMenuComponent />, document.getElementById('react-dev-menu'));
}

export function closeDevMenu() {
    removeElementById(devMenuContainerId);
}
