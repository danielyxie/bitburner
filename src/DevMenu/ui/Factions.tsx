import React, { useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import { Adjuster } from "./Adjuster";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Factions as AllFaction } from "../../Faction/Factions";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import ReplyIcon from "@material-ui/icons/Reply";
import InputLabel from "@material-ui/core/InputLabel";

const bigNumber = 1e12;

interface IProps {
  player: IPlayer;
}

export function Factions(props: IProps): React.ReactElement {
  const [faction, setFaction] = useState("Illuminati");

  function setFactionDropdown(event: React.ChangeEvent<{ value: unknown }>): void {
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
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Factions</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text">Faction:</span>
              </td>
              <td>
                <FormControl>
                  <InputLabel id="factions-select">Faction</InputLabel>
                  <Select
                    labelId="factions-select"
                    id="factions-dropdown"
                    className="dropdown exp-input"
                    onChange={setFactionDropdown}
                    value={faction}
                    startAdornment={
                      <>
                        <IconButton color="primary" onClick={receiveAllInvites}>
                          <ReplyAllIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={receiveInvite}>
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
                <span className="text">Reputation:</span>
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
                <span className="text">Favor:</span>
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
                <span className="text">All Reputation:</span>
              </td>
              <td>
                <Button onClick={tonsOfRep}>Tons</Button>
                <Button onClick={resetAllRep}>Reset</Button>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text">All Favor:</span>
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
