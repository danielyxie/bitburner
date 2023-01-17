import { TextField, StandardTextFieldProps } from "@mui/material";
import React from "react";
import { numeralWrapper } from "../numeralFormat";

interface IProps extends Omit<StandardTextFieldProps, "onChange"> {
  onChange: (v: number) => void;
}

export function NumberInput(props: IProps): React.ReactElement {
  const textProps = {
    ...props,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const amt = numeralWrapper.parseMoney(event.target.value);
      if (event.target.value === "" || isNaN(amt)) props.onChange(NaN);
      else props.onChange(amt);
    },
  };
  return <TextField {...textProps} />;
}
