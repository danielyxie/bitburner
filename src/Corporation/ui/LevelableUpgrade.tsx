// React components for the levelable upgrade buttons on the overview panel
import React from "react";

import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { ICorporation } from "../ICorporation";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { CorporationUpgrade } from "../data/CorporationUpgrades";
import { LevelUpgrade } from "../Actions";
import { Money } from "../../ui/React/Money";

interface IProps {
    upgrade: CorporationUpgrade;
    corp: ICorporation;
    player: IPlayer;
}

export function LevelableUpgrade(props: IProps): React.ReactElement {
    const data = props.upgrade;
    const level = props.corp.upgrades[data[0]];

    const baseCost = data[1];
    const priceMult = data[2];
    const cost = baseCost * Math.pow(priceMult, level);

    const text = <>{data[4]} - <Money money={cost} /></>
    const tooltip = data[5];
    function onClick(): void {
        try {
            LevelUpgrade(props.corp, props.upgrade);
        } catch(err) {
            dialogBoxCreate(err+'');
        }
        props.corp.rerender(props.player);
    }

    return (
        <div className={"cmpy-mgmt-upgrade-div tooltip"} style={{"width" : "45%"}} onClick={onClick}>
            {text}
            <span className={"tooltiptext"}>{tooltip}</span>
        </div>
    )
}
