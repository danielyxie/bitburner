import React, { useRef } from "react";
import { CorporationConstants } from "../data/Constants";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { NewCity } from "../Actions";
import { MoneyCost } from "./MoneyCost";
import { useCorporation, useDivision } from "./Context";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";

interface IProps {
  cityStateSetter: (city: string) => void;
}

export function ExpandNewCity(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const dropdown = useRef<HTMLSelectElement>(null);

  function expand(): void {
    if (dropdown.current === null) return;
    try {
      NewCity(corp, division, dropdown.current.value);
    } catch (err) {
      dialogBoxCreate(err + "");
      return;
    }

    dialogBoxCreate(`Opened a new office in ${dropdown.current.value}!`);

    props.cityStateSetter(dropdown.current.value);
  }
  return (
    <>
      <Typography>
        Would you like to expand into a new city by opening an office? This would cost{" "}
        <MoneyCost money={CorporationConstants.OfficeInitialCost} corp={corp} />
      </Typography>
      <Select ref={dropdown}>
        {Object.keys(division.offices)
          .filter((cityName: string) => division.offices[cityName] === 0)
          .map((cityName: string) => (
            <MenuItem key={cityName} value={cityName}>
              {cityName}
            </MenuItem>
          ))}
      </Select>
      <Button onClick={expand} disabled={corp.funds.lt(0)}>
        Confirm
      </Button>
    </>
  );
}
