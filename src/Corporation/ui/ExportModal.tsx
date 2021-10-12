import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Material } from "../Material";
import { Export } from "../Export";
import { IIndustry } from "../IIndustry";
import { ExportMaterial } from "../Actions";
import { Modal } from "../../ui/React/Modal";
import { useCorporation } from "./Context";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IProps {
  open: boolean;
  onClose: () => void;
  mat: Material;
}

// Create a popup that lets the player manage exports
export function ExportModal(props: IProps): React.ReactElement {
  const corp = useCorporation();
  if (corp.divisions.length === 0) throw new Error("Export popup created with no divisions.");
  if (Object.keys(corp.divisions[0].warehouses).length === 0)
    throw new Error("Export popup created in a division with no warehouses.");
  const [industry, setIndustry] = useState<string>(corp.divisions[0].name);
  const [city, setCity] = useState<string>(Object.keys(corp.divisions[0].warehouses)[0]);
  const [amt, setAmt] = useState("");
  const setRerender = useState(false)[1];

  function rerender(): void {
    setRerender((old) => !old);
  }

  function onCityChange(event: SelectChangeEvent<string>): void {
    setCity(event.target.value);
  }

  function onIndustryChange(event: SelectChangeEvent<string>): void {
    const div = event.target.value;
    setIndustry(div);
    setCity(Object.keys(corp.divisions[0].warehouses)[0]);
  }

  function onAmtChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setAmt(event.target.value);
  }

  function exportMaterial(): void {
    try {
      ExportMaterial(industry, city, props.mat, amt);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    props.onClose();
  }

  function removeExport(exp: Export): void {
    for (let i = 0; i < props.mat.exp.length; ++i) {
      if (props.mat.exp[i].ind !== exp.ind || props.mat.exp[i].city !== exp.city || props.mat.exp[i].amt !== exp.amt)
        continue;
      props.mat.exp.splice(i, 1);
      break;
    }
    rerender();
  }

  const currentDivision = corp.divisions.find((division: IIndustry) => division.name === industry);
  if (currentDivision === undefined)
    throw new Error(`Export popup somehow ended up with undefined division '${currentDivision}'`);
  const possibleCities = Object.keys(currentDivision.warehouses).filter(
    (city) => currentDivision.warehouses[city] !== 0,
  );
  if (possibleCities.length > 0 && !possibleCities.includes(city)) {
    setCity(possibleCities[0]);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Select the industry and city to export this material to, as well as how much of this material to export per
        second. You can set the export amount to 'MAX' to export all of the materials in this warehouse.
      </Typography>
      <Select onChange={onIndustryChange} value={industry}>
        {corp.divisions.map((division: IIndustry) => (
          <MenuItem key={division.name} value={division.name}>
            {division.name}
          </MenuItem>
        ))}
      </Select>
      <Select onChange={onCityChange} value={city}>
        {possibleCities.map((cityName: string) => {
          if (currentDivision.warehouses[cityName] === 0) return;
          return (
            <MenuItem key={cityName} value={cityName}>
              {cityName}
            </MenuItem>
          );
        })}
      </Select>
      <TextField placeholder="Export amount / s" onChange={onAmtChange} value={amt} />
      <Button onClick={exportMaterial}>Export</Button>
      <Typography>
        Below is a list of all current exports of this material from this warehouse. Clicking on one of the exports
        below will REMOVE that export.
      </Typography>
      {props.mat.exp.map((exp: Export, index: number) => (
        <Box display="flex" alignItems="center" key={index}>
          <Button sx={{ mx: 2 }} onClick={() => removeExport(exp)}>
            delete
          </Button>
          <Typography>
            Industry: {exp.ind}
            <br />
            City: {exp.city}
            <br />
            Amount/s: {exp.amt}
          </Typography>
        </Box>
      ))}
    </Modal>
  );
}
