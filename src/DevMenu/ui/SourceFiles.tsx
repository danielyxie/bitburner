import React from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Button } from "../../ui/React/Button";
import { PlayerOwnedSourceFile } from "../../SourceFile/PlayerOwnedSourceFile";
import { IPlayer } from "../../PersonObjects/IPlayer";
import ButtonGroup from "@material-ui/core/ButtonGroup";

// Update as additional BitNodes get implemented
const validSFN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function SourceFiles(props: IProps): React.ReactElement {
  function setSF(sfN: number, sfLvl: number) {
    return function () {
      if (sfLvl === 0) {
        props.player.sourceFiles = props.player.sourceFiles.filter((sf) => sf.n !== sfN);
        return;
      }

      if (!props.player.sourceFiles.some((sf) => sf.n === sfN)) {
        props.player.sourceFiles.push(new PlayerOwnedSourceFile(sfN, sfLvl));
        return;
      }

      for (let i = 0; i < props.player.sourceFiles.length; i++) {
        if (props.player.sourceFiles[i].n === sfN) {
          props.player.sourceFiles[i].lvl = sfLvl;
        }
      }
    };
  }

  function setAllSF(sfLvl: number) {
    return () => {
      for (let i = 0; i < validSFN.length; i++) {
        setSF(validSFN[i], sfLvl)();
      }
    };
  }

  function clearExploits(): void {
    props.player.exploits = [];
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Source-Files</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text">Exploits:</span>
              </td>
              <td>
                <Button onClick={clearExploits}>Clear</Button>
              </td>
            </tr>
            <tr key={"sf-all"}>
              <td>
                <span className="text">All:</span>
              </td>
              <td>
                <ButtonGroup>
                  <Button onClick={setAllSF(0)}>0</Button>
                  <Button onClick={setAllSF(1)}>1</Button>
                  <Button onClick={setAllSF(2)}>2</Button>
                  <Button onClick={setAllSF(3)}>3</Button>
                </ButtonGroup>
              </td>
            </tr>
            {validSFN.map((i) => (
              <tr key={"sf-" + i}>
                <td>
                  <span className="text">SF-{i}:</span>
                </td>
                <td>
                  <ButtonGroup>
                    <Button onClick={setSF(i, 0)}>0</Button>
                    <Button onClick={setSF(i, 1)}>1</Button>
                    <Button onClick={setSF(i, 2)}>2</Button>
                    <Button onClick={setSF(i, 3)}>3</Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
