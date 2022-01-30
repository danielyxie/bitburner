import React, { useState } from "react";
import { Modal } from "../../ui/React/Modal";
import { defaultMonacoTheme } from "./themes";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ReplyIcon from "@mui/icons-material/Reply";
import HistoryIcon from '@mui/icons-material/History';
import SaveIcon from '@mui/icons-material/Save';

import { Settings } from "../../Settings/Settings";
import { OptionSwitch } from "../../ui/React/OptionSwitch";
import _ from "lodash";

import { Color, ColorPicker } from "material-ui-color";

interface IProps {
  onClose: () => void;
  open: boolean;
}

interface IColorEditorProps {
  label: string;
  themePath: string;
  color: string | undefined;
  onColorChange: (name: string, value: string) => void;
  defaultColor: string;
}

// Slightly tweaked version of the same function found in game options
function ColorEditor({ label, themePath, onColorChange, color, defaultColor }: IColorEditorProps): React.ReactElement {
  if (color === undefined) {
    console.error(`color ${themePath} was undefined, reverting to default`);
    color = defaultColor;
  }

  return (
    <>
      <Tooltip title={label}>
        <span>
          <TextField
            label={themePath}
            value={"#" + color}
            sx={{ display: "block", my: 1 }}
            InputProps={{
              startAdornment: (
                <>
                  <ColorPicker
                    hideTextfield
                    deferred
                    value={"#" + color}
                    onChange={(newColor: Color) => onColorChange(themePath, newColor.hex)}
                    disableAlpha
                  />
                </>
              ),
              endAdornment: (
                <>
                  <IconButton onClick={() => onColorChange(themePath, defaultColor)}>
                    <ReplyIcon color="primary" />
                  </IconButton>
                </>
              ),
            }}
          />
        </span>
      </Tooltip>
    </>
  );
}

