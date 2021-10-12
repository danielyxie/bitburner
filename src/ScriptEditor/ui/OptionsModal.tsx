import React, { useState } from "react";
import { Options } from "./Options";
import { Modal } from "../../ui/React/Modal";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

interface IProps {
  options: Options;
  save: (options: Options) => void;
  onClose: () => void;
  open: boolean;
}

export function OptionsModal(props: IProps): React.ReactElement {
  const [theme, setTheme] = useState(props.options.theme);
  const [insertSpaces, setInsertSpaces] = useState(props.options.insertSpaces);
  const [fontSize, setFontSize] = useState(props.options.fontSize);

  function save(): void {
    props.save({
      theme: theme,
      insertSpaces: insertSpaces,
      fontSize: fontSize,
    });
    props.onClose();
  }

  function onFontChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const f = parseFloat(event.target.value);
    if (isNaN(f)) return;
    setFontSize(f);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Theme: </Typography>
        <Select onChange={(event) => setTheme(event.target.value)} defaultValue={props.options.theme}>
          <MenuItem value="vs-dark">dark</MenuItem>
          <MenuItem value="light">light</MenuItem>
          <MenuItem value="monokai">monokai</MenuItem>
        </Select>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Use whitespace over tabs: </Typography>
        <Switch onChange={(event) => setInsertSpaces(event.target.checked)} checked={insertSpaces} />
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        <TextField type="number" label="Font size" value={fontSize} onChange={onFontChange} />
      </Box>
      <br />
      <Button onClick={save}>Save</Button>
    </Modal>
  );
}
