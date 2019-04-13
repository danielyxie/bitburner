import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { CodingContractTypes } from "./CodingContracts";
import {
    generateContract,
    generateRandomContract,
    generateRandomContractOnHome
} from "./CodingContractGenerator";
import { Companies } from "./Company/Companies";
import { Company } from "./Company/Company";
import { Programs } from "./Programs/Programs";
import { Factions } from "./Faction/Factions";
import { Player } from "./Player";
import { PlayerOwnedSourceFile } from "./SourceFile/PlayerOwnedSourceFile";
import { AllServers } from "./Server/AllServers";
import { GetServerByHostname } from "./Server/ServerHelpers";
import { hackWorldDaemon } from "./RedPill";
import { StockMarket, SymbolToStockMap } from "./StockMarket/StockMarket";
import { Stock } from "./StockMarket/Stock";
import { Terminal } from "./Terminal";

import { numeralWrapper } from "./ui/numeralFormat";

import { dialogBoxCreate } from "../utils/DialogBox";
import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { createElement } from "../utils/uiHelpers/createElement";
import { createOptionElement } from "../utils/uiHelpers/createOptionElement";
import { getSelectText } from "../utils/uiHelpers/getSelectData";
import { removeElementById } from "../utils/uiHelpers/removeElementById";

import React from "react";
import ReactDOM from "react-dom";


const Component = React.Component;

// Update as additional BitNodes get implemented
const validSFN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Some dev menu buttons just add a lot of something for convenience
const tonsPP = 1e27;
const tonsP = 1e12;


class ValueAdjusterComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.setValue = this.setValue.bind(this);
    }
    setValue(event) {
        this.setState({ value: event.target.value });
    }
    render() {
        const { title, add, subtract, reset } = this.props;
        const { value } = this.state;
        return (
            <>
            <button className="std-button add-exp-button" onClick={() => add(this.state.value)}>+</button>
            <input className="text-input exp-input" type="number"
                placeholder={`+/- ${title}`} value={this.state.value} onChange={this.setValue}></input>
            <button className="std-button remove-exp-button" onClick={() => subtract(this.state.value)}>-</button>
            <button className="std-button" onClick={reset}>Reset</button>
            </>
        );
    }
}

class DevMenuComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: 'ECorp',
            faction: 'Illuminati',
            program: 'NUKE.exe',
            server: 'home',
            augmentation: 'Augmented Targeting I',
            codingcontract: 'Find Largest Prime Factor',
        }

        this.setSF = this.setSF.bind(this);
        this.setAllSF = this.setAllSF.bind(this);
        this.processStocks = this.processStocks.bind(this);
        this.setStockPrice = this.setStockPrice.bind(this);
        this.viewStockCaps = this.viewStockCaps.bind(this);

        this.setFactionDropdown = this.setFactionDropdown.bind(this);
        this.setCompanyDropdown = this.setCompanyDropdown.bind(this);
        this.setProgramDropdown = this.setProgramDropdown.bind(this);
        this.setServerDropdown = this.setServerDropdown.bind(this);
        this.setAugmentationDropdown = this.setAugmentationDropdown.bind(this);
        this.setCodingcontractDropdown = this.setCodingcontractDropdown.bind(this);

        this.receiveInvite = this.receiveInvite.bind(this);
        this.modifyFactionRep = this.modifyFactionRep.bind(this);
        this.resetFactionRep = this.resetFactionRep.bind(this);
        this.modifyFactionFavor = this.modifyFactionFavor.bind(this);
        this.resetFactionFavor = this.resetFactionFavor.bind(this);
        this.queueAug = this.queueAug.bind(this);
        this.addProgram = this.addProgram.bind(this);
        this.rootServer = this.rootServer.bind(this);
        this.minSecurity = this.minSecurity.bind(this);
        this.maxMoney = this.maxMoney.bind(this);
        this.modifyCompanyRep = this.modifyCompanyRep.bind(this);
        this.resetCompanyRep = this.resetCompanyRep.bind(this);
        this.modifyCompanyFavor = this.modifyCompanyFavor.bind(this);
        this.resetCompanyFavor = this.resetCompanyFavor.bind(this);
        this.specificContract = this.specificContract.bind(this);
    }

    setFactionDropdown(event) {
        this.setState({ faction: event.target.value });
    }

    setCompanyDropdown(event) {
        this.setState({ company: event.target.value });
    }

    setProgramDropdown(event) {
        this.setState({ program: event.target.value });
    }

    setServerDropdown(event) {
        this.setState({ server: event.target.value });
    }

    setAugmentationDropdown(event) {
        this.setState({ augmentation: event.target.value });
    }

    setCodingcontractDropdown(event) {
        this.setState({ codingcontract: event.target.value });
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
        return function(exp) {
            switch(stat) {
            case "hacking":
                if(exp) {
                    Player.gainHackingExp(exp*modifier);
                }
                break;
            case "strength":
                if(exp) {
                    Player.gainStrengthExp(exp*modifier);
                }
                break;
            case "defense":
                if(exp) {
                    Player.gainDefenseExp(exp*modifier);
                }
                break;
            case "dexterity":
                if(exp) {
                    Player.gainDexterityExp(exp*modifier);
                }
                break;
            case "agility":
                if(exp) {
                    Player.gainAgilityExp(exp*modifier);
                }
                break;
            case "charisma":
                if(exp) {
                    Player.gainCharismaExp(exp*modifier);
                }
                break;
            case "intelligence":
                if(exp) {
                    Player.gainIntelligenceExp(exp*modifier);
                }
                break;
            }
            Player.updateSkillLevels();
        }
    }

    tonsOfExp() {
        Player.gainHackingExp(tonsPP);
        Player.gainStrengthExp(tonsPP);
        Player.gainDefenseExp(tonsPP);
        Player.gainDexterityExp(tonsPP);
        Player.gainAgilityExp(tonsPP);
        Player.gainCharismaExp(tonsPP);
        Player.gainIntelligenceExp(tonsPP);
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

    receiveInvite() {
        Player.receiveInvite(this.state.faction);
    }

    receiveAllInvites() {
        for (const i in Factions) {
            Player.receiveInvite(Factions[i].name);
        }
    }

    modifyFactionRep(modifier) {
        const component = this;
        return function(reputation) {
            const fac = Factions[component.state.faction];
            if (fac != null && !isNaN(reputation)) {
                fac.playerReputation += reputation*modifier;
            }
        }
    }

    resetFactionRep() {
        const fac = Factions[this.state.faction];
        if (fac != null) {
            fac.playerReputation = 0;
        }
    }

    modifyFactionFavor(modifier) {
        const component = this;
        return function(favor) {
            const fac = Factions[component.state.faction];
            if (fac != null && !isNaN(favor)) {
                fac.favor += favor*modifier;
            }
        }
    }

    resetFactionFavor() {
        const fac = Factions[this.state.faction];
        if (fac != null) {
            fac.favor = 0;
        }
    }

    tonsOfRep() {
        for (const i in Factions) {
            Factions[i].playerReputation = tonsPP;
        }
    }

    resetAllRep() {
        for (const i in Factions) {
            Factions[i].playerReputation = 0;
        }
    }

    tonsOfFactionFavor() {
        for (const i in Factions) {
            Factions[i].favor = tonsPP;
        }
    }

    resetAllFactionFavor() {
        for (const i in Factions) {
            Factions[i].favor = 0;
        }
    }

    queueAug() {
        Player.queueAugmentation(this.state.augmentation);
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
        const program = this.state.program;
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
        const serverName = this.state.server;
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
        const serverName = this.state.server;
        const server = GetServerByHostname(serverName);
        server.hackDifficulty = server.minDifficulty;
    }

    minAllSecurity() {
        for (const i in AllServers) {
            AllServers[i].hackDifficulty = AllServers[i].minDifficulty;
        }
    }

    maxMoney() {
        const serverName = this.state.server;
        const server = GetServerByHostname(serverName);
        server.moneyAvailable = server.moneyMax;
    }

    maxAllMoney() {
        for (const i in AllServers) {
            AllServers[i].moneyAvailable = AllServers[i].moneyMax;
        }
    }

    modifyCompanyRep(modifier) {
        const component = this;
        return function(reputation) {
            const company = Companies[component.state.company];
            if (company != null && !isNaN(reputation)) {
                company.playerReputation += reputation*modifier;
            }
        }
    }

    resetCompanyRep() {
        const company = Companies[this.state.company];
        company.playerReputation = 0;
    }

    modifyCompanyFavor(modifier) {
        const component = this;
        return function(favor) {
            const company = Companies[component.state.company];
            if (company != null && !isNaN(favor)) {
                company.favor += favor*modifier;
            }
        }
    }

    resetCompanyFavor() {
        const company = Companies[this.state.company];
        company.favor = 0;
    }

    tonsOfRepCompanies() {
        for (const c in Companies) {
            Companies[c].playerReputation = tonsP;
        }
    }

    resetAllRepCompanies() {
        for (const c in Companies) {
            Companies[c].playerReputation = 0;
        }
    }

    tonsOfFavorCompanies() {
        for (const c in Companies) {
            Companies[c].favor = tonsP;
        }
    }

    resetAllFavorCompanies() {
        for (const c in Companies) {
            Companies[c].favor = 0;
        }
    }

    modifyBladeburnerRank(modify) {
        return function(rank) {
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
            Player.bladeburner.changeRank(tonsP);
        }
    }

    modifyBladeburnerCycles(modify) {
        return function(cycles) {
            if (!!Player.bladeburner) {
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
            Player.bladeburner.storedCycles += tonsP;
        }
    }

    addTonsGangCycles() {
        if (!!Player.gang) {
            Player.gang.storedCycles = tonsP;
        }
    }

    modifyGangCycles(modify) {
        return function(cycles) {
            if (!!Player.gang) {
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
            Player.corporation.storedCycles = tonsP;
        }
    }

    modifyCorporationCycles(modify) {
        return function(cycles) {
            if (!!Player.corporation) {
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
        generateContract({
            problemType: this.state.codingcontract,
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
        let text = "<table><tbody><tr><th>Stock</th><th>Price cap</th></tr>";
        this.processStocks((stock) => {
            text += `<tr><td>${stock.symbol}</td><td style="text-align:right;">${numeralWrapper.format(stock.cap, '$0.000a')}</td></tr>`;
        });
        text += "</tbody></table>";
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
        <h1>Development Menu - Only meant to be used for testing/debugging</h1>
    </div>
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
                        <td>
                            <button className="std-button tooltip" onClick={this.tonsOfExp}>Tons of exp<span className="tooltiptext">Sometimes you just need a ton of experience in every stat</span></button>
                            <button className="std-button tooltip" onClick={this.resetAllExp}>Reset<span className="tooltiptext">Sometimes you just need a ton of experience in every stat</span></button>
                            </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Hacking:</span>
                        </td>
                        <td>
                            <ValueAdjusterComponent
                              title="hacking exp"
                              add={this.modifyExp('hacking', 1)}
                              subtract={this.modifyExp('hacking', -1)}
                              reset={this.resetExperience('hacking')}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Strength:</span>
                        </td>
                        <td>
                            <ValueAdjusterComponent
                              title="strength exp"
                              add={this.modifyExp('strength', 1)}
                              subtract={this.modifyExp('strength', -1)}
                              reset={this.resetExperience('strength')}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Defense:</span>
                        </td>
                        <td>
                            <ValueAdjusterComponent
                              title="defense exp"
                              add={this.modifyExp('defense', 1)}
                              subtract={this.modifyExp('defense', -1)}
                              reset={this.resetExperience('defense')}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Dexterity:</span>
                        </td>
                        <td>
                            <ValueAdjusterComponent
                              title="dexterity exp"
                              add={this.modifyExp('dexterity', 1)}
                              subtract={this.modifyExp('dexterity', -1)}
                              reset={this.resetExperience('dexterity')}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Agility:</span>
                        </td>
                        <td>
                            <ValueAdjusterComponent
                              title="agility exp"
                              add={this.modifyExp('agility', 1)}
                              subtract={this.modifyExp('agility', -1)}
                              reset={this.resetExperience('agility')}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Charisma:</span>
                        </td>
                        <td>
                            <ValueAdjusterComponent
                              title="charisma exp"
                              add={this.modifyExp('charisma', 1)}
                              subtract={this.modifyExp('charisma', -1)}
                              reset={this.resetExperience('charisma')}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text text-center">Intelligence:</span>
                        </td>
                        <td>
                            <ValueAdjusterComponent
                              title="intelligence exp"
                              add={this.modifyExp('intelligence', 1)}
                              subtract={this.modifyExp('intelligence', -1)}
                              reset={this.resetExperience('intelligence')}
                            />
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
                        <td><select id="factions-dropdown" className="dropdown exp-input" onChange={this.setFactionDropdown} value={this.state.faction}>
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
                            <ValueAdjusterComponent
                              title="reputation"
                              add={this.modifyFactionRep(1)}
                              subtract={this.modifyFactionRep(-1)}
                              reset={this.resetFactionRep}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="text">Favor:</span>
                        </td>
                        <td>
                            <ValueAdjusterComponent
                              title="favor"
                              add={this.modifyFactionFavor(1)}
                              subtract={this.modifyFactionFavor(-1)}
                              reset={this.resetFactionFavor}
                            />
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
                        <td><select id="dev-augs-dropdown" className="dropdown" onChange={this.setAugmentationDropdown} value={this.state.augmentation}>{augs}</select></td>
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
                        <td><select id="dev-programs-dropdown" className="dropdown" onChange={this.setProgramDropdown} value={this.state.program}>{programs}</select></td>
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
                        <td colSpan="2"><select id="dev-servers-dropdown" className="dropdown"onChange={this.setServerDropdown} value={this.state.server}>{servers}</select></td>
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
                        <td colSpan="3"><select id="dev-companies-dropdown" className="dropdown" onChange={this.setCompanyDropdown} value={this.state.company}>{companies}</select></td>
                    </tr>
                    <tr>
                        <td><span className="text">Reputation:</span></td>
                        <td>
                            <ValueAdjusterComponent
                              title="reputation"
                              add={this.modifyCompanyRep(1)}
                              subtract={this.modifyCompanyRep(-1)}
                              reset={this.resetCompanyRep}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><span className="text">Favor:</span></td>
                        <td>
                            <ValueAdjusterComponent
                              title="favor"
                              add={this.modifyCompanyFavor(1)}
                              subtract={this.modifyCompanyFavor(-1)}
                              reset={this.resetCompanyFavor}
                            />
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
                            <ValueAdjusterComponent
                              title="rank"
                              add={this.modifyBladeburnerRank(1)}
                              subtract={this.modifyBladeburnerRank(-1)}
                              reset={this.resetBladeburnerRank}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><span className="text">Cycles:</span></td>
                        <td><button className="std-button" onClick={this.addTonsBladeburnerCycles}>Tons</button></td>
                        <td>
                            <ValueAdjusterComponent
                              title="cycles"
                              add={this.modifyBladeburnerCycles(1)}
                              subtract={this.modifyBladeburnerCycles(-1)}
                              reset={this.resetBladeburnerCycles}
                            />
                        </td>
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
                            <ValueAdjusterComponent
                              title="cycles"
                              add={this.modifyGangCycles(1)}
                              subtract={this.modifyGangCycles(-1)}
                              reset={this.resetGangCycles}
                            />
                        </td>
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
                            <ValueAdjusterComponent
                              title="cycles"
                              add={this.modifyCorporationCycles(1)}
                              subtract={this.modifyCorporationCycles(-1)}
                              reset={this.resetCorporationCycles}
                            />
                        </td>
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
                        <select id="contract-types-dropdown" className="dropdown" onChange={this.setCodingcontractDropdown} value={this.state.codingcontract}>
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

    // Add everything to container, then append to main menu
    const devMenuContainer = createElement("div", {
        class: "generic-menupage-container",
        id: devMenuContainerId,
    });

    const entireGameContainer = document.getElementById("entire-game-container");
    if (entireGameContainer == null) {
        throw new Error("Could not find entire-game-container DOM element");
    }
    entireGameContainer.appendChild(devMenuContainer);

    ReactDOM.render(<DevMenuComponent />, devMenuContainer);
}

export function closeDevMenu() {
    removeElementById(devMenuContainerId);
}
