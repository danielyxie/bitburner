/**
 * React Component for displaying a City's UI.
 * This UI shows all of the available locations in the city, and lets the player
 * visit those locations
 */
import * as React from "react";

import { City } from "../City";
import { LocationName } from "../data/LocationNames";
import { Settings } from "../../Settings/Settings";

import { StdButton } from "../../ui/React/StdButton";

type IProps = {
    city: City;
    enterLocation: (to: LocationName) => void;
}

export class LocationCity extends React.Component<IProps, any> {
    asciiCity(): React.ReactNode {
        const LocationLetter = (location: LocationName): JSX.Element => {
            if (location)
                return <span
                    key={location}
                    className="tooltip"
                    style={{color: 'blue', whiteSpace: 'nowrap', margin: '0px', padding: '0px', cursor: 'pointer'}}
                    onClick={this.props.enterLocation.bind(this, location)}>
                    X
                </span>
            return <span>*</span>
        }

        const locationLettersRegex = /[A-Z]/g;
        const letterMap: any = {'A': 0,'B': 1,'C': 2,'D': 3,'E': 4,'F': 5,'G': 6,
            'H': 7,'I': 8,'J': 9,'K': 10,'L': 11,'M': 12,'N': 13,'O': 14,
            'P': 15,'Q': 16,'R': 17,'S': 18,'T': 19,'U': 20,'V': 21,'W': 22,
            'X': 23,'Y': 24,'Z': 25}

        const lineElems = (s: string): JSX.Element[] => {
            const elems: any[] = [];
            const matches: any[] = [];
            let match: any;
            while ((match = locationLettersRegex.exec(s)) !== null) {
                matches.push(match);
            }
            if (matches.length === 0) {
                elems.push(s);
                return elems;
            }

            for(let i = 0; i < matches.length; i++) {
                const startI = i === 0 ? 0 : matches[i-1].index+1;
                const endI = matches[i].index;
                elems.push(s.slice(startI, endI))
                const locationI = letterMap[s[matches[i].index]];
                elems.push(LocationLetter(this.props.city.locations[locationI]))
            }
            elems.push(s.slice(matches[matches.length-1].index+1))
            return elems;
        }

        const elems: JSX.Element[] = [];
        const lines = this.props.city.asciiArt.split('\n');
        for(const i in lines) {
            elems.push(<pre key={i}>{lineElems(lines[i])}</pre>)
        }

        return elems;
    }

    listCity(): React.ReactNode {
        const locationButtons = this.props.city.locations.map((locName) => {
            return (
                <li key={locName}>
                    <StdButton onClick={this.props.enterLocation.bind(this, locName)} text={locName} />
                </li>
            )
        });

        return (
            <ul>
                {locationButtons}
            </ul>
        )
    }

    render(): React.ReactNode {
        return (
            <>
                {Settings.DisableASCIIArt ? this.listCity() : this.asciiCity()}
            </>
        )
    }
}