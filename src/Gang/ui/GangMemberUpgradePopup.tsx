/**
 * React Component for the popup that manages gang members upgrades
 */
import React, { useState, useEffect } from "react";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { GangMemberUpgrades } from "../GangMemberUpgrades";
import { GangMemberUpgrade } from "../GangMemberUpgrade";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../../ui/React/Money";
import { removePopup } from "../../ui/React/createPopup";
import { GangMember } from "../GangMember";
import { Gang } from "../Gang";
import { UpgradeType } from "../data/upgrades";

interface INextRevealProps {
  gang: Gang;
  upgrades: string[];
  type: UpgradeType;
  player: IPlayer;
}

function NextReveal(props: INextRevealProps): React.ReactElement {
  const upgrades = Object.keys(GangMemberUpgrades)
    .filter((upgName: string) => {
      const upg = GangMemberUpgrades[upgName];
      if (props.player.money.gt(props.gang.getUpgradeCost(upg))) return false;
      if (upg.type !== props.type) return false;
      if (props.upgrades.includes(upgName)) return false;
      return true;
    })
    .map((upgName: string) => GangMemberUpgrades[upgName]);

  if (upgrades.length === 0) return <></>;
  return (
    <p>
      Next at <Money money={upgrades[0].cost} />
    </p>
  );
}

interface IPanelProps {
  member: GangMember;
  gang: Gang;
  player: IPlayer;
}

