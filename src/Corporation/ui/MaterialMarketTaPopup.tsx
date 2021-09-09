import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { IIndustry } from "../IIndustry";
import { ICorporation } from "../ICorporation";
import { Material } from "../Material";

interface IMarketTA2Props {
  industry: IIndustry;
  mat: Material;
}

function MarketTA2(props: IMarketTA2Props): React.ReactElement {
  if (!props.industry.hasResearch("Market-TA.II")) return <></>;

  const [newCost, setNewCost] = useState<number>(props.mat.bCost);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  const markupLimit = props.mat.getMarkupLimit();

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setNewCost(0);
    else setNewCost(parseFloat(event.target.value));
  }

  const sCost = newCost;
  let markup = 1;
  if (sCost > props.mat.bCost) {
    //Penalty if difference between sCost and bCost is greater than markup limit
    if (sCost - props.mat.bCost > markupLimit) {
      markup = Math.pow(markupLimit / (sCost - props.mat.bCost), 2);
    }
  } else if (sCost < props.mat.bCost) {
    if (sCost <= 0) {
      markup = 1e12; //Sell everything, essentially discard
    } else {
      //Lower prices than market increases sales
      markup = props.mat.bCost / sCost;
    }
  }

  function onMarketTA2(event: React.ChangeEvent<HTMLInputElement>): void {
    props.mat.marketTa2 = event.target.checked;
    rerender();
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
      <input className="text-input" type="number" style={{ marginTop: "4px" }} onChange={onChange} value={newCost} />
      <div style={{ display: "block" }}>
        <label className="tooltip" htmlFor="cmpy-mgmt-marketa2-checkbox" style={{ color: "white" }}>
          Use Market-TA.II for Auto-Sale Price
          <span className="tooltiptext">
            If this is enabled, then this Material will automatically be sold at the optimal price such that the amount
            sold matches the amount produced. (i.e. the highest possible price, while still ensuring that all produced
            materials will be sold)
          </span>
        </label>
        <input
          id="cmpy-mgmt-marketa2-checkbox"
          type="checkbox"
          onChange={onMarketTA2}
          checked={props.mat.marketTa2}
          style={{ margin: "3px" }}
        />
      </div>
      <p>
        Note that Market-TA.II overrides Market-TA.I. This means that if both are enabled, then Market-TA.II will take
        effect, not Market-TA.I
      </p>
    </>
  );
}

interface IProps {
  mat: Material;
  industry: IIndustry;
  corp: ICorporation;
  popupId: string;
}

// Create a popup that lets the player use the Market TA research for Materials
export function MaterialMarketTaPopup(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  const markupLimit = props.mat.getMarkupLimit();

  function onMarketTA1(event: React.ChangeEvent<HTMLInputElement>): void {
    props.mat.marketTa1 = event.target.checked;
    rerender();
  }

  return (
    <>
      <p>
        <u>
          <strong>Market-TA.I</strong>
        </u>
        <br />
        The maximum sale price you can mark this up to is {numeralWrapper.formatMoney(props.mat.bCost + markupLimit)}.
        This means that if you set the sale price higher than this, you will begin to experience a loss in number of
        sales
      </p>
      <div style={{ display: "block" }}>
        <label className="tooltip" htmlFor="cmpy-mgmt-marketa1-checkbox" style={{ color: "white" }}>
          Use Market-TA.I for Auto-Sale Price
          <span className="tooltiptext">
            If this is enabled, then this Material will automatically be sold at the price identified by Market-TA.I
            (i.e. the price shown above)
          </span>
        </label>
        <input
          id="cmpy-mgmt-marketa1-checkbox"
          type="checkbox"
          onChange={onMarketTA1}
          checked={props.mat.marketTa1}
          style={{ margin: "3px" }}
        />
      </div>
      <MarketTA2 mat={props.mat} industry={props.industry} />
    </>
  );
}
