import React, { useState } from 'react';
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import {
    Industries,
    IndustryStartingCosts,
    IndustryDescriptions } from "../IndustryData";
import { Industry } from "../Industry";

interface IProps {
    corp: any;
    popupId: string;
    routing: any;
}
// Create a popup that lets the player create a new industry.
// This is created when the player clicks the "Expand into new Industry" header tab
export function NewIndustryPopup(props: IProps): React.ReactElement {
    const allIndustries = Object.keys(Industries).sort();
    const possibleIndustries = allIndustries.filter((industryType: string) => props.corp.divisions.find((division: any) => division.type === industryType) === undefined).sort();
    const [industry, setIndustry] = useState(possibleIndustries.length > 0 ? possibleIndustries[0] : '');
    const [name, setName] = useState('');

    function newIndustry(): void {
        const ind = industry;
        const newDivisionName = name;

        for (let i = 0; i < props.corp.divisions.length; ++i) {
            if (props.corp.divisions[i].name === newDivisionName) {
                dialogBoxCreate("This name is already in use!");
                return;
            }
        }
        if (props.corp.funds.lt(IndustryStartingCosts[ind])) {
            dialogBoxCreate("Not enough money to create a new division in this industry");
        } else if (newDivisionName === "") {
            dialogBoxCreate("New division must have a name!");
        } else {
            props.corp.funds = props.corp.funds.minus(IndustryStartingCosts[ind]);
            const newInd = new Industry({
                corp: props.corp,
                name: newDivisionName,
                type: ind,
            });
            props.corp.divisions.push(newInd);

            // Set routing to the new division so that the UI automatically switches to it
            props.routing.routeTo(newDivisionName);

            removePopup(props.popupId);
        }
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

    return (<>
        <p>Create a new division to expand into a new industry:</p>
        <select className="dropdown" defaultValue={industry} onChange={onIndustryChange}>
            {
                possibleIndustries.map((industry: string) => <option key={industry} value={industry}>{industry}</option>)
            }
        </select>
        <p>{IndustryDescriptions[industry]}</p>
        <br /><br />

        <p>Division name:</p>
        <input autoFocus={true} value={name} onChange={onNameChange} onKeyDown={onKeyDown} type="text" className="text-input" style={{display:"block"}} maxLength={30} pattern="[a-zA-Z0-9-_]" />
        <span onClick={newIndustry} className="popup-box-button">Create Division</span>
    </>);

}
