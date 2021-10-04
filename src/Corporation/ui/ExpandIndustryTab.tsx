import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { IndustryStartingCosts, Industries, IndustryDescriptions } from "../IndustryData";
import { useCorporation } from "./Context";
import { IIndustry } from "../IIndustry";
import { NewIndustry } from "../Actions";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IProps {
  setDivisionName: (name: string) => void;
}

export function ExpandIndustryTab(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const allIndustries = Object.keys(Industries).sort();
  const possibleIndustries = allIndustries
    .filter(
      (industryType: string) =>
        corp.divisions.find((division: IIndustry) => division.type === industryType) === undefined,
    )
    .sort();
  const [industry, setIndustry] = useState(possibleIndustries.length > 0 ? possibleIndustries[0] : "");
  const [name, setName] = useState("");

  const cost = IndustryStartingCosts[industry];
  if (cost === undefined) {
    throw new Error(`Invalid industry: '${industry}'`);
  }
  const disabled = corp.funds.lt(cost) || name === "";

  function newIndustry(): void {
    if (disabled) return;
    try {
      NewIndustry(corp, industry, name);
    } catch (err) {
      dialogBoxCreate(err + "");
      return;
    }

    // Set routing to the new division so that the UI automatically switches to it
    props.setDivisionName(name);
  }

  function onNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    // [a-zA-Z0-9-_]
    setName(event.target.value);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) newIndustry();
  }

  function onIndustryChange(event: SelectChangeEvent<string>): void {
    setIndustry(event.target.value);
  }

  const desc = IndustryDescriptions[industry];
  if (desc === undefined) throw new Error(`Trying to create an industry that doesn't exists: '${industry}'`);

  return (
    <>
      <Typography>Create a new division to expand into a new industry:</Typography>
      <Select value={industry} onChange={onIndustryChange}>
        {possibleIndustries.map((industry: string) => (
          <MenuItem key={industry} value={industry}>
            {industry}
          </MenuItem>
        ))}
      </Select>
      <Typography>{desc(corp)}</Typography>
      <br />
      <br />

      <Typography>Division name:</Typography>

      <Box display="flex" alignItems="center">
        <TextField autoFocus={true} value={name} onChange={onNameChange} onKeyDown={onKeyDown} type="text" />
        <Button disabled={disabled} sx={{ mx: 1 }} onClick={newIndustry}>
          Create Division
        </Button>
      </Box>
    </>
  );
}
