import * as React from "react";

import { numeralWrapper } from "../ui/numeralFormat";
import { BitNodes } from "../BitNode/BitNode";
import { IPlayer } from "../PersonObjects/IPlayer";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";
import { dialogBoxCreate } from "../../utils/DialogBox";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";
import { getPurchaseServerLimit } from "../Server/ServerPurchases";
import { MaxNumberHacknetServers } from "../Hacknet/HacknetServer";

export function CharacterInfo(p: IPlayer): React.ReactElement {
    function LastEmployer(): React.ReactElement {
        if (p.companyName) {
            return <><span>Employer at which you last worked: {p.companyName}</span><br /></>;
        }
        return <></>;
    }
    function LastJob(): React.ReactElement {
        if (p.companyName !== "") {
            return <><span>Job you last worked: {p.jobs[p.companyName]}</span><br /></>;
        }
        return <></>;
    }
    function Employers(): React.ReactElement {
        if (p.jobs && Object.keys(p.jobs).length !== 0)
            return <>
                    <span>All Employers:</span><br />
                    <ul>
                        {Object.keys(p.jobs).map(j => <li key='j'>    * {j}</li>)}
                    </ul><br /><br />
                </>
        return <></>;
    }

    function convertMoneySourceTrackerToString(src: MoneySourceTracker): string {
        let parts: string[] = [`Total: ${numeralWrapper.formatMoney(src.total)}`];
        if (src.bladeburner)     { parts.push(`Bladeburner: ${numeralWrapper.formatMoney(src.bladeburner)}`) };
        if (src.codingcontract)  { parts.push(`Coding Contracts: ${numeralWrapper.formatMoney(src.codingcontract)}`) };
        if (src.work)            { parts.push(`Company Work: ${numeralWrapper.formatMoney(src.work)}`) };
        if (src.corporation)     { parts.push(`Corporation: ${numeralWrapper.formatMoney(src.corporation)}`) };
        if (src.crime)           { parts.push(`Crimes: ${numeralWrapper.formatMoney(src.crime)}`) };
        if (src.gang)            { parts.push(`Gang: ${numeralWrapper.formatMoney(src.gang)}`) };
        if (src.hacking)         { parts.push(`Hacking: ${numeralWrapper.formatMoney(src.hacking)}`) };
        if (src.hacknetnode)     { parts.push(`Hacknet Nodes: ${numeralWrapper.formatMoney(src.hacknetnode)}`) };
        if (src.hospitalization) { parts.push(`Hospitalization: ${numeralWrapper.formatMoney(src.hospitalization)}`) };
        if (src.infiltration)    { parts.push(`Infiltration: ${numeralWrapper.formatMoney(src.infiltration)}`) };
        if (src.stock)           { parts.push(`Stock Market: ${numeralWrapper.formatMoney(src.stock)}`) };

        return parts.join("<br>");
    }

    function openMoneyModal() {
        let txt: string = "<u>Money earned since you last installed Augmentations:</u><br>" +
                          convertMoneySourceTrackerToString(p.moneySourceA);
        if (p.sourceFiles.length !== 0) {
            txt += "<br><br><u>Money earned in this BitNode:</u><br>" +
                   convertMoneySourceTrackerToString(p.moneySourceB);
        }

        dialogBoxCreate(txt, false);
    }

    function Intelligence(): React.ReactElement {
        if (p.intelligence > 0) {
            return <tr key='5'>
                <td>Intelligence:</td>
                <td style={{textAlign: 'right'}}>{(p.intelligence).toLocaleString()}</td>
            </tr>;
        }
        return <></>;
    }

    function MultiplierTable(props: any): React.ReactElement {
        function bn5Stat(r: any) {
            if(SourceFileFlags[5] > 0 && r.length > 2 && r[1] != r[2]) {
                return <td key='2' style={{textAlign: 'right'}}> ({numeralWrapper.formatPercentage(r[2])})</td>
            }
            return undefined;
        }
        return <>
            <table>
                <tbody>
                    {props.rows.map((r: any) => <tr key={r[0]}>
                        <td key='0'>{r[0]} multiplier: </td>
                        <td key='1' style={{textAlign: 'right'}}>{numeralWrapper.formatPercentage(r[1])}</td>
                        {bn5Stat(r)}
                    </tr>)}
                </tbody>
            </table>
        </>
    }

    function BitNodeTimeText(): React.ReactElement {
        if(p.sourceFiles.length > 0) {
            return <>
                <span>Time played since last Bitnode destroyed: {convertTimeMsToTimeElapsedString(p.playtimeSinceLastBitnode)}</span>
                <br />
            </>
        }
        return <></>
    }

    function CurrentBitNode(): React.ReactElement {
        if(p.sourceFiles.length > 0) {

            const index = "BitNode" + p.bitNodeN;
            return <>
                <span>Current BitNode: {p.bitNodeN} ({BitNodes[index].name})</span><br /><br />
                <div style={{width:"60%", fontSize: "13px", marginLeft:"4%"}}>
                    {BitNodes[index].info.split("<br>").map((t, i) => <div key={i}>
                        <span style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{t}</span><br />
                    </div>)}
                </div>
            </>
        }

        return <></>
    }

    return (
        <pre>
            <b>General</b>
            <br /><br />
            <span>Current City: {p.city}</span><br />
            <LastEmployer />
            <LastJob />
            <Employers />
            <span>Money: {numeralWrapper.formatMoney(p.money.toNumber())}</span>
            <button className="popup-box-button" style={{display: 'inline-block', float: 'none'}} onClick={openMoneyModal}>Money Statistics & Breakdown</button><br /><br />
            <b>Stats</b>
            <table>
              <tbody>
                <tr key='0'>
                  <td key='0'>Hacking:</td>
                  <td key='1' style={{textAlign: 'right'}}>{p.hacking_skill.toLocaleString()}</td>
                  <td key='2' style={{textAlign: 'right'}}>({numeralWrapper.format(p.hacking_exp, '0.000a')} exp)</td>
                </tr>
                <tr key='1'>
                  <td key='0'>Strength:</td>
                  <td key='1' style={{textAlign: 'right'}}>{p.strength.toLocaleString()}</td>
                  <td key='2' style={{textAlign: 'right'}}>({numeralWrapper.format(p.strength_exp, '0.000a')} exp)</td>
                </tr>
                <tr key='2'>
                  <td key='0'>Defense:</td>
                  <td key='1' style={{textAlign: 'right'}}>{p.defense.toLocaleString()}</td>
                  <td key='2' style={{textAlign: 'right'}}>({numeralWrapper.format(p.defense_exp, '0.000a')} exp)</td>
                </tr>
                <tr key='3'>
                  <td key='0'>Dexterity:</td>
                  <td key='1' style={{textAlign: 'right'}}>{p.dexterity.toLocaleString()}</td>
                  <td key='2' style={{textAlign: 'right'}}>({numeralWrapper.format(p.dexterity_exp, '0.000a')} exp)</td>
                </tr>
                <tr key='4'>
                  <td key='0'>Agility:</td>
                  <td key='1' style={{textAlign: 'right'}}>{p.agility.toLocaleString()}</td>
                  <td key='2' style={{textAlign: 'right'}}>({numeralWrapper.format(p.agility_exp, '0.000a')} exp)</td>
                </tr>
                <tr key='5'>
                  <td key='0'>Charisma:</td>
                  <td key='1' style={{textAlign: 'right'}}>{p.charisma.toLocaleString()}</td>
                  <td key='2' style={{textAlign: 'right'}}>({numeralWrapper.format(p.charisma_exp, '0.000a')} exp)</td>
                </tr>
                <Intelligence />
            </tbody>
            </table>
            <br />
            <MultiplierTable rows={[
                ['Hacking Chance', p.hacking_chance_mult],
                ['Hacking Speed', p.hacking_speed_mult],
                ['Hacking Money', p.hacking_money_mult, p.hacking_money_mult*BitNodeMultipliers.ScriptHackMoney],
                ['Hacking Growth', p.hacking_grow_mult, p.hacking_grow_mult*BitNodeMultipliers.ServerGrowthRate]
            ]} /><br />
            <MultiplierTable rows={[
                ['Hacking Level', p.hacking_mult, p.hacking_mult*BitNodeMultipliers.HackingLevelMultiplier],
                ['Hacking Experience', p.hacking_exp_mult, p.hacking_exp_mult*BitNodeMultipliers.HackExpGain],
            ]} /><br />

            <MultiplierTable rows={[
                ['Strength Level', p.strength_mult, p.strength_mult*BitNodeMultipliers.StrengthLevelMultiplier],
                ['Strength Experience', p.strength_exp_mult]
            ]} /><br />

            <MultiplierTable rows={[
                ['Defense Level', p.defense_mult, p.defense_mult*BitNodeMultipliers.DefenseLevelMultiplier],
                ['Defense Experience', p.defense_exp_mult]
            ]} /><br />

            <MultiplierTable rows={[
                ['Dexterity Level', p.dexterity_mult, p.dexterity_mult*BitNodeMultipliers.DexterityLevelMultiplier],
                ['Dexterity Experience', p.dexterity_exp_mult]
            ]} /><br />

            <MultiplierTable rows={[
                ['Agility Level', p.agility_mult, p.agility_mult*BitNodeMultipliers.AgilityLevelMultiplier],
                ['Agility Experience', p.agility_exp_mult]
            ]} /><br />

                <MultiplierTable rows={[
                ['Charisma Level', p.charisma_mult, p.charisma_mult*BitNodeMultipliers.CharismaLevelMultiplier],
                ['Charisma Experience', p.charisma_exp_mult]
            ]} /><br />

                <MultiplierTable rows={[
                ['Hacknet Node production', p.hacknet_node_money_mult, p.hacknet_node_money_mult*BitNodeMultipliers.HacknetNodeMoney],
                ['Hacknet Node purchase cost', p.hacknet_node_purchase_cost_mult],
                ['Hacknet Node RAM upgrade cost', p.hacknet_node_ram_cost_mult],
                ['Hacknet Node Core purchase cost', p.hacknet_node_core_cost_mult],
                ['Hacknet Node level upgrade cost', p.hacknet_node_level_cost_mult]
            ]} /><br />

            <MultiplierTable rows={[
                ['Company reputation gain', p.company_rep_mult],
                ['Faction reputation gain', p.faction_rep_mult, p.faction_rep_mult*BitNodeMultipliers.FactionWorkRepGain],
                ['Salary', p.work_money_mult, p.work_money_mult*BitNodeMultipliers.CompanyWorkMoney]
            ]} /><br />

            <MultiplierTable rows={[
                ['Crime success', p.crime_success_mult],
                ['Crime money', p.crime_money_mult, p.crime_money_mult*BitNodeMultipliers.CrimeMoney]
            ]} /><br /><br />

            <b>Misc.</b><br /><br />
            <span>Servers owned:       {p.purchasedServers.length} / {getPurchaseServerLimit()}</span><br />
            <span>Hacknet Nodes owned: {p.hacknetNodes.length}</span><br />
            <span>Augmentations installed: {p.augmentations.length}</span><br />
            <span>Time played since last Augmentation: {convertTimeMsToTimeElapsedString(p.playtimeSinceLastAug)}</span><br />
            <BitNodeTimeText />
            <span>Time played: {convertTimeMsToTimeElapsedString(p.totalPlaytime)}</span><br />

            <br />
            <CurrentBitNode />
        </pre>
    )
}