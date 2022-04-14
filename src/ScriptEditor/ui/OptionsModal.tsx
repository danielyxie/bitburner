import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { Modal } from "../../ui/React/Modal";

import type { Options, WordWrapOptions } from "./Options";
import { ThemeEditorModal } from "./ThemeEditorModal";

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
  const [wordWrap, setWordWrap] = useState(props.options.wordWrap);
  const [vim, setVim] = useState(props.options.vim);
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);

  function save(): void {
    props.save({
      theme,
      insertSpaces,
      fontSize,
      wordWrap,
      vim,
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
      <ThemeEditorModal open={themeEditorOpen} onClose={() => setThemeEditorOpen(false)} />
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Theme: </Typography>
        <Select onChange={(event) => setTheme(event.target.value)} value={theme}>
          <MenuItem value="monokai">monokai</MenuItem>
          <MenuItem value="solarized-dark">solarized-dark</MenuItem>
          <MenuItem value="solarized-light">solarized-light</MenuItem>
          <MenuItem value="vs-dark">dark</MenuItem>
          <MenuItem value="light">light</MenuItem>
          <MenuItem value="dracula">dracula</MenuItem>
          <MenuItem value="one-dark">one-dark</MenuItem>
          <MenuItem value="customTheme">Custom theme</MenuItem>
        </Select>
        <Button onClick={() => setThemeEditorOpen(true)} sx={{ mx: 1 }} startIcon={<EditIcon />}>
          Edit custom theme
        </Button>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Use whitespace over tabs: </Typography>
        <Switch onChange={(event) => setInsertSpaces(event.target.checked)} checked={insertSpaces} />
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Word Wrap: </Typography>
        <Select onChange={(event) => setWordWrap(event.target.value as WordWrapOptions)} value={wordWrap}>
          <MenuItem value={"off"}>Off</MenuItem>
          <MenuItem value={"on"}>On</MenuItem>
          <MenuItem value={"bounded"}>Bounded</MenuItem>
          <MenuItem value={"wordWrapColumn"}>Word Wrap Column</MenuItem>
        </Select>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Enable vim mode: </Typography>
        <Switch onChange={(event) => setVim(event.target.checked)} checked={vim} />
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center">
        <TextField type="number" label="Font size" value={fontSize} onChange={onFontChange} />
      </Box>
      <br />
      <Button onClick={save} startIcon={<SaveIcon />}>
        Save
      </Button>
    </Modal>
  );
}
