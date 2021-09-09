import React, { useState } from "react";

import { Warehouse } from "../Warehouse";
import { ICorporation } from "../ICorporation";
import { IIndustry } from "../IIndustry";
import { SetSmartSupply } from "../Actions";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Material } from "../Material";

interface ILeftoverProps {
  matName: string;
  warehouse: Warehouse;
}

function Leftover(props: ILeftoverProps): React.ReactElement {
  const [checked, setChecked] = useState(!!props.warehouse.smartSupplyUseLeftovers[props.matName]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    props.warehouse.smartSupplyUseLeftovers[props.matName] = event.target.checked;
    setChecked(event.target.checked);
  }

  const matNameId = `${props.matName}-use-leftovers`;
  return (
    <div key={props.matName}>
      <label style={{ color: "white" }} htmlFor={matNameId}>
        {props.warehouse.materials[props.matName].name}
      </label>
      <input type={"checkbox"} id={matNameId} onChange={onChange} style={{ margin: "3px" }} checked={checked} />
      <br />
    </div>
  );
}

interface IProps {
  division: IIndustry;
  warehouse: Warehouse;
  corp: ICorporation;
  player: IPlayer;
  popupId: string;
}

export function SmartSupplyPopup(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  // Smart Supply Checkbox
  const smartSupplyCheckboxId = "cmpy-mgmt-smart-supply-checkbox";
  function smartSupplyOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    SetSmartSupply(props.warehouse, e.target.checked);
    rerender();
  }

  // Create React components for materials
  const mats = [];
  for (const matName in props.warehouse.materials) {
    if (!(props.warehouse.materials[matName] instanceof Material)) continue;
    if (!Object.keys(props.division.reqMats).includes(matName)) continue;
    mats.push(<Leftover key={matName} warehouse={props.warehouse} matName={matName} />);
  }

  return (
    <>
      <label style={{ color: "white" }} htmlFor={smartSupplyCheckboxId}>
        Enable Smart Supply
      </label>
      <input
        type={"checkbox"}
        id={smartSupplyCheckboxId}
        onChange={smartSupplyOnChange}
        style={{ margin: "3px" }}
        checked={props.warehouse.smartSupplyEnabled}
      />
      <br />
      <p>Use materials already in the warehouse instead of buying new ones, if available:</p>
      {mats}
    </>
  );
}
