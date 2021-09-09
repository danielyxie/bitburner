/**
 * React Component for a button that initiates a transaction on the Stock Market UI
 * (Buy, Sell, Buy Max, etc.)
 */
import * as React from "react";

type IProps = {
  onClick: () => void;
  text: string;
  tooltip?: JSX.Element | null;
};

export function StockTickerTxButton(props: IProps): React.ReactElement {
  let className = "stock-market-input std-button";

  const hasTooltip = props.tooltip != null;
  if (hasTooltip) {
    className += " tooltip";
  }

  return (
    <button className={className} onClick={props.onClick}>
      {props.text}
      {props.tooltip != null && <span className={"tooltiptext"}>{props.tooltip}</span>}
    </button>
  );
}
