import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { PlayerOwnedSourceFile } from "../../SourceFile/PlayerOwnedSourceFile";
import { IPlayer } from "../../PersonObjects/IPlayer";
import ButtonGroup from "@mui/material/ButtonGroup";

// Update as additional BitNodes get implemented
const validSFN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Source-Files</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Exploits:</Typography>
              </td>
              <td>
                <Button onClick={clearExploits}>Clear</Button>
              </td>
            </tr>
            <tr key={"sf-all"}>
              <td>
                <Typography>All:</Typography>
              </td>
              <td>
                <ButtonGroup>
                  <Button aria-label="all-sf-0" onClick={setAllSF(0)}>
                    0
                  </Button>
                  <Button aria-label="all-sf-1" onClick={setAllSF(1)}>
                    1
                  </Button>
                  <Button aria-label="all-sf-2" onClick={setAllSF(2)}>
                    2
                  </Button>
                  <Button aria-label="all-sf-3" onClick={setAllSF(3)}>
                    3
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
            {validSFN.map((i) => (
              <tr key={"sf-" + i}>
                <td>
                  <Typography>SF-{i}:</Typography>
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
