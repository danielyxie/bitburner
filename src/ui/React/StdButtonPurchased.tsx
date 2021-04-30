/**
 * Stateless button that represents something that has been purchased.
 */
import * as React from "react";

interface IStdButtonPurchasedProps {
    onClick?: (e: React.MouseEvent<HTMLElement>) => any;
    style?: object;
    text: string;
    tooltip?: string;
}

type IInnerHTMLMarkup = {
    __html: string;
}

export class StdButtonPurchased extends React.Component<IStdButtonPurchasedProps, any> {
    render() {
        const hasTooltip = this.props.tooltip != null && this.props.tooltip !== "";
        let className = "std-button-bought";
        if (hasTooltip) {
            className += " tooltip";
        }

        // Tooltip will be set using inner HTML
        let tooltipMarkup: IInnerHTMLMarkup | null;
        if (hasTooltip) {
            tooltipMarkup = {
                __html: this.props.tooltip!,
            }
        }

        return (
            <button className={className} onClick={this.props.onClick} style={this.props.style}>
                {this.props.text}
                {
                    hasTooltip &&
                    <span className={"tooltiptext"} dangerouslySetInnerHTML={tooltipMarkup!}></span>
                }
            </button>
        )
    }
}
