/**
 * React Component for a button that initiates a transaction on the Stock Market UI
 * (Buy, Sell, Buy Max, etc.)
 */
import * as React from "react";

type IProps = {
    onClick: () => void;
    text: string;
}

export function StockTickerTxButton(props: IProps): React.ReactElement {
    return (
        <button className={"stock-market-input std-button"} onClick={props.onClick}>
            {props.text}
        </button>
    )
}
