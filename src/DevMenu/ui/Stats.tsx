import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Button from "@mui/material/Button";
import { Adjuster } from "./Adjuster";
import { IPlayer } from "../../PersonObjects/IPlayer";

const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function Stats(props: IProps): React.ReactElement {
  function modifyExp(stat: string, modifier: number) {
    return function (exp: number) {
      switch (stat) {
        case "hacking":
          if (exp) {
            props.player.gainHackingExp(exp * modifier);
          }
          break;
        case "strength":
          if (exp) {
            props.player.gainStrengthExp(exp * modifier);
          }
          break;
        case "defense":
          if (exp) {
            props.player.gainDefenseExp(exp * modifier);
          }
          break;
        case "dexterity":
          if (exp) {
            props.player.gainDexterityExp(exp * modifier);
          }
          break;
        case "agility":
          if (exp) {
            props.player.gainAgilityExp(exp * modifier);
          }
          break;
        case "charisma":
          if (exp) {
            props.player.gainCharismaExp(exp * modifier);
          }
          break;
        case "intelligence":
          if (exp) {
            props.player.gainIntelligenceExp(exp * modifier);
          }
          break;
      }
      props.player.updateSkillLevels();
    };
  }

  function modifyKarma(modifier: number) {
    return function (amt: number) {
      props.player.karma += amt * modifier;
    };
  }

  function tonsOfExp(): void {
    props.player.gainHackingExp(bigNumber);
    props.player.gainStrengthExp(bigNumber);
    props.player.gainDefenseExp(bigNumber);
    props.player.gainDexterityExp(bigNumber);
    props.player.gainAgilityExp(bigNumber);
    props.player.gainCharismaExp(bigNumber);
    props.player.gainIntelligenceExp(bigNumber);
    props.player.updateSkillLevels();
  }

  function resetAllExp(): void {
    props.player.hacking_exp = 0;
    props.player.strength_exp = 0;
    props.player.defense_exp = 0;
    props.player.dexterity_exp = 0;
    props.player.agility_exp = 0;
    props.player.charisma_exp = 0;
    props.player.intelligence_exp = 0;
    props.player.updateSkillLevels();
  }

  function resetExperience(stat: string): () => void {
    return function () {
      switch (stat) {
        case "hacking":
          props.player.hacking_exp = 0;
          break;
        case "strength":
          props.player.strength_exp = 0;
          break;
        case "defense":
          props.player.defense_exp = 0;
          break;
        case "dexterity":
          props.player.dexterity_exp = 0;
          break;
        case "agility":
          props.player.agility_exp = 0;
          break;
        case "charisma":
          props.player.charisma_exp = 0;
          break;
        case "intelligence":
          props.player.intelligence_exp = 0;
          break;
      }
      props.player.updateSkillLevels();
    };
  }

  function resetKarma(): () => void {
    return function () {
      props.player.karma = 0;
    };
  }

  function enableIntelligence(): void {
    if (props.player.intelligence === 0) {
      props.player.intelligence = 1;
      props.player.updateSkillLevels();
    }
  }

  function disableIntelligence(): void {
    props.player.intelligence_exp = 0;
    props.player.intelligence = 0;
    props.player.updateSkillLevels();
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Experience / Stats</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text text-center">All:</span>
              </td>
              <td>
                <Button onClick={tonsOfExp}>Tons of exp</Button>
                <Button onClick={resetAllExp}>Reset</Button>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text text-center">Hacking:</span>
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
                <span className="text text-center">Strength:</span>
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
                <span className="text text-center">Defense:</span>
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
                <span className="text text-center">Dexterity:</span>
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
                <span className="text text-center">Agility:</span>
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
                <span className="text text-center">Charisma:</span>
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
                <span className="text text-center">Intelligence:</span>
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
                <span className="text text-center">Karma:</span>
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