export function ThemeEditorModal(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((o) => !o);
  }

  // Need to deep copy the object since it has nested attributes
  const [themeCopy, setThemeCopy] = useState(JSON.parse(JSON.stringify(Settings.EditorTheme)));

  function onColorChange(name: string, value: string): void {
    setThemeCopy(_.set(themeCopy, name, value));
    rerender();
  }

  function onThemeChange(event: React.ChangeEvent<HTMLInputElement>): void {
    try {
      const importedTheme = JSON.parse(event.target.value);
      if (typeof importedTheme !== "object") return;
      setThemeCopy(importedTheme);
    } catch (err) {
      // ignore
    }
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography variant="h4">Customize Editor theme</Typography>
      <Typography>Hover over input boxes for more information</Typography>
      <OptionSwitch
        checked={themeCopy.base === "vs"}
        onChange={(val) => {
          setThemeCopy(_.set(themeCopy, "base", val ? "vs" : "vs-dark"));
          rerender();
        }}
        text="Use light theme as base"
        tooltip={
          <>
            If enabled, the vs light theme will be used as the
            theme base, otherwise, vs-dark will be used.
          </>
        }
      />
      <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", width: "fit-content", gap: 1 }}>
        <Box>
          <Typography variant="h6">UI</Typography>
          <ColorEditor
            label="Background color"
            themePath="common.bg"
            onColorChange={onColorChange}
            color={themeCopy.common.bg}
            defaultColor={defaultMonacoTheme.common.bg}
          />
          <ColorEditor
            label="Current line and minimap background color"
            themePath="ui.line"
            onColorChange={onColorChange}
            color={themeCopy.ui.line}
            defaultColor={defaultMonacoTheme.ui.line}
          />
          <ColorEditor
            label="Base text color"
            themePath="common.fg"
            onColorChange={onColorChange}
            color={themeCopy.common.fg}
            defaultColor={defaultMonacoTheme.common.fg}
          />
          <ColorEditor
            label="Popup background color"
            themePath="ui.panel.bg"
            onColorChange={onColorChange}
            color={themeCopy.ui.panel.bg}
            defaultColor={defaultMonacoTheme.ui.panel.bg}
          />
          <ColorEditor
            label="Background color for selected item in popup"
            themePath="ui.panel.selected"
            onColorChange={onColorChange}
            color={themeCopy.ui.panel.selected}
            defaultColor={defaultMonacoTheme.ui.panel.selected}
          />
          <ColorEditor
            label="Popup border color"
            themePath="ui.panel.border"
            onColorChange={onColorChange}
            color={themeCopy.ui.panel.border}
            defaultColor={defaultMonacoTheme.ui.panel.border}
          />
          <ColorEditor
            label="Background color of highlighted text"
            themePath="ui.selection.bg"
            onColorChange={onColorChange}
            color={themeCopy.ui.selection.bg}
            defaultColor={defaultMonacoTheme.ui.selection.bg}
          />
        </Box>
        <Box>
          <Typography variant="h6">Syntax</Typography>
          <ColorEditor
            label="Numbers, function names, and other key vars"
            themePath="common.accent"
            onColorChange={onColorChange}
            color={themeCopy.common.accent}
            defaultColor={defaultMonacoTheme.common.accent}
          />
          <ColorEditor
            label="Keywords"
            themePath="syntax.keyword"
            onColorChange={onColorChange}
            color={themeCopy.syntax.keyword}
            defaultColor={defaultMonacoTheme.syntax.keyword}
          />
          <ColorEditor
            label="Strings"
            themePath="syntax.string"
            onColorChange={onColorChange}
            color={themeCopy.syntax.string}
            defaultColor={defaultMonacoTheme.syntax.string}
          />
          <ColorEditor
            label="Regexp literals as well as escapes within strings"
            themePath="syntax.regexp"
            onColorChange={onColorChange}
            color={themeCopy.syntax.regexp}
            defaultColor={defaultMonacoTheme.syntax.regexp}
          />
          <ColorEditor
            label="Constants"
            themePath="syntax.constant"
            onColorChange={onColorChange}
            color={themeCopy.syntax.constant}
            defaultColor={defaultMonacoTheme.syntax.constant}
          />
          <ColorEditor
            label="Entities"
            themePath="syntax.entity"
            onColorChange={onColorChange}
            color={themeCopy.syntax.entity}
            defaultColor={defaultMonacoTheme.syntax.entity}
          />
          <ColorEditor
            label="'this', 'ns', types, and tags"
            themePath="syntax.tag"
            onColorChange={onColorChange}
            color={themeCopy.syntax.tag}
            defaultColor={defaultMonacoTheme.syntax.tag}
          />
          <ColorEditor
            label="Netscript functions and constructors"
            themePath="syntax.markup"
            onColorChange={onColorChange}
            color={themeCopy.syntax.markup}
            defaultColor={defaultMonacoTheme.syntax.markup}
          />
          <ColorEditor
            label="Errors"
            themePath="syntax.error"
            onColorChange={onColorChange}
            color={themeCopy.syntax.error}
            defaultColor={defaultMonacoTheme.syntax.error}
          />
          <ColorEditor
            label="Comments"
            themePath="syntax.comment"
            onColorChange={onColorChange}
            color={themeCopy.syntax.comment}
            defaultColor={defaultMonacoTheme.syntax.comment}
          />
        </Box>
      </Box>
      <TextField
        multiline
        fullWidth
        maxRows={10}
        label={"import / export theme"}
        value={JSON.stringify(themeCopy, undefined, 2)}
        onChange={onThemeChange}
      />
      <Box sx={{ my: 1 }}>
        <Button onClick={() => {
          Settings.EditorTheme = { ...themeCopy };
          props.onClose()
        }} startIcon={<SaveIcon />}>Save</Button>
        <Button
          onClick={() => {
            setThemeCopy(defaultMonacoTheme);
            rerender();
          }}
          startIcon={<HistoryIcon />}
        >Reset to default</Button>
      </Box>
    </Modal>
  )
}