import React, { useState, useEffect } from "react";
import { find } from "lodash";

import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Check, Lock, Create } from "@mui/icons-material";

import { use } from "../../ui/Context";
import { Settings } from "../../Settings/Settings";

import { Programs } from "../Programs";
import { CreateProgramWork } from "../../Work/CreateProgramWork";

export const ProgramsSeen: string[] = [];

export function ProgramsRoot(): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  const programs = [...Object.values(Programs)]
    .filter((prog) => {
      const create = prog.create;
      if (create === null) return false;
      if (prog.name === "b1t_flum3.exe") {
        return create.req(player);
      }
      return true;
    })
    .sort((a, b) => {
      if (player.hasProgram(a.name)) return 1;
      if (player.hasProgram(b.name)) return -1;
      return (a.create?.level ?? 0) - (b.create?.level ?? 0);
    });

  useEffect(() => {
    programs.forEach((p) => {
      if (ProgramsSeen.includes(p.name)) return;
      ProgramsSeen.push(p.name);
    });
  }, []);

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  const getHackingLevelRemaining = (lvl: number): number => {
    return Math.ceil(Math.max(lvl - (player.skills.hacking + player.skills.intelligence / 2), 0));
  };

  const getProgCompletion = (name: string): number => {
    const programFile = find(player.getHomeComputer().programs, (p) => {
      return p.startsWith(name) && p.endsWith("%-INC");
    });
    if (!programFile) return -1;

    const res = programFile.split("-");
    if (res.length != 3) return -1;
    const percComplete = Number(res[1].slice(0, -1));
    if (isNaN(percComplete) || percComplete < 0 || percComplete >= 100) {
      return -1;
    }
    return percComplete;
  };

  return (
    <Container disableGutters maxWidth="lg" sx={{ mx: 0, mb: 10 }}>
      <Typography variant="h4">Create program</Typography>
      <Typography>
        This page displays any programs that you are able to create. Writing the code for a program takes time, which
        can vary based on how complex the program is. If you are working on creating a program you can cancel at any
        time. Your progress will be saved and you can continue later.
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", my: 1 }}>
        {programs.map((program) => {
          const create = program.create;
          if (create === null) return <></>;
          const curCompletion = getProgCompletion(program.name);

          return (
            <Box
              component={Paper}
              sx={{ p: 1, opacity: player.hasProgram(program.name) ? 0.75 : 1 }}
              key={program.name}
            >
              <>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  {(player.hasProgram(program.name) && <Check sx={{ mr: 1 }} />) ||
                    (create.req(player) && <Create sx={{ mr: 1 }} />) || <Lock sx={{ mr: 1 }} />}
                  {program.name}
                </Typography>
                {!player.hasProgram(program.name) && create.req(player) && (
                  <Button
                    sx={{ my: 1, width: "100%" }}
                    onClick={(event) => {
                      if (!event.isTrusted) return;
                      player.startWork(
                        new CreateProgramWork({ player: player, singularity: false, programName: program.name }),
                      );
                      player.startFocusing();
                      router.toWork();
                    }}
                  >
                    Create program
                  </Button>
                )}
                {player.hasProgram(program.name) || getHackingLevelRemaining(create.level) === 0 || (
                  <Typography color={Settings.theme.hack}>
                    <b>Unlocks in:</b> {getHackingLevelRemaining(create.level)} hacking levels
                  </Typography>
                )}
                {curCompletion !== -1 && (
                  <Typography color={Settings.theme.infolight}>
                    <b>Current completion:</b> {curCompletion}%
                  </Typography>
                )}
                <Typography>{create.tooltip}</Typography>
              </>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
