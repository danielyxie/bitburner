import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
import ExposureZeroIcon from "@material-ui/icons/ExposureZero";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { TextField } from "../../ui/React/TextField";

interface IProps {
  label: string;
  placeholder: string;
  add: (x: number) => void;
  subtract: (x: number) => void;
  tons: () => void;
  reset: () => void;
}

export function Adjuster(props: IProps): React.ReactElement {
  const [value, setValue] = useState<number | string>("");

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setValue("");
    else setValue(parseFloat(event.target.value));
  }

  const { label, placeholder, add, subtract, reset, tons } = props;
  return (
    <>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="number"
        InputProps={{
          startAdornment: (
            <>
              <IconButton color="primary" onClick={tons}>
                <DoubleArrowIcon style={{ transform: "rotate(-90deg)" }} />
              </IconButton>
              <IconButton color="primary" onClick={() => add(typeof value !== "string" ? value : 0)}>
                <AddIcon />
              </IconButton>
            </>
          ),
          endAdornment: (
            <>
              <IconButton color="primary" onClick={() => subtract(typeof value !== "string" ? value : 0)}>
                <RemoveIcon />
              </IconButton>
              <IconButton color="primary" onClick={reset}>
                <ExposureZeroIcon />
              </IconButton>
            </>
          ),
        }}
      />
    </>
  );
}
