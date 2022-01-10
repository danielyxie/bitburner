import { FormControlLabel, Switch, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface IProps {
  checked: boolean;
  onChange: (newValue: boolean, error?: string) => void;
  text: React.ReactNode;
  tooltip: React.ReactNode;
}

export function OptionSwitch({ checked, onChange, text, tooltip }: IProps): React.ReactElement {
  const [value, setValue] = useState(checked);

  function handleSwitchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.checked);
  }

  useEffect(() => onChange(value), [value]);

  return (
    <FormControlLabel
      control={<Switch checked={value} onChange={handleSwitchChange} />}
      label={
        <Tooltip title={<Typography>{tooltip}</Typography>}>
          <Typography>{text}</Typography>
        </Tooltip>
      }
    />
  );
}
