import React, { useState } from "react";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { Industries, IndustryDescriptions } from "../IndustryData";
import { ICorporation } from "../ICorporation";
import { IIndustry } from "../IIndustry";
import { NewIndustry } from "../Actions";

interface IProps {
  corp: ICorporation;
  popupId: string;
  setDivisionName: (name: string) => void;
}
// Create a popup that lets the player create a new industry.
// This is created when the player clicks the "Expand into new Industry" header tab
export function NewIndustryPopup(props: IProps): React.ReactElement {
  const allIndustries = Object.keys(Industries).sort();
  const possibleIndustries = allIndustries
    .filter(
      (industryType: string) =>
        props.corp.divisions.find((division: IIndustry) => division.type === industryType) === undefined,
    )
    .sort();
  const [industry, setIndustry] = useState(possibleIndustries.length > 0 ? possibleIndustries[0] : "");
  const [name, setName] = useState("");

  function newIndustry(): void {
    try {
      NewIndustry(props.corp, industry, name);
    } catch (err) {
      dialogBoxCreate(err + "");
      return;
    }

    // Set routing to the new division so that the UI automatically switches to it
    props.setDivisionName(name);

    removePopup(props.popupId);
  }

  function onNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) newIndustry();
  }

  function onIndustryChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setIndustry(event.target.value);
  }

  const desc = IndustryDescriptions[industry];
  if (desc === undefined) throw new Error(`Trying to create an industry that doesn't exists: '${industry}'`);

  return (
    <>
      <p>Create a new division to expand into a new industry:</p>
      <select className="dropdown" defaultValue={industry} onChange={onIndustryChange}>
        {possibleIndustries.map((industry: string) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </select>
      <p>{desc(props.corp)}</p>
      <br />
      <br />

      <p>Division name:</p>
      <input
        autoFocus={true}
        value={name}
        onChange={onNameChange}
        onKeyDown={onKeyDown}
        type="text"
        className="text-input"
        style={{ display: "block" }}
        maxLength={30}
        pattern="[a-zA-Z0-9-_]"
      />
      <span onClick={newIndustry} className="popup-box-button">
        Create Division
      </span>
    </>
  );
}
