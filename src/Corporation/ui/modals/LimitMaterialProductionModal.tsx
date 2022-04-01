import React, { useState } from "react";
import { LimitMaterialProduction } from "../../Actions";
import { Modal } from "../../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { KEY } from "../../../utils/helpers/keyCodes";
import { Material } from "../../Material";

interface IProps {
  open: boolean;
  onClose: () => void;
  material: Material;
}

// Create a popup that lets the player limit the production of a product
export function LimitMaterialProductionModal(props: IProps): React.ReactElement {
  const [limit, setLimit] = useState<number | null>(null);

  function limitMaterialProduction(): void {
    let qty = limit;
    if (qty === null) qty = -1;
    LimitMaterialProduction(props.material, qty);
    props.onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === KEY.ENTER) limitMaterialProduction();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setLimit(null);
    else setLimit(parseFloat(event.target.value));
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Enter a limit to the amount of this material you would like to produce per second. Leave the box empty to set no
        limit.
      </Typography>
      <TextField autoFocus={true} placeholder="Limit" type="number" onChange={onChange} onKeyDown={onKeyDown} />
      <Button onClick={limitMaterialProduction}>Limit production</Button>
    </Modal>
  );
}
