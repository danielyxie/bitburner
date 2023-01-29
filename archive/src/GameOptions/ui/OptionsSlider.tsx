import { Slider, Tooltip, Typography, Box } from "@mui/material";
import React, { useState } from "react";

interface IProps {
  initialValue: number;
  callback: (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) => void;
  step: number;
  min: number;
  max: number;
  tooltip: React.ReactElement;
  label: string;
  marks?: boolean;
}

export const OptionsSlider = (props: IProps): React.ReactElement => {
  const [value, setValue] = useState(props.initialValue);

  const onChange = (_evt: Event, newValue: number | Array<number>): void => {
    if (typeof newValue === "number") setValue(newValue);
  };

  return (
    <Box>
      <Tooltip title={<Typography>{props.tooltip}</Typography>}>
        <Typography>{props.label}</Typography>
      </Tooltip>
      <Slider
        value={value}
        onChange={onChange}
        onChangeCommitted={props.callback}
        step={props.step}
        min={props.min}
        max={props.max}
        valueLabelDisplay="auto"
        sx={{
          "& .MuiSlider-thumb": {
            height: "12px",
            width: "12px",
          },
        }}
        marks={props.marks}
      />
    </Box>
  );
};
