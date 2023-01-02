import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/React/Modal";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import ReplyIcon from "@mui/icons-material/Reply";
import SaveIcon from "@mui/icons-material/Save";

import { ThemeEvents } from "./Theme";
import { Settings } from "../../Settings/Settings";
import { defaultStyles } from "../Styles";
import { Tooltip } from "@mui/material";
import { IStyleSettings } from "@nsdefs";

interface IProps {
  open: boolean;
  onClose: () => void;
}

interface FontFamilyProps {
  value: React.CSSProperties["fontFamily"];
  onChange: (newValue: React.CSSProperties["fontFamily"], error?: string) => void;
  refreshId: number;
}

function FontFamilyField({ value, onChange, refreshId }: FontFamilyProps): React.ReactElement {
  const [errorText, setErrorText] = useState<string | undefined>();
  const [fontFamily, setFontFamily] = useState<React.CSSProperties["fontFamily"]>(value);

  function update(newValue: React.CSSProperties["fontFamily"]): void {
    setFontFamily(newValue);
    if (!newValue) {
      setErrorText("Must have a value");
    } else {
      setErrorText("");
    }
  }

  function onTextChange(event: React.ChangeEvent<HTMLInputElement>): void {
    update(event.target.value);
  }

  useEffect(() => onChange(fontFamily, errorText), [fontFamily]);
  useEffect(() => update(value), [refreshId]);

  return (
    <TextField
      sx={{ my: 1 }}
      label={"Font-Family"}
      error={!!errorText}
      value={fontFamily}
      helperText={errorText}
      onChange={onTextChange}
      fullWidth
    />
  );
}

interface LineHeightProps {
  value: React.CSSProperties["lineHeight"];
  onChange: (newValue: React.CSSProperties["lineHeight"], error?: string) => void;
  refreshId: number;
}

function LineHeightField({ value, onChange, refreshId }: LineHeightProps): React.ReactElement {
  const [errorText, setErrorText] = useState<string | undefined>();
  const [lineHeight, setLineHeight] = useState<React.CSSProperties["lineHeight"]>(value);

  function update(newValue: React.CSSProperties["lineHeight"]): void {
    setLineHeight(newValue);
    if (!newValue) {
      setErrorText("Must have a value");
    } else if (isNaN(Number(newValue))) {
      setErrorText("Must be a number");
    } else {
      setErrorText("");
    }
  }

  function onTextChange(event: React.ChangeEvent<HTMLInputElement>): void {
    update(event.target.value);
  }

  useEffect(() => onChange(lineHeight, errorText), [lineHeight]);
  useEffect(() => update(value), [refreshId]);

  return (
    <TextField
      sx={{ my: 1 }}
      label={"Line Height"}
      error={!!errorText}
      value={lineHeight}
      helperText={errorText}
      onChange={onTextChange}
    />
  );
}

export function StyleEditorModal(props: IProps): React.ReactElement {
  const [refreshId, setRefreshId] = useState<number>(0);
  const [error, setError] = useState<string | undefined>();
  const [customStyle, setCustomStyle] = useState<IStyleSettings>({
    ...Settings.styles,
  });

  function persistToSettings(styles: IStyleSettings): void {
    Object.assign(Settings.styles, styles);
    ThemeEvents.emit();
  }

  function saveStyles(): void {
    persistToSettings(customStyle);
  }

  function setDefaults(): void {
    const styles = { ...defaultStyles };
    setCustomStyle(styles);
    persistToSettings(styles);
    setRefreshId(refreshId + 1);
  }

  function update(styles: IStyleSettings, errorMessage?: string): void {
    setError(errorMessage);
    if (!errorMessage) {
      setCustomStyle(styles);
    }
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography variant="h6">Styles Editor</Typography>
      <Typography>
        WARNING: Changing styles <strong>may mess up</strong> the interface. Drastic changes are{" "}
        <strong>NOT recommended</strong>.
      </Typography>
      <Paper sx={{ p: 2, my: 2 }}>
        <FontFamilyField
          value={customStyle.fontFamily}
          refreshId={refreshId}
          onChange={(value, error) => update({ ...customStyle, fontFamily: value ?? "" }, error)}
        />
        <br />
        <LineHeightField
          value={customStyle.lineHeight}
          refreshId={refreshId}
          onChange={(value, error) => update({ ...customStyle, lineHeight: Number(value) ?? 0 }, error)}
        />
        <br />
        <ButtonGroup sx={{ my: 1 }}>
          <Button onClick={setDefaults} startIcon={<ReplyIcon />} color="secondary" variant="outlined">
            Revert to Defaults
          </Button>
          <Tooltip title={"Save styles to settings"}>
            <Button onClick={saveStyles} endIcon={<SaveIcon />} color={error ? "error" : "primary"} disabled={!!error}>
              Save Modifications
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Paper>
    </Modal>
  );
}
