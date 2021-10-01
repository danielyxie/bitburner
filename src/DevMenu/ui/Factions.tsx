import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Adjuster } from "./Adjuster";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Factions as AllFaction } from "../../Faction/Factions";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import ReplyIcon from "@mui/icons-material/Reply";
import InputLabel from "@mui/material/InputLabel";

const bigNumber = 1e12;

interface IProps {
  player: IPlayer;
}

export function Factions(props: IProps): React.ReactElement {
  const [faction, setFaction] = useState("Illuminati");

  function setFactionDropdown(event: SelectChangeEvent<string>): void {
    setFaction(event.target.value as string);
  }

  function receiveInvite(): void {
    props.player.receiveInvite(faction);
  }

  function receiveAllInvites(): void {
    for (const i in AllFaction) {
      props.player.receiveInvite(AllFaction[i].name);
    }
  }

  function modifyFactionRep(modifier: number): (x: number) => void {
    return function (reputation: number): void {
      const fac = AllFaction[faction];
      if (fac != null && !isNaN(reputation)) {
        fac.playerReputation += reputation * modifier;
      }
    };
  }

  function resetFactionRep(): void {
    const fac = AllFaction[faction];
    if (fac != null) {
      fac.playerReputation = 0;
    }
  }

  function modifyFactionFavor(modifier: number): (x: number) => void {
    return function (favor: number): void {
      const fac = AllFaction[faction];
      if (fac != null && !isNaN(favor)) {
        fac.favor += favor * modifier;
      }
    };
  }

  function resetFactionFavor(): void {
    const fac = AllFaction[faction];
    if (fac != null) {
      fac.favor = 0;
    }
  }

  function tonsOfRep(): void {
    for (const i in AllFaction) {
      AllFaction[i].playerReputation = bigNumber;
    }
  }

  function resetAllRep(): void {
    for (const i in AllFaction) {
      AllFaction[i].playerReputation = 0;
    }
  }

  function tonsOfFactionFavor(): void {
    for (const i in AllFaction) {
      AllFaction[i].favor = bigNumber;
    }
  }

  function resetAllFactionFavor(): void {
    for (const i in AllFaction) {
      AllFaction[i].favor = 0;
    }
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Factions</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Faction:</Typography>
              </td>
              <td>
                <FormControl>
                  <InputLabel id="factions-select">Faction</InputLabel>
                  <Select
                    labelId="factions-select"
                    id="factions-dropdown"
                    onChange={setFactionDropdown}
                    value={faction}
                    startAdornment={
                      <>
                        <IconButton onClick={receiveAllInvites} size="large" arial-label="receive-all-invitation">
                          <ReplyAllIcon />
                        </IconButton>
                        <IconButton onClick={receiveInvite} size="large" arial-label="receive-one-invitation">
                          <ReplyIcon />
                        </IconButton>
                      </>
                    }
                  >
                    {Object.values(AllFaction).map((faction) => (
                      <MenuItem key={faction.name} value={faction.name}>
                        {faction.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Reputation:</Typography>
              </td>
              <td>
                <Adjuster
                  label="reputation"
                  placeholder="amt"
                  tons={() => modifyFactionRep(1)(bigNumber)}
                  add={modifyFactionRep(1)}
                  subtract={modifyFactionRep(-1)}
                  reset={resetFactionRep}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Favor:</Typography>
              </td>
              <td>
                <Adjuster
                  label="favor"
                  placeholder="amt"
                  tons={() => modifyFactionFavor(1)(2000)}
                  add={modifyFactionFavor(1)}
                  subtract={modifyFactionFavor(-1)}
                  reset={resetFactionFavor}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>All Reputation:</Typography>
              </td>
              <td>
                <Button onClick={tonsOfRep}>Tons</Button>
                <Button onClick={resetAllRep}>Reset</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>All Favor:</Typography>
              </td>
              <td>
                <Button onClick={tonsOfFactionFavor}>Tons</Button>
                <Button onClick={resetAllFactionFavor}>Reset</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