function GangMemberUpgradePanel(props: IPanelProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function filterUpgrades(list: string[], type: UpgradeType): GangMemberUpgrade[] {
    return Object.keys(GangMemberUpgrades)
      .filter((upgName: string) => {
        const upg = GangMemberUpgrades[upgName];
        if (props.player.money.lt(props.gang.getUpgradeCost(upg))) return false;
        if (upg.type !== type) return false;
        if (list.includes(upgName)) return false;
        return true;
      })
      .map((upgName: string) => GangMemberUpgrades[upgName]);
  }
  const weaponUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Weapon);
  const armorUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Armor);
  const vehicleUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Vehicle);
  const rootkitUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Rootkit);
  const augUpgrades = filterUpgrades(props.member.augmentations, UpgradeType.Augmentation);

  function purchasedUpgrade(upgName: string): React.ReactElement {
    const upg = GangMemberUpgrades[upgName];
    return (
      <div key={upgName} className="gang-owned-upgrade tooltip">
        {upg.name}
        <span className="tooltiptext" dangerouslySetInnerHTML={{ __html: upg.desc }} />
      </div>
    );
  }

  function upgradeButton(upg: GangMemberUpgrade, left = false): React.ReactElement {
    function onClick(): void {
      props.member.buyUpgrade(upg, props.player, props.gang);
      setRerender((old) => !old);
    }
    return (
      <a
        key={upg.name}
        className="a-link-button tooltip"
        style={{
          margin: "2px",
          padding: "2px",
          display: "block",
          fontSize: "11px",
        }}
        onClick={onClick}
      >
        {upg.name} - <Money money={props.gang.getUpgradeCost(upg)} player={props.player} />
        <span className={left ? "tooltiptextleft" : "tooltiptext"} dangerouslySetInnerHTML={{ __html: upg.desc }} />
      </a>
    );
  }

  const asc = {
    hack: props.member.calculateAscensionMult(props.member.hack_asc_points),
    str: props.member.calculateAscensionMult(props.member.str_asc_points),
    def: props.member.calculateAscensionMult(props.member.def_asc_points),
    dex: props.member.calculateAscensionMult(props.member.dex_asc_points),
    agi: props.member.calculateAscensionMult(props.member.agi_asc_points),
    cha: props.member.calculateAscensionMult(props.member.cha_asc_points),
  };
  return (
    <div style={{ border: "1px solid white" }}>
      <h1>
        {props.member.name}({props.member.task})
      </h1>
      <pre style={{ fontSize: "14px", display: "inline-block", width: "20%" }}>
        Hack: {props.member.hack} (x
        {formatNumber(props.member.hack_mult * asc.hack, 2)})<br />
        Str: {props.member.str} (x
        {formatNumber(props.member.str_mult * asc.str, 2)})<br />
        Def: {props.member.def} (x
        {formatNumber(props.member.def_mult * asc.def, 2)})<br />
        Dex: {props.member.dex} (x
        {formatNumber(props.member.dex_mult * asc.dex, 2)})<br />
        Agi: {props.member.agi} (x
        {formatNumber(props.member.agi_mult * asc.agi, 2)})<br />
        Cha: {props.member.cha} (x
        {formatNumber(props.member.cha_mult * asc.cha, 2)})
      </pre>
      <div className="gang-owned-upgrades-div noselect">
        Purchased Upgrades: {props.member.upgrades.map((upg: string) => purchasedUpgrade(upg))}
        {props.member.augmentations.map((upg: string) => purchasedUpgrade(upg))}
      </div>
      <div className="noselect" style={{ width: "20%", display: "inline-block" }}>
        <h2>Weapons</h2>
        {weaponUpgrades.map((upg) => upgradeButton(upg))}
        <NextReveal
          gang={props.gang}
          type={UpgradeType.Weapon}
          player={props.player}
          upgrades={props.member.upgrades}
        />
      </div>
      <div className="noselect" style={{ width: "20%", display: "inline-block" }}>
        <h2>Armor</h2>
        {armorUpgrades.map((upg) => upgradeButton(upg))}
        <NextReveal gang={props.gang} type={UpgradeType.Armor} player={props.player} upgrades={props.member.upgrades} />
      </div>
      <div className="noselect" style={{ width: "20%", display: "inline-block" }}>
        <h2>Vehicles</h2>
        {vehicleUpgrades.map((upg) => upgradeButton(upg))}
        <NextReveal
          gang={props.gang}
          type={UpgradeType.Vehicle}
          player={props.player}
          upgrades={props.member.upgrades}
        />
      </div>
      <div className="noselect" style={{ width: "20%", display: "inline-block" }}>
        <h2>Rootkits</h2>
        {rootkitUpgrades.map((upg) => upgradeButton(upg, true))}
        <NextReveal
          gang={props.gang}
          type={UpgradeType.Rootkit}
          player={props.player}
          upgrades={props.member.upgrades}
        />
      </div>
      <div className="noselect" style={{ width: "20%", display: "inline-block" }}>
        <h2>Augmentations</h2>
        {augUpgrades.map((upg) => upgradeButton(upg, true))}
        <NextReveal
          gang={props.gang}
          type={UpgradeType.Augmentation}
          player={props.player}
          upgrades={props.member.upgrades}
        />
      </div>
    </div>
  );
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
    if (ev.keyCode !== 27) return;
    removePopup(props.popupId);
  }

  useEffect(() => {
    window.addEventListener<"keydown">("keydown", closePopup);
    const id = setInterval(() => setRerender((old) => !old), 1000);
    return () => {
      clearInterval(id);
      window.removeEventListener<"keydown">("keydown", closePopup);
    };
  }, []);

  return (
    <>
      <input
        className="text-input noselect"
        value={filter}
        placeholder="Filter gang member"
        onChange={(event) => setFilter(event.target.value)}
      />
      <p className="tooltip" style={{ marginLeft: "6px", display: "inline-block" }}>
        Discount: -{numeralWrapper.formatPercentage(1 - 1 / props.gang.getDiscount())}
        <span className="tooltiptext noselect">
          You get a discount on equipment and upgrades based on your gang's respect and power. More respect and power
          leads to more discounts.
        </span>
      </p>
      {props.gang.members.map((member: GangMember) => (
        <GangMemberUpgradePanel key={member.name} player={props.player} gang={props.gang} member={member} />
      ))}
    </>
  );
}
