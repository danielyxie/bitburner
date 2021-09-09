import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { IIndustry } from "../IIndustry";
import { Product } from "../Product";

interface IProps {
  product: Product;
  industry: IIndustry;
  popupId: string;
}

function MarketTA2(props: IProps): React.ReactElement {
  const markupLimit = props.product.rat / props.product.mku;
  const [value, setValue] = useState(props.product.pCost);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValue(parseFloat(event.target.value));
  }

  function onCheckedChange(event: React.ChangeEvent<HTMLInputElement>): void {
    props.product.marketTa2 = event.target.checked;
    rerender();
  }

  const sCost = value;
  let markup = 1;
  if (sCost > props.product.pCost) {
    if (sCost - props.product.pCost > markupLimit) {
      markup = markupLimit / (sCost - props.product.pCost);
    }
  }

  return (
    <>
      <p>
        <br />
        <u>
          <strong>Market-TA.II</strong>
        </u>
        <br />
        If you sell at {numeralWrapper.formatMoney(sCost)}, then you will sell{" "}
        {numeralWrapper.format(markup, "0.00000")}x as much compared to if you sold at market price.
      </p>
      <input className="text-input" onChange={onChange} value={value} type="number" style={{ marginTop: "4px" }} />
      <div style={{ display: "block" }}>
        <label className="tooltip" htmlFor="cmpy-mgmt-marketa2-checkbox" style={{ color: "white" }}>
          Use Market-TA.II for Auto-Sale Price
          <span className="tooltiptext">
            If this is enabled, then this Product will automatically be sold at the optimal price such that the amount
            sold matches the amount produced. (i.e. the highest possible price, while still ensuring that all produced
            materials will be sold).
          </span>
        </label>
        <input
          className="text-input"
          onChange={onCheckedChange}
          id="cmpy-mgmt-marketa2-checkbox"
          style={{ margin: "3px" }}
          type="checkbox"
          checked={props.product.marketTa2}
        />
      </div>
      <p>
        Note that Market-TA.II overrides Market-TA.I. This means that if both are enabled, then Market-TA.II will take
        effect, not Market-TA.I
      </p>
    </>
  );
}

// Create a popup that lets the player use the Market TA research for Products
export function ProductMarketTaPopup(props: IProps): React.ReactElement {
  const markupLimit = props.product.rat / props.product.mku;
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    props.product.marketTa1 = event.target.checked;
    rerender();
  }

  return (
    <>
      <p>
        <u>
          <strong>Market-TA.I</strong>
        </u>
        <br />
        The maximum sale price you can mark this up to is{" "}
        {numeralWrapper.formatMoney(props.product.pCost + markupLimit)}. This means that if you set the sale price
        higher than this, you will begin to experience a loss in number of sales.
      </p>
      <div style={{ display: "block" }}>
        <label className="tooltip" htmlFor="cmpy-mgmt-marketa1-checkbox" style={{ color: "white" }}>
          Use Market-TA.I for Auto-Sale Price
          <span className="tooltiptext">
            If this is enabled, then this Product will automatically be sold at the price identified by Market-TA.I
            (i.e. the price shown above).
          </span>
        </label>
        <input
          onChange={onChange}
          className="text-input"
          id="cmpy-mgmt-marketa1-checkbox"
          style={{ margin: "3px" }}
          type="checkbox"
          checked={props.product.marketTa1}
        />
      </div>
      {props.industry.hasResearch("Market-TA.II") && (
        <MarketTA2 product={props.product} industry={props.industry} popupId={props.popupId} />
      )}
    </>
  );
}
