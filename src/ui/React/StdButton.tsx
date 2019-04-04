/**
 * Basic stateless button
 * Uses the 'std-button' css class
 */
import * as React from "react";

interface IStdButtonProps {
    disabled?: boolean;
    id?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => any;
    style?: object;
    text: string;
    tooltip?: string;
}

type IInnerHTMLMarkup = {
    __html: string;
}

export class StdButton extends React.Component<IStdButtonProps, any> {
    render() {
        const hasTooltip = this.props.tooltip != null && this.props.tooltip !== "";
        let className = this.props.disabled ? "std-button-disabled" : "std-button";
        if (hasTooltip) {
            className += " tooltip";
        }

        // Tooltip will be set using inner HTML
        let tooltipMarkup: IInnerHTMLMarkup | null;
        if (hasTooltip) {
            tooltipMarkup = {
                __html: this.props.tooltip!
            }
        }

        return (
            <button className={className} id={this.props.id} onClick={this.props.onClick} style={this.props.style}>
                {this.props.text}
                {
                    hasTooltip &&
                    <span className={"tooltiptext"} dangerouslySetInnerHTML={tooltipMarkup!}></span>
                }
            </button>
        )
    }
}
