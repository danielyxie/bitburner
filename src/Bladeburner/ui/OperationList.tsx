import React, { useState, useEffect } from "react";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { OperationElem } from "./OperationElem";
import { Operation } from "../Operation";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
    bladeburner: IBladeburner;
    player: IPlayer;
}

export function OperationList(props: IProps): React.ReactElement {
    const names = Object.keys(props.bladeburner.operations);
    const operations = props.bladeburner.operations;
    return (<>
        {names.map((name: string) => <li key={name} className="bladeburner-action">
                <OperationElem bladeburner={props.bladeburner} action={operations[name]} player={props.player} />
            </li>,
        )}
    </>);
}