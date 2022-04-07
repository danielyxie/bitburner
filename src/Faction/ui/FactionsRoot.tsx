import React, { useEffect, useState } from "react";

import { Box, Button, Container, Paper, TableBody, TableRow, Typography } from "@mui/material";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { Table, TableCell } from "../../ui/React/Table";
import { IRouter } from "../../ui/Router";

import { Faction } from "../Faction";
import { joinFaction, getFactionAugmentationsFiltered } from "../FactionHelpers";
import { Factions } from "../Factions";
import { FactionNames } from "../data/FactionNames";

export const InvitationsSeen: string[] = [];

interface IProps {
  player: IPlayer;
  router: IRouter;
}

export function FactionsRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    props.player.factionInvitations.forEach((faction) => {
      if (InvitationsSeen.includes(faction)) return;
      InvitationsSeen.push(faction);
    });
  }, []);

  function openFaction(faction: Faction): void {
    props.router.toFaction(faction);
  }

  function openFactionAugPage(faction: Faction): void {
    props.router.toFaction(faction, true);
  }

  function acceptInvitation(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, faction: string): void {
    if (!event.isTrusted) return;
    joinFaction(Factions[faction]);
    setRerender((x) => !x);
  }

  const getAugsLeft = (faction: Faction, player: IPlayer): number => {
    const augs = getFactionAugmentationsFiltered(player, faction);

    return augs.filter((augmentation: string) => !player.hasAugmentation(augmentation)).length;
  };

  const allFactions = Object.values(FactionNames).map((faction) => faction as string);
  const allJoinedFactions = props.player.factions.slice(0);
  allJoinedFactions.sort((a, b) => allFactions.indexOf(a) - allFactions.indexOf(b));

  return (
    <Container disableGutters maxWidth="md" sx={{ mx: 0, mb: 10 }}>
      <Typography variant="h4">Factions</Typography>
      <Typography mb={4}>
        Throughout the game you may receive invitations from factions. There are many different factions, and each
        faction has different criteria for determining its potential members. Joining a faction and furthering its cause
        is crucial to progressing in the game and unlocking endgame content.
      </Typography>

      <Typography variant="h5" color="primary" mt={2} mb={1}>
        Factions you have joined:
      </Typography>
      {(allJoinedFactions.length > 0 && (
        <Paper sx={{ my: 1, p: 1, pb: 0, display: "inline-block" }}>
          <Table padding="none" style={{ width: "fit-content" }}>
            <TableBody>
              {allJoinedFactions.map((faction: string) => (
                <TableRow key={faction}>
                  <TableCell>
                    <Typography noWrap mb={1}>
                      {faction}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box ml={1} mb={1}>
                      <Button onClick={() => openFaction(Factions[faction])}>Details</Button>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box ml={1} mb={1}>
                      <Button sx={{ width: "100%" }} onClick={() => openFactionAugPage(Factions[faction])}>
                        Augmentations Left: {getAugsLeft(Factions[faction], props.player)}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )) || <Typography>You haven't joined any factions.</Typography>}
      <Typography variant="h5" color="primary" mt={4} mb={1}>
        Outstanding Faction Invitations
      </Typography>
      <Typography mb={1}>
        Factions you have been invited to. You can accept these faction invitations at any time:
      </Typography>
      {(props.player.factionInvitations.length > 0 && (
        <Paper sx={{ my: 1, mb: 4, p: 1, pb: 0, display: "inline-block" }}>
          <Table padding="none">
            <TableBody>
              {props.player.factionInvitations.map((faction: string) => (
                <TableRow key={faction}>
                  <TableCell>
                    <Typography noWrap mb={1}>
                      {faction}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box ml={1} mb={1}>
                      <Button onClick={(e) => acceptInvitation(e, faction)}>Join!</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )) || <Typography>You have no outstanding faction invites.</Typography>}
    </Container>
  );
}
