import React, { useState } from "react";
import { MenuItem, Select, SelectChangeEvent, TextField, Tooltip, Typography } from "@mui/material";
import { Settings } from "../../Settings/Settings";
import { OptionSwitch } from "../../ui/React/OptionSwitch";
import { GameOptionsPage } from "./GameOptionsPage";
import { formatTime } from "../../utils/helpers/formatTime";

export const InterfacePage = (): React.ReactElement => {
  const [timestampFormat, setTimestampFormat] = useState(Settings.TimestampsFormat);
  const [locale, setLocale] = useState(Settings.Locale);

  function handleLocaleChange(event: SelectChangeEvent<string>): void {
    setLocale(event.target.value);
    Settings.Locale = event.target.value;
  }
  function handleTimestampFormatChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setTimestampFormat(event.target.value);
    Settings.TimestampsFormat = event.target.value;
  }
  return (
    <GameOptionsPage title="Interface">
      <OptionSwitch
        checked={Settings.DisableASCIIArt}
        onChange={(newValue) => (Settings.DisableASCIIArt = newValue)}
        text="Disable ascii art"
        tooltip={<>If this is set all ASCII art will be disabled.</>}
      />
      <OptionSwitch
        checked={Settings.DisableTextEffects}
        onChange={(newValue) => (Settings.DisableTextEffects = newValue)}
        text="Disable text effects"
        tooltip={
          <>
            If this is set, text effects will not be displayed. This can help if text is difficult to read in certain
            areas.
          </>
        }
      />
      <OptionSwitch
        checked={Settings.DisableOverviewProgressBars}
        onChange={(newValue) => (Settings.DisableOverviewProgressBars = newValue)}
        text="Disable Overview Progress Bars"
        tooltip={<>If this is set, the progress bars in the character overview will be hidden.</>}
      />
      <OptionSwitch
        checked={Settings.UseIEC60027_2}
        onChange={(newValue) => (Settings.UseIEC60027_2 = newValue)}
        text="Use GiB instead of GB"
        tooltip={
          <>If this is set all references to memory will use GiB instead of GB, in accordance with IEC 60027-2.</>
        }
      />
      <Tooltip
        title={
          <Typography>
            Terminal commands and log entries will be timestamped. See https://date-fns.org/docs/Getting-Started/
          </Typography>
        }
      >
        <TextField
          key={"timestampFormat"}
          InputProps={{
            startAdornment: (
              <Typography
                color={formatTime(timestampFormat) === "format error" && timestampFormat !== "" ? "error" : "success"}
              >
                Timestamp format:
              </Typography>
            ),
          }}
          value={timestampFormat}
          onChange={handleTimestampFormatChange}
          placeholder="yyyy-MM-dd hh:mm:ss"
        />
      </Tooltip>
      <>
        <Tooltip title={<Typography>Sets the locale for displaying numbers.</Typography>}>
          <Typography>Locale</Typography>
        </Tooltip>
        <Select value={locale} onChange={handleLocaleChange}>
          <MenuItem value="en">en</MenuItem>
          <MenuItem value="bg">bg</MenuItem>
          <MenuItem value="cs">cs</MenuItem>
          <MenuItem value="da-dk">da-dk</MenuItem>
          <MenuItem value="de">de</MenuItem>
          <MenuItem value="en-au">en-au</MenuItem>
          <MenuItem value="en-gb">en-gb</MenuItem>
          <MenuItem value="es">es</MenuItem>
          <MenuItem value="fr">fr</MenuItem>
          <MenuItem value="hu">hu</MenuItem>
          <MenuItem value="it">it</MenuItem>
          <MenuItem value="lv">lv</MenuItem>
          <MenuItem value="no">no</MenuItem>
          <MenuItem value="pl">pl</MenuItem>
          <MenuItem value="ru">ru</MenuItem>
        </Select>
      </>
    </GameOptionsPage>
  );
};
