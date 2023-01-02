import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Adjuster } from "./Adjuster";
import { Player } from "@player";

const bigNumber = 1e27;

export function Stats(): React.ReactElement {
  function modifyExp(stat: string, modifier: number) {
    return function (exp: number) {
      switch (stat) {
        case "hacking":
          if (exp) {
            Player.gainHackingExp(exp * modifier);
          }
          break;
        case "strength":
          if (exp) {
            Player.gainStrengthExp(exp * modifier);
          }
          break;
        case "defense":
          if (exp) {
            Player.gainDefenseExp(exp * modifier);
          }
          break;
        case "dexterity":
          if (exp) {
            Player.gainDexterityExp(exp * modifier);
          }
          break;
        case "agility":
          if (exp) {
            Player.gainAgilityExp(exp * modifier);
          }
          break;
        case "charisma":
          if (exp) {
            Player.gainCharismaExp(exp * modifier);
          }
          break;
        case "intelligence":
          if (exp) {
            Player.gainIntelligenceExp(exp * modifier);
          }
          break;
      }
      Player.updateSkillLevels();
    };
  }

  function modifyKarma(modifier: number) {
    return function (amt: number) {
      Player.karma += amt * modifier;
    };
  }

  function tonsOfExp(): void {
    Player.gainHackingExp(bigNumber);
    Player.gainStrengthExp(bigNumber);
    Player.gainDefenseExp(bigNumber);
    Player.gainDexterityExp(bigNumber);
    Player.gainAgilityExp(bigNumber);
    Player.gainCharismaExp(bigNumber);
    Player.gainIntelligenceExp(bigNumber);
    Player.updateSkillLevels();
  }

  function resetAllExp(): void {
    Player.exp.hacking = 0;
    Player.exp.strength = 0;
    Player.exp.defense = 0;
    Player.exp.dexterity = 0;
    Player.exp.agility = 0;
    Player.exp.charisma = 0;
    Player.exp.intelligence = 0;
    Player.updateSkillLevels();
  }

  function resetExperience(stat: string): () => void {
    return function () {
      switch (stat) {
        case "hacking":
          Player.exp.hacking = 0;
          break;
        case "strength":
          Player.exp.strength = 0;
          break;
        case "defense":
          Player.exp.defense = 0;
          break;
        case "dexterity":
          Player.exp.dexterity = 0;
          break;
        case "agility":
          Player.exp.agility = 0;
          break;
        case "charisma":
          Player.exp.charisma = 0;
          break;
        case "intelligence":
          Player.exp.intelligence = 0;
          break;
      }
      Player.updateSkillLevels();
    };
  }

  function resetKarma(): () => void {
    return function () {
      Player.karma = 0;
    };
  }

  function enableIntelligence(): void {
    if (Player.skills.intelligence === 0) {
      Player.skills.intelligence = 1;
      Player.updateSkillLevels();
    }
  }

  function disableIntelligence(): void {
    Player.exp.intelligence = 0;
    Player.skills.intelligence = 0;
    Player.updateSkillLevels();
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Experience / Stats</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>All:</Typography>
              </td>
              <td>
                <Button onClick={tonsOfExp}>Tons of exp</Button>
                <Button onClick={resetAllExp}>Reset</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Hacking:</Typography>
              </td>
              <td>
                <Adjuster
                  label="hacking"
                  placeholder="exp"
                  tons={() => modifyExp("hacking", 1)(bigNumber)}
                  add={modifyExp("hacking", 1)}
                  subtract={modifyExp("hacking", -1)}
                  reset={resetExperience("hacking")}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Strength:</Typography>
              </td>
              <td>
                <Adjuster
                  label="strength"
                  placeholder="exp"
                  tons={() => modifyExp("strength", 1)(bigNumber)}
                  add={modifyExp("strength", 1)}
                  subtract={modifyExp("strength", -1)}
                  reset={resetExperience("strength")}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Defense:</Typography>
              </td>
              <td>
                <Adjuster
                  label="defense"
                  placeholder="exp"
                  tons={() => modifyExp("defense", 1)(bigNumber)}
                  add={modifyExp("defense", 1)}
                  subtract={modifyExp("defense", -1)}
                  reset={resetExperience("defense")}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Dexterity:</Typography>
              </td>
              <td>
                <Adjuster
                  label="dexterity"
                  placeholder="exp"
                  tons={() => modifyExp("dexterity", 1)(bigNumber)}
                  add={modifyExp("dexterity", 1)}
                  subtract={modifyExp("dexterity", -1)}
                  reset={resetExperience("dexterity")}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Agility:</Typography>
              </td>
              <td>
                <Adjuster
                  label="agility"
                  placeholder="exp"
                  tons={() => modifyExp("agility", 1)(bigNumber)}
                  add={modifyExp("agility", 1)}
                  subtract={modifyExp("agility", -1)}
                  reset={resetExperience("agility")}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Charisma:</Typography>
              </td>
              <td>
                <Adjuster
                  label="charisma"
                  placeholder="exp"
                  tons={() => modifyExp("charisma", 1)(bigNumber)}
                  add={modifyExp("charisma", 1)}
                  subtract={modifyExp("charisma", -1)}
                  reset={resetExperience("charisma")}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Intelligence:</Typography>
              </td>
              <td>
                <Adjuster
                  label="intelligence"
                  placeholder="exp"
                  tons={() => modifyExp("intelligence", 1)(bigNumber)}
                  add={modifyExp("intelligence", 1)}
                  subtract={modifyExp("intelligence", -1)}
                  reset={resetExperience("intelligence")}
                />
              </td>
              <td>
                <Button onClick={enableIntelligence}>Enable</Button>
              </td>
              <td>
                <Button onClick={disableIntelligence}>Disable</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Karma:</Typography>
              </td>
              <td>
                <Adjuster
                  label="karma"
                  placeholder="amt"
                  tons={() => modifyExp("intelligence", 1)(100000)}
                  add={modifyKarma(1)}
                  subtract={modifyKarma(-1)}
                  reset={resetKarma()}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
