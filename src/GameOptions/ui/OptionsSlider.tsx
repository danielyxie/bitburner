import { Slider, Tooltip, Typography, Box } from "@mui/material";
import React from "react";

interface IProps {
  value: any;
  callback: (event: any, newValue: number | number[]) => void;
  step: number;
  min: number;
  max: number;
  tooltip: React.ReactElement;
  label: string;
}

export const OptionsSlider = (props: IProps): React.ReactElement => {
  return (
    <Box>
      <Tooltip title={<Typography>{props.tooltip}</Typography>}>
        <Typography>{props.label}</Typography>
      </Tooltip>
      <Slider
        value={props.value}
        onChange={props.callback}
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
      />
    </Box>
  );
};
