import { FormControlLabel, Switch, SwitchProps, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface IProps extends SwitchProps {
  checked: boolean;
  onValueChanged: (newValue: boolean, error?: string) => void;
  text: React.ReactNode;
  tooltip: React.ReactNode;
}

export function OptionSwitch({ checked, onValueChanged, text, tooltip, ...otherProps }: IProps): React.ReactElement {
  const [value, setValue] = useState(checked);

  function handleSwitchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.checked);
  }

  useEffect(() => onValueChanged(value), [value]);

  return (
    <FormControlLabel
      control={<Switch checked={value} onChange={handleSwitchChange} {...otherProps} />}
      label={
        <Tooltip title={<Typography>{tooltip}</Typography>}>
          <Typography>{text}</Typography>
        </Tooltip>
      }
    />
  );
}
