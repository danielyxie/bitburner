import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Material } from "../Material";
import { Modal } from "../../ui/React/Modal";
import { useDivision } from "./Context";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

interface IMarketTA2Props {
  mat: Material;
}

function MarketTA2(props: IMarketTA2Props): React.ReactElement {
  const division = useDivision();
  if (!division.hasResearch("Market-TA.II")) return <></>;

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
      <Typography variant="h4">Market-TA.II</Typography>
      <br />
      <Typography>
        If you sell at {numeralWrapper.formatMoney(sCost)}, then you will sell{" "}
        {numeralWrapper.format(markup, "0.00000")}x as much compared to if you sold at market price.
      </Typography>
      <TextField type="number" onChange={onChange} value={newCost} />
      <br />
      <FormControlLabel
        control={<Switch checked={props.mat.marketTa2} onChange={onMarketTA2} />}
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

      <Typography>
        Note that Market-TA.II overrides Market-TA.I. This means that if both are enabled, then Market-TA.II will take
        effect, not Market-TA.I
      </Typography>
    </>
  );
}

interface IProps {
  open: boolean;
  onClose: () => void;
  mat: Material;
}

// Create a popup that lets the player use the Market TA research for Materials
export function MaterialMarketTaModal(props: IProps): React.ReactElement {
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
    <Modal open={props.open} onClose={props.onClose}>
      <Typography variant="h4">Market-TA.I</Typography>
      <Typography>
        The maximum sale price you can mark this up to is {numeralWrapper.formatMoney(props.mat.bCost + markupLimit)}.
        This means that if you set the sale price higher than this, you will begin to experience a loss in number of
        sales
      </Typography>

      <FormControlLabel
        control={<Switch checked={props.mat.marketTa1} onChange={onMarketTA1} />}
        label={
          <Tooltip
            title={
              <Typography>
                If this is enabled, then this Material will automatically be sold at the price identified by Market-TA.I
                (i.e. the price shown above)
              </Typography>
            }
          >
            <Typography>Use Market-TA.I for Auto-Sale Price</Typography>
          </Tooltip>
        }
      />
      <MarketTA2 mat={props.mat} />
    </Modal>
  );
}
