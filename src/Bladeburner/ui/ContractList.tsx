import React, { useState, useEffect } from "react";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { ContractElem } from "./ContractElem";
import { Contract } from "../Contract";
import { IBladeburner } from "../IBladeburner";

interface IProps {
    bladeburner: IBladeburner;
}

export function ContractList(props: IProps): React.ReactElement {
    const names = Object.keys(props.bladeburner.contracts);
    const contracts = props.bladeburner.contracts;
    return (<>
        {names.map((name: string) => <li key={name} className="bladeburner-action">
                <ContractElem bladeburner={props.bladeburner} action={contracts[name]} />
            </li>,
        )}
    </>);
}