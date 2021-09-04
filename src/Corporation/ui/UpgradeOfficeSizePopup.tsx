import React from "react";
import { removePopup } from "../../ui/React/createPopup";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { CorporationConstants } from "../data/Constants";
import { OfficeSpace } from "../OfficeSpace";
import { ICorporation } from "../ICorporation";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
  office: OfficeSpace;
  corp: ICorporation;
  popupId: string;
  player: IPlayer;
}

export function UpgradeOfficeSizePopup(props: IProps): React.ReactElement {
  const initialPriceMult = Math.round(
    props.office.size / CorporationConstants.OfficeInitialSize,
  );
  const costMultiplier = 1.09;
  const upgradeCost =
    CorporationConstants.OfficeInitialCost *
    Math.pow(costMultiplier, initialPriceMult);

  // Calculate cost to upgrade size by 15 employees
  let mult = 0;
  for (let i = 0; i < 5; ++i) {
    mult += Math.pow(costMultiplier, initialPriceMult + i);
  }
  const upgradeCost15 = CorporationConstants.OfficeInitialCost * mult;

  //Calculate max upgrade size and cost
  const maxMult = props.corp.funds
    .dividedBy(CorporationConstants.OfficeInitialCost)
    .toNumber();
  let maxNum = 1;
  mult = Math.pow(costMultiplier, initialPriceMult);
  while (maxNum < 50) {
    //Hard cap of 50x (extra 150 employees)
    if (mult >= maxMult) break;
    const multIncrease = Math.pow(costMultiplier, initialPriceMult + maxNum);
    if (mult + multIncrease > maxMult) {
      break;
    } else {
      mult += multIncrease;
    }
    ++maxNum;
  }
  const upgradeCostMax = CorporationConstants.OfficeInitialCost * mult;

  function upgradeSize(cost: number, size: number): void {
    if (props.corp.funds.lt(cost)) {
      dialogBoxCreate(
        "You don't have enough company funds to purchase this upgrade!",
      );
    } else {
      props.office.size += size;
      props.corp.funds = props.corp.funds.minus(cost);
      dialogBoxCreate(
        "Office space increased! It can now hold " +
          props.office.size +
          " employees",
      );
      props.corp.rerender(props.player);
    }
    removePopup(props.popupId);
  }

  interface IUpgradeButton {
    cost: number;
    size: number;
    corp: ICorporation;
  }

  function UpgradeSizeButton(props: IUpgradeButton): React.ReactElement {
    return (
      <button
        className={
          "tooltip " +
          (props.corp.funds.lt(props.cost)
            ? "a-link-button-inactive"
            : "a-link-button")
        }
        style={{ display: "inline-block", margin: "4px" }}
        onClick={() => upgradeSize(props.cost, props.size)}
      >
        by {props.size}
        <span className="tooltiptext">
          {numeralWrapper.formatMoney(props.cost)}
        </span>
      </button>
    );
  }

  return (
    <>
      <p>Increase the size of your office space to fit additional employees!</p>
      <p>Upgrade size: </p>
      <UpgradeSizeButton
        corp={props.corp}
        cost={upgradeCost}
        size={CorporationConstants.OfficeInitialSize}
      />
      <UpgradeSizeButton
        corp={props.corp}
        cost={upgradeCost15}
        size={CorporationConstants.OfficeInitialSize * 5}
      />
      <UpgradeSizeButton
        corp={props.corp}
        cost={upgradeCostMax}
        size={maxNum * CorporationConstants.OfficeInitialSize}
      />
    </>
  );
}
