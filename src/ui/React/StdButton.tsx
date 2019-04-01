/**
 * Basic stateless button
 * Uses the 'std-button' css class
 */
import * as React from "react";

interface IStdButtonProps {
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => any;
    style?: object;
    text: string;
    tooltip?: string;
}

export class StdButton extends React.Component<IStdButtonProps, any> {
    render() {
        const hasTooltip = this.props.tooltip !== "";
        let className = this.props.disabled ? "std-button-disabled" : "std-button";
        if (hasTooltip) {
            className += " tooltip";
        }

        return (
            <button className={className} onClick={this.props.onClick} style={this.props.style}>
                {this.props.text}
                {
                    hasTooltip &&
                    <span className={"tooltiptext"}>
                        {this.props.tooltip}
                    </span>
                }
            </button>
        )
    }
}
