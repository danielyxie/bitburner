/**
 * React Component for a button that initiates a transaction on the Stock Market UI
 * (Buy, Sell, Buy Max, etc.)
 */
import * as React from "react";

type IProps = {
    onClick: () => void;
    text: string;
    tooltip?: string;
}

type IInnerHTMLMarkup = {
    __html: string;
}

export function StockTickerTxButton(props: IProps): React.ReactElement {
    let className = "stock-market-input std-button";

    const hasTooltip = (typeof props.tooltip === "string" && props.tooltip !== "");
    if (hasTooltip) {
        className += " tooltip";
    }

    let tooltipMarkup: IInnerHTMLMarkup | null;
    if (hasTooltip) {
        tooltipMarkup = {
            __html: props.tooltip!
        }
    }

    return (
        <button className={className} onClick={props.onClick}>
            {props.text}
            {
                hasTooltip &&
                <span className={"tooltiptext"} dangerouslySetInnerHTML={tooltipMarkup!}></span>
            }
        </button>
    )
}
