/**
 * React component for a selectable option on the Faction UI. These
 * options including working for the faction, hacking missions, purchasing
 * augmentations, etc.
 */
import * as React from "react";

import { StdButton } from "../../ui/React/StdButton";

type IProps = {
    buttonText: string;
    infoText: string;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export class Option extends React.Component<IProps, any> {
    render() {
        return (
            <div className={"faction-work-div"}>
                <div className={"faction-work-div-wrapper"}>
                    <StdButton
                        onClick={this.props.onClick}
                        text={this.props.buttonText}
                    />
                    <p>{this.props.infoText}</p>
                </div>
            </div>
        )
    }
}
