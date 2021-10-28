import React, { useState } from "react";
import { Modal } from "./Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ReplyIcon from "@mui/icons-material/Reply";
import { Color, ColorPicker } from "material-ui-color";
import { ThemeEvents } from "./Theme";
import { Settings, defaultSettings } from "../../Settings/Settings";

interface IProps {
  open: boolean;
  onClose: () => void;
}

interface IColorEditorProps {
  name: string;
  color: string | undefined;
  onColorChange: (name: string, value: string) => void;
  defaultColor: string;
}

function ColorEditor({ name, onColorChange, color, defaultColor }: IColorEditorProps): React.ReactElement {
  if (color === undefined) {
    console.error(`color ${name} was undefined, reverting to default`);
    color = defaultColor;
  }

  return (
    <>
      <TextField
        sx={{ mx: 1 }}
        label={name}
        value={color}
        InputProps={{
          startAdornment: (
            <>
              <ColorPicker
                hideTextfield
                value={color}
                onChange={(newColor: Color) => onColorChange(name, "#" + newColor.hex)}
              />
            </>
          ),
          endAdornment: (
            <>
              <IconButton onClick={() => onColorChange(name, defaultColor)}>
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
  const [customTheme, setCustomTheme] = useState<{ [key: string]: string | undefined }>({
    ...Settings.theme,
  });

  function onThemeChange(event: React.ChangeEvent<HTMLInputElement>): void {
    try {
      const importedTheme = JSON.parse(event.target.value);
      if (typeof importedTheme !== "object") return;
      setCustomTheme(importedTheme);
      for (const key of Object.keys(importedTheme)) {
        Settings.theme[key] = importedTheme[key];
      }
      ThemeEvents.emit();
    } catch (err) {
      // ignore
    }
  }

  function onColorChange(name: string, value: string): void {
    setCustomTheme((old: any) => {
      old[name] = value;
      return old;
    });

    Settings.theme[name] = value;
    ThemeEvents.emit();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Paper>
        <Tooltip open={true} placement={"top"} title={<Typography>Example tooltip</Typography>}>
          <Button color="primary">primary button</Button>
        </Tooltip>
        <Button color="secondary">secondary button</Button>
        <Button color="warning">warning button</Button>
        <Button color="info">info button</Button>
        <Button color="error">error button</Button>
        <Button disabled>disabled button</Button>
        <Typography color="primary">text with primary color</Typography>
        <Typography color="secondary">text with secondary color</Typography>
        <Typography color="error">text with error color</Typography>
        <TextField value={"Text field"} />
      </Paper>
      <br />
      <Typography>Warning: Editing the theme is very slow.</Typography>
      <ColorEditor
        name="primarylight"
        onColorChange={onColorChange}
        color={customTheme["primarylight"]}
        defaultColor={defaultSettings.theme["primarylight"]}
      />
      <ColorEditor
        name="primary"
        onColorChange={onColorChange}
        color={customTheme["primary"]}
        defaultColor={defaultSettings.theme["primary"]}
      />
      <ColorEditor
        name="primarydark"
        onColorChange={onColorChange}
        color={customTheme["primarydark"]}
        defaultColor={defaultSettings.theme["primarydark"]}
      />

      <br />
      <ColorEditor
        name="errorlight"
        onColorChange={onColorChange}
        color={customTheme["errorlight"]}
        defaultColor={defaultSettings.theme["errorlight"]}
      />
      <ColorEditor
        name="error"
        onColorChange={onColorChange}
        color={customTheme["error"]}
        defaultColor={defaultSettings.theme["error"]}
      />
      <ColorEditor
        name="errordark"
        onColorChange={onColorChange}
        color={customTheme["errordark"]}
        defaultColor={defaultSettings.theme["errordark"]}
      />

      <br />
      <ColorEditor
        name="secondarylight"
        onColorChange={onColorChange}
        color={customTheme["secondarylight"]}
        defaultColor={defaultSettings.theme["secondarylight"]}
      />
      <ColorEditor
        name="secondary"
        onColorChange={onColorChange}
        color={customTheme["secondary"]}
        defaultColor={defaultSettings.theme["secondary"]}
      />
      <ColorEditor
        name="secondarydark"
        onColorChange={onColorChange}
        color={customTheme["secondarydark"]}
        defaultColor={defaultSettings.theme["secondarydark"]}
      />

      <br />
      <ColorEditor
        name="warninglight"
        onColorChange={onColorChange}
        color={customTheme["warninglight"]}
        defaultColor={defaultSettings.theme["warninglight"]}
      />
      <ColorEditor
        name="warning"
        onColorChange={onColorChange}
        color={customTheme["warning"]}
        defaultColor={defaultSettings.theme["warning"]}
      />
      <ColorEditor
        name="warningdark"
        onColorChange={onColorChange}
        color={customTheme["warningdark"]}
        defaultColor={defaultSettings.theme["warningdark"]}
      />

      <br />
      <ColorEditor
        name="infolight"
        onColorChange={onColorChange}
        color={customTheme["infolight"]}
        defaultColor={defaultSettings.theme["infolight"]}
      />
      <ColorEditor
        name="info"
        onColorChange={onColorChange}
        color={customTheme["info"]}
        defaultColor={defaultSettings.theme["info"]}
      />
      <ColorEditor
        name="infodark"
        onColorChange={onColorChange}
        color={customTheme["infodark"]}
        defaultColor={defaultSettings.theme["infodark"]}
      />

      <br />
      <ColorEditor
        name="welllight"
        onColorChange={onColorChange}
        color={customTheme["welllight"]}
        defaultColor={defaultSettings.theme["welllight"]}
      />
      <ColorEditor
        name="well"
        onColorChange={onColorChange}
        color={customTheme["well"]}
        defaultColor={defaultSettings.theme["well"]}
      />
      <ColorEditor
        name="white"
        onColorChange={onColorChange}
        color={customTheme["white"]}
        defaultColor={defaultSettings.theme["white"]}
      />
      <ColorEditor
        name="black"
        onColorChange={onColorChange}
        color={customTheme["black"]}
        defaultColor={defaultSettings.theme["black"]}
      />
      <ColorEditor
        name="backgroundprimary"
        onColorChange={onColorChange}
        color={customTheme["backgroundprimary"]}
        defaultColor={defaultSettings.theme["backgroundprimary"]}
      />
      <ColorEditor
        name="backgroundsecondary"
        onColorChange={onColorChange}
        color={customTheme["backgroundsecondary"]}
        defaultColor={defaultSettings.theme["backgroundsecondary"]}
      />

      <br />
      <ColorEditor
        name="hp"
        onColorChange={onColorChange}
        color={customTheme["hp"]}
        defaultColor={defaultSettings.theme["hp"]}
      />
      <ColorEditor
        name="money"
        onColorChange={onColorChange}
        color={customTheme["money"]}
        defaultColor={defaultSettings.theme["money"]}
      />
      <ColorEditor
        name="hack"
        onColorChange={onColorChange}
        color={customTheme["hack"]}
        defaultColor={defaultSettings.theme["hack"]}
      />
      <ColorEditor
        name="combat"
        onColorChange={onColorChange}
        color={customTheme["combat"]}
        defaultColor={defaultSettings.theme["combat"]}
      />
      <ColorEditor
        name="cha"
        onColorChange={onColorChange}
        color={customTheme["cha"]}
        defaultColor={defaultSettings.theme["cha"]}
      />
      <ColorEditor
        name="int"
        onColorChange={onColorChange}
        color={customTheme["int"]}
        defaultColor={defaultSettings.theme["int"]}
      />
      <ColorEditor
        name="rep"
        onColorChange={onColorChange}
        color={customTheme["rep"]}
        defaultColor={defaultSettings.theme["rep"]}
      />
      <ColorEditor
        name="disabled"
        onColorChange={onColorChange}
        color={customTheme["disabled"]}
        defaultColor={defaultSettings.theme["disabled"]}
      />
      <br />
      <br />
      <TextField label={"import / export theme"} value={JSON.stringify(customTheme)} onChange={onThemeChange} />
    </Modal>
  );
}
