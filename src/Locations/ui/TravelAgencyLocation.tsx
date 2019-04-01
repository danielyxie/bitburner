/**
 * React Subcomponent for displaying a location's UI, when that location is a Travel Agency
 *
 * This subcomponent renders all of the buttons for traveling to different cities
 */
import * as React from "react";

import { CityName }             from "../data/CityNames";
import { createTravelPopup }    from "../LocationsHelpers";

import { CONSTANTS }            from "../../Constants";
import { IPlayer }              from "../../PersonObjects/IPlayer";

import { numeralWrapper }       from "../../ui/numeralFormat";
import { StdButton }            from "../../ui/React/StdButton";

type IProps = {
    p: IPlayer;
    travel: (to: CityName) => void;
}

export class TravelAgencyLocation extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const travelBtns: React.ReactNode[] = [];
        for (const key in CityName) {
            const city = CityName[key];

            // Skip current city
            if (city === this.props.p.city) { continue; }

            travelBtns.push(
                <StdButton
                    key={city}
                    onClick={createTravelPopup.bind(null, city, this.props.travel)}
                    text={`Travel to ${city}`}
                />
            )
        }

        return (
            <div>
                <p>
                    From here, you can travel to any other city! A ticket costs
                    {numeralWrapper.formatMoney(CONSTANTS.TravelCost)}
                </p>
                {travelBtns}
            </div>
        )
    }
}
