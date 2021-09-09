import React, { useState } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Factions } from "../../Faction/Factions";
import { CorporationConstants } from "../data/Constants";
import { numeralWrapper } from "../../ui/numeralFormat";
import { removePopup } from "../../ui/React/createPopup";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { ICorporation } from "../ICorporation";

interface IProps {
  popupId: string;
  corp: ICorporation;
  player: IPlayer;
}

export function BribeFactionPopup(props: IProps): React.ReactElement {
  const [money, setMoney] = useState<number | null>(0);
  const [stock, setStock] = useState<number | null>(0);
  const [selectedFaction, setSelectedFaction] = useState(
    props.player.factions.length > 0 ? props.player.factions[0] : "",
  );

  function onMoneyChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setMoney(parseFloat(event.target.value));
  }

  function onStockChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setStock(parseFloat(event.target.value));
  }

  function changeFaction(event: React.ChangeEvent<HTMLSelectElement>): void {
    setSelectedFaction(event.target.value);
  }

  function repGain(money: number, stock: number): number {
    return (money + stock * props.corp.sharePrice) / CorporationConstants.BribeToRepRatio;
  }

  function getRepText(money: number, stock: number): string {
    if (money === 0 && stock === 0) return "";
    if (isNaN(money) || isNaN(stock) || money < 0 || stock < 0) {
      return "ERROR: Invalid value(s) entered";
    } else if (props.corp.funds.lt(money)) {
      return "ERROR: You do not have this much money to bribe with";
    } else if (stock > props.corp.numShares) {
      return "ERROR: You do not have this many shares to bribe with";
    } else {
      return (
        "You will gain " +
        numeralWrapper.formatReputation(repGain(money, stock)) +
        " reputation with " +
        selectedFaction +
        " with this bribe"
      );
    }
  }

  function bribe(money: number, stock: number): void {
    const fac = Factions[selectedFaction];
    if (fac == null) {
      dialogBoxCreate("ERROR: You must select a faction to bribe");
    }
    if (isNaN(money) || isNaN(stock) || money < 0 || stock < 0) {
    } else if (props.corp.funds.lt(money)) {
    } else if (stock > props.corp.numShares) {
    } else {
      const rep = repGain(money, stock);
      dialogBoxCreate(
        "You gained " + numeralWrapper.formatReputation(rep) + " reputation with " + fac.name + " by bribing them.",
      );
      fac.playerReputation += rep;
      props.corp.funds = props.corp.funds.minus(money);
      props.corp.numShares -= stock;
      removePopup(props.popupId);
    }
  }

  return (
    <>
      <p>You can use Corporation funds or stock shares to bribe Faction Leaders in exchange for faction reputation.</p>
      <select className="dropdown" style={{ margin: "3px" }} defaultValue={selectedFaction} onChange={changeFaction}>
        {props.player.factions.map((name: string) => {
          const info = Factions[name].getInfo();
          if (!info.offersWork()) return;
          return (
            <option key={name} value={name}>
              {name}
            </option>
          );
        })}
      </select>
      <p>{getRepText(money ? money : 0, stock ? stock : 0)}</p>
      <input
        className="text-input"
        onChange={onMoneyChange}
        placeholder="Corporation funds"
        style={{ margin: "5px" }}
      />
      <input className="text-input" onChange={onStockChange} placeholder="Stock Shares" style={{ margin: "5px" }} />
      <button
        className="a-link-button"
        onClick={() => bribe(money ? money : 0, stock ? stock : 0)}
        style={{ display: "inline-block" }}
      >
        Bribe
      </button>
    </>
  );
}
