import { Tooltip, Typography, Slider, SliderProps } from "@mui/material";
import React, { useEffect, useState } from "react";

interface IProps extends SliderProps {
  value: number;
  onValueChanged: (newValue: number, error?: string) => void;
  text: React.ReactNode;
  tooltip: React.ReactNode;
  step?: number;
  min: number;
  max: number;
}

export function OptionSlider({ value, onValueChanged, text, tooltip, ...otherProps }: IProps): React.ReactElement {
  const [sliderValue, setSliderValue] = useState(value);

  function handleSliderChange(event: any, newValue: number | number[]): void {
    setSliderValue(newValue as number);
  }

  useEffect(() => onValueChanged(sliderValue), [sliderValue]);

  return (
    <>
      <Tooltip title={<Typography>{tooltip}</Typography>}>
        <Typography>{text}</Typography>
      </Tooltip>
      <Slider value={sliderValue} onChange={handleSliderChange} valueLabelDisplay="auto" {...otherProps} />
    </>
  );
}
