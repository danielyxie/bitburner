import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { IndustryDescriptions, IndustriesData } from "../IndustryData";
import { IndustryType } from "../data/Enums";
import { useCorporation } from "./Context";
import { Industry } from "../Industry";
import { NewIndustry } from "../Actions";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { KEY } from "../../utils/helpers/keyCodes";

interface IProps {
  setDivisionName: (name: string) => void;
}

export function ExpandIndustryTab(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const allIndustries = Object.values(IndustryType).sort();
  const possibleIndustries = allIndustries.filter(
    (industryType: IndustryType) =>
      corp.divisions.find((division: Industry) => division.type === industryType) === undefined,
  );
  const [industry, setIndustry] = useState(possibleIndustries[0]);
  const [name, setName] = useState("");

  //If there are no possible industries to expand into, nothing to render in this tab.
  if (possibleIndustries.length === 0) return <></>;

  const data = IndustriesData[industry];
  if (!data) return <></>;

  const disabled = corp.funds < data.startingCost;

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
    if (event.key === KEY.ENTER) newIndustry();
  }

  function onIndustryChange(event: SelectChangeEvent<string>): void {
    setIndustry(event.target.value as IndustryType);
  }

  const desc = IndustryDescriptions(industry, corp);
  if (desc === undefined) throw new Error(`Trying to create an industry that doesn't exists: '${industry}'`);

  return (
    <>
      <Typography>Create a new division to expand into a new industry:</Typography>
      <Select value={industry} onChange={onIndustryChange}>
        {possibleIndustries.map((industry) => (
          <MenuItem key={industry} value={industry}>
            {industry}
          </MenuItem>
        ))}
      </Select>
      <Typography>{desc}</Typography>
      <br />
      <br />

      <Typography>Division name:</Typography>

      <Box display="flex" alignItems="center">
        <TextField
          autoFocus={true}
          value={name}
          onChange={onNameChange}
          onKeyDown={onKeyDown}
          type="text"
          InputProps={{
            endAdornment: (
              <Button disabled={disabled} sx={{ mx: 1 }} onClick={newIndustry}>
                Expand
              </Button>
            ),
          }}
        />
      </Box>
    </>
  );
}
