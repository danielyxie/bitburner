import React, { useState } from "react";
import { Modal } from "../../ui/React/Modal";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ReplyIcon from "@mui/icons-material/Reply";
import PaletteSharpIcon from "@mui/icons-material/PaletteSharp";
import HistoryIcon from "@mui/icons-material/History";
import { Color, ColorPicker } from "material-ui-color";
import { ThemeEvents } from "./Theme";
import { Settings } from "../../Settings/Settings";
import { defaultTheme } from "../Themes";
import { UserInterfaceTheme } from "@nsdefs";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { ThemeCollaborate } from "./ThemeCollaborate";

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
                deferred
                value={color}
                onChange={(newColor: Color) => onColorChange(name, "#" + newColor.hex)}
                disableAlpha
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

  function setTheme(theme: UserInterfaceTheme): void {
    setCustomTheme(theme);
    Object.assign(Settings.theme, theme);
    ThemeEvents.emit();
  }

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
    setCustomTheme((old: { [key: string]: string | undefined }) => {
      old[name] = value;
      return old;
    });

    Settings.theme[name] = value;
    ThemeEvents.emit();
  }

  function setTemplateTheme(theme: UserInterfaceTheme): void {
    setTheme(theme);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Paper sx={{ px: 1, py: 1, my: 1 }}>
        <Tooltip open={true} placement={"top"} title={<Typography>Example tooltip</Typography>}>
          <Button color="primary" size="small">
            primary button
          </Button>
        </Tooltip>
        <Button color="secondary" size="small">
          secondary button
        </Button>
        <Button color="warning" size="small">
          warning button
        </Button>
        <Button color="info" size="small">
          info button
        </Button>
        <Button color="error" size="small">
          error button
        </Button>
        <Button disabled size="small">
          disabled button
        </Button>
        <br />
        <Typography color="primary" variant="caption">
          text with primary color
        </Typography>
        &nbsp;
        <Typography color="secondary" variant="caption">
          text with secondary color
        </Typography>
        &nbsp;
        <Typography color="error" variant="caption">
          text with error color
        </Typography>
        <br />
        <TextField value={"Text field"} size="small" />
      </Paper>

      <Paper sx={{ py: 1, my: 1 }}>
        <ColorEditor
          name="primarylight"
          onColorChange={onColorChange}
          color={customTheme["primarylight"]}
          defaultColor={defaultTheme["primarylight"]}
        />
        <ColorEditor
          name="primary"
          onColorChange={onColorChange}
          color={customTheme["primary"]}
          defaultColor={defaultTheme["primary"]}
        />
        <ColorEditor
          name="primarydark"
          onColorChange={onColorChange}
          color={customTheme["primarydark"]}
          defaultColor={defaultTheme["primarydark"]}
        />

        <br />
        <ColorEditor
          name="successlight"
          onColorChange={onColorChange}
          color={customTheme["successlight"]}
          defaultColor={defaultTheme["successlight"]}
        />
        <ColorEditor
          name="success"
          onColorChange={onColorChange}
          color={customTheme["success"]}
          defaultColor={defaultTheme["success"]}
        />
        <ColorEditor
          name="successdark"
          onColorChange={onColorChange}
          color={customTheme["successdark"]}
          defaultColor={defaultTheme["successdark"]}
        />

        <br />
        <ColorEditor
          name="errorlight"
          onColorChange={onColorChange}
          color={customTheme["errorlight"]}
          defaultColor={defaultTheme["errorlight"]}
        />
        <ColorEditor
          name="error"
          onColorChange={onColorChange}
          color={customTheme["error"]}
          defaultColor={defaultTheme["error"]}
        />
        <ColorEditor
          name="errordark"
          onColorChange={onColorChange}
          color={customTheme["errordark"]}
          defaultColor={defaultTheme["errordark"]}
        />

        <br />
        <ColorEditor
          name="secondarylight"
          onColorChange={onColorChange}
          color={customTheme["secondarylight"]}
          defaultColor={defaultTheme["secondarylight"]}
        />
        <ColorEditor
          name="secondary"
          onColorChange={onColorChange}
          color={customTheme["secondary"]}
          defaultColor={defaultTheme["secondary"]}
        />
        <ColorEditor
          name="secondarydark"
          onColorChange={onColorChange}
          color={customTheme["secondarydark"]}
          defaultColor={defaultTheme["secondarydark"]}
        />

        <br />
        <ColorEditor
          name="warninglight"
          onColorChange={onColorChange}
          color={customTheme["warninglight"]}
          defaultColor={defaultTheme["warninglight"]}
        />
        <ColorEditor
          name="warning"
          onColorChange={onColorChange}
          color={customTheme["warning"]}
          defaultColor={defaultTheme["warning"]}
        />
        <ColorEditor
          name="warningdark"
          onColorChange={onColorChange}
          color={customTheme["warningdark"]}
          defaultColor={defaultTheme["warningdark"]}
        />

        <br />
        <ColorEditor
          name="infolight"
          onColorChange={onColorChange}
          color={customTheme["infolight"]}
          defaultColor={defaultTheme["infolight"]}
        />
        <ColorEditor
          name="info"
          onColorChange={onColorChange}
          color={customTheme["info"]}
          defaultColor={defaultTheme["info"]}
        />
        <ColorEditor
          name="infodark"
          onColorChange={onColorChange}
          color={customTheme["infodark"]}
          defaultColor={defaultTheme["infodark"]}
        />

        <br />
        <ColorEditor
          name="welllight"
          onColorChange={onColorChange}
          color={customTheme["welllight"]}
          defaultColor={defaultTheme["welllight"]}
        />
        <ColorEditor
          name="well"
          onColorChange={onColorChange}
          color={customTheme["well"]}
          defaultColor={defaultTheme["well"]}
        />
        <ColorEditor
          name="white"
          onColorChange={onColorChange}
          color={customTheme["white"]}
          defaultColor={defaultTheme["white"]}
        />
        <ColorEditor
          name="black"
          onColorChange={onColorChange}
          color={customTheme["black"]}
          defaultColor={defaultTheme["black"]}
        />
        <ColorEditor
          name="backgroundprimary"
          onColorChange={onColorChange}
          color={customTheme["backgroundprimary"]}
          defaultColor={defaultTheme["backgroundprimary"]}
        />
        <ColorEditor
          name="backgroundsecondary"
          onColorChange={onColorChange}
          color={customTheme["backgroundsecondary"]}
          defaultColor={defaultTheme["backgroundsecondary"]}
        />
        <ColorEditor
          name="button"
          onColorChange={onColorChange}
          color={customTheme["button"]}
          defaultColor={defaultTheme["button"]}
        />

        <br />
        <ColorEditor
          name="hp"
          onColorChange={onColorChange}
          color={customTheme["hp"]}
          defaultColor={defaultTheme["hp"]}
        />
        <ColorEditor
          name="money"
          onColorChange={onColorChange}
          color={customTheme["money"]}
          defaultColor={defaultTheme["money"]}
        />
        <ColorEditor
          name="hack"
          onColorChange={onColorChange}
          color={customTheme["hack"]}
          defaultColor={defaultTheme["hack"]}
        />
        <ColorEditor
          name="combat"
          onColorChange={onColorChange}
          color={customTheme["combat"]}
          defaultColor={defaultTheme["combat"]}
        />
        <ColorEditor
          name="cha"
          onColorChange={onColorChange}
          color={customTheme["cha"]}
          defaultColor={defaultTheme["cha"]}
        />
        <ColorEditor
          name="int"
          onColorChange={onColorChange}
          color={customTheme["int"]}
          defaultColor={defaultTheme["int"]}
        />
        <ColorEditor
          name="rep"
          onColorChange={onColorChange}
          color={customTheme["rep"]}
          defaultColor={defaultTheme["rep"]}
        />
        <ColorEditor
          name="disabled"
          onColorChange={onColorChange}
          color={customTheme["disabled"]}
          defaultColor={defaultTheme["disabled"]}
        />
      </Paper>

      <Paper sx={{ px: 1, py: 1, my: 1 }}>
        <TextField
          sx={{ mb: 1 }}
          multiline
          fullWidth
          maxRows={10}
          label={"import / export theme"}
          value={JSON.stringify(customTheme, undefined, 2)}
          onChange={onThemeChange}
        />
        <>
          <Typography sx={{ my: 1 }}>Backup your theme or share it with others by copying the string above.</Typography>
          <ThemeCollaborate />
          <ButtonGroup>
            <Tooltip title="Reverts all modification back to the default theme. This is permanent.">
              <Button onClick={() => setTemplateTheme(defaultTheme)} startIcon={<HistoryIcon />}>
                Revert to Default
              </Button>
            </Tooltip>
            <Tooltip title="Move over to the theme browser's page to use one of our predefined themes.">
              <Button startIcon={<PaletteSharpIcon />} onClick={() => Router.toPage(Page.ThemeBrowser)}>
                See more themes
              </Button>
            </Tooltip>
          </ButtonGroup>
        </>
      </Paper>
    </Modal>
  );
}
