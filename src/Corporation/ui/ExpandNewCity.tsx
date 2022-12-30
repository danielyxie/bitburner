import React, { useState } from "react";
import * as corpConstants from "../data/Constants";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { NewCity } from "../Actions";
import { MoneyCost } from "./MoneyCost";
import { useCorporation, useDivision } from "./Context";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { CityName } from "../../Enums";

interface IProps {
  cityStateSetter: (city: CityName | "Expand") => void;
}

export function ExpandNewCity(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const possibleCities = Object.values(CityName).filter((cityName) => division.offices[cityName] === 0);
  const [city, setCity] = useState(possibleCities[0]);

  const disabled = corp.funds < corpConstants.officeInitialCost;

  function onCityChange(event: SelectChangeEvent<string>): void {
    setCity(event.target.value as CityName);
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
        <MoneyCost money={corpConstants.officeInitialCost} corp={corp} />
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
