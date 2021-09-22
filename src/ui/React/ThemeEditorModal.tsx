import React, { useState } from "react";
import { Modal } from "./Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import IconButton from "@mui/material/IconButton";
import ReplyIcon from "@mui/icons-material/Reply";
import { Color, ColorPicker } from "material-ui-color";
import { ThemeEvents } from "./Theme";
import { Settings, defaultSettings } from "../../Settings/Settings";

interface IProps {
  open: boolean;
  onClose: () => void;
}

function ColorEditor({ name }: { name: string }): React.ReactElement {
  const [color, setColor] = useState(Settings.theme[name]);
  if (color === undefined) return <></>;
  const valid = color.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})/g);

  function set(): void {
    if (!valid) return;
    Settings.theme[name] = color;
    ThemeEvents.emit();
  }

  function revert(): void {
    Settings.theme[name] = defaultSettings.theme[name];
    setColor(defaultSettings.theme[name]);
    ThemeEvents.emit();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setColor(event.target.value);
  }

  function onColorPickerChange(newValue: Color): void {
    setColor("#" + newValue.hex.toLowerCase());
  }

  return (
    <>
      <TextField
        sx={{ mx: 1 }}
        label={name}
        value={color}
        onChange={onChange}
        variant="standard"
        InputProps={{
          startAdornment: (
            <>
              <ColorPicker
                hideTextfield
                value={color}
                onChange={onColorPickerChange}
              />
            </>
          ),
          endAdornment: (
            <>
              <IconButton onClick={set} disabled={!valid}>
                <DoneIcon color={valid ? "primary" : "error"} />
              </IconButton>
              <IconButton onClick={revert}>
                <ReplyIcon color="primary" />
              </IconButton>
            </>
          ),
        }}
      />
    </>
  );
}

export function ThemeEditorModal(props: IProps): React.ReactElement {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Button color="primary">primary</Button>
      <Button color="secondary">secondary</Button>
      <Button color="warning">warning</Button>
      <Button color="info">info</Button>
      <Button color="error">error</Button>
      <Typography color="primary">primary</Typography>
      <Typography color="secondary">secondary</Typography>
      <Typography color="warning">warning</Typography>
      <Typography color="info">info</Typography>
      <Typography color="error">error</Typography>
      <br />
      <ColorEditor name="primarylight" />
      <ColorEditor name="primary" />
      <ColorEditor name="primarydark" />

      <br />
      <ColorEditor name="errorlight" />
      <ColorEditor name="error" />
      <ColorEditor name="errordark" />

      <br />
      <ColorEditor name="secondarylight" />
      <ColorEditor name="secondary" />
      <ColorEditor name="secondarydark" />

      <br />
      <ColorEditor name="warninglight" />
      <ColorEditor name="warning" />
      <ColorEditor name="warningdark" />

      <br />
      <ColorEditor name="infolight" />
      <ColorEditor name="info" />
      <ColorEditor name="infodark" />

      <br />
      <ColorEditor name="welllight" />
      <ColorEditor name="well" />
      <ColorEditor name="white" />
      <ColorEditor name="black" />

      <br />
      <ColorEditor name="hp" />
      <ColorEditor name="money" />
      <ColorEditor name="hack" />
      <ColorEditor name="combat" />
      <ColorEditor name="cha" />
      <ColorEditor name="int" />
      <ColorEditor name="rep" />
    </Modal>
  );
}
