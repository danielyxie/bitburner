/**
 * Basic stateless button with a tooltip
 * Uses the 'std-button' css class
 */
import * as React from "react";

export interface IStdButtonWithTooltipProps {
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => any;
    style?: object;
    text: string;
    tooltip: string;
}

export class StdButtonWithTooltip extends React.Component<IStdButtonWithTooltipProps, any> {
    render() {
        const className = this.props.disabled ? "std-button-disabled tooltip" : "std-button tooltip";

        return (
            <button className={className} onClick={this.props.onClick} style={this.props.style}>
                {this.props.text}
                <span className={"tooltiptext"}>
                    {this.props.tooltip}
                </span>
            </button>
        )
    }
}
