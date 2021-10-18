import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Product } from "../Product";
import { Modal } from "../../ui/React/Modal";
import { useDivision } from "./Context";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

interface ITa2Props {
  product: Product;
}

function MarketTA2(props: ITa2Props): React.ReactElement {
  const division = useDivision();
  if (!division.hasResearch("Market-TA.II")) return <></>;
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
      <Typography variant="h4">Market-TA.II</Typography>
      <br />
      <Typography>
        If you sell at {numeralWrapper.formatMoney(sCost)}, then you will sell{" "}
        {numeralWrapper.format(markup, "0.00000")}x as much compared to if you sold at market price.
      </Typography>
      <TextField type="number" onChange={onChange} value={value} />
      <br />
      <FormControlLabel
        control={<Switch checked={props.product.marketTa2} onChange={onCheckedChange} />}
        label={
          <Tooltip
            title={
              <Typography>
                If this is enabled, then this Material will automatically be sold at the optimal price such that the
                amount sold matches the amount produced. (i.e. the highest possible price, while still ensuring that all
                produced materials will be sold)
              </Typography>
            }
          >
            <Typography>Use Market-TA.II for Auto-Sale Price</Typography>
          </Tooltip>
        }
      />
    </>
  );
}

interface IProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

// Create a popup that lets the player use the Market TA research for Products
export function ProductMarketTaModal(props: IProps): React.ReactElement {
  const division = useDivision();
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
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography variant="h4">Market-TA.I</Typography>
        <Typography>
          The maximum sale price you can mark this up to is{" "}
          {numeralWrapper.formatMoney(props.product.pCost + markupLimit)}. This means that if you set the sale price
          higher than this, you will begin to experience a loss in number of sales
        </Typography>

        <FormControlLabel
          control={<Switch checked={props.product.marketTa1} onChange={onChange} />}
          label={
            <Tooltip
              title={
                <Typography>
                  If this is enabled, then this Material will automatically be sold at the price identified by
                  Market-TA.I (i.e. the price shown above)
                </Typography>
              }
            >
              <Typography>Use Market-TA.I for Auto-Sale Price</Typography>
            </Tooltip>
          }
        />
      </>

      <MarketTA2 product={props.product} />
    </Modal>
  );
}
