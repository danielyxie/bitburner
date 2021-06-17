/**
 * React Component for the popup that manages gang members upgrades
 */
import React, { useState, useEffect } from "react";
import { formatNumber } from "../../../utils/StringHelperFunctions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { GangMemberUpgrades } from "../GangMemberUpgrades";
import { GangMemberUpgrade } from "../GangMemberUpgrade";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../../ui/React/Money";
import { removePopup } from "../../ui/React/createPopup";
import { GangMember } from "../GangMember";
import { Gang } from "../Gang";
import { UpgradeType } from "../data/upgrades";

interface IPanelProps {
    member: GangMember;
    gang: Gang;
    player: IPlayer;
}

function GangMemberUpgradePanel(props: IPanelProps): React.ReactElement {
    const setRerender = useState(false)[1];
    function filterUpgrades(list: string[], type: UpgradeType): GangMemberUpgrade[] {
        return Object.keys(GangMemberUpgrades).filter((upgName: string) => {
            const upg = GangMemberUpgrades[upgName];
            if (props.player.money.lt(props.gang.getUpgradeCost(upg)))
                return false;
            if(upg.type !== type) return false;
            if(list.includes(upgName)) return false;
            return true;
        }).map((upgName: string) => GangMemberUpgrades[upgName]);
    }
    const weaponUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Weapon);
    const armorUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Armor);
    const vehicleUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Vehicle);
    const rootkitUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Rootkit);
    const augUpgrades = filterUpgrades(props.member.augmentations, UpgradeType.Augmentation);

    function purchasedUpgrade(upgName: string): React.ReactElement {
        const upg = GangMemberUpgrades[upgName]
        return (<div key={upgName} className="gang-owned-upgrade tooltip">
            {upg.name}
            <span className="tooltiptext" dangerouslySetInnerHTML={{__html: upg.desc}} />
        </div>);
    }

    function upgradeButton(upg: GangMemberUpgrade, left = false): React.ReactElement {
        function onClick(): void {
            props.member.buyUpgrade(upg, props.player, props.gang);
            setRerender(old => !old);
        }
        return (<a key={upg.name} className="a-link-button tooltip" style={{margin:"2px",  padding:"2px", display:"block", fontSize:"11px"}} onClick={onClick}>
            {upg.name} - {Money(props.gang.getUpgradeCost(upg))}
            <span className={left?"tooltiptextleft":"tooltiptext"} dangerouslySetInnerHTML={{__html: upg.desc}} />
        </a>);
    }

    return (<div style={{border: '1px solid white'}}>
        <h1>{props.member.name}({props.member.task})</h1>
        <pre style={{fontSize:"14px", display: "inline-block", width:"20%"}}>
Hack: {props.member.hack} (x{formatNumber(props.member.hack_mult * props.member.hack_asc_mult, 2)})<br />
Str:  {props.member.str} (x{formatNumber(props.member.str_mult * props.member.str_asc_mult, 2)})<br />
Def:  {props.member.def} (x{formatNumber(props.member.def_mult * props.member.def_asc_mult, 2)})<br />
Dex:  {props.member.dex} (x{formatNumber(props.member.dex_mult * props.member.dex_asc_mult, 2)})<br />
Agi:  {props.member.agi} (x{formatNumber(props.member.agi_mult * props.member.agi_asc_mult, 2)})<br />
Cha:  {props.member.cha} (x{formatNumber(props.member.cha_mult * props.member.cha_asc_mult, 2)})
        </pre>
        <div className="gang-owned-upgrades-div">
        Purchased Upgrades: {props.member.upgrades.map((upg: string) => purchasedUpgrade(upg))}
        {props.member.augmentations.map((upg: string) => purchasedUpgrade(upg))}
        </div>
        <div style={{width: "20%", display: "inline-block"}}>
            <h2>Weapons</h2>
            {weaponUpgrades.map(upg => upgradeButton(upg))}
        </div>
        <div style={{width: "20%", display: "inline-block"}}>
            <h2>Armor</h2>
            {armorUpgrades.map(upg => upgradeButton(upg))}
        </div>
        <div style={{width: "20%", display: "inline-block"}}>
            <h2>Vehicles</h2>
            {vehicleUpgrades.map(upg => upgradeButton(upg))}
        </div>
        <div style={{width: "20%", display: "inline-block"}}>
            <h2>Rootkits</h2>
            {rootkitUpgrades.map(upg => upgradeButton(upg, true))}
        </div>
        <div style={{width: "20%", display: "inline-block"}}>
            <h2>Augmentations</h2>
            {augUpgrades.map(upg => upgradeButton(upg, true))}
        </div>
    </div>);
}

interface IProps {
    gang: Gang;
    player: IPlayer;
    popupId: string;
}

export function GangMemberUpgradePopup(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];
    const [filter, setFilter] = useState("");

    function closePopup(this: Window, ev: KeyboardEvent): void {
        if(ev.keyCode !== 27) return;
        removePopup(props.popupId);
    }

    useEffect(() => {
        window.addEventListener<'keydown'>('keydown', closePopup);
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => {
            clearInterval(id);
            window.removeEventListener<'keydown'>('keydown', closePopup);
        }
    }, []);

    return (<>
        <input
            className="text-input"
            value={filter}
            placeholder="Filter gang member"
            onChange={event => setFilter(event.target.value)} />
        <p className="tooltip" style={{marginLeft: '6px', display: 'inline-block'}}>
            Discount: -{numeralWrapper.formatPercentage(1 - 1 / props.gang.getDiscount())}
            <span className="tooltiptext">
                You get a discount on equipment and upgrades based on your
                gang's respect and power. More respect and power leads to more
                discounts.
            </span>
        </p>
        {props.gang.members.map((member: GangMember) => <GangMemberUpgradePanel
                key={member.name}
                player={props.player}
                gang={props.gang}
                member={member} />)
        }
    </>);
}
