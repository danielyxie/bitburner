import React, { useState } from "react";
import { Options } from "./Options";
import { StdButton } from "../../ui/React/StdButton";
import { removePopup } from "../../ui/React/createPopup";
import { Modal } from "../../ui/React/Modal";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";

interface IProps {
  options: Options;
  save: (options: Options) => void;
  onClose: () => void;
  open: boolean;
}

export function OptionsModal(props: IProps): React.ReactElement {
  const [theme, setTheme] = useState(props.options.theme);
  const [insertSpaces, setInsertSpaces] = useState(props.options.insertSpaces);

  function save(): void {
    props.save({
      theme: theme,
      insertSpaces: insertSpaces,
    });
    props.onClose();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Theme: </Typography>
        <Select
          variant="standard"
          color="primary"
          onChange={(event) => setTheme(event.target.value)}
          defaultValue={props.options.theme}
        >
          <MenuItem value="vs-dark">dark</MenuItem>
          <MenuItem value="light">light</MenuItem>
        </Select>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Use whitespace over tabs: </Typography>
        <Switch onChange={(event) => setInsertSpaces(event.target.checked)} checked={insertSpaces} />
      </Box>
      <br />
      <Button onClick={save}>Save</Button>
    </Modal>
  );
}
