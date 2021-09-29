import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { ICorporation } from "../ICorporation";
import { Material } from "../Material";
import { Export } from "../Export";
import { IIndustry } from "../IIndustry";
import { ExportMaterial } from "../Actions";

interface IProps {
  mat: Material;
  corp: ICorporation;
  popupId: string;
}

// Create a popup that lets the player manage exports
export function ExportPopup(props: IProps): React.ReactElement {
  if (props.corp.divisions.length === 0) throw new Error("Export popup created with no divisions.");
  if (Object.keys(props.corp.divisions[0].warehouses).length === 0)
    throw new Error("Export popup created in a division with no warehouses.");
  const [industry, setIndustry] = useState<string>(props.corp.divisions[0].name);
  const [city, setCity] = useState<string>(Object.keys(props.corp.divisions[0].warehouses)[0]);
  const [amt, setAmt] = useState("");
  const setRerender = useState(false)[1];

  function rerender(): void {
    setRerender((old) => !old);
  }

  function onCityChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setCity(event.target.value);
  }

  function onIndustryChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setIndustry(event.target.value);
  }

  function onAmtChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setAmt(event.target.value);
  }

  function exportMaterial(): void {
    try {
      ExportMaterial(industry, city, props.mat, amt);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    removePopup(props.popupId);
  }

  function removeExport(exp: Export): void {
    for (let i = 0; i < props.mat.exp.length; ++i) {
      if (props.mat.exp[i].ind !== exp.ind || props.mat.exp[i].city !== exp.city || props.mat.exp[i].amt !== exp.amt)
        continue;
      props.mat.exp.splice(i, 1);
      break;
    }
    rerender();
  }

  const currentDivision = props.corp.divisions.find((division: IIndustry) => division.name === industry);
  if (currentDivision === undefined)
    throw new Error(`Export popup somehow ended up with undefined division '${currentDivision}'`);
  const possibleCities = Object.keys(currentDivision.warehouses).filter(
    (city) => currentDivision.warehouses[city] !== 0,
  );
  if (possibleCities.length > 0 && !possibleCities.includes(city)) {
    setCity(possibleCities[0]);
  }

  return (
    <>
      <p>
        Select the industry and city to export this material to, as well as how much of this material to export per
        second. You can set the export amount to 'MAX' to export all of the materials in this warehouse.
      </p>
      <select className="dropdown" onChange={onIndustryChange} defaultValue={industry}>
        {props.corp.divisions.map((division: IIndustry) => (
          <option key={division.name} value={division.name}>
            {division.name}
          </option>
        ))}
      </select>
      <select className="dropdown" onChange={onCityChange} defaultValue={city}>
        {possibleCities.map((cityName: string) => {
          if (currentDivision.warehouses[cityName] === 0) return;
          return (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          );
        })}
      </select>
      <input className="text-input" placeholder="Export amount / s" onChange={onAmtChange} />
      <button className="std-button" style={{ display: "inline-block" }} onClick={exportMaterial}>
        Export
      </button>
      <p>
        Below is a list of all current exports of this material from this warehouse. Clicking on one of the exports
        below will REMOVE that export.
      </p>
      {props.mat.exp.map((exp: Export, index: number) => (
        <div key={index} className="cmpy-mgmt-existing-export" onClick={() => removeExport(exp)}>
          Industry: {exp.ind}
          <br />
          City: {exp.city}
          <br />
          Amount/s: {exp.amt}
        </div>
      ))}
    </>
  );
}
