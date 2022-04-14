import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { NewCity } from "../Actions";
import { CorporationConstants } from "../data/Constants";

import { useCorporation, useDivision } from "./Context";
import { MoneyCost } from "./MoneyCost";

interface IProps {
  cityStateSetter: (city: string) => void;
}

export function ExpandNewCity(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const possibleCities = Object.keys(division.offices).filter((cityName: string) => division.offices[cityName] === 0);
  const [city, setCity] = useState(possibleCities[0]);

  const disabled = corp.funds < CorporationConstants.OfficeInitialCost;

  function onCityChange(event: SelectChangeEvent<string>): void {
    setCity(event.target.value);
  }

  function expand(): void {
    try {
      NewCity(corp, division, city);
    } catch (err) {
      dialogBoxCreate(err + "");
      return;
    }

    dialogBoxCreate(`Opened a new office in ${city}!`);

    props.cityStateSetter(city);
  }
  return (
    <>
      <Typography>
        Would you like to expand into a new city by opening an office? This would cost{" "}
        <MoneyCost money={CorporationConstants.OfficeInitialCost} corp={corp} />
      </Typography>
      <Select
        endAdornment={
          <Button onClick={expand} disabled={disabled}>
            Confirm
          </Button>
        }
        value={city}
        onChange={onCityChange}
      >
        {possibleCities.map((cityName: string) => (
          <MenuItem key={cityName} value={cityName}>
            {cityName}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
