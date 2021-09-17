import React, { useState, useEffect } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { getAvailableCreatePrograms } from "../ProgramHelpers";

import { Box, ButtonGroup, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button";

interface IProps {
  player: IPlayer;
}

export function ProgramsRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div>
        <Box>
          <Typography>
            This page displays any programs that you are able to create. Writing the code for a program takes time, which
            can vary based on how complex the program is. If you are working on creating a program you can cancel at any
            time. Your progress will be saved and you can continue later.
          </Typography>
        </Box>
        <ButtonGroup>
          {getAvailableCreatePrograms(props.player).map((program) => {
            const create = program.create;
            if (create === null) return <></>;

            return (
              <Tooltip title={create.tooltip}>
                <Button onClick={() => props.player.startCreateProgramWork(program.name, create.time, create.level)}>
                {program.name}
                </Button>
              </Tooltip>
            )
          })}
        </ButtonGroup>
      </div>
    </>
  )
}
